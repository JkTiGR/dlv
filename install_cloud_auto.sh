#!/bin/bash
# ============================================================================
# 🚀 ПОЛНОСТЬЮ АВТОМАТИЗИРОВАННАЯ УСТАНОВКА ОБЛАЧНОЙ СИСТЕМЫ
# ============================================================================
# Скрипт автоматически:
# ✅ Проверяет Python и зависимости
# ✅ Интерактивно запрашивает Supabase credentials
# ✅ Создаёт .env файл
# ✅ Устанавливает зависимости
# ✅ Тестирует подключение
# ✅ Создаёт systemd сервис
# ✅ Запускает сервер
# ✅ Открывает мониторинг
# ============================================================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции вывода
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${YELLOW}→${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ============================================================================
# ШАГ 1: ПРОВЕРКА ОКРУЖЕНИЯ
# ============================================================================

print_header "ШАГ 1: Проверка окружения"

print_step "Проверка Python..."
if ! command -v python3 &> /dev/null; then
    print_error "Python3 не найден!"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | awk '{print $2}')
print_success "Python $PYTHON_VERSION найден"

print_step "Проверка pip..."
if ! command -v pip3 &> /dev/null; then
    print_error "pip3 не найден!"
    exit 1
fi
print_success "pip3 найден"

print_step "Определение текущей папки..."
CURRENT_DIR=$(pwd)
print_success "Папка: $CURRENT_DIR"

print_step "Определение текущего пользователя..."
CURRENT_USER=$(whoami)
print_success "Пользователь: $CURRENT_USER"

# ============================================================================
# ШАГ 2: ИНТЕРАКТИВНЫЙ ВВОД SUPABASE CREDENTIALS
# ============================================================================

print_header "ШАГ 2: Supabase credentials"

print_info "Откройте https://app.supabase.com и найдите:"
print_info "1. Project URL (Settings → API → Project URL)"
print_info "2. API Key (Settings → API → Anon Key)"
echo ""

# Проверяем есть ли уже .env
if [ -f "$CURRENT_DIR/.env" ]; then
    print_info "Найден существующий .env файл"
    read -p "Использовать существующие credentials? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success ".env уже готов"
        source "$CURRENT_DIR/.env"
    else
        read -p "Введите SUPABASE_URL: " SUPABASE_URL
        read -p "Введите SUPABASE_KEY: " SUPABASE_KEY
    fi
else
    echo "Введите Supabase credentials:"
    read -p "SUPABASE_URL (например: https://xxxx.supabase.co): " SUPABASE_URL
    read -p "SUPABASE_KEY (длинная строка): " SUPABASE_KEY
fi

# Валидация
if [[ -z "$SUPABASE_URL" ]] || [[ -z "$SUPABASE_KEY" ]]; then
    print_error "Credentials не могут быть пусты!"
    exit 1
fi

# ============================================================================
# ШАГ 3: СОЗДАНИЕ .env ФАЙЛА
# ============================================================================

print_header "ШАГ 3: Создание .env файла"

print_step "Создание $CURRENT_DIR/.env..."
cat > "$CURRENT_DIR/.env" << EOF
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
EOF
chmod 600 "$CURRENT_DIR/.env"
print_success ".env файл создан и защищен (chmod 600)"

# ============================================================================
# ШАГ 4: УСТАНОВКА ЗАВИСИМОСТЕЙ
# ============================================================================

print_header "ШАГ 4: Установка Python зависимостей"

print_step "Запуск: pip3 install -r requirements_cloud.txt"
if pip3 install -r "$CURRENT_DIR/requirements_cloud.txt" > /dev/null 2>&1; then
    print_success "Зависимости установлены"
else
    print_error "Ошибка при установке зависимостей"
    exit 1
fi

# ============================================================================
# ШАГ 5: ТЕСТ ПОДКЛЮЧЕНИЯ
# ============================================================================

print_header "ШАГ 5: Проверка подключения к Supabase"

print_step "Тестирование подключения..."
TEST_OUTPUT=$(python3 -c "
from cloud_sync import get_cloud_sync
try:
    cloud = get_cloud_sync()
    stats = cloud.get_dashboard_stats()
    print('OK')
except Exception as e:
    print(f'ERROR: {e}')
" 2>&1)

if [[ "$TEST_OUTPUT" == "OK" ]]; then
    print_success "✨ Подключение к Supabase успешно!"
else
    print_error "Ошибка подключения!"
    print_error "$TEST_OUTPUT"
    echo ""
    print_info "Проверьте:"
    print_info "1. Правильность SUPABASE_URL"
    print_info "2. Правильность SUPABASE_KEY"
    print_info "3. Интернет подключение"
    exit 1
fi

# ============================================================================
# ШАГ 6: СОЗДАНИЕ/ЗАПУСК SYSTEMD СЕРВИСА
# ============================================================================

print_header "ШАГ 6: Настройка автозапуска"

read -p "Создать systemd сервис для автозапуска? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Создание systemd сервиса /etc/systemd/system/dragon-cloud.service..."
    
    sudo tee /etc/systemd/system/dragon-cloud.service > /dev/null << EOF
[Unit]
Description=DRAGON Restaurant Cloud Server
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$CURRENT_DIR
ExecStart=/usr/bin/python3 $CURRENT_DIR/dragon_local_server_cloud.py --port 8000
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    print_success "Systemd сервис создан"
    
    print_step "Включение сервиса..."
    sudo systemctl enable dragon-cloud
    print_success "Сервис включен (будет запускаться при загрузке)"
    
    print_step "Запуск сервиса..."
    sudo systemctl start dragon-cloud
    sleep 2
    
    if sudo systemctl is-active dragon-cloud > /dev/null; then
        print_success "Сервис запущен успешно!"
        echo ""
        echo -e "${BLUE}Полезные команды:${NC}"
        echo "  sudo systemctl status dragon-cloud        # Статус"
        echo "  sudo systemctl stop dragon-cloud          # Остановить"
        echo "  sudo systemctl start dragon-cloud         # Запустить"
        echo "  sudo journalctl -u dragon-cloud -f       # Логи (реал-тайм)"
    else
        print_error "Ошибка при запуске сервиса"
        echo ""
        echo "Логи:"
        sudo journalctl -u dragon-cloud -n 20
    fi
else
    print_info "Пропущено - запустите вручную:"
    echo "  python3 $CURRENT_DIR/dragon_local_server_cloud.py --port 8000"
fi

# ============================================================================
# ШАГ 7: ОТКРЫТИЕ МОНИТОРИНГА
# ============================================================================

print_header "ШАГ 7: Открытие мониторинга"

sleep 2

print_step "Проверка доступности сервера..."
if curl -s http://localhost:8000/api/stats > /dev/null 2>&1; then
    print_success "Сервер доступен на http://localhost:8000"
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                 ✅ УСПЕШНО УСТАНОВЛЕНО!                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📊 Откройте мониторинг в браузере:${NC}"
    echo "  http://localhost:8000/MONITOR_CLOUD.html"
    echo ""
    echo -e "${BLUE}📡 API endpoints:${NC}"
    echo "  GET  http://localhost:8000/api/orders"
    echo "  GET  http://localhost:8000/api/stats"
    echo "  GET  http://localhost:8000/api/menu-availability"
    echo ""
    echo -e "${BLUE}🌐 Работа из дома (опционально):${NC}"
    echo "  Для постоянного адреса: bash start_dragon_named_tunnel.sh 8000"
    echo "  Подробности: cat STABLE_REMOTE_ADDRESS.md"
    echo ""
    echo -e "${BLUE}📚 Дополнительная информация:${NC}"
    echo "  cat QUICK_START.md"
    echo "  cat README_CLOUD.md"
    echo "  cat TROUBLESHOOTING.md"
    echo ""
    echo -e "${YELLOW}🎉 Система готова к работе!${NC}"
else
    print_error "Не удалось подключиться к серверу"
    echo ""
    print_info "Проверьте логи:"
    echo "  sudo journalctl -u dragon-cloud -n 50"
fi

# ============================================================================
# ФИНАЛ
# ============================================================================

print_header "Установка завершена!"

print_info "Следующие шаги:"
echo "  1. Откройте браузер: http://localhost:8000/MONITOR_CLOUD.html"
echo "  2. Проверьте что видите статистику заказов"
echo "  3. Тестируйте создание заказов"
echo "  4. Для работы из дома лучше использовать: bash start_dragon_named_tunnel.sh 8000"
echo ""
print_success "Готово! Ваша облачная система работает! ☁️"
