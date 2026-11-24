/**
 * Katalog za web. Pri izgradnji ga scripts/sync-cms.mjs preuzme iz ARDOR aplikacije (GET /api/web/katalog)
 * zajedno s fotografijama. Bez aplikacije koristi primjerni katalog ispod (da se stranica uvijek može izgraditi).
 */
import type { RoomKey } from './site'
import { cmsProducts } from './cms'

export interface WebProduct {
  id: string
  slug: string
  name: string
  type: string
  room: RoomKey
  style: 'moderni' | 'skandinavski' | 'klasicni' | 'industrijski'
  color: 'svijetla' | 'drvo' | 'tamna' | 'boja'
  material: 'tkanina' | 'iverica' | 'mdf' | 'masiv'
  avail: 'stanje' | 'narudzba'
  price: number
  oldPrice?: number
  images: string[]
  dimensions: string
  materials: string
  personal: string
  description: string
  swatches: string[]
  featured?: boolean
}

const SAMPLE: WebProduct[] = [
  { id: 's1', slug: 'grande-garnitura', name: 'Grande', type: 'Garnitura 3+2+1', room: 'dnevni-boravak', style: 'moderni', color: 'svijetla', material: 'tkanina', avail: 'stanje', price: 3290, images: ['/img/grande.jpg', '/img/aden.jpg'], swatches: ['#E8E2D8', '#B9B2A6', '#C29A52'], dimensions: 'trosjed 232 × 95 × 84 cm', materials: 'tkanina otporna na mrlje, metalne nogice', personal: 'Izbor od 40+ tkanina, trosjed na razvlačenje.', description: 'Svijetla garnitura s prošivenim naslonom i metalnim nogicama — dovoljno elegantna za goste, dovoljno izdržljiva za svaki dan.', featured: true },
  { id: 's2', slug: 'isabel-lux-garnitura', name: 'Isabel Lux', type: 'Garnitura', room: 'dnevni-boravak', style: 'klasicni', color: 'tamna', material: 'tkanina', avail: 'narudzba', price: 2790, oldPrice: 3490, images: ['/img/isabel.jpg'], swatches: ['#6C513C', '#C7A57B'], dimensions: 'trosjed 220 × 92 × 88 cm', materials: 'baršunasta tkanina, drvena konstrukcija', personal: 'Tri boje tkanine, opcija ležaja.', description: 'Topli smeđi tonovi i zlatni detalji za klasičan dnevni boravak.', featured: true },
  { id: 's3', slug: 'aden-s-ugaona-garnitura', name: 'Aden S', type: 'Ugaona garnitura', room: 'dnevni-boravak', style: 'moderni', color: 'boja', material: 'tkanina', avail: 'stanje', price: 2450, images: ['/img/aden.jpg', '/img/grande.jpg'], swatches: ['#5E8C95', '#E8E2D8'], dimensions: '290 × 205 cm', materials: 'tkanina, sanduk za posteljinu', personal: 'Lijevi ili desni ugao, funkcija spavanja.', description: 'Ugaona garnitura u petrolej plavoj, s ležajem i sandukom.', featured: true },
  { id: 's4', slug: 'aruba-ii-megasofa', name: 'Aruba II', type: 'Megasofa', room: 'dnevni-boravak', style: 'moderni', color: 'tamna', material: 'tkanina', avail: 'narudzba', price: 1990, images: ['/img/aruba.jpg'], swatches: ['#5A5550', '#F0EDE8'], dimensions: 'Ø 200 cm', materials: 'eko koža i tkanina', personal: 'Kombinacije boja okvira i sjedišta.', description: 'Okrugla megasofa za filmske večeri.' },
  { id: 's5', slug: 'grace-relax-fotelja', name: 'Grace', type: 'Relax fotelja', room: 'dnevni-boravak', style: 'skandinavski', color: 'tamna', material: 'tkanina', avail: 'stanje', price: 890, images: ['/img/grace.jpg'], swatches: ['#45474A', '#C8C3BB'], dimensions: '80 × 85 × 105 cm', materials: 'tkanina, okretno metalno postolje', personal: 'Tabure uključen, 3 boje.', description: 'Relax fotelja s taburom i okretnim postoljem.' },
  { id: 's6', slug: 'akustik-spavaca-soba', name: 'Akustik', type: 'Spavaća soba', room: 'spavaca-soba', style: 'industrijski', color: 'drvo', material: 'iverica', avail: 'narudzba', price: 4290, images: ['/img/akustik.jpg'], swatches: ['#7A5534', '#3A3734'], dimensions: 'krevet 160 × 200, ormar 220 cm', materials: 'oplemenjena iverica, tapecirano uzglavlje', personal: 'Ormar s 2 ili 3 klizna krila.', description: 'Tamno drvo i tapecirano uzglavlje — spavaća soba s karakterom.', featured: true },
  { id: 's7', slug: 'natalee-spavaca-soba', name: 'Natalee', type: 'Spavaća soba', room: 'spavaca-soba', style: 'klasicni', color: 'svijetla', material: 'mdf', avail: 'narudzba', price: 5190, images: ['/img/natalee.jpg', '/img/balat.jpg'], swatches: ['#F3EFE8', '#A9A49B'], dimensions: 'ormar 5 vrata, krevet 160 × 200', materials: 'MDF frontovi, ogledalo', personal: 'Tapecirano uzglavlje u 4 tkanine.', description: 'Romantična bijela spavaća soba s ormarom od 5 vrata.' },
  { id: 's8', slug: 'chilly-spavaca-soba', name: 'Chilly', type: 'Spavaća soba s ormarom', room: 'ormari-i-plakari', style: 'moderni', color: 'drvo', material: 'iverica', avail: 'stanje', price: 2890, images: ['/img/chilly.jpg'], swatches: ['#6B4A31', '#2E2B28'], dimensions: 'ormar 250 × 215 cm', materials: 'iverica, klizna vrata', personal: 'Moguća izvedba po mjeri iz pogona.', description: 'Veliki ormar s kliznim vratima u dekoru drveta.' },
  { id: 's9', slug: 'bianca-kuhinja', name: 'Bianca', type: 'Kuhinja po mjeri', room: 'kuhinja', style: 'moderni', color: 'svijetla', material: 'mdf', avail: 'narudzba', price: 4800, images: ['/img/bianca.jpg'], swatches: ['#F7F6F3', '#6B5A4A'], dimensions: 'po tvojim mjerama · primjer 330 × 180 cm', materials: 'akrilna iverica 18,6 mm, visoki sjaj', personal: 'Sve dimenzije, boje, okovi i rasvjeta.', description: 'Bijela kuhinja visokog sjaja — optički povećava i manji prostor.', featured: true },
  { id: 's10', slug: 'chamomix-kuhinja', name: 'Chamomix', type: 'Kuhinja po mjeri', room: 'kuhinja', style: 'skandinavski', color: 'drvo', material: 'iverica', avail: 'narudzba', price: 3900, images: ['/img/chamomix.jpg'], swatches: ['#D9CFC1', '#4A3B30'], dimensions: 'po tvojim mjerama · primjer 300 cm', materials: 'oplemenjena iverica 18 mm', personal: 'Ručke ili push-to-open sistem.', description: 'Kombinacija kapućino i tamnih donjih elemenata.' },
  { id: 's11', slug: 'provance-kuhinja', name: 'Provance', type: 'Kuhinja', room: 'kuhinja', style: 'klasicni', color: 'svijetla', material: 'masiv', avail: 'stanje', price: 3450, images: ['/img/provance.jpg', '/img/sycylia.jpg'], swatches: ['#F4F1EA', '#9D7A55'], dimensions: '260 × 60 cm', materials: 'MDF frontovi s profilom, drvena ploha', personal: 'Ploha u 3 dekora drveta.', description: 'Klasična bijela kuhinja s profiliranim frontovima.' },
  { id: 's12', slug: 'job-djecja-soba', name: 'Job', type: 'Dječja soba', room: 'djecja-soba', style: 'skandinavski', color: 'svijetla', material: 'iverica', avail: 'stanje', price: 1890, images: ['/img/job.jpg'], swatches: ['#F2EFEA', '#C3B9A9'], dimensions: 'krevet 120 × 200', materials: 'iverica, zaobljeni rubovi', personal: 'Dodatni ladičar ispod kreveta.', description: 'Svijetla soba koja raste s djetetom.' },
  { id: 's13', slug: 'galeri-krevet-s-podizanjem', name: 'Galeri', type: 'Krevet s podizanjem', room: 'lezajevi-i-madraci', style: 'moderni', color: 'svijetla', material: 'tkanina', avail: 'stanje', price: 1290, oldPrice: 1590, images: ['/img/galeri.jpg'], swatches: ['#D8D3CC', '#7A5A3E'], dimensions: '160 × 200 cm', materials: 'tapecirano, plinski amortizeri', personal: 'Madrac po izboru iz studija spavanja.', description: 'Tapecirani krevet s velikim prostorom za posteljinu.' },
  { id: 's14', slug: 'kan-kan-ugaona-garnitura', name: 'Kan Kan', type: 'Ugaona garnitura', room: 'dnevni-boravak', style: 'moderni', color: 'boja', material: 'tkanina', avail: 'narudzba', price: 1390, images: ['/img/kankan.jpg'], swatches: ['#B8C23A', '#6B5A44'], dimensions: '250 × 160 cm', materials: 'tkanina, funkcija spavanja', personal: '12 boja tkanine.', description: 'Vesela ugaona garnitura s funkcijom spavanja.' },
]

/** Katalog: preuzet iz aplikacije (scripts/sync-cms.mjs → cms.json), inače primjerni. */
export async function getCatalog(): Promise<{ products: WebProduct[]; source: 'api' | 'primjer' }> {
  // Primjeri (SAMPLE) se više ne prikazuju: web pokazuje samo artikle upisane u aplikaciji (Web stranica → Artikli na webu).
  return { products: cmsProducts, source: cmsProducts.length ? 'api' : 'primjer' }
}
