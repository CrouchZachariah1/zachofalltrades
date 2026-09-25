import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const host = process.env.HOST ?? '0.0.0.0'
const port = Number(process.env.PORT ?? 4173)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
}

function send(res, code, file) {
  const type = mime[path.extname(file)] ?? 'application/octet-stream'
  const cache = path.extname(file) === '.html' ? 'no-cache' : 'public, max-age=31536000'
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': cache })
  fs.createReadStream(file).pipe(res)
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0] || '/')
  const rel = url.replace(/^\/+/, '') || 'index.html'
  const requested = path.normalize(path.join(root, rel))
  if (!requested.startsWith(root)) {
    res.writeHead(403)
    res.end()
    return
  }
  if (fs.existsSync(requested) && fs.statSync(requested).isFile()) {
    send(res, 200, requested)
    return
  }
  const index = path.join(root, 'index.html')
  if (fs.existsSync(index)) {
    send(res, 200, index)
    return
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Build the site first: npm run build')
})

server.listen(port, host, () => {
  console.log(`Zach of All Trades  →  http://localhost:${port}`)
  console.log(`Serving ${root}`)
})
