import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { MessageSquare, Send, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { company, displayName, hasWhatsApp, isPlaceholder } from '../../config/company'
import { chatbotCopy } from '../../config/content'
import { useQuotePrefill } from '../../context/QuotePrefillContext'
import {
  createChatState,
  createMessage,
  defaultQuickReplies,
  greetingText,
  handleChatInput,
  type ChatMessage,
  type QuickReply,
} from '../../chatbot/engine'
import { openWhatsApp } from '../../lib/whatsapp'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [state, setState] = useState(createChatState)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage('assistant', greetingText()),
  ])
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(defaultQuickReplies)
  const [busy, setBusy] = useState(false)
  const panelId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { applyPrefill } = useQuotePrefill()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function process(text: string) {
    if (busy) return
    const trimmed = text.trim()
    if (!trimmed) return
    setBusy(true)
    const userMessage = createMessage('user', trimmed)
    const result = handleChatInput(state, trimmed)
    setMessages((current) => [
      ...current,
      userMessage,
      ...result.replies.map((reply) => createMessage('assistant', reply)),
    ])
    setState(result.state)
    setQuickReplies(result.quickReplies)
    setInput('')

    if (result.openWhatsApp && result.whatsappMessage) {
      if (hasWhatsApp()) {
        openWhatsApp(result.whatsappMessage)
      } else {
        setMessages((current) => [
          ...current,
          createMessage(
            'assistant',
            'WhatsApp is not configured on this website yet. Please use the quote form instead.',
          ),
        ])
      }
    }

    if (result.transferToForm) {
      applyPrefill({
        pickupCity: result.transferToForm.pickupCity ?? '',
        deliveryCity: result.transferToForm.deliveryCity ?? '',
        vehicleType: result.transferToForm.vehicleType ?? '',
        cargoDescription: result.transferToForm.cargoDescription ?? '',
        preferredPickupDate: result.transferToForm.preferredPickupDate ?? '',
      })
      navigate('/#quote')
      setOpen(false)
    }

    window.setTimeout(() => setBusy(false), 250)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    process(input)
  }

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      process(input)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`fixed z-40 flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-lift ${
          hasWhatsApp() ? 'right-4 bottom-22 md:right-6 md:bottom-24' : 'right-4 bottom-4 md:right-6 md:bottom-6'
        }`}
        style={{ bottom: hasWhatsApp() ? '5.75rem' : '1.5rem' }}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <MessageSquare size={18} />
        <span>{open ? 'Close chat' : chatbotCopy.launcher}</span>
      </button>

      {open ? (
        <section
          id={panelId}
          className="fixed right-3 bottom-36 z-50 flex h-[min(520px,calc(100svh-8rem))] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden border border-navy/10 bg-white shadow-lift md:right-6"
          aria-label="Transportation assistant"
        >
          <header className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-2">
              <img src={company.logoSrc} alt="" className="h-7 w-7" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {isPlaceholder(company.name) ? displayName() : company.name}
                </p>
                <p className="text-[11px] text-white/60">Automated assistant</p>
              </div>
            </div>
            <button type="button" className="p-2" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-3 py-3">
            {messages.map((message) => (
              <p
                key={message.id}
                className={`max-w-[90%] whitespace-pre-wrap px-3 py-2 text-sm leading-5 ${
                  message.role === 'assistant' ? 'bg-white text-navy' : 'ml-auto bg-navy text-white'
                }`}
              >
                {message.text}
              </p>
            ))}
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  className="border border-navy/15 bg-white px-3 py-2 text-left text-xs font-semibold"
                  onClick={() => process(reply.label)}
                  disabled={busy}
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>

          <p className="bg-cream px-3 pb-2 text-[11px] text-slate">{chatbotCopy.disclaimer}</p>
          <form onSubmit={onSubmit} className="flex gap-2 border-t border-navy/10 p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onInputKey}
              className="min-w-0 flex-1 border border-navy/15 px-3 py-2 text-sm"
              placeholder="Type a message"
              aria-label="Chat message"
            />
            <button
              type="submit"
              className="bg-accent px-3 text-navy"
              aria-label="Send message"
              disabled={busy || !input.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      ) : null}
    </>
  )
}
