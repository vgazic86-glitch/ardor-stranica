/**
 * Sadržaj koji zaposlenici uređuju u ARDOR aplikaciji (Web stranica → Tekstovi na webu / Članci).
 * Preuzima ga scripts/sync-cms.mjs prije izgradnje u src/data/cms.json; bez toga vrijede zadani tekstovi u stranicama.
 */
import type { WebProduct } from './catalog'

export interface CmsArticle {
  slug: string
  title: string
  summary: string
  theme: string
  room: string
  image: string
  date: string
  readMin: number
  html: string
}

interface Cms {
  products?: WebProduct[]
  texts?: Record<string, string>
  articles?: CmsArticle[]
}

const files = import.meta.glob<Cms>('./cms.json', { eager: true, import: 'default' })
const data: Cms = Object.values(files)[0] ?? {}

/** Tekst iz aplikacije ili zadani tekst (ako aplikacija nije dostupna). */
export const t = (key: string, fallback: string) => {
  const v = data.texts?.[key]
  return v === undefined || v === '' ? fallback : v
}

/** Odlomci (prazan red = novi odlomak). */
export const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

export const cmsProducts = data.products ?? []
export const cmsArticles = data.articles ?? []

/** Obavijest na vrhu (traka); nestaje nakon datuma „do” — i bez nove izgradnje, skriptom u pregledniku. */
export const bar = {
  text: data.texts?.['traka.tekst'] ?? '',
  link: data.texts?.['traka.link'] ?? '',
  until: data.texts?.['traka.do'] ?? '',
}

/** Domaći broj → +387…: „051 433 750” → „+38751433750”. */
export function intl(phone: string) {
  let d = phone.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  else if (d.startsWith('0')) d = `387${d.slice(1)}`
  return d
}
