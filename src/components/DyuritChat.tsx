import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

interface Message {
  role: "user" | "dyurit"
  text: string
}

const RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["привет", "здравствуй", "хай", "hello", "дьюрит"],
    reply: "Приветствую. Я Дьюрит — ваш личный ИИ-ассистент. Чем могу помочь?",
  },
  {
    keywords: ["как тебя зовут", "твоё имя", "твое имя", "кто ты"],
    reply: "Меня зовут Дьюрит. Голосовой ИИ-ассистент нового поколения, вдохновлённый Джарвисом.",
  },
  {
    keywords: ["как дела", "как ты", "всё хорошо", "все хорошо"],
    reply: "Все системы работают в штатном режиме. Готов к выполнению задач.",
  },
  {
    keywords: ["что ты умеешь", "что можешь", "твои возможности", "функции"],
    reply: "Я могу отвечать на вопросы, помогать с задачами, вести беседу и быть рядом когда нужна помощь. В будущем — голосовое управление.",
  },
  {
    keywords: ["время", "который час", "сколько времени"],
    reply: `Текущее время: ${new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}.`,
  },
  {
    keywords: ["дата", "какое число", "какой день", "сегодня"],
    reply: `Сегодня ${new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.`,
  },
  {
    keywords: ["железный человек", "тони старк", "джарвис", "marvel"],
    reply: "Тони Старк создал Джарвиса — я вдохновлён этой идеей. Умный ассистент всегда рядом с тем, кто создаёт великое.",
  },
  {
    keywords: ["спасибо", "благодарю", "thanks"],
    reply: "Всегда к вашим услугам.",
  },
  {
    keywords: ["пока", "до свидания", "выход", "выключись"],
    reply: "До встречи. Дьюрит переходит в режим ожидания.",
  },
  {
    keywords: ["погода"],
    reply: "Для получения данных о погоде мне потребуется подключение к внешним сервисам. Эта функция будет доступна в следующей версии.",
  },
  {
    keywords: ["помоги", "помощь", "help"],
    reply: "Конечно. Задайте ваш вопрос — я постараюсь помочь.",
  },
]

function getDyuritReply(message: string): string {
  const lower = message.toLowerCase()
  for (const item of RESPONSES) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.reply
    }
  }
  return "Интересный вопрос. Мои возможности пока ограничены, но я учусь. Попробуйте спросить что-нибудь другое."
}

export default function DyuritChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "dyurit", text: "Система запущена. Я Дьюрит — ваш личный ассистент. Чем могу помочь?" },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setTyping(true)
    setTimeout(() => {
      const reply = getDyuritReply(text)
      setMessages((prev) => [...prev, { role: "dyurit", text: reply }])
      setTyping(false)
    }, 700)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_24px_hsl(var(--primary)/0.6)] hover:scale-110 transition-all duration-300"
      >
        {open ? <Icon name="X" size={22} /> : <Icon name="MessageCircle" size={22} />}
      </button>

      {/* Чат окно */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 rounded-2xl border border-border bg-card shadow-[0_0_40px_hsl(var(--primary)/0.2)] flex flex-col overflow-hidden">
          {/* Шапка */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm font-semibold text-foreground">ДЬЮРИТ</span>
            <span className="font-mono text-xs text-muted-foreground ml-auto">онлайн</span>
          </div>

          {/* Сообщения */}
          <div className="flex flex-col gap-3 p-4 h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl font-mono text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none border border-border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-secondary border border-border px-3 py-2 rounded-xl rounded-bl-none font-mono text-xs text-muted-foreground">
                  Дьюрит печатает...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Ввод */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-border">
            <input
              className="flex-1 bg-input text-foreground font-mono text-xs rounded-lg px-3 py-2 outline-none border border-border focus:border-primary transition-colors placeholder:text-muted-foreground"
              placeholder="Напишите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              onClick={sendMessage}
              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <Icon name="Send" size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
