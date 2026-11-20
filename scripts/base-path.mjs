/**
 * Nakon izgradnje za pregled na podadresi (GitHub Pages, BASE_PATH=/ardor-web):
 * apsolutne putanje "/img/…", "/namjestaj/…" u HTML/CSS/JS dobiju prefiks, a robots.txt zabrani indeksiranje.
 * Na pravoj domeni (BASE_PATH prazan) skripta ne radi ništa.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = (process.env.BASE_PATH || '').replace(/\/$/, '')
if (!base) process.exit(0)
if (!/^\/[a-z0-9-]+$/i.test(base)) throw new Error('BASE_PATH mora biti oblika /ime-repoa')
const name = base.slice(1)
const dist = fileURLToPath(new URL('../dist/', import.meta.url))

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (/\.(html|css|js)$/.test(e.name)) yield p
  }
}

// "/x", ali ne "//x" (vanjske adrese) i ne ono što već počinje s base.
const attr = new RegExp(`((?:href|src|action)=["'\`])/(?!/|${name}/)`, 'g')
const css = new RegExp(`url\\(/(?!/|${name}/)`, 'g')
const pages = 'img|fonts|namjestaj|namjestaj-po-mjeri|kontakt|savjetnik|inspiracija|akcije|o-nama|placanje-na-rate|privatnost|kolacici'
const str = new RegExp(`(['"\`])/(${pages})/`, 'g')

let n = 0
for await (const f of walk(dist)) {
  const s = await readFile(f, 'utf8')
  let o = s.replace(attr, `$1${base}/`).replace(css, `url(${base}/`)
  if (/\.(js|html)$/.test(f)) o = o.replace(str, `$1${base}/$2/`)
  if (o !== s) {
    await writeFile(f, o)
    n++
  }
}
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
await writeFile(join(dist, '.nojekyll'), '')
console.log(`[base-path] ${base}: izmijenjeno ${n} datoteka, robots.txt = zabrana indeksiranja`)
