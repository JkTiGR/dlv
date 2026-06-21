#!/usr/bin/env python3
from __future__ import annotations

import argparse
import ipaddress
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


ROOT_DIR = Path(__file__).resolve().parent
DEFAULT_AUDIT_FILE = ROOT_DIR / "dragon_order_audit.jsonl"
DEFAULT_ORDERS_FILE = ROOT_DIR / "dragon_local_orders.json"


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    events: list[dict[str, Any]] = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = line.strip()
        if not line:
            continue
        try:
            payload = json.loads(line)
        except json.JSONDecodeError as exc:
            print(f"skip invalid audit line {line_no}: {exc}", file=sys.stderr)
            continue
        if isinstance(payload, dict):
            events.append(payload)
    return events


def load_orders(path: Path) -> dict[str, dict[str, Any]]:
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    orders = payload.get("orders") if isinstance(payload, dict) else {}
    return orders if isinstance(orders, dict) else {}


def nested(payload: dict[str, Any], *keys: str) -> Any:
    cur: Any = payload
    for key in keys:
        if not isinstance(cur, dict):
            return ""
        cur = cur.get(key)
    return cur


def short(value: Any, limit: int = 44) -> str:
    text = str(value or "").replace("\n", " ").strip()
    if len(text) <= limit:
        return text
    return text[: max(0, limit - 1)] + "…"


def public_ip(value: str) -> str:
    ip = str(value or "").strip()
    if not ip:
        return ""
    try:
        parsed = ipaddress.ip_address(ip)
    except ValueError:
        return ""
    if parsed.is_private or parsed.is_loopback or parsed.is_reserved or parsed.is_link_local or parsed.is_multicast:
        return ""
    return ip


def geo_lookup(ip: str) -> dict[str, Any]:
    ip = public_ip(ip)
    if not ip:
        return {}
    fields = "status,message,country,regionName,city,zip,lat,lon,isp,org,query,proxy,hosting,mobile"
    url = f"http://ip-api.com/json/{urllib.parse.quote(ip)}?fields={fields}"
    try:
        with urllib.request.urlopen(url, timeout=4) as response:
            data = json.loads(response.read().decode("utf-8"))
    except (OSError, urllib.error.URLError, json.JSONDecodeError):
        return {}
    if data.get("status") != "success":
        return {}
    return data


def order_key_from_event(event: dict[str, Any]) -> str:
    for path in (
        ("order", "code"),
        ("order", "id"),
        ("telegram", "code"),
        ("telegram", "id"),
    ):
        value = str(nested(event, *path) or "").strip()
        if value:
            return value
    return ""


def enrich_event(event: dict[str, Any], orders: dict[str, dict[str, Any]]) -> dict[str, Any]:
    key = order_key_from_event(event)
    order = {}
    if key:
        order = orders.get(key) or next(
            (
                candidate
                for candidate in orders.values()
                if isinstance(candidate, dict)
                and key in {str(candidate.get("id") or ""), str(candidate.get("code") or "")}
            ),
            {},
        )
    order = order if isinstance(order, dict) else {}
    order_summary = event.get("order") if isinstance(event.get("order"), dict) else {}
    telegram = event.get("telegram") if isinstance(event.get("telegram"), dict) else {}
    request_trace = order.get("request_trace") if isinstance(order.get("request_trace"), dict) else {}
    return {
        "time": event.get("received_at") or request_trace.get("received_at") or order.get("created_at") or "",
        "event": event.get("event") or "",
        "ok": event.get("ok"),
        "id": order_summary.get("id") or telegram.get("id") or order.get("id") or "",
        "code": order_summary.get("code") or telegram.get("code") or order.get("code") or "",
        "client_ip": event.get("client_ip") or request_trace.get("client_ip") or "",
        "forwarded_ips": event.get("forwarded_ips") or request_trace.get("forwarded_ips") or [],
        "user_agent": nested(event, "headers", "user_agent") or request_trace.get("user_agent") or "",
        "origin": nested(event, "headers", "origin") or request_trace.get("origin") or "",
        "referer": nested(event, "headers", "referer") or request_trace.get("referer") or "",
        "source_url": order_summary.get("source_url") or order.get("source_url") or nested(order, "trace", "source_url") or "",
        "device_id": order_summary.get("device_id") or order.get("device_id") or nested(order, "trace", "device_id") or "",
        "session_id": order_summary.get("session_id") or order.get("session_id") or nested(order, "trace", "session_id") or "",
        "browser": order_summary.get("browser_label") or order.get("browser_label") or nested(order, "trace", "browser_label") or "",
        "phone": order_summary.get("phone") or order.get("phone") or order.get("customer_phone") or nested(order, "customer", "phone") or "",
        "customer": order_summary.get("customer_name") or order.get("customer_name") or nested(order, "customer", "name") or "",
        "total": order_summary.get("total") or order.get("total") or "",
        "geo": order_summary.get("geo") or order.get("geo") or nested(order, "trace", "geo") or {},
    }


def print_table(rows: list[dict[str, Any]], *, geo_ip: bool) -> None:
    geo_cache: dict[str, dict[str, Any]] = {}
    headers = ["time", "event", "code", "ip", "geo", "device/session", "who", "source"]
    print(" | ".join(headers))
    print("-" * 150)
    for row in rows:
        ip = str(row.get("client_ip") or "")
        geo_text = ""
        if isinstance(row.get("geo"), dict) and row["geo"].get("lat") and row["geo"].get("lon"):
            geo_text = f"GPS {row['geo'].get('lat')},{row['geo'].get('lon')} ±{row['geo'].get('accuracy_m', '?')}m"
        elif geo_ip and public_ip(ip):
            geo = geo_cache.setdefault(ip, geo_lookup(ip))
            if geo:
                geo_text = f"{geo.get('city','')}, {geo.get('country','')} {geo.get('lat')},{geo.get('lon')}"
        device = " / ".join(part for part in [short(row.get("device_id"), 18), short(row.get("session_id"), 18)] if part)
        who = " / ".join(part for part in [short(row.get("customer"), 18), short(row.get("phone"), 18)] if part)
        source = short(row.get("source_url") or row.get("referer") or row.get("origin") or row.get("user_agent"), 48)
        print(
            " | ".join(
                [
                    short(row.get("time"), 24),
                    short(row.get("event"), 20),
                    short(row.get("code") or row.get("id"), 16),
                    short(ip, 22),
                    short(geo_text, 38),
                    short(device, 40),
                    short(who, 40),
                    source,
                ]
            )
        )


def main() -> int:
    parser = argparse.ArgumentParser(description="Inspect DRAGON order audit logs.")
    parser.add_argument("--audit-file", type=Path, default=DEFAULT_AUDIT_FILE)
    parser.add_argument("--orders-file", type=Path, default=DEFAULT_ORDERS_FILE)
    parser.add_argument("--limit", type=int, default=50)
    parser.add_argument("--code", default="", help="Filter by order code or id.")
    parser.add_argument("--ip", default="", help="Filter by client IP.")
    parser.add_argument("--event", default="", help="Filter by event name, e.g. order_upsert.")
    parser.add_argument("--geo-ip", action="store_true", help="Approximate public IP location with ip-api.com.")
    parser.add_argument("--json", action="store_true", help="Print enriched JSON instead of a table.")
    args = parser.parse_args()

    events = load_jsonl(args.audit_file)
    orders = load_orders(args.orders_file)
    rows = [enrich_event(event, orders) for event in events]

    if args.code:
        needle = args.code.strip().lower()
        rows = [row for row in rows if needle in {str(row.get("code") or "").lower(), str(row.get("id") or "").lower()}]
    if args.ip:
        rows = [row for row in rows if str(row.get("client_ip") or "") == args.ip.strip()]
    if args.event:
        rows = [row for row in rows if str(row.get("event") or "") == args.event.strip()]

    rows = rows[-max(1, args.limit):]
    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
    else:
        print_table(rows, geo_ip=args.geo_ip)
        print("\nNote: IP geolocation is approximate. Exact GPS appears only when browser geolocation was explicitly allowed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
