import { processQuoteSubmission } from '../server/quoteHandler.ts'

type NodeRes = {
  statusCode: number
  setHeader: (key: string, value: string) => void
  end: (body: string) => void
}

type NodeReq = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
  body?: unknown
  [Symbol.asyncIterator]?: () => AsyncIterator<Buffer | string>
}

export default async function handler(req: NodeReq, res: NodeRes) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end('')
    return
  }
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }))
    return
  }

  const forwarded = req.headers['x-forwarded-for']
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0] : '') || req.socket?.remoteAddress || 'unknown'
  const raw = req.body ?? {}
  const result = await processQuoteSubmission(raw, { ip, env: process.env })
  res.statusCode = result.status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(result.body))
}
