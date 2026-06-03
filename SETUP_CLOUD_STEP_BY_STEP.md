# 🚀 Полное руководство по переходу на облако

## Этап 1: Подготовка (5-10 минут)

### 1.1 Создайте аккаунт Supabase
1. Зайдите на https://supabase.com
2. Нажмите "Start your project"
3. Зарегистрируйтесь через GitHub или Google
4. Создайте новый проект:
   - **Project name**: `dragon_restaurant`
   - **Password**: придумайте сложный пароль (сохраните!)
   - **Region**: выберите ближайший к вам

### 1.2 Сохраните учётные данные
После создания проекта вы получите:
- **Project URL** - выглядит как `https://xxxxxxxxxxxx.supabase.co`
- **API Key (anon/public)** - длинная строка символов

⚠️ **ВАЖНО**: Сохраните эти данные в безопасном месте!

---

## Этап 2: Создание базы данных (2-3 минуты)

### 2.1 Выполните SQL миграцию
1. В Supabase дашборде перейдите в **SQL Editor**
2. Нажмите **"New Query"**
3. Скопируйте содержимое файла `supabase_schema.sql`
4. Вставьте в редактор
5. Нажмите **"Run"** (⏯️)

✅ Таблицы создались успешно!

---

## Этап 3: Установка (2-3 минуты)

### 3.1 Установите Python зависимости

```bash
cd /home/jkbook/DRAGON
pip install -r requirements_cloud.txt
```

### 3.2 Создайте файл конфигурации

Создайте файл `.env` в папке `/home/jkbook/DRAGON/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-api-key-here
```

Замените:
- `your-project` на ваш ID проекта
- `your-api-key-here` на API key

### 3.3 Проверьте подключение

```bash
python3 cloud_sync.py
```

Вы должны увидеть:
```
✅ Подключение к Supabase успешно!
📊 Статистика: {...}
```

---

## Этап 4: Миграция данных (5-10 минут)

### 4.1 Синхронизируйте существующие заказы

Если у вас есть данные в `dragon_local_orders.json`:

```bash
python3 -c "
from cloud_sync import get_cloud_sync
cloud = get_cloud_sync()
result = cloud.sync_from_local_json('dragon_local_orders.json')
print(result)
"
```

Результат:
```
✅ Синхронизация завершена: {
  'status': 'success',
  'synced': 42,
  'errors': 0
}
```

---

## Этап 5: Запуск нового сервера (3 минуты)

### 5.1 Остановите старый сервер (если он работает)

```bash
# Найдите процесс
ps aux | grep dragon_local_server

# Остановите (замените PID на реальный номер)
kill -9 <PID>
```

### 5.2 Запустите новый сервер с облачной синхронизацией

```bash
python3 dragon_local_server_cloud.py --port 8000
```

Вы должны увидеть:
```
╔════════════════════════════════════════════════════════════╗
║  Локальный сервер заказов с облачной синхронизацией       ║
║  🚀 Запуск на http://localhost:8000                         ║
║  ☁️  Облако: Supabase                                      ║
╚════════════════════════════════════════════════════════════╝

🔄 Начальная синхронизация с облаком...
✅ Сервер запущен успешно
```

---

## Этап 6: Просмотр с дома (работает сразу!)

### 6.1 Настройка VPN/Туннеля

Если вы дома, вам нужен доступ к компьютеру в ресторане.

**Вариант A: Ngrok (самый простой)**

```bash
# Установите ngrok
curl https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip -o ngrok.zip
unzip ngrok.zip

# Создайте туннель
./ngrok http 8000
```

Вы получите URL типа: `https://abc123.ngrok.io`

**Вариант B: SSH туннель**

```bash
# На вашем домашнем компьютере
ssh -L 8000:localhost:8000 user@restaurant_ip
```

### 6.2 Откройте мониторинг

Зайдите на:
- Локально в ресторане: `http://localhost:8000/MONITOR_CLOUD.html`
- Дома: `https://abc123.ngrok.io/MONITOR_CLOUD.html`

✨ Видите все заказы в реальном времени!

---

## Этап 7: Автоматический запуск при перезагрузке

### 7.1 Создайте systemd сервис

Файл `/etc/systemd/system/dragon-cloud.service`:

```ini
[Unit]
Description=DRAGON Restaurant Cloud Server
After=network.target

[Service]
Type=simple
User=jkbook
WorkingDirectory=/home/jkbook/DRAGON
ExecStart=/usr/bin/python3 /home/jkbook/DRAGON/dragon_local_server_cloud.py --port 8000
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 7.2 Активируйте сервис

```bash
sudo systemctl daemon-reload
sudo systemctl enable dragon-cloud
sudo systemctl start dragon-cloud

# Проверьте статус
sudo systemctl status dragon-cloud
```

---

## 📊 Архитектура системы

```
┌──────────────────────────────────┐
│   Ваш ресторан (локально)        │
│ ┌──────────────────────────────┐ │
│ │ dragon_local_server_cloud.py    │ │
│ │ (слушает на порту 8000)      │ │
│ └──────┬───────────────────────┘ │
│        │ Синхронизация            │
└────────┼────────────────────────────┘
         │
         ↓ (интернет)
┌──────────────────────────────────┐
│   SUPABASE (облако)              │
│ ┌──────────────────────────────┐ │
│ │ PostgreSQL Database          │ │
│ │ • orders                     │ │
│ │ • menu_availability          │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
         ↑ (интернет)
         │
    ┌────┴─────────────────────────┐
    │                              │
    ▼                              ▼
┌─────────────────┐         ┌─────────────────┐
│ В ресторане     │         │ ДОМА            │
│ на телефоне     │         │ на компьютере   │
│                 │         │                 │
│ MONITOR_CLOUD   │         │ MONITOR_CLOUD   │
│ .html           │         │ .html           │
│                 │         │                 │
│ Реал-тайм ✨    │         │ Реал-тайм ✨    │
└─────────────────┘         └─────────────────┘
```

---

## 📱 API Endpoints

```bash
# Получить все заказы
curl http://localhost:8000/api/orders

# Создать заказ
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "table_number": 5,
    "customer_name": "Иван",
    "items": [{"code": "PBx", "qty": 2}],
    "total_amount": 400
  }'

# Получить статистику (из облака!)
curl http://localhost:8000/api/stats

# Обновить доступность меню
curl -X POST http://localhost:8000/api/menu-availability \
  -H "Content-Type: application/json" \
  -d '{
    "menu_key": "pho_bo_xao",
    "available": false,
    "reason": "закончилась"
  }'
```

---

## 🔧 Решение проблем

### Ошибка: "SUPABASE_URL не найден"
✅ Убедитесь, что `.env` файл создан в `/home/jkbook/DRAGON/`

### Ошибка: "Network error при загрузке статистики"
✅ Проверьте интернет подключение
✅ Убедитесь, что Supabase проект активен

### Данные не синхронизируются
✅ Проверьте логи: `sudo journalctl -u dragon-cloud -f`
✅ Убедитесь, что API key правильный

### Хочу откатиться на локальное хранилище
```bash
# Остановите облачный сервер
sudo systemctl stop dragon-cloud

# Запустите старый локальный
python3 dragon_local_server.py --port 8000
```

---

## 📚 Дополнительно

### Резервные копии в Supabase
Supabase автоматически делает резервные копии. Проверяйте их в Settings → Backups

### Масштабирование
Если заказов станет много, перейдите с Supabase на:
- **AWS RDS** (более дешёво для больших объёмов)
- **DigitalOcean** (простой и дешёвый)

### Безопасность
- Не делитесь API key с кем попало
- Используйте разные уровни доступа для разных пользователей
- Включите двухфакторную аутентификацию в Supabase

---

## ✅ Чек-лист готовности

- [ ] Аккаунт Supabase создан
- [ ] Проект создан и URL сохранён
- [ ] API key сохранён в `.env`
- [ ] SQL миграция выполнена
- [ ] Зависимости установлены (`pip install -r requirements_cloud.txt`)
- [ ] Подключение протестировано (`python3 cloud_sync.py`)
- [ ] Данные синхронизированы
- [ ] Новый сервер запущен (`dragon_local_server_cloud.py`)
- [ ] Мониторинг открывается (`/MONITOR_CLOUD.html`)
- [ ] Видны данные в реальном времени ✨

---

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи: `cat /var/log/syslog | grep dlv`
2. Перезагрузите сервер: `sudo systemctl restart dragon-cloud`
3. Проверьте интернет на обоих устройствах

**Готово! Теперь вы можете работать из дома и видеть всё, что происходит в ресторане! 🎉**
