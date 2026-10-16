import { processQuoteSubmission, readJsonBody } from '../server/quoteHandler.ts'

/** Vercel serverless function for POST /api/quote. Local dev/preview use the plugin in vite.config.ts. */

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
  [Symbol.asyncIterator]: () => AsyncIterator<Buffer | string>
}

function send(res: NodeRes, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

async function parseBody(req: NodeReq): Promise<unknown> {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body) as unknown
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8')) as unknown
  return readJsonBody(req)
}

export default async function handler(req: NodeReq, res: NodeRes) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    send(res, 405, { ok: false, error: 'Method not allowed.' })
    return
  }

  const contentType = String(req.headers['content-type'] ?? '')
  if (!contentType.includes('application/json')) {
    send(res, 415, { ok: false, error: 'Expected a JSON enquiry.' })
    return
  }

  const forwarded = req.headers['x-forwarded-for']
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || req.socket?.remoteAddress || 'unknown'

  try {
    const raw = await parseBody(req)
    const result = await processQuoteSubmission(raw, { ip, env: process.env })
    send(res, result.status, result.body)
  } catch (error) {
    console.error(error)
    send(res, 400, { ok: false, error: 'Unable to process this enquiry.' })
  }
}
