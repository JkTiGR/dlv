# DRAGON Security Baseline

Этот файл описывает не формальную open-source policy, а практический security baseline для проекта DRAGON.

## Цель

Сделать систему пригодной для продажи как коммерческого ресторанного продукта:

- без публично торчащих секретов;
- без дефолтных PIN/паролей;
- с понятными ролями и входом;
- с предсказуемым production-развёртыванием;
- с минимальным риском утечки заказов, платежных данных и внутренних настроек.

## Что уже есть

- серверная загрузка конфигурации из `.env` через `dragon_bridge_runtime.py`;
- серверная сборка LiqPay checkout формы;
- cookie-сессии для bridge/kassa;
- отдельная auth-модель в `dlv_po/app.py`;
- Supabase schema с RLS на запись через `service_role`.

## Текущие риски

### 1. Секреты и конфигурация

- Раньше `.env` не был явно защищён через `.gitignore`.
- Есть риск использования дефолтного `DRAGON_KASSA_PIN=1990`.
- Есть режим `DRAGON_ALLOW_INSECURE_REMOTE`, который открывает удалённый доступ без нормальной защиты.
- В `cloud_sync.py` допускается fallback до `SUPABASE_ANON_KEY`, что размывает границу между публичным и серверным ключом.

### 2. Аутентификация и роли

- Сейчас нет единой auth-системы для `admin`, `cashier`, `kitchen`, `viewer`.
- Для кассы используется PIN, а не полноценный login.
- В `dlv_po` есть только одна парольная роль администратора.
- Нет централизованного audit trail: кто изменил цену, стоп-лист, заказ, скидку.

### 3. Данные и доступ

- Заказы и состояние меню завязаны на bridge/token access, а не на user/session/role model.
- Нет серверного permission layer уровня "может читать", "может менять цены", "может закрывать смену".
- Публичное чтение из Supabase может быть избыточным для production-режима.

### 4. Production

- Нет формализованного reverse proxy слоя (`Caddy`/`Nginx`).
- Нет обязательного HTTPS baseline.
- Нет политики backup/restore.
- Нет alerting, uptime monitoring и structured logs.

## Обязательный baseline перед продажей

### Секреты

- Хранить реальные ключи только в локальном `.env` или в environment variables на сервере.
- Никогда не коммитить `.env`, приватные `.key`/`.pem` и служебные файлы с токенами.
- Ротировать все ключи, если они хоть раз были в репозитории, скриншоте или чате.

### Серверный доступ

- `DRAGON_ALLOW_INSECURE_REMOTE=0` во всех production-средах.
- Обязательный `DRAGON_BRIDGE_TOKEN` достаточной длины.
- Обязательный `DRAGON_ALLOWED_ORIGINS` для production-доменов.
- Обязательный недефолтный `DRAGON_KASSA_PIN` до замены PIN-схемы на полноценный login.

### Cookies и sessions

- `HttpOnly` cookies уже есть; для production нужно включать `Secure` и работать только по HTTPS.
- Сессии должны иметь TTL, logout и возможность принудительного revoke.

### Аудит

- Любое изменение цены, блюда, категории, скидки, стоп-листа, статуса заказа и расхода должно писать audit-event:
  - `who`
  - `when`
  - `what`
  - `before`
  - `after`

## Целевая security-модель

### Роли

- `admin` — полный доступ, пользователи, цены, отчёты, склад, расходы.
- `cashier` — создание и закрытие заказов, приём оплаты, ограниченный возврат.
- `kitchen` — просмотр и изменение kitchen status без доступа к финансам и настройкам.
- `viewer` — read-only dashboard и отчёты без права менять данные.

### Login

Нужен единый login flow:

- email или username;
- пароль с hash (`argon2id` или `bcrypt`);
- серверные session cookies;
- rate limit на логин;
- optional 2FA для `admin`;
- reset password flow;
- audit лог по входам и ошибкам входа.

### Data model

Нужны сущности:

- `users`
- `roles`
- `user_roles`
- `sessions`
- `audit_events`
- `permissions` или role-permission matrix

## Практический порядок hardening

1. Убрать риск утечки секретов.
2. Запретить insecure remote mode в production.
3. Заменить PIN/token-доступ на user/session/role auth.
4. Закрыть доступ к отчётам и настройкам через permissions.
5. Включить HTTPS, secure cookies, backup и monitoring.

## Что считать "готово"

Проект можно считать коммерчески зрелым по security, когда:

- `.env` и реальные ключи не попадают в git;
- нет дефолтных паролей и PIN;
- все критические страницы требуют login;
- роли ограничивают доступ по назначению;
- есть audit trail;
- production работает только по HTTPS;
- есть backup и процедура восстановления.
