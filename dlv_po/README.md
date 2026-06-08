# DRAGON Purchase Order Starter

Стартовый проект для системы управления заказами на поставку DRAGON. Он уже включает базовый backend на Flask, SQLite-схему, стартовую веб-панель и API для поставщиков, номенклатуры и purchase orders.

Теперь модуль запускается безопаснее:
- API закрыт сессией
- пароль админа берётся из `DRAGON_PO_ADMIN_PASSWORD`
- по умолчанию сервер слушает только `127.0.0.1`
- debug mode по умолчанию выключен

## Что уже готово

- единая точка входа `app.py`
- автоматическая инициализация SQLite-базы через `schema.sql`
- базовая веб-панель по адресу `/`
- API для:
  - поставщиков
  - товаров
  - заказов на поставку
  - dashboard-метрик
- структура, которую удобно расширять дальше под инвентарь, приемку и закупки

## Структура

```text
dlv_po/
├── app.py
├── data/
│   └── po.db
├── index.html
├── requirements.txt
├── schema.sql
└── static/
    ├── app.js
    └── styles.css
```

## Быстрый запуск

1. Перейдите в каталог проекта:

   ```bash
   cd /home/jkbook/DRAGON/dlv_po
   ```

2. Установите зависимости:

   ```bash
   pip install -r requirements.txt
   ```

3. Задайте пароль для входа:

   ```bash
   export DRAGON_PO_ADMIN_PASSWORD='change-this-password'
   ```

   Дополнительно можно задать:

   ```bash
   export DRAGON_PO_SECRET_KEY='long-random-secret'
   export DRAGON_PO_HOST='127.0.0.1'
   export DRAGON_PO_DEBUG='0'
   ```

4. Запустите приложение:

   ```bash
   python app.py
   ```

5. Откройте в браузере:

   ```text
   http://127.0.0.1:5001
   ```

6. Войдите через форму на странице, используя `DRAGON_PO_ADMIN_PASSWORD`.

## Основные API endpoints

- `GET /api/health`
- `GET /api/session`
- `POST /api/session`
- `DELETE /api/session`
- `GET /api/dashboard`
- `GET /api/suppliers`
- `POST /api/suppliers`
- `GET /api/products`
- `POST /api/products`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/<id>`

## Данные

- база создается автоматически в `dlv_po/data/po.db`
- номера заказов формируются в формате `PO-YYYYMMDD-XXX`
- суммы заказов пересчитываются на сервере
- если пароль не задан через env, приложение сгенерирует временный пароль и выведет его в консоль

## Следующий этап

Этот каркас уже готов к дальнейшему расширению:

- приемка поставок и складские движения
- роли и авторизация
- workflow согласования заказов
- полноценный inventory module
- расширенный REST API
- интеграция с отдельным frontend
