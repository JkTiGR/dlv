#!/usr/bin/env python3
from __future__ import annotations

import argparse
import atexit
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable
from urllib.error import URLError
from urllib.request import urlopen
import re

import requests


ROOT_DIR = Path(__file__).resolve().parent
SERVER_SCRIPT = ROOT_DIR / "dragon_local_server.py"
KASSA_FILE = ROOT_DIR / "DRAGON_KASSA.html"
BOOTSTRAP_FILE = ROOT_DIR / "__dragon_kassa_screenshot_bootstrap__.html"


@dataclass
class TelegramConfig:
    bot_token: str
    chat_id: str


@dataclass
class ServerHandle:
    base_url: str
    port: int
    process: subprocess.Popen[str] | None = None


def log(message: str) -> None:
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{stamp}] {message}", flush=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Capture DRAGON pages and send screenshots to Telegram every N minutes."
    )
    parser.add_argument("--interval", type=int, default=300, help="Interval in seconds. Default: 300")
    parser.add_argument("--port", type=int, default=8000, help="Preferred local DRAGON port. Default: 8000")
    parser.add_argument("--fallback-port", type=int, default=8015, help="Fallback local port if preferred port is busy. Default: 8015")
    parser.add_argument("--width", type=int, default=1440, help="Chrome viewport width. Default: 1440")
    parser.add_argument("--height", type=int, default=16000, help="Chrome viewport height for tall full-page capture. Default: 16000")
    parser.add_argument("--virtual-time-budget", type=int, default=9000, help="Chrome virtual time budget in ms. Default: 9000")
    parser.add_argument("--once", action="store_true", help="Run one capture cycle and exit.")
    parser.add_argument("--dry-run", action="store_true", help="Capture screenshots without sending to Telegram.")
    parser.add_argument("--bot-token", default="", help="Telegram bot token override.")
    parser.add_argument("--chat-id", default="", help="Telegram chat id override.")
    return parser.parse_args()


def load_telegram_config(args: argparse.Namespace) -> TelegramConfig:
    source_text = KASSA_FILE.read_text(encoding="utf-8")

    def pick(key: str) -> str:
        env_value = ""
        if key == "BOT_TOKEN":
            env_value = str(os.environ.get("DRAGON_TG_BOT_TOKEN", "")).strip()
            cli_value = str(args.bot_token or "").strip()
        else:
            env_value = str(os.environ.get("DRAGON_TG_CHAT_ID_VN", "")).strip()
            cli_value = str(args.chat_id or "").strip()
        if cli_value:
            return cli_value
        if env_value:
            return env_value
        match = re.search(rf"{key}\s*:\s*\"([^\"]+)\"", source_text)
        return match.group(1).strip() if match else ""

    bot_token = pick("BOT_TOKEN")
    chat_id = pick("CHAT_ID_VN")
    if not bot_token:
        raise RuntimeError("Telegram bot token not found. Set --bot-token or DRAGON_TG_BOT_TOKEN.")
    if not chat_id:
        raise RuntimeError("Telegram chat id not found. Set --chat-id or DRAGON_TG_CHAT_ID_VN.")
    return TelegramConfig(bot_token=bot_token, chat_id=chat_id)


def port_responds(host: str, port: int, timeout: float = 1.5) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        return sock.connect_ex((host, port)) == 0


def is_dragon_bridge_ready(port: int) -> bool:
    try:
        with urlopen(f"http://127.0.0.1:{port}/api/local-orders", timeout=2.5) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return bool(payload.get("ok")) and isinstance(payload.get("orders"), list)
    except (OSError, URLError, TimeoutError, ValueError, json.JSONDecodeError):
        return False


def start_local_server(port: int) -> subprocess.Popen[str]:
    log(f"Starting local DRAGON server on 127.0.0.1:{port}")
    process = subprocess.Popen(
        [sys.executable, str(SERVER_SCRIPT), "--bind", "127.0.0.1", "--port", str(port)],
        cwd=str(ROOT_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    deadline = time.time() + 12
    while time.time() < deadline:
        if process.poll() is not None:
            output = process.stdout.read() if process.stdout else ""
            raise RuntimeError(f"DRAGON server exited early on port {port}.\n{output}")
        if is_dragon_bridge_ready(port):
            return process
        time.sleep(0.25)

    output = process.stdout.read() if process.stdout else ""
    process.terminate()
    raise RuntimeError(f"DRAGON server did not become ready on port {port}.\n{output}")


def ensure_server(preferred_port: int, fallback_port: int) -> ServerHandle:
    for port in (preferred_port, fallback_port):
        if is_dragon_bridge_ready(port):
            log(f"Using existing DRAGON server on http://127.0.0.1:{port}")
            return ServerHandle(base_url=f"http://127.0.0.1:{port}", port=port)

    if not port_responds("127.0.0.1", preferred_port):
        process = start_local_server(preferred_port)
        handle = ServerHandle(base_url=f"http://127.0.0.1:{preferred_port}", port=preferred_port, process=process)
    else:
        process = start_local_server(fallback_port)
        handle = ServerHandle(base_url=f"http://127.0.0.1:{fallback_port}", port=fallback_port, process=process)

    if handle.process:
        atexit.register(stop_server, handle.process)
    return handle


def stop_server(process: subprocess.Popen[str]) -> None:
    if process.poll() is not None:
        return
    process.terminate()
    try:
        process.wait(timeout=3)
    except subprocess.TimeoutExpired:
        process.kill()


def ensure_kassa_bootstrap() -> Path:
    content = """<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DRAGON Kassa Screenshot Bootstrap</title>
</head>
<body>
  <script>
    sessionStorage.setItem("CD_KASSA_AUTH_V1", "ok");
    location.replace("DRAGON_KASSA.html?screenshot=1");
  </script>
</body>
</html>
"""
    if not BOOTSTRAP_FILE.exists() or BOOTSTRAP_FILE.read_text(encoding="utf-8") != content:
        BOOTSTRAP_FILE.write_text(content, encoding="utf-8")
    return BOOTSTRAP_FILE


def chrome_binary() -> str:
    for candidate in ("google-chrome", "chromium", "chromium-browser"):
        binary = shutil.which(candidate)
        if binary:
            return binary
    raise RuntimeError("Chrome/Chromium binary not found.")


def cleanup_path(path: Path, attempts: int = 6, delay: float = 0.4) -> None:
    for attempt in range(attempts):
        try:
            shutil.rmtree(path)
            return
        except FileNotFoundError:
            return
        except OSError:
            if attempt == attempts - 1:
                shutil.rmtree(path, ignore_errors=True)
                return
            time.sleep(delay)


def capture_page_screenshot(
    chrome_bin: str,
    url: str,
    output_path: Path,
    width: int,
    height: int,
    virtual_time_budget: int
) -> None:
    profile_dir = Path(tempfile.mkdtemp(prefix="dragon-shot-profile-"))
    try:
        cmd = [
            chrome_bin,
            "--headless=new",
            "--disable-gpu",
            "--disable-background-networking",
            "--hide-scrollbars",
            "--run-all-compositor-stages-before-draw",
            "--no-first-run",
            "--no-default-browser-check",
            f"--user-data-dir={profile_dir}",
            f"--window-size={width},{height}",
            f"--timeout={virtual_time_budget}",
            f"--virtual-time-budget={virtual_time_budget}",
            f"--screenshot={output_path}",
            url,
        ]
        result = subprocess.run(
            cmd,
            cwd=str(ROOT_DIR),
            capture_output=True,
            text=True,
            timeout=max(30, virtual_time_budget // 1000 + 20)
        )
    finally:
        cleanup_path(profile_dir)
    if result.returncode != 0:
        raise RuntimeError(
            f"Chrome screenshot failed for {url}\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
        )
    if not output_path.exists() or output_path.stat().st_size == 0:
        raise RuntimeError(f"Screenshot file was not created for {url}")


def send_document(config: TelegramConfig, file_path: Path, caption: str, dry_run: bool) -> None:
    if dry_run:
        log(f"DRY RUN: {file_path.name} -> {config.chat_id} | {caption}")
        return

    with file_path.open("rb") as handle:
        response = requests.post(
            f"https://api.telegram.org/bot{config.bot_token}/sendDocument",
            data={
                "chat_id": config.chat_id,
                "caption": caption
            },
            files={
                "document": (file_path.name, handle, "image/png")
            },
            timeout=90
        )
    response.raise_for_status()
    payload = response.json()
    if not payload.get("ok"):
        raise RuntimeError(f"Telegram sendDocument failed: {payload}")


def cycle_targets(base_url: str) -> Iterable[tuple[str, str]]:
    ensure_kassa_bootstrap()
    yield "kassa", f"{base_url}/{BOOTSTRAP_FILE.name}"
    yield "contron", f"{base_url}/contron.html"


def run_cycle(server: ServerHandle, config: TelegramConfig, args: argparse.Namespace) -> None:
    chrome_bin = chrome_binary()
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    human_time = datetime.now().strftime("%d.%m.%Y %H:%M:%S")

    with tempfile.TemporaryDirectory(prefix="dragon-shot-output-") as temp_dir:
        temp_path = Path(temp_dir)
        for label, url in cycle_targets(server.base_url):
            screenshot_path = temp_path / f"{timestamp}_{label}.png"
            log(f"Capturing {label}: {url}")
            capture_page_screenshot(
                chrome_bin=chrome_bin,
                url=url,
                output_path=screenshot_path,
                width=args.width,
                height=args.height,
                virtual_time_budget=args.virtual_time_budget
            )
            caption = f"DRAGON {label} • {human_time}"
            send_document(config, screenshot_path, caption, args.dry_run)
            log(f"Sent {label} screenshot: {screenshot_path.name}")


def main() -> None:
    args = parse_args()
    config = load_telegram_config(args)
    server = ensure_server(args.port, args.fallback_port)

    log(f"Screenshot sender started. Interval: {args.interval}s. Chat: {config.chat_id}")
    while True:
        started_at = time.time()
        try:
            run_cycle(server, config, args)
        except Exception as error:
            log(f"Cycle failed: {error}")

        if args.once:
            break

        elapsed = time.time() - started_at
        sleep_for = max(1.0, args.interval - elapsed)
        log(f"Sleeping {sleep_for}s until next cycle")
        time.sleep(sleep_for)


if __name__ == "__main__":
    main()
