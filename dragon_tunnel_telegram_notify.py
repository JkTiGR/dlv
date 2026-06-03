#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import re
import signal
import subprocess
import sys
from datetime import datetime
from urllib.parse import urlsplit

from dragon_public_url_telegram import load_telegram_config, send_telegram_message

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
TUNNEL_URL_RE = re.compile(r"https://[a-z0-9-]+\.trycloudflare\.com", re.IGNORECASE)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run cloudflared quick tunnel and send the detected public URL to Telegram."
    )
    parser.add_argument("--local-base", required=True, help="Local DRAGON base URL, e.g. http://127.0.0.1:8000")
    parser.add_argument("--edge-ip-version", default=os.environ.get("CLOUDFLARED_EDGE_IP_VERSION", "4"), help="cloudflared edge ip version: 4, 6 or auto")
    parser.add_argument("--bot-token", default="", help="Telegram bot token override.")
    parser.add_argument("--chat-id", action="append", default=[], help="Telegram chat id override. Can be used multiple times.")
    parser.add_argument("--dry-run", action="store_true", help="Print the Telegram message instead of sending it.")
    parser.add_argument("--simulate-url", default="", help="Test mode: notify with this URL and exit without starting cloudflared.")
    return parser.parse_args()



def build_message(public_url: str, local_base: str) -> str:
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return "\n".join(
        [
            "DRAGON new quick tunnel",
            stamp,
            "",
            f"Bridge: {public_url}",
            f"Monitor: {public_url}/MONITOR.html",
            f"View: {public_url}/VIEW.html",
            f"Profil: {public_url}/profil.html",
            f"Control: {public_url}/contron.html",
            f"Kassa: {public_url}/DRAGON_KASSA.html",
            "",
            f"Local source: {local_base}",
            "If pages remember the old bridge, open them once with ?bridge=0",
        ]
    )


def extract_public_tunnel_url(line: str) -> str:
    match = TUNNEL_URL_RE.search(str(line or ""))
    if not match:
        return ""
    candidate = match.group(0).rstrip("/")
    try:
        parsed = urlsplit(candidate)
    except ValueError:
        return ""
    hostname = str(parsed.hostname or "").strip().lower()
    if not hostname or hostname == "api.trycloudflare.com":
        return ""
    if not hostname.endswith(".trycloudflare.com"):
        return ""
    return f"{parsed.scheme}://{hostname}"

def run_cloudflared(local_base: str, edge_ip_version: str, config, dry_run: bool) -> int:
    command = [
        "cloudflared",
        "tunnel",
        "--edge-ip-version",
        str(edge_ip_version or "4"),
        "--url",
        local_base,
    ]
    process = subprocess.Popen(
        command,
        cwd=str(ROOT_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )
    notified_urls: set[str] = set()

    try:
        assert process.stdout is not None
        for line in process.stdout:
            print(line, end="", flush=True)
            public_url = extract_public_tunnel_url(line)
            if not public_url:
                continue
            if public_url in notified_urls:
                continue
            notified_urls.add(public_url)
            if not config:
                print("Telegram notify skipped: bot token or chat id not configured.", flush=True)
                continue
            send_telegram_message(config, build_message(public_url, local_base), dry_run=dry_run, replace_key="public_external_address")
        return process.wait()
    except KeyboardInterrupt:
        if process.poll() is None:
            process.send_signal(signal.SIGINT)
            try:
                return process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                return process.wait()
        return process.returncode or 130


def main() -> int:
    args = parse_args()
    config = load_telegram_config(args.bot_token, args.chat_id)

    if args.simulate_url:
      public_url = str(args.simulate_url).strip().rstrip("/")
      if not public_url:
          print("simulate-url is empty", file=sys.stderr)
          return 1
      if not config:
          print("Telegram notify skipped: bot token or chat id not configured.", flush=True)
          return 0
      send_telegram_message(config, build_message(public_url, args.local_base), dry_run=args.dry_run, replace_key="public_external_address")
      return 0

    return run_cloudflared(args.local_base, args.edge_ip_version, config, args.dry_run)


if __name__ == "__main__":
    raise SystemExit(main())
