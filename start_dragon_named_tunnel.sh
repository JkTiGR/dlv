#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8000}"
LOCAL_BASE="http://127.0.0.1:${PORT}"
DOTENV_FILE="${ROOT_DIR}/.env"
CF_HOME="${HOME}/.cloudflared"
APP_CF_DIR="${ROOT_DIR}/.cloudflared"
EDGE_IP_VERSION="${CLOUDFLARED_EDGE_IP_VERSION:-4}"

if [[ -f "${DOTENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${DOTENV_FILE}"
  set +a
fi

TUNNEL_NAME="${DRAGON_TUNNEL_NAME:-${CLOUDFLARED_TUNNEL_NAME:-dragon-restaurant}}"
PUBLIC_HOSTNAME="${DRAGON_PUBLIC_HOSTNAME:-${CLOUDFLARED_TUNNEL_HOSTNAME:-}}"
PUBLIC_BRIDGE_URL="${DRAGON_PUBLIC_BRIDGE_URL:-}"
ORIGIN_CERT="${TUNNEL_ORIGIN_CERT:-${CF_HOME}/cert.pem}"

normalize_hostname() {
  local raw="${1:-}"
  python3 - "$raw" <<'PY'
import sys
from urllib.parse import urlsplit

raw = (sys.argv[1] or "").strip()
if not raw:
    print("")
    raise SystemExit(0)
if "://" not in raw:
    print(raw.split("/", 1)[0].strip())
    raise SystemExit(0)
parsed = urlsplit(raw)
print((parsed.hostname or "").strip())
PY
}

if [[ -z "${PUBLIC_HOSTNAME}" && -n "${PUBLIC_BRIDGE_URL}" ]]; then
  PUBLIC_HOSTNAME="$(normalize_hostname "${PUBLIC_BRIDGE_URL}")"
fi

if [[ -z "${PUBLIC_HOSTNAME}" ]]; then
  echo "Не задан стабильный public hostname."
  echo
  echo "Добавь в ${DOTENV_FILE} одну из строк:"
  echo "  DRAGON_PUBLIC_HOSTNAME=dlv.example.com"
  echo "или"
  echo "  DRAGON_PUBLIC_BRIDGE_URL=https://dlv.example.com"
  echo
  echo "Также можно задать имя туннеля:"
  echo "  DRAGON_TUNNEL_NAME=dragon-restaurant"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl не найден. Установи curl и попробуй снова."
  exit 1
fi

if ! curl -fsS -m 3 "${LOCAL_BASE}/api/health" >/dev/null 2>&1; then
  echo "Локальный DRAGON сервер на порту ${PORT} не отвечает."
  echo "Сначала запусти bridge, например:"
  echo "  bash start_dragon_lan.sh ${PORT}"
  echo "или"
  echo "  python3 dragon_local_server_cloud.py --bind 0.0.0.0 --port ${PORT}"
  exit 1
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared не найден."
  echo "Для установки смотри start_dragon_remote_tunnel.sh или STABLE_REMOTE_ADDRESS.md."
  exit 1
fi

if [[ ! -f "${ORIGIN_CERT}" ]]; then
  echo "Не найден Cloudflare origin cert: ${ORIGIN_CERT}"
  echo
  echo "Это named tunnel, поэтому нужен одноразовый login в Cloudflare:"
  echo "  cloudflared tunnel login"
  echo
  echo "После login запусти этот скрипт снова."
  exit 1
fi

mkdir -p "${APP_CF_DIR}"

find_tunnel_id() {
  cloudflared tunnel list -o json -n "${TUNNEL_NAME}" 2>/dev/null | python3 - <<'PY'
import json
import sys

try:
    rows = json.load(sys.stdin)
except json.JSONDecodeError:
    rows = []

if isinstance(rows, list) and rows:
    row = rows[0] or {}
    print(str(row.get("id") or "").strip())
PY
}

TUNNEL_ID="$(find_tunnel_id || true)"

if [[ -z "${TUNNEL_ID}" ]]; then
  echo "Создаю named tunnel: ${TUNNEL_NAME}"
  cloudflared tunnel create "${TUNNEL_NAME}"
  TUNNEL_ID="$(find_tunnel_id || true)"
fi

if [[ -z "${TUNNEL_ID}" ]]; then
  echo "Не удалось определить tunnel id для ${TUNNEL_NAME}."
  exit 1
fi

CREDENTIALS_FILE="${CF_HOME}/${TUNNEL_ID}.json"
CONFIG_FILE="${APP_CF_DIR}/${TUNNEL_NAME}.yml"

if [[ ! -f "${CREDENTIALS_FILE}" ]]; then
  echo "Не найден файл credentials: ${CREDENTIALS_FILE}"
  echo "Попробуй пересоздать tunnel:"
  echo "  cloudflared tunnel create ${TUNNEL_NAME}"
  exit 1
fi

cat > "${CONFIG_FILE}" <<EOF
tunnel: ${TUNNEL_ID}
credentials-file: ${CREDENTIALS_FILE}

ingress:
  - hostname: ${PUBLIC_HOSTNAME}
    service: ${LOCAL_BASE}
  - service: http_status:404
EOF

chmod 600 "${CONFIG_FILE}"

echo "Привязываю ${PUBLIC_HOSTNAME} к tunnel ${TUNNEL_NAME}..."
cloudflared tunnel route dns --overwrite-dns "${TUNNEL_ID}" "${PUBLIC_HOSTNAME}"

cat <<EOF

DRAGON Stable Tunnel

Локальный сервер:
  ${LOCAL_BASE}

Постоянный public bridge:
  https://${PUBLIC_HOSTNAME}

Открывай из дома:
  https://${PUBLIC_HOSTNAME}/MONITOR.html
  https://${PUBLIC_HOSTNAME}/VIEW.html
  https://${PUBLIC_HOSTNAME}/profil.html
  https://${PUBLIC_HOSTNAME}/contron.html

Кассу публично открывай только если это действительно нужно:
  https://${PUBLIC_HOSTNAME}/DRAGON_KASSA.html

Если касса или monitor запомнили старый bridge URL:
  открой страницу один раз с ?bridge=0
  и затем зайди уже по новому адресу выше

Остановить tunnel:
  Ctrl+C
EOF

exec cloudflared tunnel \
  --config "${CONFIG_FILE}" \
  --edge-ip-version "${EDGE_IP_VERSION}" \
  run "${TUNNEL_ID}"
