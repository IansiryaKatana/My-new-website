import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const PORT = Number(process.env.PORT) || 3000
const CLIENT_ROOT = join(root, 'dist', 'client')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

const { default: appHandler } = await import('./dist/server/server.js')

function resolveStaticPath(pathname) {
  const rel = decodeURIComponent(pathname.replace(/^\//, ''))
  const filePath = join(CLIENT_ROOT, rel)
  if (!filePath.startsWith(CLIENT_ROOT)) return null
  if (!existsSync(filePath) || !statSync(filePath).isFile()) return null
  return filePath
}

function serveStatic(pathname) {
  const filePath = resolveStaticPath(pathname)
  if (!filePath) return null

  const ext = extname(filePath).toLowerCase()
  const type = MIME[ext] ?? 'application/octet-stream'
  return new Response(createReadStream(filePath), {
    headers: { 'Content-Type': type },
  })
}

async function readRequestBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return chunks.length ? Buffer.concat(chunks) : undefined
}

async function toWebRequest(req) {
  const host = req.headers.host ?? 'localhost'
  const url = `http://${host}${req.url ?? '/'}`
  return new Request(url, {
    method: req.method,
    headers: req.headers,
    body: await readRequestBody(req),
  })
}

async function sendNodeResponse(webResponse, res) {
  res.statusCode = webResponse.status
  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'transfer-encoding') return
    res.setHeader(key, value)
  })

  if (webResponse.body) {
    const reader = webResponse.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
  }

  res.end()
}

const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`).pathname
    const staticResponse = serveStatic(pathname)
    if (staticResponse) {
      await sendNodeResponse(staticResponse, res)
      return
    }

    const response = await appHandler.fetch(await toWebRequest(req))
    await sendNodeResponse(response, res)
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ian Katana portfolio listening on http://0.0.0.0:${PORT}`)
})
