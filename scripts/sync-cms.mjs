/**
 * Prije izgradnje: preuzmi sadržaj iz ARDOR aplikacije (katalog, tekstovi, članci) i sve fotografije.
 *   ARDOR_API_URL=https://ardor-4mdu.onrender.com node scripts/sync-cms.mjs
 * Rezultat: src/data/cms.json + public/cms/*.jpg (fotografije se poslužuju s weba, ne s aplikacije,
 * pa stranica radi brzo i kad aplikacija „spava”).
 * Bez adrese ili ako aplikacija ne odgovori: ostaje zadnji preuzeti sadržaj, odnosno zadani tekstovi.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const dataFile = new URL('../src/data/cms.json', import.meta.url)
const imgDir = new URL('../public/cms/', import.meta.url)
for (const l of existsSync('.env') ? readFileSync('.env', 'utf8').split(/\r?\n/) : []) {
  const m = l.match(/^(\w+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const base = (process.env.ARDOR_API_URL || '').replace(/\/$/, '')

const keep = (why) => {
  console.log(`[cms] ${why} — ${existsSync(dataFile) ? 'ostaje zadnji preuzeti sadržaj' : 'koriste se zadani tekstovi i primjerni katalog'}.`)
  if (!existsSync(dataFile)) writeFileSync(dataFile, '{}\n')
}

async function get(path) {
  // Render (besplatni plan) se budi do minute — zato dugo čekanje i jedan ponovni pokušaj.
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(base + path, { signal: AbortSignal.timeout(90_000) })
      if (r.ok) return await r.json()
      console.log(`[cms] ${path}: HTTP ${r.status}`)
    } catch (e) {
      console.log(`[cms] ${path}: ${e.message}`)
    }
  }
  return null
}

if (!base) keep('ARDOR_API_URL nije postavljen')
else {
  const [kat, sad] = await Promise.all([get('/api/web/katalog'), get('/api/web/sadrzaj')])
  if (!kat || !sad || sad.error) keep('aplikacija nije odgovorila')
  else {
    mkdirSync(imgDir, { recursive: true })
    const done = new Map()
    /** Preuzmi fotografiju i vrati lokalnu adresu (/cms/p12.jpg). */
    const local = async (url) => {
      if (!url) return ''
      if (done.has(url)) return done.get(url)
      const m = /\/api\/web\/(slike|mediji)\/(\d+)/.exec(url)
      if (!m) return ''
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) }).catch(() => null)
      if (!r?.ok) return ''
      const ext = { 'image/webp': 'webp', 'image/png': 'png' }[r.headers.get('content-type')] ?? 'jpg'
      const name = `${m[1] === 'slike' ? 'p' : 'm'}${m[2]}.${ext}`
      writeFileSync(new URL(name, imgDir), Buffer.from(await r.arrayBuffer()))
      done.set(url, `/cms/${name}`)
      return `/cms/${name}`
    }
    const products = []
    for (const p of kat.products ?? []) {
      const images = (await Promise.all((p.images ?? []).map(local))).filter(Boolean)
      if (images.length) products.push({ ...p, images })
    }
    const texts = { ...sad.texts }
    for (const [k, v] of Object.entries(texts)) if (typeof v === 'string' && v.includes('/api/web/')) texts[k] = await local(v)
    const articles = []
    for (const a of sad.articles ?? []) articles.push({ ...a, image: await local(a.image) })
    writeFileSync(dataFile, JSON.stringify({ syncedAt: new Date().toISOString(), products, texts, articles }, null, 1) + '\n')
    console.log(`[cms] preuzeto: ${products.length} artikala, ${Object.keys(texts).length} tekstova, ${articles.length} članaka, ${done.size} fotografija.`)
  }
}
