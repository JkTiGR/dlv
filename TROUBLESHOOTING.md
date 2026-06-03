# 🔧 Решение проблем и FAQ

## ❌ Частые ошибки и решения

### Ошибка: "ModuleNotFoundError: No module named 'supabase'"

**Проблема:** Зависимости не установлены

**Решение:**
```bash
pip3 install -r requirements_cloud.txt
```

Или установите вручную:
```bash
pip3 install supabase python-dotenv
```

---

### Ошибка: "SUPABASE_URL и SUPABASE_KEY не установлены"

**Проблема:** .env файл не создан или пуст

**Решение:**

1. Проверьте что .env существует:
```bash
ls -la .env
```

2. Если нет, создайте:
```bash
nano .env
```

3. Добавьте:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-api-key-here
```

4. Убедитесь что файл сохранён:
```bash
cat .env
```

---

### Ошибка: "Connection refused" / "Не удаётся подключиться"

**Проблема:** Supabase проект недоступен

**Решение:**

1. Проверьте интернет:
```bash
ping 8.8.8.8
```

2. Убедитесь что API key правильный:
```bash
python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('SUPABASE_URL')); print(os.getenv('SUPABASE_KEY')[:10] + '...')"
```

3. Проверьте что проект активен на https://supabase.com

4. Проверьте SQL миграцию была выполнена (таблицы созданы)

---

### Ошибка: "Порт уже используется"

**Проблема:** Порт 8000 занят другим процессом

**Решение:**

1. Найдите процесс:
```bash
sudo lsof -i :8000
# или
netstat -tulpn | grep 8000
```

2. Остановите его:
```bash
kill -9 <PID>
```

3. Запустите сервер на другом порту:
```bash
python3 dragon_local_server_cloud.py --port 8001
```

---

### Ошибка: "JSON decode error" при загрузке мониторинга

**Проблема:** Неправильный формат JSON в локальном хранилище

**Решение:**

1. Проверьте JSON файл:
```bash
python3 -c "import json; json.load(open('dragon_local_orders.json'))"
```

2. Если ошибка, восстановите из резервной копии:
```bash
# Создайте пустой JSON
echo '{"orders": []}' > dragon_local_orders.json
```

3. Синхронизируйте с облаком:
```bash
python3 cloud_sync.py
```

---

### Ошибка: "Таблицы не найдены" в Supabase

**Проблема:** SQL миграция не была выполнена

**Решение:**

1. Зайдите в Supabase дашборд: https://app.supabase.com
2. Выберите ваш проект
3. Перейдите в SQL Editor
4. Нажмите "New Query"
5. Скопируйте и вставьте содержимое `supabase_schema.sql`
6. Нажмите Run (▶️)
7. Таблицы должны появиться в Database → Tables

---

## ❓ FAQ - Часто Задаваемые Вопросы

### Q: Потеряются ли мои старые заказы?
**A:** Нет, они автоматически мигрируют. Запустите:
```bash
python3 -c "
from cloud_sync import get_cloud_sync
cloud = get_cloud_sync()
result = cloud.sync_from_local_json('dragon_local_orders.json')
print(f'Синхронизировано {result[\"synced\"]} заказов')
"
```

---

### Q: Насколько безопасно хранить данные в облаке?
**A:** Очень безопасно:
- ✅ Supabase использует PostgreSQL (надёжная БД)
- ✅ Шифрование в пути (HTTPS/TLS)
- ✅ Автоматические резервные копии каждый день
- ✅ Row Level Security включена
- ✅ Ваши данные не видны другим пользователям

---

### Q: Какой интернет нужен?
**A:** Обычный домашний интернет достаточно:
- В ресторане: нужен для синхронизации
- Дома: нужен для просмотра мониторинга
- Скорость не критична (сигналы маленькие)
- Может быть медленный/нестабильный - система всё равно работает

---

### Q: Что будет если пропадёт интернет?
**A:** 
- Локальные заказы будут сохраняться локально
- Когда интернет вернётся, они автоматически синхронизируются
- Вы всегда можете смотреть локальную копию

---

### Q: Могу ли я работать на нескольких устройствах?
**A:** Да! Откройте `MONITOR_CLOUD.html` на любом устройстве с интернетом:
- Планшет в ресторане - видит все заказы
- Телефон дома - видит все заказы
- Компьютер в офисе - видит все заказы
Все видят одни и те же данные в реальном времени!

---

### Q: Сколько это будет стоить?
**A:**
- Supabase Free план: **$0** (достаточно для ресторана)
- Ngrok: **$5-10/месяц** (если нужен постоянный туннель)
- Total: **~$10/месяц** (можно бесплатно)

---

### Q: Как часто обновляются данные?
**A:** Очень часто:
- Локальная запись: мгновенная
- Облако: 0-1 секунда
- Мониторинг на других устройствах: обновляется каждые 5 секунд
- Реал-тайм подписки: может быть быстрее

---

### Q: Что если забуду пароль Supabase?
**A:**
1. Зайдите на https://supabase.com
2. Перейдите в Settings → Database
3. Нажмите "Reset database password"
4. Обновите пароль в .env файле

---

### Q: Могу ли я удалить данные?
**A:** Да, но осторожно:

Удалить один заказ:
```bash
curl -X DELETE http://localhost:8000/api/orders/ORD-123
```

Очистить все заказы в Supabase (⚠️ ОСТОРОЖНО):
```sql
DELETE FROM orders;
```

---

### Q: Как создать резервную копию?
**A:** Supabase делает это автоматически, но вы можете экспортировать:

1. SQL dump:
```bash
sudo systemctl stop dragon-cloud
pg_dump postgresql://user:pass@host/db > backup.sql
sudo systemctl start dragon-cloud
```

2. JSON export:
```bash
python3 -c "
from cloud_sync import get_cloud_sync
import json
cloud = get_cloud_sync()
orders = cloud.get_orders()
with open('backup.json', 'w') as f:
    json.dump({'orders': orders}, f, ensure_ascii=False, indent=2)
"
```

---

### Q: Как переключиться на другой Supabase проект?
**A:** Обновите .env файл:

```bash
nano .env
# Замените SUPABASE_URL и SUPABASE_KEY на новые

# Перезагрузите сервер
sudo systemctl restart dragon-cloud
```

---

## 🔍 Инструменты для диагностики

### Проверка всего в одной команде

```bash
#!/bin/bash
echo "🔍 Полная диагностика DRAGON Cloud"
echo ""

echo "1️⃣  Проверка Python..."
python3 --version

echo ""
echo "2️⃣  Проверка зависимостей..."
pip3 show supabase | grep Version

echo ""
echo "3️⃣  Проверка .env..."
test -f .env && echo "✅ .env существует" || echo "❌ .env не найден"

echo ""
echo "4️⃣  Проверка подключения к интернету..."
ping -c 1 8.8.8.8 > /dev/null && echo "✅ Интернет есть" || echo "❌ Нет интернета"

echo ""
echo "5️⃣  Проверка подключения к Supabase..."
python3 cloud_sync.py > /dev/null 2>&1 && echo "✅ Supabase доступна" || echo "❌ Ошибка подключения"

echo ""
echo "6️⃣  Проверка порта 8000..."
netstat -tulpn 2>/dev/null | grep 8000 > /dev/null && echo "✅ Порт занят" || echo "❌ Порт свободен"

echo ""
echo "7️⃣  Проверка процесса dragon-cloud..."
systemctl is-active dragon-cloud > /dev/null 2>&1 && echo "✅ Сервис работает" || echo "❌ Сервис остановлен"

echo ""
echo "✅ Диагностика завершена"
```

Сохраните как `diagnose.sh` и запустите:
```bash
bash diagnose.sh
```

---

## 📞 Когда обратиться за помощью

Если ничего не помогает, соберите информацию:

```bash
# Логи сервера
sudo journalctl -u dragon-cloud -n 50 > logs.txt

# Версии
python3 --version > info.txt
pip3 show supabase >> info.txt

# Конфигурация (без чувствительных данных)
echo "SUPABASE_URL есть: $(test -f .env && grep SUPABASE_URL .env | cut -d= -f1)" >> info.txt

# Результат диагностики
bash diagnose.sh >> info.txt

# Отправьте logs.txt и info.txt в поддержку
```

---

## 🎓 Полезные команды

```bash
# Просмотр всех заказов
curl http://localhost:8000/api/orders | python3 -m json.tool

# Просмотр статистики
curl http://localhost:8000/api/stats | python3 -m json.tool

# Создание тестового заказа
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "table_number": 1,
    "customer_name": "Тест",
    "items": [{"code": "PBx", "qty": 1}],
    "total_amount": 200
  }' | python3 -m json.tool

# Обновление статуса заказа
curl -X POST http://localhost:8000/api/orders/ORD-ID \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}' | python3 -m json.tool

# Проверка доступности меню
curl http://localhost:8000/api/menu-availability | python3 -m json.tool

# Отключение пункта меню
curl -X POST http://localhost:8000/api/menu-availability \
  -H "Content-Type: application/json" \
  -d '{
    "menu_key": "pho_bo_xao",
    "available": false,
    "reason": "закончилась"
  }' | python3 -m json.tool
```

---

## 💡 Советы и трюки

### Автоматическое обновление мониторинга чаще
Отредактируйте `MONITOR_CLOUD.html` и измените:
```javascript
autoRefreshInterval = setInterval(refreshData, 5000); // 5 сек
// на
autoRefreshInterval = setInterval(refreshData, 2000); // 2 сек
```

### Добавление нотификаций
Добавьте в конец `MONITOR_CLOUD.html`:
```javascript
// Звук при новом заказе
const audio = new Audio('data:audio/wav;base64,...'); // звук
// Воспроизведите при появлении нового заказа
```

### Отправка уведомлений в Telegram
Создайте бота и отправляйте уведомления при новых заказах:
```python
import requests
TELEGRAM_BOT_TOKEN = "..."
TELEGRAM_CHAT_ID = "..."

requests.get(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", params={
    "chat_id": TELEGRAM_CHAT_ID,
    "text": f"📦 Новый заказ: #{order_id} на {order['total_amount']}₽"
})
```

---

**Удачи с облачной системой! ☁️**
