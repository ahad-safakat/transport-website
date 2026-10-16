import { defineConfig, loadEnv, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { processChat } from './server/chatHandler.ts'
import { processQuoteSubmission, readJsonBody } from './server/quoteHandler.ts'

function quoteApiPlugin(env: Record<string, string>): Plugin {
  async function handler(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const url = req.url ?? ''
    const isChat = url.startsWith('/api/chat')
    if (!url.startsWith('/api/quote') && !isChat) {
      next()
      return
    }
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }))
      return
    }
    try {
      const raw = await readJsonBody(req)
      const forwarded = req.headers['x-forwarded-for']
      const ip =
        (typeof forwarded === 'string' ? forwarded.split(',')[0] : '') ||
        req.socket.remoteAddress ||
        'unknown'
      const result = isChat ? await processChat(raw, { ip, env }) : await processQuoteSubmission(raw, { ip, env })
      res.statusCode = result.status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result.body))
    } catch (error) {
      console.error(error)
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Unable to process this enquiry.' }))
    }
  }

  return {
    name: 'site-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), quoteApiPlugin(env)],
  }
})
