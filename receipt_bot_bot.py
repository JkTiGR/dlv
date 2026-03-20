import re
import sqlite3
from datetime import datetime, timezone
from typing import Optional

from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters

BOT_TOKEN = "6819820426:AAEWwwN8tYLVPo6U-g6EjWCo4evnJ2SaGk4"
DB_PATH = "orders.db"

CODE_RE = re.compile(r"\bCode:\s*([a-z]\d{3})\b", re.IGNORECASE)

def db():
    con = sqlite3.connect(DB_PATH)
    con.execute("""
      CREATE TABLE IF NOT EXISTS orders (
        code TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        created_at TEXT,
        source_chat_id TEXT,
        source_msg_id INTEGER
      )
    """)
    return con

def extract_code(text: str) -> Optional[str]:
    if not text:
        return None
    m = CODE_RE.search(text)
    if not m:
        return None
    return m.group(1).lower().strip()

async def on_channel_post(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.channel_post
    if not msg or not msg.text:
        return

    code = extract_code(msg.text)
    if not code:
        return

    created_at = msg.date.astimezone(timezone.utc).isoformat() if msg.date else datetime.now(timezone.utc).isoformat()

    con = db()
    with con:
        con.execute(
            "INSERT OR REPLACE INTO orders(code, text, created_at, source_chat_id, source_msg_id) VALUES (?,?,?,?,?)",
            (code, msg.text, created_at, str(msg.chat_id), msg.message_id)
        )
    con.close()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # /start receipt_y908
    args = context.args or []
    if args and args[0].startswith("receipt_"):
        code = args[0].replace("receipt_", "").lower().strip()
        await send_receipt(update, context, code)
        return

    await update.message.reply_text(
        "Привет! Я выдаю чек по коду заказа.\n"
        "Нажми кнопку «Получить чек» на сайте или отправь мне код: y123"
    )

async def send_receipt(update: Update, context: ContextTypes.DEFAULT_TYPE, code: str):
    if not re.fullmatch(r"[a-z]\d{3}", code or ""):
        await update.message.reply_text("Код должен быть вида: y908")
        return

    con = db()
    cur = con.execute("SELECT text, created_at FROM orders WHERE code = ?", (code,))
    row = cur.fetchone()
    con.close()

    if not row:
        await update.message.reply_text(
            f"Заказ {code} не найден.\n"
            "Если это старый заказ — бот мог ещё не быть в канале.\n"
            "Или подожди 5–10 секунд после оформления и попробуй снова."
        )
        return

    text, created_at = row
    # Можно чуть “причесать” текст, но пока отдаём аккуратно как чек:
    await update.message.reply_text(
        f"🧾 <b>Ваш чек</b>\n\n{text}",
        parse_mode=ParseMode.HTML,
        disable_web_page_preview=True
    )

async def on_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # если пользователь просто прислал "y908"
    t = (update.message.text or "").strip().lower()
    if re.fullmatch(r"[a-z]\d{3}", t):
        await send_receipt(update, context, t)
    else:
        await update.message.reply_text("Отправь код вида y908 или нажми кнопку «Получить чек» на сайте.")

def main():
    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.UpdateType.CHANNEL_POST & filters.TEXT, on_channel_post))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_text))

    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()