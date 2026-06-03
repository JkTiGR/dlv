#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT_DIR = Path(__file__).resolve().parent
KASSA_FILE = ROOT_DIR / "DRAGON_KASSA.html"
STATE_FILE = Path(os.environ.get("DRAGON_TG_STATE_FILE") or (ROOT_DIR / ".dragon_telegram_state.json"))


@dataclass
class TelegramConfig:
    bot_token: str
    chat_ids: list[str]


def load_state() -> dict:
    try:
        data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return data if isinstance(data, dict) else {}


def save_state(state: dict) -> None:
    try:
        STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
    except OSError as exc:
        print(f"Telegram state save failed: {exc}", file=sys.stderr, flush=True)


def telegram_api_request(bot_token: str, method: str, payload: dict) -> dict | None:
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        f"https://api.telegram.org/bot{bot_token}/{method}",
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=12) as response:
            raw = response.read().decode("utf-8", errors="replace")
    except (HTTPError, URLError, OSError) as exc:
        print(f"Telegram {method} failed: {exc}", file=sys.stderr, flush=True)
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        print(f"Telegram {method} returned invalid JSON", file=sys.stderr, flush=True)
        return None
    return data if isinstance(data, dict) else None


def read_kassa_source() -> str:
    try:
        return KASSA_FILE.read_text(encoding="utf-8")
    except OSError:
        return ""


def parse_kassa_value(source: str, key: str) -> str:
    match = re.search(rf"{re.escape(key)}\s*:\s*\"([^\"]+)\"", source)
    return match.group(1).strip() if match else ""


def split_chat_values(*values: str) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        for part in re.split(r"[\s,;]+", str(value or "").strip()):
            item = part.strip()
            if not item or item in seen:
                continue
            seen.add(item)
            result.append(item)
    return result


def load_telegram_config(bot_token_override: str = "", chat_id_overrides: list[str] | None = None) -> TelegramConfig | None:
    source = read_kassa_source()
    bot_token = str(bot_token_override or "").strip()
    if not bot_token:
        bot_token = str(os.environ.get("DRAGON_TG_BOT_TOKEN", "")).strip()
    if not bot_token:
        bot_token = parse_kassa_value(source, "BOT_TOKEN")

    chat_ids = split_chat_values(
        *(chat_id_overrides or []),
        os.environ.get("DRAGON_TG_CHAT_IDS", ""),
        os.environ.get("DRAGON_TG_CHAT_ID", ""),
    )
    if not chat_ids:
        fallback_chat = parse_kassa_value(source, "CHAT_ID")
        chat_ids = split_chat_values(fallback_chat)

    if not bot_token or not chat_ids:
        return None
    return TelegramConfig(bot_token=bot_token, chat_ids=chat_ids)


def build_public_url_message(title: str, public_url: str, local_base: str, note: str = "") -> str:
    lines = [
        title.strip() or "DRAGON external address",
        "",
        f"Base: {public_url}",
        f"Kassa: {public_url}/DRAGON_KASSA.html",
        f"Monitor: {public_url}/MONITOR.html",
        f"View: {public_url}/VIEW.html",
        f"Profil: {public_url}/profil.html",
        f"Control: {public_url}/contron.html",
        "",
        f"Local source: {local_base}",
    ]
    if note.strip():
        lines.extend(["", note.strip()])
    return "\n".join(lines)


def normalize_message_ids(value) -> list[int]:
    raw_values = value if isinstance(value, list) else [value]
    result: list[int] = []
    seen: set[int] = set()
    for item in raw_values:
        try:
            number = int(item)
        except (TypeError, ValueError):
            continue
        if number <= 0 or number in seen:
            continue
        seen.add(number)
        result.append(number)
    return result


def send_telegram_message(config: TelegramConfig, text: str, dry_run: bool = False, replace_key: str = "") -> None:
    state = load_state() if replace_key and not dry_run else {}
    replacements = state.setdefault("replacements", {}) if replace_key and not dry_run else {}
    replace_map = replacements.setdefault(replace_key, {}) if replace_key and not dry_run else {}

    for chat_id in config.chat_ids:
        if dry_run:
            print(f"[dry-run] Telegram chat {chat_id}", flush=True)
            print(text, flush=True)
            if replace_key:
                print(f"[dry-run] Would replace previous message for key {replace_key}", flush=True)
            continue

        payload = (
            {
                "chat_id": chat_id,
                "text": text,
                "disable_web_page_preview": True,
            }
        )
        data = telegram_api_request(config.bot_token, "sendMessage", payload)
        if not data:
            continue

        if data.get("ok"):
            print(f"Telegram notify sent to {chat_id}", flush=True)
            if replace_key:
                result = data.get("result") or {}
                new_message_id = result.get("message_id")
                previous_message_ids = normalize_message_ids(replace_map.get(chat_id))
                for previous_message_id in previous_message_ids:
                    if previous_message_id == new_message_id:
                        continue
                    delete_result = telegram_api_request(
                        config.bot_token,
                        "deleteMessage",
                        {
                            "chat_id": chat_id,
                            "message_id": previous_message_id,
                        },
                    )
                    if delete_result and delete_result.get("ok"):
                        print(f"Telegram previous message deleted in {chat_id}: {previous_message_id}", flush=True)
                if new_message_id:
                    replace_map[chat_id] = [int(new_message_id)]
        else:
            print(f"Telegram notify failed for chat {chat_id}: {data}", file=sys.stderr, flush=True)

    if replace_key and not dry_run:
        save_state(state)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Send a DRAGON public URL message to Telegram.")
    parser.add_argument("--public-url", required=True, help="Public base URL, e.g. https://foo.lhr.life")
    parser.add_argument("--local-base", default="http://127.0.0.1:8000", help="Local DRAGON base URL.")
    parser.add_argument("--title", default="DRAGON external address", help="Telegram message title.")
    parser.add_argument("--note", default="", help="Optional final note in the message.")
    parser.add_argument("--bot-token", default="", help="Telegram bot token override.")
    parser.add_argument("--chat-id", action="append", default=[], help="Telegram chat id override. Can be used multiple times.")
    parser.add_argument("--dry-run", action="store_true", help="Print the message instead of sending it.")
    parser.add_argument("--replace-key", default="public_external_address", help="Replacement key for deleting the previous address message.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    config = load_telegram_config(args.bot_token, args.chat_id)
    if not config:
        print("Telegram notify skipped: bot token or chat id not configured.", flush=True)
        return 0

    text = build_public_url_message(args.title, args.public_url.rstrip("/"), args.local_base.rstrip("/"), args.note)
    send_telegram_message(config, text, dry_run=args.dry_run, replace_key=str(args.replace_key or "").strip())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
