import type { ChatMessage } from './engine'

/** Set once the server says the AI is not configured, so later messages skip the network call. */
let unavailable = false

/**
 * Asks the server-side AI assistant (/api/chat) for a reply to the latest user message.
 * Returns null on any failure so the caller can use the scripted answer instead.
 */
export async function askAssistant(history: ChatMessage[]): Promise<string | null> {
  if (unavailable) return null
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-12).map(({ role, text }) => ({ role, content: text })) }),
    })
    if (response.status === 503 || response.status === 404) unavailable = true
    if (!response.ok) return null
    const data = (await response.json()) as { ok?: boolean; reply?: string }
    return data.ok && data.reply ? data.reply : null
  } catch {
    return null
  }
}
