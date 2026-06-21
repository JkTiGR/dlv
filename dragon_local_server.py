#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import functools
import ipaddress
import json
import os
import queue
import re
import threading
import time
from datetime import datetime, timezone
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from dragon_bridge_runtime import (
    BridgeRuntimeConfig,
    build_liqpay_checkout_form,
    has_liqpay_checkout_config,
    load_bridge_runtime_config,
    send_telegram_document,
    send_telegram_message,
)


ROOT_DIR = Path(__file__).resolve().parent
DB_PATH = ROOT_DIR / "dragon_local_orders.json"
MENU_AVAILABILITY_PATH = ROOT_DIR / "dragon_menu_availability.json"
AUDIT_PATH = ROOT_DIR / "dragon_order_audit.jsonl"
MAX_AUDIT_EVENTS_RETURNED = 500


def utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_float(value: object) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


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


class DRAGONServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    def __init__(
        self,
        server_address,
        handler_cls,
        root_dir: Path,
        db_path: Path,
        menu_availability_path: Path,
        audit_path: Path,
        runtime_config: BridgeRuntimeConfig,
    ):
        self.root_dir = root_dir
        self.db_path = db_path
        self.menu_availability_path = menu_availability_path
        self.audit_path = audit_path
        self.runtime_config = runtime_config
        self.db_lock = threading.Lock()
        self.menu_lock = threading.Lock()
        self.audit_lock = threading.Lock()
        self.listeners_lock = threading.Lock()
        self.listeners: set[queue.Queue[str]] = set()
        self.sessions_lock = threading.Lock()
        self.bridge_sessions: dict[str, float] = {}
        self.kassa_sessions: dict[str, float] = {}
        super().__init__(server_address, handler_cls)

    def _prune_sessions(self, sessions: dict[str, float]) -> None:
        now = time.time()
        for token, expires_at in list(sessions.items()):
            if expires_at <= now:
                sessions.pop(token, None)

    def create_bridge_session(self) -> str:
        session_token = base64.urlsafe_b64encode(os.urandom(32)).decode("ascii").rstrip("=")
        with self.sessions_lock:
            self._prune_sessions(self.bridge_sessions)
            self.bridge_sessions[session_token] = time.time() + self.runtime_config.cookie_max_age_seconds
        return session_token

    def create_kassa_session(self) -> str:
        session_token = base64.urlsafe_b64encode(os.urandom(32)).decode("ascii").rstrip("=")
        with self.sessions_lock:
            self._prune_sessions(self.kassa_sessions)
            self.kassa_sessions[session_token] = time.time() + self.runtime_config.cookie_max_age_seconds
        return session_token

    def has_bridge_session(self, token: str) -> bool:
        token = str(token or "").strip()
        if not token:
            return False
        with self.sessions_lock:
            self._prune_sessions(self.bridge_sessions)
            expires_at = self.bridge_sessions.get(token)
            if not expires_at:
                return False
            self.bridge_sessions[token] = time.time() + self.runtime_config.cookie_max_age_seconds
            return True

    def has_kassa_session(self, token: str) -> bool:
        token = str(token or "").strip()
        if not token:
            return False
        with self.sessions_lock:
            self._prune_sessions(self.kassa_sessions)
            expires_at = self.kassa_sessions.get(token)
            if not expires_at:
                return False
            self.kassa_sessions[token] = time.time() + self.runtime_config.cookie_max_age_seconds
            return True

    def clear_kassa_session(self, token: str) -> None:
        with self.sessions_lock:
            self.kassa_sessions.pop(str(token or "").strip(), None)

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

    def append_audit_event(self, event: dict) -> None:
        if not isinstance(event, dict):
            return
        event = {
            "received_at": event.get("received_at") or utc_iso(),
            **event,
        }
        line = json.dumps(event, ensure_ascii=False, separators=(",", ":"))
        try:
            with self.audit_lock:
                with self.audit_path.open("a", encoding="utf-8") as fh:
                    fh.write(line + "\n")
        except OSError as exc:
            print(f"Order audit write failed: {exc}", flush=True)

    def read_audit_events(self, limit: int = MAX_AUDIT_EVENTS_RETURNED) -> list[dict]:
        if not self.audit_path.exists():
            return []
        limit = max(1, min(int(limit or MAX_AUDIT_EVENTS_RETURNED), MAX_AUDIT_EVENTS_RETURNED))
        try:
            with self.audit_lock:
                lines = self.audit_path.read_text(encoding="utf-8").splitlines()
        except OSError:
            return []
        events: list[dict] = []
        for line in lines[-limit:]:
            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(payload, dict):
                events.append(payload)
        return events

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

    def delete_order(self, reference: str) -> bool:
        with self.db_lock:
            payload = self.read_db()
            orders = payload["orders"]
            key = self.find_order_key(orders, reference)
            if not key:
                return False
            removed = orders.pop(key, None)
            self.write_db(payload)
        removed_code = ""
        if isinstance(removed, dict):
            removed_code = str(removed.get("code") or removed.get("id") or key)
        self.broadcast_event("orders_updated", {
            "code": removed_code or str(reference or key),
            "deleted": True,
            "updated_at": utc_iso()
        })
        return True

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

    def get_stats(self) -> dict:
        orders = self.list_orders()
        today_prefix = datetime.now().date().isoformat()
        active_statuses = {"NEW", "COOKING", "READY"}
        completed_statuses = {"HANDED"}
        cancelled_statuses = {"CANCELLED"}

        return {
            "total_orders": len(orders),
            "pending_orders": sum(1 for order in orders if order.get("status") in active_statuses),
            "completed_orders": sum(1 for order in orders if order.get("status") in completed_statuses),
            "cancelled_orders": sum(1 for order in orders if order.get("status") in cancelled_statuses),
            "total_revenue": round(
                sum(safe_float(order.get("total")) for order in orders if order.get("status") not in cancelled_statuses),
                2,
            ),
            "orders_today": sum(
                1
                for order in orders
                if str(order.get("created_at") or "").startswith(today_prefix)
            ),
        }

    def snapshot_token(self) -> dict:
        orders = self.list_orders()
        latest_order = max(orders, key=sync_stamp, default={})
        menu = self.get_menu_availability()
        return {
            "orders_count": len(orders),
            "orders_updated_at": str(latest_order.get("updated_at") or latest_order.get("created_at") or ""),
            "menu_updated_at": str(menu.get("updated_at") or ""),
        }

    def get_health(self) -> dict:
        return {
            "ok": True,
            "mode": "local",
            "storage": "json_bridge",
            "db_path": str(self.db_path),
            "menu_availability_path": str(self.menu_availability_path),
            "audit_path": str(self.audit_path),
            "snapshot": self.snapshot_token(),
        }

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


class DRAGONHandler(SimpleHTTPRequestHandler):
    server: DRAGONServer

    def __init__(self, *args, directory: str | None = None, **kwargs):
        self._pending_cookies: list[str] = []
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, format: str, *args) -> None:
        super().log_message(format, *args)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        cors_origin = self.resolve_cors_origin()
        if cors_origin:
            self.send_header("Access-Control-Allow-Origin", cors_origin)
            self.send_header("Access-Control-Allow-Credentials", "true")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Vary", "Origin")
        for cookie in self._pending_cookies:
            self.send_header("Set-Cookie", cookie)
        super().end_headers()

    def is_loopback_client(self) -> bool:
        try:
            return ipaddress.ip_address(self.client_address[0]).is_loopback
        except ValueError:
            return False

    def resolve_cors_origin(self) -> str:
        origin = str(self.headers.get("Origin") or "").strip()
        if not origin:
            return ""
        if origin in self.server.runtime_config.allowed_origins:
            return origin
        return ""

    def parse_cookie(self, name: str) -> str:
        raw = self.headers.get("Cookie")
        if not raw:
            return ""
        jar = SimpleCookie()
        try:
            jar.load(raw)
        except Exception:
            return ""
        morsel = jar.get(name)
        return str(morsel.value).strip() if morsel else ""

    def queue_cookie(self, name: str, value: str, *, max_age: int | None = None, http_only: bool = True) -> None:
        parts = [f"{name}={value}", "Path=/", "SameSite=Lax"]
        if http_only:
            parts.append("HttpOnly")
        if max_age is not None:
            parts.append(f"Max-Age={max_age}")
        self._pending_cookies.append("; ".join(parts))

    def clear_cookie(self, name: str) -> None:
        self._pending_cookies.append(f"{name}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly")

    def bridge_token_from_query(self, query: dict[str, list[str]]) -> str:
        return str(
            (query.get("bridgeToken") or query.get("bridge_token") or query.get("remoteBridgeToken") or query.get("remote_bridge_token") or [""])[0]
            or ""
        ).strip()

    def authorize_bridge_from_query(self, query: dict[str, list[str]]) -> bool:
        configured = str(self.server.runtime_config.bridge_token or "").strip()
        provided = self.bridge_token_from_query(query)
        if not configured or not provided or provided != configured:
            return False
        session_token = self.server.create_bridge_session()
        self.queue_cookie("dragon_bridge_session", session_token, max_age=self.server.runtime_config.cookie_max_age_seconds)
        return True

    def has_bridge_access(self, query: dict[str, list[str]]) -> bool:
        if self.is_loopback_client():
            return True
        if self.authorize_bridge_from_query(query):
            return True
        bridge_session = self.parse_cookie("dragon_bridge_session")
        if self.server.has_bridge_session(bridge_session):
            return True
        return self.server.runtime_config.allow_insecure_remote

    def has_kassa_access(self) -> bool:
        if self.is_loopback_client():
            return True
        return self.server.has_kassa_session(self.parse_cookie("dragon_kassa_session"))

    def send_unauthorized_json(self, message: str = "Bridge access denied. Open the page using a bridgeToken link.") -> None:
        parsed = urlsplit(self.path)
        audit = self.request_audit_context("api_unauthorized", parse_qs(parsed.query))
        audit["ok"] = False
        audit["error"] = message
        self.server.append_audit_event(audit)
        self.send_json(
            {
                "ok": False,
                "error": message,
                "auth_required": True,
            },
            HTTPStatus.UNAUTHORIZED,
        )

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

    def bounded_header(self, name: str, limit: int = 500) -> str:
        value = str(self.headers.get(name) or "").strip()
        return value[:limit]

    def forwarded_ip_chain(self) -> list[str]:
        raw_values = [
            self.bounded_header("CF-Connecting-IP"),
            self.bounded_header("X-Real-IP"),
            self.bounded_header("X-Forwarded-For", 1000),
        ]
        forwarded = self.bounded_header("Forwarded", 1000)
        if forwarded:
            raw_values.extend(re.findall(r"for=\"?([^;,\" ]+)", forwarded, flags=re.IGNORECASE))

        ips: list[str] = []
        for raw in raw_values:
            for part in str(raw or "").split(","):
                value = part.strip().strip('"').strip("'")
                if not value:
                    continue
                if value.startswith("[") and "]" in value:
                    value = value[1:value.index("]")]
                elif ":" in value and value.count(":") == 1:
                    value = value.rsplit(":", 1)[0]
                if value and value not in ips:
                    ips.append(value)
        return ips

    def request_audit_context(self, event_type: str, query: dict[str, list[str]]) -> dict:
        remote_addr = str((self.client_address or [""])[0] or "").strip()
        forwarded_ips = self.forwarded_ip_chain()
        client_ip = forwarded_ips[0] if forwarded_ips else remote_addr
        request_id = base64.urlsafe_b64encode(os.urandom(9)).decode("ascii").rstrip("=")
        return {
            "event": event_type,
            "request_id": request_id,
            "received_at": utc_iso(),
            "method": self.command,
            "path": urlsplit(self.path).path,
            "client_ip": client_ip,
            "remote_addr": remote_addr,
            "forwarded_ips": forwarded_ips,
            "headers": {
                "host": self.bounded_header("Host"),
                "origin": self.bounded_header("Origin"),
                "referer": self.bounded_header("Referer", 1000),
                "user_agent": self.bounded_header("User-Agent", 1000),
                "accept_language": self.bounded_header("Accept-Language"),
                "cf_ipcountry": self.bounded_header("CF-IPCountry"),
            },
            "auth": {
                "bridge_token_in_query": bool(self.bridge_token_from_query(query)),
                "bridge_session_cookie": bool(self.parse_cookie("dragon_bridge_session")),
                "kassa_session_cookie": bool(self.parse_cookie("dragon_kassa_session")),
                "loopback_client": self.is_loopback_client(),
            },
        }

    def order_audit_summary(self, order: dict) -> dict:
        if not isinstance(order, dict):
            return {}
        customer = order.get("customer") if isinstance(order.get("customer"), dict) else {}
        trace = order.get("trace") if isinstance(order.get("trace"), dict) else {}
        geo = order.get("geo") if isinstance(order.get("geo"), dict) else trace.get("geo") if isinstance(trace.get("geo"), dict) else {}
        return {
            "id": str(order.get("id") or ""),
            "code": str(order.get("code") or ""),
            "source": str(order.get("source") or ""),
            "type": str(order.get("type") or ""),
            "status": str(order.get("status") or ""),
            "total": order.get("total"),
            "phone": str(order.get("phone") or order.get("customer_phone") or customer.get("phone") or ""),
            "customer_name": str(order.get("customer_name") or customer.get("name") or ""),
            "device_id": str(order.get("device_id") or trace.get("device_id") or order.get("customer_id") or ""),
            "session_id": str(order.get("session_id") or trace.get("session_id") or ""),
            "session_started_at": str(order.get("session_started_at") or trace.get("session_started_at") or ""),
            "source_url": str(order.get("source_url") or trace.get("source_url") or ""),
            "browser_label": str(order.get("browser_label") or trace.get("browser_label") or ""),
            "geo": geo if isinstance(geo, dict) else {},
        }

    def attach_request_trace(self, order: dict, audit: dict) -> dict:
        if not isinstance(order, dict):
            return order
        headers = audit.get("headers") if isinstance(audit.get("headers"), dict) else {}
        request_trace = {
            "request_id": audit.get("request_id"),
            "received_at": audit.get("received_at"),
            "client_ip": audit.get("client_ip"),
            "remote_addr": audit.get("remote_addr"),
            "forwarded_ips": audit.get("forwarded_ips") or [],
            "user_agent": headers.get("user_agent") or "",
            "accept_language": headers.get("accept_language") or "",
            "origin": headers.get("origin") or "",
            "referer": headers.get("referer") or "",
            "host": headers.get("host") or "",
            "cf_ipcountry": headers.get("cf_ipcountry") or "",
        }
        existing_trace = order.get("request_trace") if isinstance(order.get("request_trace"), dict) else {}
        return {
            **order,
            "request_trace": {
                **existing_trace,
                **request_trace,
            },
        }

    def telegram_text_summary(self, text: str) -> dict:
        raw = str(text or "")
        plain = re.sub(r"<[^>]+>", "", raw)
        id_match = re.search(r"\bID:\s*([A-Z0-9_-]+)", plain, flags=re.IGNORECASE)
        code_match = re.search(r"\bCode:\s*([a-z]\d{3})", plain, flags=re.IGNORECASE)
        return {
            "id": id_match.group(1) if id_match else "",
            "code": code_match.group(1).lower() if code_match else "",
            "preview": plain[:700],
        }

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
                f"data: {json.dumps({'ok': True, 'updated_at': utc_iso(), 'snapshot': self.server.snapshot_token()}, ensure_ascii=False)}\n\n"
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
            if path == "/api/health":
                health = self.server.get_health()
                health["security"] = {
                    "bridge_token_enabled": bool(self.server.runtime_config.bridge_token),
                    "allow_insecure_remote": self.server.runtime_config.allow_insecure_remote,
                    "kassa_pin_configured": bool(self.server.runtime_config.kassa_pin),
                    "telegram_proxy_enabled": bool(self.server.runtime_config.telegram_bot_token),
                    "liqpay_enabled": has_liqpay_checkout_config(self.server.runtime_config),
                }
                self.authorize_bridge_from_query(query)
                self.send_json(health)
                return

            if path == "/api/kassa/session":
                if not self.has_bridge_access(query):
                    self.send_unauthorized_json()
                    return
                self.send_json({
                    "ok": True,
                    "authenticated": self.has_kassa_access(),
                    "updated_at": utc_iso(),
                })
                return

            if path.startswith("/api/") and not self.has_bridge_access(query):
                self.send_unauthorized_json()
                return

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

            if path == "/api/order-audit":
                limit_raw = (query.get("limit") or [""])[0]
                try:
                    limit = int(limit_raw or MAX_AUDIT_EVENTS_RETURNED)
                except ValueError:
                    limit = MAX_AUDIT_EVENTS_RETURNED
                self.send_json({
                    "ok": True,
                    "events": self.server.read_audit_events(limit),
                    "audit_path": str(self.server.audit_path),
                    "updated_at": utc_iso(),
                })
                return

            if path == "/api/menu-availability":
                self.send_json({
                    "ok": True,
                    "availability": self.server.get_menu_availability(),
                    "updated_at": utc_iso()
                })
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

            if path == "/api/sync":
                self.send_json(self.server.get_health())
                return
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)
            return

        self.authorize_bridge_from_query(query)
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlsplit(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/liqpay/checkout":
            try:
                payload = self.read_json_body()
                checkout = build_liqpay_checkout_form(
                    self.server.runtime_config,
                    amount=payload.get("amount"),
                    currency=str(payload.get("currency") or "UAH"),
                    description=str(payload.get("description") or "CYBER DRAGON online payment"),
                    order_id=str(payload.get("order_id") or ""),
                    language=str(payload.get("language") or "uk"),
                    result_url=str(payload.get("result_url") or ""),
                    info=str(payload.get("info") or ""),
                    phone=str(payload.get("phone") or ""),
                )
            except ValueError as exc:
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return
            self.send_json(
                {
                    "ok": True,
                    "checkout_url": checkout["checkout_url"],
                    "data": checkout["data"],
                    "signature": checkout["signature"],
                    "payment": checkout["payload"],
                    "updated_at": utc_iso(),
                }
            )
            return

        if path == "/api/kassa/session":
            if not self.has_bridge_access(query):
                self.send_unauthorized_json()
                return
            try:
                payload = self.read_json_body()
            except ValueError as exc:
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return
            pin = str(payload.get("pin") or "").strip()
            if pin != str(self.server.runtime_config.kassa_pin or "").strip():
                audit = self.request_audit_context("kassa_pin_failed", query)
                audit["ok"] = False
                self.server.append_audit_event(audit)
                self.send_json({"ok": False, "error": "Неверный PIN."}, HTTPStatus.UNAUTHORIZED)
                return
            session_token = self.server.create_kassa_session()
            self.queue_cookie("dragon_kassa_session", session_token, max_age=self.server.runtime_config.cookie_max_age_seconds)
            self.send_json({"ok": True, "authenticated": True, "updated_at": utc_iso()})
            return

        if path == "/api/telegram/send-message":
            if not self.has_bridge_access(query):
                self.send_unauthorized_json()
                return
            try:
                payload = self.read_json_body()
                audit = self.request_audit_context("telegram_send_message", query)
                text = str(payload.get("text") or "")
                audit["telegram"] = {
                    "channel": str(payload.get("channel") or "main"),
                    **self.telegram_text_summary(text),
                }
                response = send_telegram_message(
                    self.server.runtime_config,
                    channel=str(payload.get("channel") or "main"),
                    text=text,
                    parse_mode=str(payload.get("parse_mode") or "HTML"),
                    disable_web_page_preview=bool(payload.get("disable_web_page_preview", True)),
                )
            except ValueError as exc:
                if "audit" in locals():
                    audit["ok"] = False
                    audit["error"] = str(exc)
                    self.server.append_audit_event(audit)
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return
            except RuntimeError as exc:
                if "audit" in locals():
                    audit["ok"] = False
                    audit["error"] = str(exc)
                    self.server.append_audit_event(audit)
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)
                return
            audit["ok"] = True
            self.server.append_audit_event(audit)
            self.send_json({"ok": True, "data": response, "updated_at": utc_iso()})
            return

        if path == "/api/telegram/send-document":
            if not self.has_bridge_access(query):
                self.send_unauthorized_json()
                return
            try:
                payload = self.read_json_body()
                encoded = str(payload.get("document_base64") or "").strip()
                if not encoded:
                    raise ValueError("document_base64 is required")
                content_bytes = base64.b64decode(encoded, validate=True)
                response = send_telegram_document(
                    self.server.runtime_config,
                    channel=str(payload.get("channel") or "vn"),
                    filename=str(payload.get("filename") or "dragon-upload.bin"),
                    mime_type=str(payload.get("mime_type") or "application/octet-stream"),
                    caption=str(payload.get("caption") or ""),
                    content_bytes=content_bytes,
                )
            except ValueError as exc:
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return
            except RuntimeError as exc:
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)
                return
            self.send_json({"ok": True, "data": response, "updated_at": utc_iso()})
            return

        if not self.has_bridge_access(query):
            self.send_unauthorized_json()
            return

        if path == "/api/menu-availability":
            try:
                payload = self.read_json_body()
                data = self.server.update_menu_availability(payload)
            except ValueError as exc:
                self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return
            self.send_json({"ok": True, "availability": data, "updated_at": utc_iso()})
            return

        try:
            payload = self.read_json_body()
        except ValueError as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
            return

        try:
            if path == "/api/local-orders":
                audit = self.request_audit_context("order_upsert", query)
                payload = self.attach_request_trace(payload, audit)
                order = self.server.upsert_order(payload)
                audit["order"] = self.order_audit_summary(order)
                audit["ok"] = True
                self.server.append_audit_event(audit)
                self.send_json({"ok": True, "order": order, "updated_at": utc_iso()})
                return

            if path == "/api/orders":
                audit = self.request_audit_context("order_upsert", query)
                payload = self.attach_request_trace(payload, audit)
                order = self.server.upsert_order(payload)
                audit["order"] = self.order_audit_summary(order)
                audit["ok"] = True
                self.server.append_audit_event(audit)
                self.send_json(order, HTTPStatus.CREATED)
                return

            if path.startswith("/api/orders/"):
                audit = self.request_audit_context("order_update", query)
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
                merged = self.attach_request_trace(merged, audit)
                order = self.server.upsert_order(merged)
                audit["order"] = self.order_audit_summary(order)
                audit["ok"] = True
                self.server.append_audit_event(audit)
                self.send_json(order)
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
        query = parse_qs(parsed.query)

        if path == "/api/kassa/session":
            self.server.clear_kassa_session(self.parse_cookie("dragon_kassa_session"))
            self.clear_cookie("dragon_kassa_session")
            self.send_json({"ok": True, "authenticated": False, "updated_at": utc_iso()})
            return

        if not self.has_bridge_access(query):
            self.send_unauthorized_json()
            return

        try:
            if path == "/api/menu-availability":
                data = self.server.clear_menu_availability()
                self.send_json({
                    "ok": True,
                    "availability": data,
                    "updated_at": utc_iso()
                })
                return

            if path in {"/api/local-orders", "/api/orders"}:
                removed = self.server.clear_orders()
                self.send_json({
                    "ok": True,
                    "removed": removed,
                    "updated_at": utc_iso()
                })
                return

            if path.startswith("/api/orders/"):
                reference = path.rsplit("/", 1)[-1]
                deleted = self.server.delete_order(reference)
                if not deleted:
                    self.send_json({"ok": False, "error": "Order not found"}, HTTPStatus.NOT_FOUND)
                    return
                self.send_json({"ok": True, "deleted": True, "updated_at": utc_iso()})
                return
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)
            return

        self.send_json({"ok": False, "error": "Unknown endpoint"}, HTTPStatus.NOT_FOUND)


def main() -> None:
    parser = argparse.ArgumentParser(description="DRAGON local server with bridge API for cashier and monitor.")
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    runtime_config = load_bridge_runtime_config(ROOT_DIR)
    handler_cls = functools.partial(DRAGONHandler, directory=str(ROOT_DIR))
    server = DRAGONServer((args.bind, args.port), handler_cls, ROOT_DIR, DB_PATH, MENU_AVAILABILITY_PATH, AUDIT_PATH, runtime_config)
    print(f"Serving DRAGON on http://{args.bind}:{args.port} from {ROOT_DIR}")
    print(f"Local bridge DB: {DB_PATH}")
    print(f"Menu availability DB: {MENU_AVAILABILITY_PATH}")
    print(f"Order audit log: {AUDIT_PATH}")
    if runtime_config.bridge_token:
        print("Bridge remote auth: enabled")
    elif args.bind not in {"127.0.0.1", "localhost", "::1"} and not runtime_config.allow_insecure_remote:
        print("Bridge remote auth: remote API locked until DRAGON_BRIDGE_TOKEN is configured")
    elif runtime_config.allow_insecure_remote:
        print("Bridge remote auth: WARNING insecure remote access is enabled")
    print(f"Kassa PIN source: {'env/.env' if runtime_config.kassa_pin != '1990' else 'server default'}")
    print(f"Telegram proxy: {'enabled' if runtime_config.telegram_bot_token else 'disabled'}")
    print("Bridge API:")
    print("  POST/DELETE  /api/kassa/session")
    print("  POST         /api/telegram/send-message")
    print("  POST         /api/telegram/send-document")
    print("  GET/POST/DELETE /api/local-orders")
    print("  GET           /api/order-audit")
    print("  GET           /api/local-events")
    print("  GET/POST/DELETE /api/menu-availability")
    print("  GET/POST/DELETE /api/orders")
    print("  GET           /api/orders/<id>")
    print("  GET           /api/stats")
    print("  GET           /api/health")
    server.serve_forever()


if __name__ == "__main__":
    main()
