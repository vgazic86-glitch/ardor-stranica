/** Zajedničko ponašanje svih stranica: tema, meni, animacije, brzi kontakt, kolačići i analitika. */

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[]

export const store = {
  get(k: string) { try { return localStorage.getItem(k) } catch { return null } },
  set(k: string, v: string) { try { localStorage.setItem(k, v) } catch { /* privatni prozor */ } },
}

declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: ((...a: unknown[]) => void) & { q?: unknown[] }; ardorTrack: typeof track }
}

/** Događaj za GA4 i Meta (šalje se samo ako je posjetitelj pristao). */
export function track(name: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', name, params)
  const meta: Record<string, string> = { upit_poslan: 'Lead', posjet_zakazan: 'Schedule', mjerenje_zakazano: 'Schedule', poziv: 'Contact', viber: 'Contact', whatsapp: 'Contact' }
  if (meta[name]) window.fbq?.('track', meta[name], params)
}

function loadAnalytics() {
  const ga4 = $<HTMLMetaElement>('meta[name="ardor-ga4"]')?.content
  const pixel = $<HTMLMetaElement>('meta[name="ardor-pixel"]')?.content
  if (ga4 && !window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' })
    window.gtag('js', new Date())
    window.gtag('config', ga4)
    const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`; document.head.append(s)
  }
  const consent = store.get('ardor.web.kolacici')
  if (window.gtag) {
    const g = consent === 'sve' ? 'granted' : 'denied'
    window.gtag('consent', 'update', { ad_storage: g, ad_user_data: g, ad_personalization: g, analytics_storage: g })
  }
  if (pixel && consent === 'sve' && !window.fbq) {
    // Standardni Meta Pixel učitavač (isti kao Metin isječak, samo čitljiv).
    type Fbq = ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; push: unknown; loaded: boolean; version: string }
    const fb = function (...a: unknown[]) { if (fb.callMethod) fb.callMethod(...a); else fb.queue.push(a) } as Fbq
    fb.push = fb; fb.loaded = true; fb.version = '2.0'; fb.queue = []
    window.fbq = fb
    const s = document.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.append(s)
    fb('init', pixel); fb('track', 'PageView')
  }
}

export function initSite() {
  window.ardorTrack = track
  const root = document.documentElement

  /* tema */
  const sun = '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
  const moon = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'
  const paint = () => { const i = $('#themeIcon'); if (i) i.innerHTML = root.dataset.theme === 'dark' ? sun : moon }
  paint()
  $('#themeBtn')?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    store.set('ardor.web.tema', root.dataset.theme)
    paint()
  })

  /* meni i parallax */
  const nav = $('#nav')!
  const hero = $('.hero')
  const heroImg = $<HTMLImageElement>('.hero-media img')
  const par = $$('[data-parallax]')
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 60 || !hero)
    if (heroImg && scrollY < innerHeight) heroImg.style.translate = `0 ${scrollY * 0.25}px`
    par.forEach((el) => { const r = el.getBoundingClientRect(); el.style.translate = `0 ${(r.top - innerHeight / 2) * -parseFloat(el.dataset.parallax || '0')}px` })
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll()
  const menu = $('#menu')!
  $('#burger')?.addEventListener('click', () => menu.classList.toggle('open'))
  $$('#menu a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('open')))

  /* pojavljivanje pri skrolanju */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12 })
  $$('.reveal, .steps-wrap').forEach((el) => io.observe(el))

  /* brojači */
  const co = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    co.unobserve(e.target)
    const el = e.target as HTMLElement, end = Number(el.dataset.count), start = end > 1900 && end < 2100 ? 1950 : 0, t0 = performance.now()
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1600); el.textContent = String(Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
  }), { threshold: 0.6 })
  $$('[data-count]').forEach((el) => co.observe(el))

  /* brzi kontakt */
  const fab = $('#fab')!
  $('#fabBtn')?.addEventListener('click', (e) => { fab.classList.toggle('open'); (e.currentTarget as HTMLElement).setAttribute('aria-expanded', String(fab.classList.contains('open'))) })
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLElement>('[data-ev]')
    if (a) track(a.dataset.ev!, { mjesto: location.pathname })
  })

  /* kolačići */
  const ck = $('#cookies')!
  if (!store.get('ardor.web.kolacici')) setTimeout(() => ck.classList.add('show'), 1500)
  ck.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-c]')
    if (!b) return
    store.set('ardor.web.kolacici', b.dataset.c!)
    ck.classList.remove('show')
    loadAnalytics()
  })
  $('#cookieSettings')?.addEventListener('click', (e) => { e.preventDefault(); ck.classList.add('show') })
  loadAnalytics()
}
