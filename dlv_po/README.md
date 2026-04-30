# DLV Purchase Order Starter

Стартовый проект для системы управления заказами на поставку DLV. Он уже включает базовый backend на Flask, SQLite-схему, стартовую веб-панель и API для поставщиков, номенклатуры и purchase orders.

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
   cd /home/jkbook/DLV/dlv_po
   ```

2. Установите зависимости:

   ```bash
   pip install -r requirements.txt
   ```

3. Запустите приложение:

   ```bash
   python app.py
   ```

4. Откройте в браузере:

   ```text
   http://127.0.0.1:5001
   ```

## Основные API endpoints

- `GET /api/health`
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

## Следующий этап

Этот каркас уже готов к дальнейшему расширению:

- приемка поставок и складские движения
- роли и авторизация
- workflow согласования заказов
- полноценный inventory module
- расширенный REST API
- интеграция с отдельным frontend
