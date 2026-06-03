#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import shlex
import signal
import subprocess
import sys
from urllib.parse import urlsplit

from dragon_public_url_telegram import build_public_url_message, load_telegram_config, send_telegram_message


DEFAULT_DOMAINS = (".lhr.life", ".lhr.rocks")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run a localhost.run tunnel for DRAGON and optionally send the public URL to Telegram."
    )
    parser.add_argument("--local-base", required=True, help="Local DRAGON base URL, e.g. http://127.0.0.1:8000")
    parser.add_argument("--ssh-login", default="nokey@localhost.run", help="SSH login for localhost.run")
    parser.add_argument("--remote-spec", default="", help="Full -R specification override.")
    parser.add_argument("--domain", default="", help="Requested stable domain on localhost.run if your account supports it.")
    parser.add_argument("--server-alive-interval", type=int, default=30, help="SSH keepalive interval in seconds.")
    parser.add_argument("--dry-run", action="store_true", help="Print the Telegram message instead of sending it.")
    parser.add_argument("--simulate-url", default="", help="Test mode: notify with this URL and exit.")
    parser.add_argument("--bot-token", default="", help="Telegram bot token override.")
    parser.add_argument("--chat-id", action="append", default=[], help="Telegram chat id override. Can be used multiple times.")
    return parser.parse_args()


def build_remote_spec(local_base: str, requested_domain: str = "") -> str:
    parsed = urlsplit(local_base)
    host = parsed.hostname or "127.0.0.1"
    port = parsed.port or 8000
    prefix = f"{requested_domain}:" if requested_domain else ""
    return f"{prefix}80:{host}:{port}"


def extract_public_url(line: str, requested_domain: str = "") -> str:
    line_text = str(line or "")
    candidates = re.findall(r"https://[A-Za-z0-9.-]+", str(line or ""))
    for candidate in candidates:
        try:
            parsed = urlsplit(candidate)
        except ValueError:
            continue
        hostname = str(parsed.hostname or "").strip().lower()
        if not hostname:
            continue
        if requested_domain and hostname == requested_domain.strip().lower():
            return f"https://{hostname}"
        if hostname.endswith(DEFAULT_DOMAINS) and "tunneled" in line_text.lower():
            return f"https://{hostname}"
    return ""


def notify(public_url: str, local_base: str, args: argparse.Namespace) -> None:
    config = load_telegram_config(args.bot_token, args.chat_id)
    if not config:
        print("Telegram notify skipped: bot token or chat id not configured.", flush=True)
        return

    note = (
        "Current external address via localhost.run. "
        "If you configure a paid custom domain or stable lhr.rocks domain, this URL can stay the same across restarts."
    )
    text = build_public_url_message("DRAGON external address", public_url, local_base, note)
    send_telegram_message(config, text, dry_run=args.dry_run, replace_key="public_external_address")


def run_tunnel(args: argparse.Namespace) -> int:
    remote_spec = args.remote_spec.strip() or build_remote_spec(args.local_base, args.domain)
    command = [
        "ssh",
        "-o",
        "StrictHostKeyChecking=no",
        "-o",
        f"ServerAliveInterval={max(5, int(args.server_alive_interval))}",
        "-o",
        "ExitOnForwardFailure=yes",
        "-R",
        remote_spec,
        args.ssh_login,
    ]
    print("Running:", " ".join(shlex.quote(part) for part in command), flush=True)

    process = subprocess.Popen(
        command,
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
            public_url = extract_public_url(line, args.domain)
            if not public_url or public_url in notified_urls:
                continue
            notified_urls.add(public_url)
            notify(public_url, args.local_base, args)
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
    if args.simulate_url:
        notify(args.simulate_url.rstrip("/"), args.local_base, args)
        return 0
    return run_tunnel(args)


if __name__ == "__main__":
    raise SystemExit(main())
