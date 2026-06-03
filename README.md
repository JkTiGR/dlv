# cyber_dragon

## GitHub Pages mode

Проект можно открыть как статический сайт через GitHub Pages, например:

`https://jktigr.github.io/dlv/`

В этом режиме страницы не используют локальный Python bridge `/api/*`, потому что GitHub Pages отдаёт только статические файлы. Клиентское меню, касса, monitor/view/control pages и PO-страница загружаются без локального сервера; данные, которым нужен локальный backend, сохраняются в `localStorage` текущего браузера или отправляются во внешний Google Apps Script/Telegram, если эти интеграции доступны.

Для локальной работы с bridge API запускай:

```bash
python3 dragon_local_server.py
```

и открывай:

`http://127.0.0.1:8000/index.html`
