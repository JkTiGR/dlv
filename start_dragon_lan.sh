#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8000}"
BIND="${DRAGON_BIND:-0.0.0.0}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python3 не найден. Установи python3 и попробуй снова."
  exit 1
fi

is_port_busy() {
  local port="$1"
  python3 - "$port" <<'PY'
import socket
import sys

port = int(sys.argv[1])
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    sock.bind(("0.0.0.0", port))
except OSError:
    sys.exit(0)
else:
    sys.exit(1)
finally:
    sock.close()
PY
}

find_next_free_port() {
  local start_port="$1"
  local limit="${2:-20}"
  local port
  for ((port=start_port + 1; port<=start_port + limit; port++)); do
    if ! is_port_busy "$port"; then
      echo "$port"
      return 0
    fi
  done
  return 1
}

port_process_info() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | tail -n +2 | head -n 1
}

looks_like_dragon_server() {
  local port="$1"
  local response=""
  response="$(curl -fsS -m 2 "http://127.0.0.1:$port/api/local-orders" 2>/dev/null || true)"
  [[ "$response" == *'"orders"'* || "$response" == *'"order"'* || "$response" == *'"updated_at"'* ]]
  return 1
}

if is_port_busy "$PORT"; then
  EXISTING_INFO="$(port_process_info "$PORT")"
  if looks_like_dragon_server "$PORT"; then
    echo
    echo "Порт $PORT уже занят, но DRAGON-сервер уже запущен."
    if [[ -n "${EXISTING_INFO:-}" ]]; then
      echo "Процесс: $EXISTING_INFO"
    fi
    echo "Новый экземпляр не нужен. Используй ссылки ниже."
  else
    NEXT_PORT="$(find_next_free_port "$PORT" 20 || true)"
    if [[ -z "${NEXT_PORT:-}" ]]; then
      echo
      echo "Порт $PORT занят, и рядом не найден свободный порт."
      if [[ -n "${EXISTING_INFO:-}" ]]; then
        echo "Процесс: $EXISTING_INFO"
      fi
      echo "Останови чужой процесс или запусти вручную на другом порту."
      exit 1
    fi
    echo
    echo "Порт $PORT занят."
    if [[ -n "${EXISTING_INFO:-}" ]]; then
      echo "Процесс: $EXISTING_INFO"
    fi
    echo "Переключаюсь на свободный порт $NEXT_PORT."
    PORT="$NEXT_PORT"
  fi
fi

mapfile -t LAN_IPS < <(python3 - <<'PY'
import socket
import subprocess

ips = []
seen = set()

def add(ip: str) -> None:
    value = str(ip or "").strip()
    if not value or value.startswith("127.") or ":" in value or value in seen:
        return
    seen.add(value)
    ips.append(value)

try:
    output = subprocess.check_output(["hostname", "-I"], text=True, stderr=subprocess.DEVNULL)
    for part in output.split():
        add(part)
except Exception:
    pass

try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.connect(("8.8.8.8", 80))
    add(sock.getsockname()[0])
    sock.close()
except Exception:
    pass

for ip in ips:
    print(ip)
PY
)

echo
echo "DRAGON LAN sync server"
echo "Папка: $ROOT_DIR"
echo "Порт:  $PORT"
echo
echo "На этом ноутбуке открой:"
echo "  Касса:   http://127.0.0.1:$PORT/DRAGON_KASSA.html"
echo "  Клиент:  http://127.0.0.1:$PORT/index.html"
echo "  Monitor: http://127.0.0.1:$PORT/MONITOR.html"
echo "  View:    http://127.0.0.1:$PORT/VIEW.html"
echo "  Profil:  http://127.0.0.1:$PORT/profil.html"
echo "  Control: http://127.0.0.1:$PORT/contron.html"

if ((${#LAN_IPS[@]} > 0)); then
  echo
  echo "На телефоне / планшете / другом ноутбуке в той же Wi-Fi сети открой:"
  for ip in "${LAN_IPS[@]}"; do
    echo "  Сеть через $ip"
    echo "    Касса:   http://$ip:$PORT/DRAGON_KASSA.html"
    echo "    Клиент:  http://$ip:$PORT/index.html"
    echo "    Monitor: http://$ip:$PORT/MONITOR.html"
    echo "    View:    http://$ip:$PORT/VIEW.html"
    echo "    Profil:  http://$ip:$PORT/profil.html"
    echo "    Control: http://$ip:$PORT/contron.html"
  done
else
  echo
  echo "LAN IP не найден автоматически. Проверь Wi-Fi или посмотри IP ноутбука командой:"
  echo "  hostname -I"
fi

echo
echo "Общая локальная база заказов будет храниться в:"
echo "  $ROOT_DIR/dragon_local_orders.json"
echo
echo "Остановить сервер: Ctrl+C"
echo

if is_port_busy "$PORT" && looks_like_dragon_server "$PORT"; then
  exit 0
fi

exec python3 "$ROOT_DIR/dragon_local_server.py" --bind "$BIND" --port "$PORT"
