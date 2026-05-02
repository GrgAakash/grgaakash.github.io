#!/usr/bin/env node
/**
 * Local preview for Math495/garden with extensionless URLs mapped to .html
 * (same behavior as `npx quartz build --serve`). Python's http.server does NOT
 * do this, so internal wiki links break with "Cannot GET" / SPA fetch errors.
 */
import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const serveHandler = require("../quartz/node_modules/serve-handler/src/index.js")

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..", "Math495", "garden")
const PORT = Number(process.env.PORT) || 8765

if (!fs.existsSync(ROOT)) {
  console.error(`Missing ${ROOT}\nRun: bash scripts/build-math495-garden.sh`)
  process.exit(1)
}

const server = http.createServer(async (req, res) => {
  const rawUrl = req.url ?? "/"
  const search = rawUrl.includes("?") ? "?" + rawUrl.split("?")[1] : ""
  let fp = rawUrl.split("?")[0] ?? "/"

  const redirect = (loc) => {
    res.writeHead(302, { Location: loc })
    res.end()
  }

  const serve = async () => {
    await serveHandler(req, res, {
      public: ROOT,
      directoryListing: false,
    })
  }

  // Mirror quartz/cli/handlers.js so pretty links resolve like production hosts.
  if (fp.endsWith("/")) {
    const indexFp = path.posix.join(fp, "index.html")
    if (fs.existsSync(path.join(ROOT, indexFp))) {
      req.url = fp + search
      return serve()
    }
    let base = fp.slice(0, -1)
    if (path.posix.extname(base) === "") {
      base += ".html"
    }
    if (fs.existsSync(path.join(ROOT, base))) {
      return redirect(fp.slice(0, -1))
    }
  } else {
    let base = fp
    if (path.posix.extname(base) === "") {
      base += ".html"
    }
    if (fs.existsSync(path.join(ROOT, base))) {
      req.url = fp + search
      return serve()
    }
    const indexFp = path.posix.join(fp, "index.html")
    if (fs.existsSync(path.join(ROOT, indexFp))) {
      return redirect(fp + "/")
    }
  }

  await serve()
})

server.listen(PORT, () => {
  console.log(`Garden preview (wiki links work): http://127.0.0.1:${PORT}/Math495/index.html`)
})
