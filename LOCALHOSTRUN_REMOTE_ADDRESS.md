# localhost.run Remote Address

Этот вариант нужен, когда нужен внешний адрес уже сейчас, а Cloudflare named tunnel и домен ещё не настроены.

Быстрый запуск:

```bash
bash start_dragon_localhostrun_tunnel.sh 8000
```

Что делает скрипт:

- проверяет локальный DRAGON bridge через `/api/health`;
- поднимает внешний tunnel через `ssh -R ... localhost.run`;
- ловит выданный public URL;
- отправляет его в Telegram, если настроены `DRAGON_TG_BOT_TOKEN` и chat id.

## Что получится

- бесплатный внешний адрес работает сразу;
- он живёт, пока работает tunnel-сессия;
- после нового запуска бесплатный адрес может измениться.

## Как сделать адрес заметно стабильнее

Есть два варианта:

1. Оставить `localhost.run`, но взять их stable domain/custom domain план.
2. Использовать Cloudflare named tunnel и свой домен.

Для `localhost.run` с платным custom domain можно заранее указать желаемый hostname в `.env`:

```env
DRAGON_LOCALHOSTRUN_LOGIN=plan@localhost.run
DRAGON_LOCALHOSTRUN_DOMAIN=dlv.example.com
DRAGON_LOCALHOSTRUN_SERVER_ALIVE=30
```

После этого запускать так же:

```bash
bash start_dragon_localhostrun_tunnel.sh 8000
```

Если custom domain ещё не подключён, оставь `DRAGON_LOCALHOSTRUN_DOMAIN` пустым и скрипт поднимет free URL.

## Telegram

Для авто-отправки адреса в Telegram:

```env
DRAGON_TG_BOT_TOKEN=123456:telegram-bot-token
DRAGON_TG_CHAT_ID=-1001234567890
```

## Когда лучше перейти на Cloudflare

Если нужен действительно один и тот же адрес после перезагрузок и без зависимости от текущей SSH-сессии, лучше переходить на named tunnel с доменом. Для этого в проекте уже есть:

```bash
bash start_dragon_named_tunnel.sh 8000
```
