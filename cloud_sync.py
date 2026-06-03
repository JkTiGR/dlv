#!/usr/bin/env python3
"""
Supabase storage adapter for the DRAGON bridge-compatible API.

This module keeps the existing frontend contract intact:
- orders are stored and returned in the same shape as the local bridge
- menu availability is stored as a single snapshot payload
- dashboard stats are derived from the stored order payloads
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv

try:
    from supabase import Client, create_client
except ImportError as exc:  # pragma: no cover - import depends on deployment env
    raise ImportError("Install cloud dependencies first: pip install -r requirements_cloud.txt") from exc


load_dotenv()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_iso(value: Any, fallback: str | None = None) -> str:
    fallback_value = fallback or utc_now()
    if value is None:
        return fallback_value
    raw = str(value).strip()
    if not raw:
        return fallback_value
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00")).isoformat()
    except ValueError:
        return fallback_value


def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return round(default, 2)
    if number != number:  # NaN check
        return round(default, 2)
    return round(number, 2)


def safe_int(value: Any, default: int = 0) -> int:
    try:
        number = int(float(value))
    except (TypeError, ValueError):
        return default
    return number


def parse_jsonish(value: Any, fallback: Any) -> Any:
    if value is None:
        return fallback
    if isinstance(value, (dict, list)):
        return value
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return fallback
    return fallback


def normalize_status(value: Any) -> str:
    raw = str(value or "").strip().upper()
    if raw in {"NEW", "COOKING", "READY", "HANDED", "CANCELLED"}:
        return raw
    if raw in {"SENT", "PENDING", "FAILED"}:
        return "NEW"
    if raw in {"CONFIRMED", "IN_PROGRESS"}:
        return "COOKING"
    if raw in {"COMPLETED", "DONE"}:
        return "HANDED"
    return "NEW"


def normalize_type(value: Any) -> str:
    raw = str(value or "").strip().lower()
    if raw in {"on_site", "onsite", "dinein"}:
        return "on_site"
    if raw in {"takeaway", "take_away", "pickup"}:
        return "takeaway"
    if raw == "delivery":
        return "delivery"
    if "мест" in raw:
        return "on_site"
    if "вынос" in raw:
        return "takeaway"
    if "достав" in raw:
        return "delivery"
    return "takeaway"


class CloudSync:
    def __init__(self, url: str | None = None, key: str | None = None):
        self.url = str(url or os.getenv("SUPABASE_URL") or "").strip()
        self.key = str(
            key
            or os.getenv("SUPABASE_SERVICE_KEY")
            or os.getenv("SUPABASE_KEY")
            or os.getenv("SUPABASE_ANON_KEY")
            or ""
        ).strip()
        if not self.url or not self.key:
            raise ValueError(
                "Set SUPABASE_URL and SUPABASE_SERVICE_KEY "
                "(or SUPABASE_KEY) in the .env file."
            )

        self.client: Client = create_client(self.url, self.key)
        self.orders_table = str(os.getenv("SUPABASE_ORDERS_TABLE") or "orders").strip()
        self.menu_state_table = str(os.getenv("SUPABASE_MENU_STATE_TABLE") or "menu_state").strip()
        self.menu_scope = str(os.getenv("SUPABASE_MENU_SCOPE") or "global").strip()

    def utc_now(self) -> str:
        return utc_now()

    def normalize_order(self, raw: dict | None) -> dict:
        payload = dict(raw or {})
        code = str(
            payload.get("code")
            or payload.get("order_code")
            or payload.get("id")
            or payload.get("order_id")
            or ""
        ).strip()
        if not code:
            raise ValueError("Order code is required")

        order_id = str(payload.get("id") or payload.get("order_id") or code).strip()
        created_at = ensure_iso(payload.get("created_at") or payload.get("createdAt"))
        updated_at = ensure_iso(payload.get("updated_at") or payload.get("updatedAt"), created_at)
        items = parse_jsonish(payload.get("items"), [])
        if not isinstance(items, list):
            items = []

        subtotal_source = payload.get("subtotal")
        if subtotal_source is None:
            subtotal_source = payload.get("sum")
        delivery_fee = safe_float(payload.get("delivery_fee", payload.get("deliveryFee", 0)))
        subtotal = safe_float(subtotal_source, 0.0)
        total = safe_float(payload.get("total"), subtotal + delivery_fee)
        if subtotal == 0.0 and items:
            subtotal = safe_float(
                sum(
                    safe_float(item.get("price")) * max(1, safe_int(item.get("qty", 1), 1))
                    for item in items
                    if isinstance(item, dict)
                ),
                total,
            )

        sync_payload = payload.get("sync")
        if not isinstance(sync_payload, dict):
            sync_payload = {}

        normalized = {
            **payload,
            "id": order_id,
            "code": code,
            "status": normalize_status(payload.get("status")),
            "type": normalize_type(payload.get("type")),
            "source": str(payload.get("source") or "site").strip() or "site",
            "items": items,
            "subtotal": subtotal,
            "delivery_fee": delivery_fee,
            "total": total,
            "created_at": created_at,
            "updated_at": updated_at,
            "sync": sync_payload,
        }
        return normalized

    def normalize_menu_availability(self, raw: dict | None) -> dict:
        payload = dict(raw or {})
        items = payload.get("items")
        if not isinstance(items, dict):
            items = {}
        return {
            "version": 1,
            "updated_at": ensure_iso(payload.get("updated_at")),
            "items": items,
        }

    def _orders_select(self):
        return self.client.table(self.orders_table).select(
            "id,code,status,type,source,total,created_at,updated_at,payload"
        )

    def _order_row_to_payload(self, row: dict | None) -> dict:
        if not isinstance(row, dict):
            return {}
        payload = row.get("payload")
        payload = dict(payload) if isinstance(payload, dict) else {}
        merged = {
            **payload,
            "id": row.get("id") or payload.get("id"),
            "code": row.get("code") or payload.get("code"),
            "status": row.get("status") or payload.get("status"),
            "type": row.get("type") or payload.get("type"),
            "source": row.get("source") or payload.get("source"),
            "total": row.get("total") if row.get("total") is not None else payload.get("total"),
            "created_at": row.get("created_at") or payload.get("created_at"),
            "updated_at": row.get("updated_at") or payload.get("updated_at"),
        }
        return self.normalize_order(merged)

    def _order_payload_to_row(self, order: dict) -> dict:
        normalized = self.normalize_order(order)
        return {
            "id": normalized["id"],
            "code": normalized["code"],
            "status": normalized["status"],
            "type": normalized["type"],
            "source": normalized.get("source") or "site",
            "total": normalized["total"],
            "created_at": normalized["created_at"],
            "updated_at": normalized["updated_at"],
            "payload": normalized,
        }

    def _get_order_row_by_column(self, column: str, value: str) -> dict:
        response = self._orders_select().eq(column, value).limit(1).execute()
        rows = response.data or []
        return rows[0] if rows else {}

    def get_order(self, reference: str) -> dict:
        ref = str(reference or "").strip()
        if not ref:
            return {}
        row = self._get_order_row_by_column("code", ref)
        if not row:
            row = self._get_order_row_by_column("id", ref)
        return self._order_row_to_payload(row)

    def list_orders(self) -> list[dict]:
        response = self._orders_select().order("created_at", desc=False).execute()
        orders = [self._order_row_to_payload(row) for row in response.data or []]
        return sorted(
            orders,
            key=lambda order: (
                ensure_iso(order.get("created_at")),
                str(order.get("code") or order.get("id") or ""),
            ),
        )

    def upsert_order(self, order_data: dict) -> dict:
        normalized = self.normalize_order(order_data)
        existing_row = self._get_order_row_by_column("code", normalized["code"])
        if not existing_row and normalized["id"] != normalized["code"]:
            existing_row = self._get_order_row_by_column("id", normalized["id"])

        merged_order = normalized
        if existing_row:
            current = self._order_row_to_payload(existing_row)
            merged_order = {
                **current,
                **normalized,
                "sync": {
                    **(current.get("sync") if isinstance(current.get("sync"), dict) else {}),
                    **(normalized.get("sync") if isinstance(normalized.get("sync"), dict) else {}),
                },
            }
            merged_order = self.normalize_order(merged_order)
            merged_order["id"] = str(existing_row.get("id") or merged_order["id"]).strip()
            response = (
                self.client.table(self.orders_table)
                .update(self._order_payload_to_row(merged_order))
                .eq("id", existing_row["id"])
                .execute()
            )
        else:
            response = self.client.table(self.orders_table).insert(self._order_payload_to_row(merged_order)).execute()

        rows = response.data or []
        if rows:
            return self._order_row_to_payload(rows[0])
        return self.get_order(merged_order["code"]) or merged_order

    def delete_order(self, reference: str) -> bool:
        existing = self.get_order(reference)
        if not existing:
            return False
        self.client.table(self.orders_table).delete().eq("id", existing["id"]).execute()
        return True

    def clear_orders(self) -> int:
        orders = self.list_orders()
        removed = 0
        for order in orders:
            if self.delete_order(order.get("id") or order.get("code") or ""):
                removed += 1
        return removed

    def get_menu_availability(self) -> dict:
        response = (
            self.client.table(self.menu_state_table)
            .select("scope,payload,updated_at")
            .eq("scope", self.menu_scope)
            .limit(1)
            .execute()
        )
        rows = response.data or []
        if not rows:
            return self.normalize_menu_availability({})
        row = rows[0]
        payload = dict(row.get("payload") or {})
        payload["updated_at"] = row.get("updated_at") or payload.get("updated_at")
        return self.normalize_menu_availability(payload)

    def replace_menu_availability(self, payload: dict) -> dict:
        normalized = self.normalize_menu_availability(payload)
        row = {
            "scope": self.menu_scope,
            "payload": normalized,
            "updated_at": normalized["updated_at"],
        }
        response = (
            self.client.table(self.menu_state_table)
            .upsert(row, on_conflict="scope")
            .execute()
        )
        rows = response.data or []
        if rows:
            result = dict(rows[0].get("payload") or {})
            result["updated_at"] = rows[0].get("updated_at") or result.get("updated_at")
            return self.normalize_menu_availability(result)
        return self.get_menu_availability()

    def clear_menu_availability(self) -> dict:
        return self.replace_menu_availability({"version": 1, "items": {}, "updated_at": utc_now()})

    def get_dashboard_stats(self) -> dict:
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
        latest_order_response = self._orders_select().order("updated_at", desc=True).limit(1).execute()
        latest_order_rows = latest_order_response.data or []
        latest_order = latest_order_rows[0] if latest_order_rows else {}

        order_count_response = self.client.table(self.orders_table).select("id", count="exact").limit(1).execute()
        order_count = getattr(order_count_response, "count", None)
        if order_count is None:
            order_count = len(self.list_orders())

        menu_response = (
            self.client.table(self.menu_state_table)
            .select("updated_at")
            .eq("scope", self.menu_scope)
            .limit(1)
            .execute()
        )
        menu_rows = menu_response.data or []
        latest_menu = menu_rows[0] if menu_rows else {}

        return {
            "orders_count": int(order_count or 0),
            "orders_updated_at": str(latest_order.get("updated_at") or ""),
            "menu_updated_at": str(latest_menu.get("updated_at") or ""),
        }

    def get_health(self) -> dict:
        return {
            "ok": True,
            "orders_table": self.orders_table,
            "menu_state_table": self.menu_state_table,
            "menu_scope": self.menu_scope,
            "snapshot": self.snapshot_token(),
        }


def get_cloud_sync() -> CloudSync:
    return CloudSync()


if __name__ == "__main__":
    sync = get_cloud_sync()
    print(json.dumps(sync.get_health(), ensure_ascii=False, indent=2))
