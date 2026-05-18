#!/usr/bin/env python3
"""
Bridge-compatible cloud server for DLV.

This server keeps the existing frontend contract intact while storing data in
Supabase, so the same cashier / monitor / profile pages can work remotely.
"""
from __future__ import annotations

import argparse
import functools
import json
import queue
import threading
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from cloud_sync import CloudSync


ROOT_DIR = Path(__file__).resolve().parent


def utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class CloudBridgeServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    def __init__(
        self,
        server_address,
        handler_cls,
        root_dir: Path,
        cloud: CloudSync,
        poll_interval: float,
    ):
        self.root_dir = root_dir
        self.cloud = cloud
        self.poll_interval = max(1.0, float(poll_interval))
        self.listeners_lock = threading.Lock()
        self.listeners: set[queue.Queue[str]] = set()
        self.snapshot_lock = threading.Lock()
        self.snapshot = self.cloud.snapshot_token()
        self.stop_event = threading.Event()
        super().__init__(server_address, handler_cls)
        self.watcher = threading.Thread(target=self._watch_loop, name="dlv-cloud-watch", daemon=True)
        self.watcher.start()

    def register_listener(self) -> queue.Queue[str]:
        client_queue: queue.Queue[str] = queue.Queue()
        with self.listeners_lock:
            self.listeners.add(client_queue)
        return client_queue

    def unregister_listener(self, client_queue: queue.Queue[str]) -> None:
        with self.listeners_lock:
            self.listeners.discard(client_queue)

    def broadcast_event(self, event: str, payload: dict) -> None:
        message = (
            f"event: {event}\n"
            f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"
        )
        with self.listeners_lock:
            listeners = list(self.listeners)
        for client_queue in listeners:
            try:
                client_queue.put_nowait(message)
            except queue.Full:
                continue

    def close(self) -> None:
        self.stop_event.set()
        super().server_close()

    def _watch_loop(self) -> None:
        while not self.stop_event.wait(self.poll_interval):
            try:
                snapshot = self.cloud.snapshot_token()
            except Exception as exc:
                print(f"⚠️  Cloud watcher error: {exc}")
                continue
            self._broadcast_snapshot_changes(snapshot)

    def _broadcast_snapshot_changes(self, snapshot: dict) -> None:
        if not isinstance(snapshot, dict):
            return
        with self.snapshot_lock:
            previous = dict(self.snapshot or {})
            self.snapshot = snapshot

        orders_changed = (
            snapshot.get("orders_updated_at") != previous.get("orders_updated_at")
            or snapshot.get("orders_count") != previous.get("orders_count")
        )
        menu_changed = snapshot.get("menu_updated_at") != previous.get("menu_updated_at")

        if orders_changed:
            self.broadcast_event(
                "orders_updated",
                {
                    "updated_at": snapshot.get("orders_updated_at") or utc_iso(),
                    "orders_count": snapshot.get("orders_count", 0),
                    "source": "cloud_watch",
                },
            )
        if menu_changed:
            self.broadcast_event(
                "menu_availability_updated",
                {
                    "updated_at": snapshot.get("menu_updated_at") or utc_iso(),
                    "source": "cloud_watch",
                },
            )

    def refresh_snapshot(self) -> dict:
        snapshot = self.cloud.snapshot_token()
        with self.snapshot_lock:
            self.snapshot = snapshot
        return snapshot

    def list_orders(self) -> list[dict]:
        return self.cloud.list_orders()

    def get_order(self, reference: str) -> dict | None:
        order = self.cloud.get_order(reference)
        return order or None

    def upsert_order(self, payload: dict) -> dict:
        order = self.cloud.upsert_order(payload)
        snapshot = self.refresh_snapshot()
        self.broadcast_event(
            "orders_updated",
            {
                "code": order.get("code") or order.get("id") or "",
                "updated_at": snapshot.get("orders_updated_at") or order.get("updated_at") or utc_iso(),
                "orders_count": snapshot.get("orders_count", 0),
                "source": "cloud_write",
            },
        )
        return order

    def delete_order(self, reference: str) -> bool:
        deleted = self.cloud.delete_order(reference)
        if deleted:
            snapshot = self.refresh_snapshot()
            self.broadcast_event(
                "orders_updated",
                {
                    "code": reference,
                    "deleted": True,
                    "updated_at": snapshot.get("orders_updated_at") or utc_iso(),
                    "orders_count": snapshot.get("orders_count", 0),
                    "source": "cloud_delete",
                },
            )
        return deleted

    def clear_orders(self) -> int:
        removed = self.cloud.clear_orders()
        snapshot = self.refresh_snapshot()
        self.broadcast_event(
            "orders_updated",
            {
                "code": "*",
                "cleared": True,
                "removed": removed,
                "updated_at": snapshot.get("orders_updated_at") or utc_iso(),
                "orders_count": snapshot.get("orders_count", 0),
                "source": "cloud_clear",
            },
        )
        return removed

    def get_menu_availability(self) -> dict:
        return self.cloud.get_menu_availability()

    def update_menu_availability(self, payload: dict) -> dict:
        data = self.cloud.replace_menu_availability(payload)
        snapshot = self.refresh_snapshot()
        self.broadcast_event(
            "menu_availability_updated",
            {
                "updated_at": snapshot.get("menu_updated_at") or data.get("updated_at") or utc_iso(),
                "source": "cloud_write",
            },
        )
        return data

    def clear_menu_availability(self) -> dict:
        data = self.cloud.clear_menu_availability()
        snapshot = self.refresh_snapshot()
        self.broadcast_event(
            "menu_availability_updated",
            {
                "updated_at": snapshot.get("menu_updated_at") or data.get("updated_at") or utc_iso(),
                "cleared": True,
                "source": "cloud_clear",
            },
        )
        return data

    def get_stats(self) -> dict:
        return self.cloud.get_dashboard_stats()

    def get_health(self) -> dict:
        return self.cloud.get_health()


class CloudBridgeHandler(SimpleHTTPRequestHandler):
    server: CloudBridgeServer

    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, format: str, *args) -> None:
        super().log_message(format, *args)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(length) if length > 0 else b"{}"
        if not raw:
            return {}
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ValueError(f"Invalid JSON body: {exc}") from exc
        if not isinstance(payload, dict):
            raise ValueError("JSON body must be an object")
        return payload

    def send_json(self, payload: dict, status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def handle_local_events(self) -> None:
        client_queue = self.server.register_listener()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        try:
            ready_message = (
                "event: ready\n"
                f"data: {json.dumps({'ok': True, 'updated_at': utc_iso(), 'snapshot': self.server.snapshot}, ensure_ascii=False)}\n\n"
            )
            self.wfile.write(ready_message.encode("utf-8"))
            self.wfile.flush()

            while True:
                try:
                    message = client_queue.get(timeout=20)
                except queue.Empty:
                    message = ": keep-alive\n\n"
                self.wfile.write(message.encode("utf-8"))
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            return
        finally:
            self.server.unregister_listener(client_queue)

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlsplit(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        try:
            if path == "/api/local-events":
                self.handle_local_events()
                return

            if path == "/api/local-orders":
                reference = (query.get("code") or query.get("id") or [""])[0]
                if reference:
                    order = self.server.get_order(reference)
                    self.send_json(
                        {
                            "ok": bool(order),
                            "order": order,
                            "updated_at": utc_iso(),
                        },
                        HTTPStatus.OK if order else HTTPStatus.NOT_FOUND,
                    )
                    return
                self.send_json(
                    {
                        "ok": True,
                        "orders": self.server.list_orders(),
                        "updated_at": utc_iso(),
                    }
                )
                return

            if path == "/api/menu-availability":
                self.send_json(
                    {
                        "ok": True,
                        "availability": self.server.get_menu_availability(),
                        "updated_at": utc_iso(),
                    }
                )
                return

            if path == "/api/orders":
                self.send_json({"orders": self.server.list_orders()})
                return

            if path.startswith("/api/orders/"):
                reference = path.rsplit("/", 1)[-1]
                order = self.server.get_order(reference)
                if not order:
                    self.send_json({"ok": False, "error": "Order not found"}, HTTPStatus.NOT_FOUND)
                    return
                self.send_json(order)
                return

            if path == "/api/stats":
                self.send_json(self.server.get_stats())
                return

            if path in {"/api/sync", "/api/health"}:
                health = self.server.get_health()
                self.send_json(health)
                return
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)
            return

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlsplit(self.path)
        path = parsed.path

        try:
            payload = self.read_json_body()
        except ValueError as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
            return

        try:
            if path == "/api/local-orders":
                order = self.server.upsert_order(payload)
                self.send_json({"ok": True, "order": order, "updated_at": utc_iso()})
                return

            if path == "/api/orders":
                order = self.server.upsert_order(payload)
                self.send_json(order, HTTPStatus.CREATED)
                return

            if path.startswith("/api/orders/"):
                reference = path.rsplit("/", 1)[-1]
                existing = self.server.get_order(reference)
                if not existing:
                    self.send_json({"ok": False, "error": "Order not found"}, HTTPStatus.NOT_FOUND)
                    return
                merged = {
                    **existing,
                    **payload,
                    "sync": {
                        **(existing.get("sync") if isinstance(existing.get("sync"), dict) else {}),
                        **(payload.get("sync") if isinstance(payload.get("sync"), dict) else {}),
                    },
                }
                order = self.server.upsert_order(merged)
                self.send_json(order)
                return

            if path == "/api/menu-availability":
                data = self.server.update_menu_availability(payload)
                self.send_json({"ok": True, "availability": data, "updated_at": utc_iso()})
                return
        except ValueError as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
            return
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)
            return

        self.send_json({"ok": False, "error": "Unknown endpoint"}, HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        parsed = urlsplit(self.path)
        path = parsed.path

        try:
            if path in {"/api/local-orders", "/api/orders"}:
                removed = self.server.clear_orders()
                self.send_json({"ok": True, "removed": removed, "updated_at": utc_iso()})
                return

            if path.startswith("/api/orders/"):
                reference = path.rsplit("/", 1)[-1]
                deleted = self.server.delete_order(reference)
                if not deleted:
                    self.send_json({"ok": False, "error": "Order not found"}, HTTPStatus.NOT_FOUND)
                    return
                self.send_json({"ok": True, "deleted": True, "updated_at": utc_iso()})
                return

            if path == "/api/menu-availability":
                data = self.server.clear_menu_availability()
                self.send_json({"ok": True, "availability": data, "updated_at": utc_iso()})
                return
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)
            return

        self.send_json({"ok": False, "error": "Unknown endpoint"}, HTTPStatus.NOT_FOUND)


def main() -> None:
    parser = argparse.ArgumentParser(description="DLV cloud bridge server backed by Supabase.")
    parser.add_argument("--bind", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--poll-interval", type=float, default=3.0, help="Seconds between cloud change checks")
    args = parser.parse_args()

    cloud = CloudSync()
    handler_cls = functools.partial(CloudBridgeHandler, directory=str(ROOT_DIR))
    server = CloudBridgeServer((args.bind, args.port), handler_cls, ROOT_DIR, cloud, args.poll_interval)

    print(f"Serving DLV cloud bridge on http://{args.bind}:{args.port}")
    print(f"Static files: {ROOT_DIR}")
    print("Bridge API:")
    print("  GET/POST/DELETE /api/local-orders")
    print("  GET           /api/local-events")
    print("  GET/POST/DELETE /api/menu-availability")
    print("  GET           /api/stats")
    print("  GET           /api/health")
    print("Recommended pages:")
    print(f"  http://localhost:{args.port}/DLV_KASSA.html")
    print(f"  http://localhost:{args.port}/MONITOR.html")
    print(f"  http://localhost:{args.port}/profil.html")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping DLV cloud bridge...")
    finally:
        server.close()


if __name__ == "__main__":
    main()
