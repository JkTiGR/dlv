#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8000}"
LOCAL_BASE="http://127.0.0.1:${PORT}"
DOTENV_FILE="${ROOT_DIR}/.env"

if [[ -f "${DOTENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${DOTENV_FILE}"
  set +a
fi

DRAGON_LOCALHOSTRUN_LOGIN="${DRAGON_LOCALHOSTRUN_LOGIN:-nokey@localhost.run}"
DRAGON_LOCALHOSTRUN_DOMAIN="${DRAGON_LOCALHOSTRUN_DOMAIN:-}"
DRAGON_LOCALHOSTRUN_SERVER_ALIVE="${DRAGON_LOCALHOSTRUN_SERVER_ALIVE:-30}"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl не найден. Установи curl и попробуй снова."
  exit 1
fi

if ! curl -fsS -m 3 "${LOCAL_BASE}/api/health" >/dev/null 2>&1; then
  echo "Локальный DRAGON сервер на порту ${PORT} не отвечает."
  echo "Сначала запусти:"
  echo "  bash start_dragon_lan.sh ${PORT}"
  echo "или"
  echo "  python3 dragon_local_server_cloud.py --bind 0.0.0.0 --port ${PORT}"
  exit 1
fi

if ! command -v ssh >/dev/null 2>&1; then
  echo "ssh не найден. Установи OpenSSH client и попробуй снова."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 не найден. Для Telegram notify и нормального парсинга нужен python3."
  exit 1
fi

cat <<EOF
DRAGON localhost.run tunnel

Локальный сервер:
  ${LOCAL_BASE}

Логин:
  ${DRAGON_LOCALHOSTRUN_LOGIN}
EOF

if [[ -n "${DRAGON_LOCALHOSTRUN_DOMAIN}" ]]; then
  cat <<EOF

Запрошенный public hostname:
  ${DRAGON_LOCALHOSTRUN_DOMAIN}

Этот вариант требует аккаунт/SSH key и custom domain или стабильный домен у localhost.run.
EOF
else
  cat <<'EOF'

Запускается free external URL.
Он станет доступен снаружи, но адрес может измениться после нового запуска.
EOF
fi

cat <<'EOF'

Если настроен Telegram, новый адрес будет отправлен автоматически.

Остановить tunnel:
  Ctrl+C
EOF

exec python3 "${ROOT_DIR}/dragon_localhostrun_tunnel.py" \
  --local-base "${LOCAL_BASE}" \
  --ssh-login "${DRAGON_LOCALHOSTRUN_LOGIN}" \
  --domain "${DRAGON_LOCALHOSTRUN_DOMAIN}" \
  --server-alive-interval "${DRAGON_LOCALHOSTRUN_SERVER_ALIVE}"
