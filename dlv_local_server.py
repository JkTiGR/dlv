#!/usr/bin/env python3
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


ROOT_DIR = Path(__file__).resolve().parent
DB_PATH = ROOT_DIR / "dlv_local_orders.json"
MENU_AVAILABILITY_PATH = ROOT_DIR / "dlv_menu_availability.json"


def utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sync_stamp(payload: object) -> float:
    if not isinstance(payload, dict):
        return 0.0
    for key in ("updated_at", "attempted_at", "requested_at", "created_at"):
        raw = payload.get(key)
        if not raw:
            continue
        try:
            return datetime.fromisoformat(str(raw).replace("Z", "+00:00")).timestamp()
        except ValueError:
            continue
    return 0.0


def sync_score(channel: str, payload: object) -> int:
    if not isinstance(payload, dict):
        return 0
    if channel == "sheet":
        if payload.get("ok") or payload.get("id"):
            return 4
        if payload.get("pending") or payload.get("retrying"):
            return 3
        return 2
    if channel == "local":
        return 3 if payload.get("ok") else 1
    return 2 if payload.get("ok") else 1


def pick_sync(channel: str, left: object, right: object):
    left_score = sync_score(channel, left)
    right_score = sync_score(channel, right)
    if left_score != right_score:
        return left if left_score > right_score else right
    return left if sync_stamp(left) >= sync_stamp(right) else right


class DLVServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    def __init__(self, server_address, handler_cls, root_dir: Path, db_path: Path, menu_availability_path: Path):
        self.root_dir = root_dir
        self.db_path = db_path
        self.menu_availability_path = menu_availability_path
        self.db_lock = threading.Lock()
        self.menu_lock = threading.Lock()
        self.listeners_lock = threading.Lock()
        self.listeners: set[queue.Queue[str]] = set()
        super().__init__(server_address, handler_cls)

    def read_db(self) -> dict:
        if not self.db_path.exists():
            return {"orders": {}}
        try:
            payload = json.loads(self.db_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {"orders": {}}
        if not isinstance(payload, dict):
            return {"orders": {}}
        orders = payload.get("orders")
        if not isinstance(orders, dict):
            orders = {}
        return {"orders": orders}

    def write_db(self, payload: dict) -> None:
        tmp_path = self.db_path.with_suffix(".tmp")
        tmp_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp_path.replace(self.db_path)

    def find_order_key(self, orders: dict, reference: str) -> str | None:
        ref = str(reference or "").strip()
        if not ref:
            return None
        if ref in orders:
            return ref
        for key, order in orders.items():
            if not isinstance(order, dict):
                continue
            if str(order.get("id") or "").strip() == ref:
                return key
            if str(order.get("code") or "").strip() == ref:
                return key
        return None

    def merge_order(self, existing: object, incoming: object) -> dict:
        base = existing if isinstance(existing, dict) else {}
        draft = incoming if isinstance(incoming, dict) else {}
        merged = {**base, **draft}
        sync = {}
        if isinstance(base.get("sync"), dict):
            sync.update(base["sync"])
        if isinstance(draft.get("sync"), dict):
            sync.update(draft["sync"])
        sync["local"] = pick_sync("local", sync.get("local"), {
            "ok": True,
            "updated_at": utc_iso(),
            "via": "local_bridge"
        })
        merged["sync"] = sync
        merged["code"] = str(merged.get("code") or merged.get("id") or "").strip()
        merged["id"] = str(merged.get("id") or merged.get("code") or "").strip()
        if not merged["code"]:
            raise ValueError("Order code is required")
        if not merged.get("created_at"):
            merged["created_at"] = utc_iso()
        merged["updated_at"] = str(draft.get("updated_at") or merged.get("updated_at") or utc_iso())
        return merged

    def list_orders(self) -> list[dict]:
        with self.db_lock:
            payload = self.read_db()
            orders = [order for order in payload["orders"].values() if isinstance(order, dict)]
        return sorted(orders, key=lambda order: str(order.get("created_at") or ""))

    def get_order(self, reference: str) -> dict | None:
        with self.db_lock:
            payload = self.read_db()
            key = self.find_order_key(payload["orders"], reference)
            order = payload["orders"].get(key or "")
        return order if isinstance(order, dict) else None

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

    def upsert_order(self, order: dict) -> dict:
        with self.db_lock:
            payload = self.read_db()
            orders = payload["orders"]
            key = self.find_order_key(orders, order.get("code") or order.get("id")) or str(order.get("code") or order.get("id"))
            merged = self.merge_order(orders.get(key), order)
            orders[merged["code"]] = merged
            if key != merged["code"] and key in orders:
                orders.pop(key, None)
            self.write_db(payload)
        self.broadcast_event("orders_updated", {
            "code": merged["code"],
            "updated_at": merged.get("updated_at") or utc_iso()
        })
        return merged

    def clear_orders(self) -> int:
        with self.db_lock:
            payload = self.read_db()
            removed = len(payload.get("orders") or {})
            payload["orders"] = {}
            self.write_db(payload)
        self.broadcast_event("orders_updated", {
            "code": "*",
            "cleared": True,
            "updated_at": utc_iso()
        })
        return removed

    def read_menu_availability(self) -> dict:
        if not self.menu_availability_path.exists():
            return {"version": 1, "updated_at": "", "items": {}}
        try:
            payload = json.loads(self.menu_availability_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {"version": 1, "updated_at": "", "items": {}}
        if not isinstance(payload, dict):
            return {"version": 1, "updated_at": "", "items": {}}
        items = payload.get("items")
        if not isinstance(items, dict):
            items = {}
        return {
            "version": 1,
            "updated_at": str(payload.get("updated_at") or ""),
            "items": items
        }

    def write_menu_availability(self, payload: dict) -> dict:
        next_payload = {
            "version": 1,
            "updated_at": str(payload.get("updated_at") or utc_iso()),
            "items": payload.get("items") if isinstance(payload.get("items"), dict) else {}
        }
        tmp_path = self.menu_availability_path.with_suffix(".tmp")
        tmp_path.write_text(json.dumps(next_payload, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp_path.replace(self.menu_availability_path)
        return next_payload

    def get_menu_availability(self) -> dict:
        with self.menu_lock:
            return self.read_menu_availability()

    def update_menu_availability(self, payload: dict) -> dict:
        if not isinstance(payload, dict):
            raise ValueError("Menu availability payload must be an object")
        with self.menu_lock:
            next_payload = self.write_menu_availability(payload)
        self.broadcast_event("menu_availability_updated", {
            "updated_at": next_payload.get("updated_at") or utc_iso()
        })
        return next_payload

    def clear_menu_availability(self) -> dict:
        with self.menu_lock:
            next_payload = self.write_menu_availability({
                "version": 1,
                "updated_at": utc_iso(),
                "items": {}
            })
        self.broadcast_event("menu_availability_updated", {
            "updated_at": next_payload.get("updated_at") or utc_iso(),
            "cleared": True
        })
        return next_payload


class DLVHandler(SimpleHTTPRequestHandler):
    server: DLVServer

    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, format: str, *args) -> None:
        super().log_message(format, *args)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
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
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        try:
            ready_message = (
                "event: ready\n"
                f"data: {json.dumps({'ok': True, 'updated_at': utc_iso()}, ensure_ascii=False)}\n\n"
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

    def do_GET(self) -> None:
        parsed = urlsplit(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/local-events":
            self.handle_local_events()
            return
        if path == "/api/local-orders":
            reference = (query.get("code") or query.get("id") or [""])[0]
            if reference:
                order = self.server.get_order(reference)
                self.send_json({
                    "ok": bool(order),
                    "order": order,
                    "updated_at": utc_iso()
                }, HTTPStatus.OK if order else HTTPStatus.NOT_FOUND)
                return
            self.send_json({
                "ok": True,
                "orders": self.server.list_orders(),
                "updated_at": utc_iso()
            })
            return
        if path == "/api/menu-availability":
            self.send_json({
                "ok": True,
                "availability": self.server.get_menu_availability(),
                "updated_at": utc_iso()
            })
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlsplit(self.path)
        if parsed.path == "/api/menu-availability":
            try:
                payload = self.read_json_body()
                data = self.server.update_menu_availability(payload)
            except ValueError as exc:
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return
            self.send_json({"ok": True, "availability": data, "updated_at": utc_iso()})
            return

        if parsed.path != "/api/local-orders":
            self.send_json({"ok": False, "error": "Unknown endpoint"}, HTTPStatus.NOT_FOUND)
            return
        try:
            payload = self.read_json_body()
            order = self.server.upsert_order(payload)
        except ValueError as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
            return
        self.send_json({"ok": True, "order": order, "updated_at": utc_iso()})

    def do_DELETE(self) -> None:
        parsed = urlsplit(self.path)
        if parsed.path == "/api/menu-availability":
            data = self.server.clear_menu_availability()
            self.send_json({
                "ok": True,
                "availability": data,
                "updated_at": utc_iso()
            })
            return

        if parsed.path != "/api/local-orders":
            self.send_json({"ok": False, "error": "Unknown endpoint"}, HTTPStatus.NOT_FOUND)
            return
        removed = self.server.clear_orders()
        self.send_json({
            "ok": True,
            "removed": removed,
            "updated_at": utc_iso()
        })


def main() -> None:
    parser = argparse.ArgumentParser(description="DLV local server with bridge API for cashier and monitor.")
    parser.add_argument("--bind", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    handler_cls = functools.partial(DLVHandler, directory=str(ROOT_DIR))
    server = DLVServer((args.bind, args.port), handler_cls, ROOT_DIR, DB_PATH, MENU_AVAILABILITY_PATH)
    print(f"Serving DLV on http://{args.bind}:{args.port} from {ROOT_DIR}")
    print(f"Local bridge DB: {DB_PATH}")
    print(f"Menu availability DB: {MENU_AVAILABILITY_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
