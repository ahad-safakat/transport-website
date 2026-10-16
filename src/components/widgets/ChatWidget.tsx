import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Loader2, MapPin, MessageCircle, MessageSquare, Phone, Send, X } from 'lucide-react'
import { company, displayName, hasWhatsApp, isPlaceholder } from '../../config/company'
import { chatbotCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/quotePrefill'
import {
  createChatState,
  createMessage,
  defaultQuickReplies,
  greetingText,
  handleChatInput,
  type ChatMessage,
  type QuickReply,
} from '../../chatbot/engine'
import { askAssistant } from '../../chatbot/ai'
import { buildWhatsAppUrl } from '../../lib/whatsapp'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [state, setState] = useState(createChatState)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createMessage('assistant', greetingText())])
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(defaultQuickReplies)
  const [inputError, setInputError] = useState(false)
  const [thinking, setThinking] = useState(false)
  const busy = useRef(false)
  const panelId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const { requestQuote } = useQuotePrefill()
  const reduce = useReducedMotion()
  const whatsappEnabled = hasWhatsApp()

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, open, reduce])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function close() {
    setOpen(false)
    requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }))
  }

  async function process(text: string) {
    const trimmed = text.trim()
    if (!trimmed) {
      setInputError(true)
      inputRef.current?.focus()
      return
    }
    if (busy.current) return
    busy.current = true

    setInputError(false)
    const result = handleChatInput(state, trimmed)
    const userMessage = createMessage('user', trimmed)
    setState(result.state)
    setInput('')

    let texts = result.replies
    if (result.aiEligible) {
      setMessages((current) => [...current, userMessage])
      setQuickReplies([])
      setThinking(true)
      const aiReply = await askAssistant([...messages, userMessage])
      setThinking(false)
      if (aiReply) texts = [aiReply]
      busy.current = false
    } else {
      setMessages((current) => [...current, userMessage])
      window.setTimeout(() => {
        busy.current = false
      }, 300)
    }

    const replies = texts.map((reply, index) =>
      createMessage(
        'assistant',
        reply,
        index === texts.length - 1 ? { whatsappMessage: result.whatsappMessage, link: result.link } : undefined,
      ),
    )
    setMessages((current) => [...current, ...replies])
    setQuickReplies(result.quickReplies)

    if (result.transferToForm) {
      const draft = result.transferToForm
      requestQuote({
        pickupCity: draft.pickupCity ?? '',
        deliveryCity: draft.deliveryCity ?? '',
        vehicleType: draft.vehicleType ?? '',
        cargoDescription: draft.cargoDescription ?? '',
        preferredPickupDate: draft.preferredPickupDate ?? '',
      })
      setOpen(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    process(input)
  }

  const title = isPlaceholder(company.name) ? displayName() : company.name

  return (
    <>
      <AnimatePresence>
        {!open ? (
          <motion.button
            key="launcher"
            ref={launcherRef}
            type="button"
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            className={`fixed right-4 z-40 flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-navy px-4 text-sm font-bold text-white shadow-lift ring-1 ring-white/10 transition-colors hover:bg-charcoal md:right-6 ${
              whatsappEnabled ? 'bottom-[5.5rem] md:bottom-[6.5rem]' : 'bottom-4 md:bottom-6'
            }`}
            aria-expanded={false}
            aria-controls={panelId}
            aria-label={`Open transportation assistant: ${chatbotCopy.launcher}`}
            onClick={() => setOpen(true)}
          >
            <MessageSquare size={20} className="text-accent" aria-hidden="true" />
            <span className="hidden sm:inline">{chatbotCopy.launcher}</span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.section
            key="panel"
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-label="Transportation assistant"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-[60] flex h-[min(600px,calc(100dvh-5.5rem))] origin-bottom-right flex-col overflow-hidden bg-white shadow-[0_30px_80px_-20px_rgba(10,10,10,0.55)] ring-1 ring-navy/10 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[390px]"
          >
            <header className="flex items-center justify-between gap-3 bg-navy px-4 py-3.5 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <img src={company.logoSrc} alt="" className="h-8 w-auto" width={63} height={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{title}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    Automated assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
                onClick={close}
              >
                <X size={20} />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-cream px-3 py-4" role="log" aria-live="polite" aria-relevant="additions">
              {messages.map((message) => (
                <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === 'assistant'
                        ? 'border border-navy/5 bg-white text-navy shadow-sm'
                        : 'bg-navy text-white'
                    }`}
                  >
                    <span className="sr-only">{message.role === 'assistant' ? 'Assistant: ' : 'You: '}</span>
                    {message.text}
                    {message.whatsappMessage && whatsappEnabled ? (
                      <a
                        href={buildWhatsAppUrl(message.whatsappMessage) ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 bg-[#1FA855] px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#178a45]"
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        Open WhatsApp
                      </a>
                    ) : null}
                    {message.link ? (
                      <a
                        href={message.link.href}
                        target={message.link.external ? '_blank' : undefined}
                        rel={message.link.external ? 'noopener noreferrer' : undefined}
                        className="mt-3 flex items-center justify-center gap-2 bg-navy px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-charcoal"
                      >
                        {message.link.external ? <MapPin size={16} aria-hidden="true" /> : <Phone size={16} aria-hidden="true" />}
                        {message.link.label}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
              {thinking ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 border border-navy/5 bg-white px-3.5 py-2.5 text-sm text-slate shadow-sm">
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                    Typing…
                  </div>
                </div>
              ) : null}
            </div>

            {quickReplies.length > 0 ? (
              <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto border-t border-navy/5 bg-cream px-3 py-3" aria-label="Suggested replies">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.id}
                    type="button"
                    className="inline-flex items-center gap-1 border border-navy/15 bg-white px-3 py-2 text-left text-xs font-semibold text-navy transition-colors hover:border-accent hover:text-accent-ink"
                    onClick={() => process(reply.label)}
                  >
                    {reply.label}
                    <ArrowRight size={12} aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="border-t border-navy/10 bg-white p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value)
                    if (inputError) setInputError(false)
                  }}
                  className="min-w-0 flex-1 border border-navy/15 px-3 py-2.5 text-[15px] outline-none focus:border-accent-ink focus:ring-2 focus:ring-accent/40"
                  placeholder="Type your message…"
                  aria-label="Chat message"
                  aria-invalid={inputError || undefined}
                  aria-describedby={inputError ? `${panelId}-error` : `${panelId}-note`}
                  maxLength={500}
                  enterKeyHint="send"
                />
                <button
                  type="submit"
                  disabled={thinking}
                  className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-navy transition-colors hover:bg-accent-dark disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>
              {inputError ? (
                <p id={`${panelId}-error`} className="mt-1.5 text-xs text-red-700">
                  Please type a message first.
                </p>
              ) : (
                <p id={`${panelId}-note`} className="mt-1.5 text-[11px] leading-4 text-slate">
                  {chatbotCopy.disclaimer}
                </p>
              )}
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  )
}
