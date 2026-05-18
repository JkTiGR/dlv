#!/bin/bash
# Быстрая установка облачного сервера DLV
# Использование: bash setup_cloud.sh

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 Установка облачного сервера DLV                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Проверка Python
echo "📌 Проверка Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден. Установите Python 3.8+"
    exit 1
fi
echo "✅ Python $(python3 --version)"

# Проверка pip
echo "📌 Проверка pip..."
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 не найден. Установите pip."
    exit 1
fi
echo "✅ pip найден"

# Установка зависимостей
echo ""
echo "📌 Установка зависимостей Python..."
pip3 install -r requirements_cloud.txt
echo "✅ Зависимости установлены"

# Проверка .env файла
echo ""
echo "📌 Проверка конфигурации..."
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  Файл .env не найден!"
    echo ""
    echo "Создайте файл .env со следующим содержимым:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "SUPABASE_URL=https://YOUR_PROJECT.supabase.co"
    echo "SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Зайдите на https://supabase.com"
    echo "2. Создайте новый проект"
    echo "3. Скопируйте Project URL и service_role key"
    echo "4. Создайте файл .env с вашими данными"
    echo ""
    echo "Когда создадите .env, запустите этот скрипт снова."
    exit 1
fi
echo "✅ Конфигурация найдена (.env)"

# Проверка подключения к Supabase
echo ""
echo "📌 Проверка подключения к Supabase..."
if python3 -c "
from cloud_sync import get_cloud_sync
try:
    cloud = get_cloud_sync()
    health = cloud.get_health()
    print('✅ Подключение успешно!')
    print(health)
except Exception as e:
    print(f'❌ Ошибка подключения: {e}')
    exit(1)
"; then
    echo ""
else
    echo ""
    exit 1
fi

# Спросить о создании systemd сервиса
echo ""
echo "📌 Настройка автозапуска..."
read -p "Создать systemd сервис для автоматического запуска? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Создаём systemd сервис..."
    
    # Получаем текущий пользователь
    CURRENT_USER=$(whoami)
    CURRENT_DIR=$(pwd)
    
    # Создаём systemd файл
    sudo tee /etc/systemd/system/dlv-cloud.service > /dev/null <<EOF
[Unit]
Description=DLV Restaurant Cloud Server
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$CURRENT_DIR
ExecStart=/usr/bin/python3 $CURRENT_DIR/dlv_local_server_cloud.py --port 8000
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    echo "✅ Systemd сервис создан"
    
    read -p "Запустить сервис сейчас? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo systemctl enable dlv-cloud
        sudo systemctl start dlv-cloud
        echo "✅ Сервис запущен!"
        echo ""
        echo "📊 Статус:"
        sudo systemctl status dlv-cloud
    fi
else
    echo "Пропущено"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ УСТАНОВКА ЗАВЕРШЕНА!                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Запустите сервер:"
echo "   python3 dlv_local_server_cloud.py --port 8000"
echo ""
echo "📊 Откройте мониторинг:"
echo "   http://localhost:8000/MONITOR.html"
echo "   http://localhost:8000/MONITOR_CLOUD.html"
echo ""
echo "📚 Документация:"
echo "   cat SETUP_CLOUD_STEP_BY_STEP.md"
echo ""
