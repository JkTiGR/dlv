# DLV Cloud Bridge

Этот режим переносит рабочий bridge API из локального ноутбука в облако, чтобы:

- касса, монитор, `profil.html`, `VIEW.html`, `contron.html` и клиентские страницы работали удалённо;
- статусы заказов обновлялись почти в реальном времени через `EventSource`;
- данные хранились централизованно в Supabase, а не только в `localStorage` и локальном JSON.

## Что изменилось

- `dlv_local_server_cloud.py` теперь отдаёт тот же API, что и локальный `dlv_local_server.py`.
- `cloud_sync.py` хранит bridge-совместимые payload'ы заказов в Supabase.
- `dlv_static_config.js` умеет подключаться к удалённому bridge URL, а не только к `localhost`.

## API

Поддерживаются оба варианта:

- `GET/POST/DELETE /api/local-orders`
- `GET /api/local-events`
- `GET/POST/DELETE /api/menu-availability`
- `GET /api/stats`
- `GET /api/health`

Дополнительно оставлены совместимые маршруты:

- `GET/POST /api/orders`
- `GET/DELETE /api/orders/<id>`
- `GET /api/sync`

## Быстрый запуск

1. Создайте проект в Supabase.
2. Выполните SQL из [supabase_schema.sql](supabase_schema.sql).
3. Создайте `.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
```

`SUPABASE_SERVICE_KEY` предпочтительнее `anon`-ключа, потому что запись идёт через сервер.

4. Установите зависимости:

```bash
bash setup_cloud.sh
```

5. Запустите bridge:

```bash
python3 dlv_local_server_cloud.py --bind 0.0.0.0 --port 8000
```

6. Откройте страницы:

- `http://IP_ИЛИ_ИМЯ_СЕРВЕРА:8000/DLV_KASSA.html`
- `http://IP_ИЛИ_ИМЯ_СЕРВЕРА:8000/MONITOR.html`
- `http://IP_ИЛИ_ИМЯ_СЕРВЕРА:8000/profil.html`
- `http://IP_ИЛИ_ИМЯ_СЕРВЕРА:8000/MONITOR_CLOUD.html`

На первом этапе чаще всего открывают по IP сервера, например:

- `http://203.0.113.10:8000/MONITOR.html`

Если домен ещё не куплен или DNS не настроен, адрес вида `https://что-то.example.com` работать не будет.

## Как подключить существующий статический сайт к облаку

Если страницы продолжают открываться не с cloud bridge, а с другого хоста, есть два варианта:

1. Открывать страницу с параметром:

```text
https://your-static-host/index.html?bridgeUrl=https://api.your-domain.com
```

2. Один раз сохранить bridge URL в браузере через консоль:

```js
window.DLV_STATIC.setBridgeBase("https://api.your-domain.com");
```

После этого фронтенд будет использовать:

- `https://api.your-domain.com/api/local-orders`
- `https://api.your-domain.com/api/local-events`
- `https://api.your-domain.com/api/menu-availability`

## Рекомендуемая схема развёртывания

Для реальной работы заведения лучше так:

1. VPS / облачный сервер с Ubuntu.
2. `dlv_local_server_cloud.py` как `systemd` сервис.
3. Caddy или Nginx перед Python-сервером.
4. HTTPS на вашем реальном домене, например `https://dlv.vash-domen.com`.
5. Все рабочие страницы открываются с этого же домена, тогда настройка `bridgeUrl` не нужна.

Важно:

- `example.com`, `your-domain.com`, `vash-domen.com` в этом README — это примеры-заглушки, а не реальные адреса.
- Чтобы открылся адрес вроде `https://dlv.vash-domen.com`, нужно:
  DNS-запись домена направить на IP вашего сервера.
- После этого настроить Caddy или Nginx, чтобы он принимал этот домен и проксировал трафик на `127.0.0.1:8000`.

## Что это решает уже сейчас

- Заказ, созданный в кассе или на клиентской странице, сразу попадает в облачный bridge.
- Монитор и страницы профиля видят те же данные с любого устройства.
- Изменения доступны через SSE (`/api/local-events`), поэтому интерфейсы могут обновляться без ручного refresh.

## Ограничения

- Если нужен именно live-видео контроль заведения, это отдельная CCTV/камера-система. Этот cloud bridge закрывает операционные данные: заказы, статусы, доступность меню и удалённую работу с интерфейсами.
