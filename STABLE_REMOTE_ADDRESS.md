# Stable Remote Address

Если нужен один и тот же адрес из дома, не используй Quick Tunnel (`trycloudflare`) и не рассчитывай на случайный URL от `ngrok`.

Для DRAGON здесь подготовлен стабильный вариант через named Cloudflare Tunnel:

```bash
bash start_dragon_named_tunnel.sh 8000
```

Что это даёт:

- один и тот же HTTPS-адрес каждый запуск;
- `MONITOR.html`, `VIEW.html`, `profil.html` и `contron.html` можно открывать из дома по одному домену;
- `bridgeUrl` больше не приходится менять вручную после каждого рестарта.

## Что нужно один раз

1. Домен в Cloudflare, например `dlv.example.com`.
2. `cloudflared` установлен локально.
3. Выполнен login:

```bash
cloudflared tunnel login
```

## Что добавить в `.env`

```env
DRAGON_TUNNEL_NAME=dragon-restaurant
DRAGON_PUBLIC_HOSTNAME=dlv.example.com
DRAGON_PUBLIC_BRIDGE_URL=https://dlv.example.com
CLOUDFLARED_EDGE_IP_VERSION=4
```

`CLOUDFLARED_EDGE_IP_VERSION=4` оставлен специально, потому что на некоторых сетях `auto` и IPv6 дают нестабильный старт туннеля.

## Как запускать

1. Подними сам DRAGON bridge:

```bash
bash start_dragon_lan.sh 8000
```

или cloud-bridge:

```bash
python3 dragon_local_server_cloud.py --bind 0.0.0.0 --port 8000
```

2. Запусти стабильный tunnel:

```bash
bash start_dragon_named_tunnel.sh 8000
```

3. Открывай из дома:

```text
https://dlv.example.com/MONITOR.html
https://dlv.example.com/VIEW.html
https://dlv.example.com/profil.html
https://dlv.example.com/contron.html
```

## Что делает скрипт

- проверяет, что локальный DRAGON bridge отвечает на `/api/health`;
- находит или создаёт named tunnel;
- привязывает DNS hostname к tunnel;
- генерирует локальный config в `.cloudflared/`;
- запускает `cloudflared tunnel run` с этим конфигом.

## Если раньше был сохранён старый bridge URL

Касса и другие страницы могут помнить старый `trycloudflare`-адрес в браузере. Тогда:

1. Открой страницу один раз с `?bridge=0`
2. Потом заходи уже по новому постоянному адресу

Пример:

```text
https://dlv.example.com/DRAGON_KASSA.html?bridge=0
```

После этого можно открыть обычный адрес без параметра.
