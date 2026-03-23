import os
import json
import urllib.request
import urllib.parse

RESPONSES = [
    {"keywords": ["привет", "здравствуй", "хай", "hello", "дьюрит"], "reply": "Приветствую. Я Дьюрит — ваш личный ИИ-ассистент. Чем могу помочь?"},
    {"keywords": ["как тебя зовут", "твоё имя", "кто ты"], "reply": "Меня зовут Дьюрит. Голосовой ИИ-ассистент нового поколения, вдохновлённый Джарвисом."},
    {"keywords": ["как дела", "как ты", "всё хорошо"], "reply": "Все системы работают в штатном режиме. Готов к выполнению задач."},
    {"keywords": ["что ты умеешь", "что можешь", "функции"], "reply": "Я могу отвечать на вопросы, помогать с задачами, вести беседу и быть рядом когда нужна помощь."},
    {"keywords": ["железный человек", "тони старк", "джарвис", "marvel"], "reply": "Тони Старк создал Джарвиса — я вдохновлён этой идеей. Но у меня своя история."},
    {"keywords": ["спасибо", "благодарю", "thanks"], "reply": "Всегда к вашим услугам."},
    {"keywords": ["пока", "до свидания", "выключись"], "reply": "До встречи. Дьюрит переходит в режим ожидания."},
    {"keywords": ["погода"], "reply": "Для получения данных о погоде мне потребуется подключение к внешним сервисам. Пока эта функция в разработке."},
    {"keywords": ["помоги", "помощь", "help"], "reply": "Конечно. Задайте ваш вопрос — я постараюсь помочь."},
    {"keywords": ["сайт", "веб", "открыть"], "reply": "Мой веб-интерфейс доступен на официальном сайте."},
]

DEFAULT_REPLY = "Интересный вопрос. Мои возможности пока ограничены, но я учусь. Попробуйте спросить что-нибудь другое."


def get_dyurit_reply(message: str) -> str:
    lower = message.lower()
    for item in RESPONSES:
        if any(kw in lower for kw in item["keywords"]):
            return item["reply"]
    return DEFAULT_REPLY


def send_telegram_message(token: str, chat_id: int, text: str):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req, timeout=10)


def handler(event: dict, context) -> dict:
    """Вебхук для Телеграм-бота Дьюрит. Получает сообщения и отвечает на них."""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")

    if not token:
        return {"statusCode": 500, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"error": "Token not configured"})}

    if event.get("httpMethod") == "GET":
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"status": "Dyurit Telegram bot is running"})}

    body = event.get("body", "{}")
    if isinstance(body, str):
        update = json.loads(body)
    else:
        update = body

    message = update.get("message", {})
    chat_id = message.get("chat", {}).get("id")
    text = message.get("text", "")

    if chat_id and text:
        reply = get_dyurit_reply(text)
        send_telegram_message(token, chat_id, reply)

    return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"ok": True})}
