from __future__ import annotations

import base64
import hashlib
import json
import os
import secrets
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any


TRUE_VALUES = {"1", "true", "yes", "on"}
LIQPAY_CHECKOUT_URL = "https://www.liqpay.ua/api/3/checkout"


def read_env_file(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}

    values: dict[str, str] = {}
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return values

    for raw_line in lines:
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if value[:1] == value[-1:] and value[:1] in {"'", '"'}:
            value = value[1:-1]
        values[key] = value
    return values


def pick_setting(env_file_values: dict[str, str], *names: str, default: str = "") -> str:
    for name in names:
        env_value = os.getenv(name)
        if env_value is not None and str(env_value).strip():
            return str(env_value).strip()
        file_value = env_file_values.get(name)
        if file_value is not None and str(file_value).strip():
            return str(file_value).strip()
    return default


@dataclass(frozen=True)
class BridgeRuntimeConfig:
    bridge_token: str
    allow_insecure_remote: bool
    kassa_pin: str
    telegram_bot_token: str
    telegram_chat_main: str
    telegram_chat_vn: str
    allowed_origins: tuple[str, ...]
    cookie_max_age_seconds: int = 60 * 60 * 12
    liqpay_public_key: str = ""
    liqpay_private_key: str = ""
    liqpay_result_url: str = ""
    liqpay_server_url: str = ""
    liqpay_checkout_url: str = LIQPAY_CHECKOUT_URL
    liqpay_sandbox: bool = False


def load_bridge_runtime_config(root_dir: Path) -> BridgeRuntimeConfig:
    env_file_values = read_env_file(root_dir / ".env")

    allow_insecure_remote = (
        pick_setting(
            env_file_values,
            "DRAGON_ALLOW_INSECURE_REMOTE",
            "DLV_ALLOW_INSECURE_REMOTE",
            default="0",
        ).lower()
        in TRUE_VALUES
    )

    allowed_origins_raw = pick_setting(
        env_file_values,
        "DRAGON_ALLOWED_ORIGINS",
        "DLV_ALLOWED_ORIGINS",
        default="",
    )
    allowed_origins = tuple(
        origin
        for origin in (part.strip() for part in allowed_origins_raw.split(","))
        if origin
    )

    liqpay_sandbox = (
        pick_setting(
            env_file_values,
            "DRAGON_LIQPAY_SANDBOX",
            "DLV_LIQPAY_SANDBOX",
            "LIQPAY_SANDBOX",
            default="0",
        ).lower()
        in TRUE_VALUES
    )

    return BridgeRuntimeConfig(
        bridge_token=pick_setting(
            env_file_values,
            "DRAGON_BRIDGE_TOKEN",
            "DLV_BRIDGE_TOKEN",
            "BRIDGE_TOKEN",
            default="",
        ),
        allow_insecure_remote=allow_insecure_remote,
        kassa_pin=pick_setting(
            env_file_values,
            "DRAGON_KASSA_PIN",
            "DLV_KASSA_PIN",
            "KASSA_PIN",
            default="1990",
        ),
        telegram_bot_token=pick_setting(
            env_file_values,
            "DRAGON_TG_BOT_TOKEN",
            "DLV_TG_BOT_TOKEN",
            default="",
        ),
        telegram_chat_main=pick_setting(
            env_file_values,
            "DRAGON_TG_CHAT_ID",
            "DRAGON_TG_CHAT_MAIN_ID",
            "DLV_TG_CHAT_ID",
            default="",
        ),
        telegram_chat_vn=pick_setting(
            env_file_values,
            "DRAGON_TG_CHAT_ID_VN",
            "DLV_TG_CHAT_ID_VN",
            default="",
        ),
        allowed_origins=allowed_origins,
        liqpay_public_key=pick_setting(
            env_file_values,
            "DRAGON_LIQPAY_PUBLIC_KEY",
            "DLV_LIQPAY_PUBLIC_KEY",
            "LIQPAY_PUBLIC_KEY",
            default="",
        ),
        liqpay_private_key=pick_setting(
            env_file_values,
            "DRAGON_LIQPAY_PRIVATE_KEY",
            "DLV_LIQPAY_PRIVATE_KEY",
            "LIQPAY_PRIVATE_KEY",
            default="",
        ),
        liqpay_result_url=pick_setting(
            env_file_values,
            "DRAGON_LIQPAY_RESULT_URL",
            "DLV_LIQPAY_RESULT_URL",
            "LIQPAY_RESULT_URL",
            default="",
        ),
        liqpay_server_url=pick_setting(
            env_file_values,
            "DRAGON_LIQPAY_SERVER_URL",
            "DLV_LIQPAY_SERVER_URL",
            "LIQPAY_SERVER_URL",
            default="",
        ),
        liqpay_checkout_url=pick_setting(
            env_file_values,
            "DRAGON_LIQPAY_CHECKOUT_URL",
            "DLV_LIQPAY_CHECKOUT_URL",
            "LIQPAY_CHECKOUT_URL",
            default=LIQPAY_CHECKOUT_URL,
        ),
        liqpay_sandbox=liqpay_sandbox,
    )


def has_liqpay_checkout_config(config: BridgeRuntimeConfig) -> bool:
    return bool(str(config.liqpay_public_key or "").strip() and str(config.liqpay_private_key or "").strip())


def _normalize_http_url(value: str) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""
    if raw.startswith("https://") or raw.startswith("http://"):
        return raw
    raise ValueError("LiqPay URLs must start with http:// or https://")


def liqpay_str_to_sign(raw_value: str) -> str:
    digest = hashlib.sha1(str(raw_value or "").encode("utf-8")).digest()
    return base64.b64encode(digest).decode("ascii")


def build_liqpay_checkout_form(
    config: BridgeRuntimeConfig,
    *,
    amount: float | int | str,
    description: str,
    order_id: str,
    currency: str = "UAH",
    language: str = "uk",
    result_url: str = "",
    info: str = "",
    phone: str = "",
) -> dict[str, Any]:
    if not has_liqpay_checkout_config(config):
        raise ValueError("LiqPay is not configured on the server. Set LIQPAY_PUBLIC_KEY and LIQPAY_PRIVATE_KEY.")

    try:
        amount_value = round(float(amount), 2)
    except (TypeError, ValueError) as exc:
        raise ValueError("Invalid payment amount for LiqPay checkout.") from exc

    if amount_value <= 0:
        raise ValueError("LiqPay amount must be greater than zero.")

    public_key = str(config.liqpay_public_key or "").strip()
    private_key = str(config.liqpay_private_key or "").strip()
    payment_language = str(language or "uk").strip().lower() or "uk"
    if payment_language not in {"uk", "ru", "en"}:
        payment_language = "en"

    payload: dict[str, Any] = {
        "version": "3",
        "public_key": public_key,
        "action": "pay",
        "amount": f"{amount_value:.2f}",
        "currency": str(currency or "UAH").strip().upper() or "UAH",
        "description": str(description or "Payment").strip()[:255] or "Payment",
        "order_id": str(order_id or "").strip()[:255],
        "language": payment_language,
    }
    if not payload["order_id"]:
        raise ValueError("LiqPay order_id is required.")

    resolved_result_url = _normalize_http_url(result_url or config.liqpay_result_url)
    resolved_server_url = _normalize_http_url(config.liqpay_server_url)
    if resolved_result_url:
        payload["result_url"] = resolved_result_url
    if resolved_server_url:
        payload["server_url"] = resolved_server_url
    if config.liqpay_sandbox:
        payload["sandbox"] = "1"
    if info:
        payload["info"] = str(info).strip()[:1024]
    if phone:
        payload["phone"] = str(phone).strip()[:32]

    data = base64.b64encode(json.dumps(payload, ensure_ascii=False).encode("utf-8")).decode("ascii")
    signature = liqpay_str_to_sign(private_key + data + private_key)
    return {
        "checkout_url": _normalize_http_url(config.liqpay_checkout_url or LIQPAY_CHECKOUT_URL),
        "data": data,
        "signature": signature,
        "payload": payload,
    }


def _require_bot_token(config: BridgeRuntimeConfig) -> str:
    token = str(config.telegram_bot_token or "").strip()
    if not token:
        raise ValueError("Telegram bot token is not configured on the server.")
    return token


def resolve_telegram_chat_id(config: BridgeRuntimeConfig, channel: str) -> str:
    normalized = str(channel or "").strip().lower()
    if normalized in {"main", "default", "ua", "primary"}:
        chat_id = config.telegram_chat_main
    elif normalized in {"vn", "secondary", "vietnam"}:
        chat_id = config.telegram_chat_vn
    else:
        raise ValueError(f"Unsupported Telegram channel: {channel!r}")

    chat_id = str(chat_id or "").strip()
    if not chat_id:
        raise ValueError(f"Telegram chat id for channel '{normalized or 'main'}' is not configured.")
    return chat_id


def _telegram_json_request(bot_token: str, method: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/{method}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError as error:
            raise RuntimeError(f"Telegram HTTP {exc.code}: {raw or exc.reason}") from error
        raise RuntimeError(payload.get("description") or payload.get("error") or f"Telegram HTTP {exc.code}") from exc
    except OSError as exc:
        raise RuntimeError(f"Telegram request failed: {exc}") from exc

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Telegram returned invalid JSON.") from exc
    if payload.get("ok") is False:
        raise RuntimeError(payload.get("description") or "Telegram error")
    return payload


def _encode_multipart_form(fields: dict[str, str], file_field: str, filename: str, content_bytes: bytes, mime_type: str) -> tuple[bytes, str]:
    boundary = f"dragon-{secrets.token_hex(12)}"
    chunks: list[bytes] = []

    for key, value in fields.items():
        chunks.append(f"--{boundary}\r\n".encode("utf-8"))
        chunks.append(f'Content-Disposition: form-data; name="{key}"\r\n\r\n'.encode("utf-8"))
        chunks.append(str(value).encode("utf-8"))
        chunks.append(b"\r\n")

    chunks.append(f"--{boundary}\r\n".encode("utf-8"))
    chunks.append(
        (
            f'Content-Disposition: form-data; name="{file_field}"; filename="{filename}"\r\n'
            f"Content-Type: {mime_type or 'application/octet-stream'}\r\n\r\n"
        ).encode("utf-8")
    )
    chunks.append(content_bytes)
    chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode("utf-8"))

    return b"".join(chunks), boundary


def send_telegram_message(
    config: BridgeRuntimeConfig,
    *,
    channel: str,
    text: str,
    parse_mode: str = "HTML",
    disable_web_page_preview: bool = True,
) -> dict[str, Any]:
    bot_token = _require_bot_token(config)
    chat_id = resolve_telegram_chat_id(config, channel)
    return _telegram_json_request(
        bot_token,
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": parse_mode,
            "disable_web_page_preview": bool(disable_web_page_preview),
        },
    )


def send_telegram_document(
    config: BridgeRuntimeConfig,
    *,
    channel: str,
    filename: str,
    content_bytes: bytes,
    mime_type: str,
    caption: str = "",
) -> dict[str, Any]:
    bot_token = _require_bot_token(config)
    chat_id = resolve_telegram_chat_id(config, channel)
    body, boundary = _encode_multipart_form(
        {
            "chat_id": chat_id,
            "caption": caption,
        },
        "document",
        filename,
        content_bytes,
        mime_type,
    )
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/sendDocument",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError as error:
            raise RuntimeError(f"Telegram HTTP {exc.code}: {raw or exc.reason}") from error
        raise RuntimeError(payload.get("description") or payload.get("error") or f"Telegram HTTP {exc.code}") from exc
    except OSError as exc:
        raise RuntimeError(f"Telegram document upload failed: {exc}") from exc

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Telegram returned invalid JSON.") from exc
    if payload.get("ok") is False:
        raise RuntimeError(payload.get("description") or "Telegram error")
    return payload
