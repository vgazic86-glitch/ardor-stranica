/** Košarica (samo u pregledniku, localStorage). Cijene su informativne — narudžbu računa ARDOR aplikacija. */
import { store } from './site'

export interface CartLine { id: string; qty: number; name: string; price: number; img: string; url: string }

const KEY = 'ardor.web.kosarica'
export const MAX_QTY = 20

export function readCart(): CartLine[] {
  try {
    const v = JSON.parse(store.get(KEY) || '[]')
    return Array.isArray(v) ? v.filter((l) => l && typeof l.id === 'string' && l.qty > 0) : []
  } catch { return [] }
}

export function writeCart(lines: CartLine[]) {
  store.set(KEY, JSON.stringify(lines.filter((l) => l.qty > 0).slice(0, 20)))
  document.dispatchEvent(new CustomEvent('ardor:kosarica'))
}

export function addToCart(line: Omit<CartLine, 'qty'>, qty = 1) {
  const lines = readCart()
  const old = lines.find((l) => l.id === line.id)
  if (old) Object.assign(old, line, { qty: Math.min(MAX_QTY, old.qty + qty) })
  else lines.push({ ...line, qty: Math.min(MAX_QTY, qty) })
  writeCart(lines)
}

export const cartCount = () => readCart().reduce((s, l) => s + l.qty, 0)

/** Broj na ikoni košarice u zaglavlju (skrivena dok je prazna). */
export function initCartBadge() {
  const paint = () => {
    const n = cartCount()
    document.querySelectorAll<HTMLElement>('.cart-btn').forEach((b) => {
      b.hidden = n === 0 && !location.pathname.startsWith('/kosarica')
      const c = b.querySelector('.cart-n'); if (c) c.textContent = String(n)
      b.setAttribute('aria-label', n ? `Košarica: ${n} kom` : 'Košarica')
    })
  }
  paint()
  document.addEventListener('ardor:kosarica', paint)
  addEventListener('storage', (e) => { if (e.key === KEY) paint() })
}
