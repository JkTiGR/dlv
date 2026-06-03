#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8000}"
LOCAL_BASE="http://127.0.0.1:${PORT}"
CONFIG_DIR="${HOME}/.cloudflared"
DOTENV_FILE="${ROOT_DIR}/.env"
EDGE_IP_VERSION="${CLOUDFLARED_EDGE_IP_VERSION:-4}"

if [[ -f "${DOTENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${DOTENV_FILE}"
  set +a
fi

print_install_help() {
  cat <<'EOF'
cloudflared не найден.

Установка для Ubuntu / Debian:

sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install cloudflared

После установки запусти снова:
  bash start_dragon_remote_tunnel.sh
EOF
}

if ! command -v curl >/dev/null 2>&1; then
  echo "curl не найден. Установи curl и попробуй снова."
  exit 1
fi

if ! curl -fsS -m 3 "${LOCAL_BASE}/api/health" >/dev/null 2>&1; then
  echo "Локальный DRAGON сервер на порту ${PORT} не отвечает."
  echo "Сначала запусти:"
  echo "  bash start_dragon_lan.sh ${PORT}"
  exit 1
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  print_install_help
  exit 1
fi

if [[ -f "${CONFIG_DIR}/config.yml" || -f "${CONFIG_DIR}/config.yaml" ]]; then
  echo "Найден config в ${CONFIG_DIR}."
  echo "Quick Tunnel может не запуститься, если там уже есть Cloudflare config."
  echo "Если увидишь ошибку, временно переименуй config и запусти снова."
  echo
fi

cat <<EOF
DRAGON Remote Tunnel

Локальный сервер:
  ${LOCAL_BASE}

После запуска cloudflared напечатает публичный URL вида:
  https://random-name.trycloudflare.com

Из дома лучше открывать:
  https://random-name.trycloudflare.com/MONITOR.html
  https://random-name.trycloudflare.com/VIEW.html
  https://random-name.trycloudflare.com/profil.html

Кассу лучше не открывать публично без необходимости:
  https://random-name.trycloudflare.com/DRAGON_KASSA.html

Если задан Telegram bot token и chat id, новый URL улетит в Telegram автоматически.

Остановить туннель:
  Ctrl+C
EOF

if ! command -v python3 >/dev/null 2>&1; then
  exec cloudflared tunnel --edge-ip-version "${EDGE_IP_VERSION}" --url "${LOCAL_BASE}"
fi

exec python3 "${ROOT_DIR}/dragon_tunnel_telegram_notify.py" \
  --local-base "${LOCAL_BASE}" \
  --edge-ip-version "${EDGE_IP_VERSION}"
