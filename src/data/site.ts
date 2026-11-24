/** Podaci o firmi, kontakti i prostorije — jedno mjesto za sve stranice. Telefoni i radno vrijeme dolaze iz aplikacije (cms.ts). */
import { intl, t } from './cms'

const PHONE = t('kontakt.telefon', '051 433 750')
const MOBILE = t('kontakt.mobitel', '065 436 420')
const span = (v: string) => /^(\d{1,2})[:.](\d{2})\s*[–-]\s*(\d{1,2})[:.](\d{2})$/.exec(v.trim())
const pad = (x: string) => x.padStart(2, '0')
const hour = (label: string, value: string, days: string[]) => {
  const m = span(value)
  return { label, value, days, opens: m ? `${pad(m[1])}:${m[2]}` : '', closes: m ? `${pad(m[3])}:${m[4]}` : '' }
}
const HOURS = [
  hour('Radni dan', t('kontakt.radni', '08:00 – 20:30'), ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  hour('Subota', t('kontakt.subota', '08:00 – 19:00'), ['Saturday']),
  hour('Nedjelja', t('kontakt.nedjelja', 'Zatvoreno'), ['Sunday']),
]


export const SITE = {
  name: 'ARDOR namještaj',
  legal: 'ARDOR namještaj d.o.o.',
  url: 'https://www.ardornamjestaj.com',
  street: 'Vojvode Pere Krece 21',
  zip: '78000',
  city: 'Banja Luka',
  country: 'BA',
  phone: PHONE,
  phoneHref: `tel:+${intl(PHONE)}`,
  mobile: MOBILE,
  mobileHref: `tel:+${intl(MOBILE)}`,
  whatsapp: `https://wa.me/${intl(MOBILE)}`,
  viber: `viber://chat?number=%2B${intl(MOBILE)}`,
  mapUrl: 'https://maps.google.com/?q=Vojvode+Pere+Krece+21+Banja+Luka',
  mapEmbed: 'https://maps.google.com/maps?q=Vojvode%20Pere%20Krece%2021%2C%20Banja%20Luka&z=15&output=embed',
  hours: HOURS,
  emails: [
    { label: 'Prodaja', value: 'prodaja@ardornamjestaj.com' },
    { label: 'Namještaj po mjeri', value: 'proizvodnja@ardornamjestaj.com' },
    { label: 'Informacije', value: 'info@ardornamjestaj.com' },
    { label: 'Nabava', value: 'nabava@ardornamjestaj.com' },
    { label: 'Marketing', value: 'marketing@ardornamjestaj.com' },
    { label: 'Uprava', value: 'uprava@ardornamjestaj.com' },
  ],
  facebook: 'https://www.facebook.com/ardorbanjaluka/',
  instagram: 'https://www.instagram.com/ardornamjestaj/',
  founded: 1996,
}

export const NAV = [
  { href: '/namjestaj-po-mjeri/', label: 'Po mjeri' },
  { href: '/namjestaj/', label: 'Katalog' },
  { href: '/akcije/', label: 'Akcije' },
  { href: '/savjetnik/', label: 'AI savjetnik' },
  { href: '/inspiracija/', label: 'Inspiracija' },
  { href: '/o-nama/', label: 'O nama' },
  { href: '/kontakt/', label: 'Kontakt' },
]

export type RoomKey =
  | 'dnevni-boravak' | 'spavaca-soba' | 'kuhinja' | 'trpezarija' | 'djecja-soba'
  | 'hodnik' | 'ured' | 'ormari-i-plakari' | 'lezajevi-i-madraci'

export interface Room {
  key: RoomKey
  name: string
  short: string
  img?: string
  imgPos?: string
  title: string
  description: string
  h1: string
  intro: string
  guide: { q: string; a: string }[]
}

export const ROOMS: Room[] = [
  {
    key: 'dnevni-boravak', name: 'Dnevni boravak', short: 'Garniture, ugaone, regali, stolići', img: 'aden',
    title: 'Garniture i ugaone garniture Banja Luka | ARDOR',
    description: 'Ugaone garniture, trosjedi na razvlačenje i relax fotelje — isprobaj u salonu. Tkanine po izboru, dostava i montaža, plaćanje na rate.',
    h1: 'Garniture u kojima se stvarno sjedi.',
    intro: 'Ugaone garniture sa sanducima za posteljinu, trosjedi na razvlačenje za goste, relax fotelje i regali. Svaku garnituru možeš isprobati u salonu, a većinu dobiti u tkanini i boji po izboru — bez straha da neće pristajati uz tvoj pod.',
    guide: [
      { q: 'Kolika garnitura stane u moj dnevni boravak?', a: 'Između garniture i stolića ostavi 40–50 cm, a za prolaz barem 80 cm. Ugaona garnitura najbolje radi kad je dnevni boravak veći od 16 m² — u manjem prostoru biraj trosjed i fotelju na nogicama.' },
      { q: 'Koja tkanina je najotpornija?', a: 'Za djecu i kućne ljubimce biraj tkanine s easy-clean zaštitom ili mikrovlakna — mrlje se skidaju vodom. Baršun izgleda luksuzno, ali traži više njege.' },
      { q: 'Mogu li garnituru dobiti u drugoj boji?', a: 'Većinu modela da: u salonu imamo kataloge tkanina, a rok za izradu po narudžbi je obično 4–6 sedmica.' },
    ],
  },
  {
    key: 'spavaca-soba', name: 'Spavaća soba', short: 'Kreveti, ormari, komode', img: 'akustik',
    title: 'Spavaće sobe i kreveti Banja Luka | ARDOR namještaj',
    description: 'Kompletne spavaće sobe, kreveti s podizanjem, ormari i komode. Pogledaj u salonu ili zatraži ponudu po mjeri.',
    h1: 'Spavaća soba u kojoj se odmara i oko.',
    intro: 'Kompletne spavaće sobe, tapecirani kreveti, kreveti s podizanjem za posteljinu, ormari s kliznim vratima i komode. Ako gotov ormar ne stane, napravit ćemo ga po mjeri u našem pogonu.',
    guide: [
      { q: 'Koliko mjesta ostaviti oko kreveta?', a: 'Sa strana barem 60 cm, ispred ormara s krilnim vratima 90 cm. Ako je soba uska, klizna vrata štede oko 60 cm.' },
      { q: 'Krevet 160 ili 180 cm?', a: 'Za par je 160 cm minimum, 180 cm ako spavate nemirno ili imate dijete koje dolazi ujutro. Provjeri da ostane 60 cm sa strana.' },
    ],
  },
  {
    key: 'kuhinja', name: 'Kuhinja', short: 'Po mjeri: akril, MDF, iverica', img: 'bianca',
    title: 'Kuhinje po mjeri Banja Luka — akril, MDF, iverica | ARDOR',
    description: 'Kuhinja tačno po tvom prostoru: akrilni visoki sjaj, lakirani MDF ili dekori drveta. Besplatno mjerenje i 3D prijedlog u Banjoj Luci.',
    h1: 'Kuhinja koja prati tvoj način kuhanja.',
    intro: 'Svaku kuhinju radimo po mjeri u našem pogonu: dolazimo na mjerenje, crtamo 3D prijedlog i montiramo. Biraš frontove, boje, radnu plohu, okove i rasvjetu.',
    guide: [
      { q: 'Koliko traje izrada kuhinje po mjeri?', a: 'Od potvrde nacrta obično 3–5 sedmica, ovisno o materijalu. Tačan rok dobiješ uz ponudu.' },
      { q: 'Akril ili lakirani MDF?', a: 'Akril daje dubok sjaj i lako se briše, povoljniji je. Lakirani MDF može biti u bilo kojoj boji i s profilima, mat ili sjaj.' },
    ],
  },
  {
    key: 'trpezarija', name: 'Trpezarija', short: 'Stolovi i stolice', img: 'provance', imgPos: '50% 80%',
    title: 'Trpezarijski stolovi i stolice Banja Luka | ARDOR',
    description: 'Stolovi na razvlačenje, stolice i trpezarijski setovi. Pogledaj u salonu, dostava i montaža u cijeloj BiH.',
    h1: 'Sto oko kojeg se okuplja porodica.',
    intro: 'Stolovi na razvlačenje za nedjeljne ručkove, udobne stolice i komode za posuđe. Pomoći ćemo ti izabrati veličinu prema prostoru i broju ukućana.',
    guide: [
      { q: 'Kolik sto za 6 osoba?', a: 'Pravokutni barem 160 × 90 cm, okrugli promjera 120–130 cm. Iza stolice ostavi 70–90 cm do zida.' },
    ],
  },
  {
    key: 'djecja-soba', name: 'Dječja soba', short: 'Raste zajedno s djetetom', img: 'job',
    title: 'Dječje sobe i kreveti za djecu Banja Luka | ARDOR',
    description: 'Dječje sobe koje rastu s djetetom: kreveti, radni stolovi, ormari sa zaobljenim rubovima. Savjet i dostava s montažom.',
    h1: 'Soba koja raste zajedno s djetetom.',
    intro: 'Kreveti 90 i 120 cm, ormari i radni stolovi sa zaobljenim rubovima, ladičari za igračke. Sve se pričvršćuje za zid pri montaži.',
    guide: [
      { q: 'Kada prijeći na veći krevet?', a: 'Krevet 120 × 200 cm traje od vrtića do kraja srednje škole — najčešće je to najisplativiji izbor.' },
    ],
  },
  {
    key: 'hodnik', name: 'Hodnik', short: 'Predsoblja i komode',
    title: 'Predsoblja, komode i plakari za hodnik | ARDOR Banja Luka',
    description: 'Predsoblja, cipelarnici i plakari za hodnik, i za najuže prostore — po mjeri iz našeg pogona.',
    h1: 'Prvi dojam doma počinje u hodniku.',
    intro: 'Predsoblja s ogledalom, cipelarnici, komode i plakari plitke dubine za uske hodnike. Ako ništa gotovo ne stane — mjerimo i radimo po mjeri.',
    guide: [
      { q: 'Plakar u uskom hodniku?', a: 'Za hodnik do 120 cm širine biraj dubinu 35–40 cm i klizna vrata s ogledalom — stane jakna i usisivač, a hodnik optički izgleda šire.' },
    ],
  },
  {
    key: 'ured', name: 'Ured', short: 'Kancelarijski program',
    title: 'Kancelarijski namještaj Banja Luka | ARDOR',
    description: 'Radni stolovi, uredske stolice i ormari za ured i rad od kuće. Opremanje poslovnih prostora uz ponudu po mjeri.',
    h1: 'Radni prostor u kojem se dobro radi.',
    intro: 'Radni stolovi, ergonomske stolice, ormari za dokumentaciju i konferencijski stolovi. Opremamo i cijele poslovne prostore — zatraži ponudu.',
    guide: [
      { q: 'Kakav stol za rad od kuće?', a: 'Barem 140 × 70 cm, okomito na prozor da ekran nema odsjaj. Uz to stolica s podesivim naslonom i rukonaslonima.' },
    ],
  },
  {
    key: 'ormari-i-plakari', name: 'Ormari i plakari', short: 'Ugradbeni, po tvojim mjerama', img: 'chilly', imgPos: '85% 50%',
    title: 'Ugradbeni plakari i ormari po mjeri Banja Luka | ARDOR',
    description: 'Plakari od poda do stropa, prilagođeni tvojim dimenzijama. Klizna vrata, ogledala, unutrašnji raspored po želji. Mjerenje besplatno.',
    h1: 'Plakari prilagođeni tvojim dimenzijama — od poda do stropa.',
    intro: 'Ugradbeni plakar ne skuplja prašinu odozgo, koristi i zadnjih 20 cm do stropa i stane i u nišu u koju ništa gotovo ne stane. Klizna ili krilna vrata, ogledala, unutrašnji raspored po tvom popisu stvari.',
    guide: [
      { q: 'Klizna ili krilna vrata?', a: 'Klizna štede prostor ispred ormara (oko 60 cm), krilna daju pristup cijeloj unutrašnjosti odjednom. U uskim sobama i hodnicima — klizna.' },
    ],
  },
  {
    key: 'lezajevi-i-madraci', name: 'Ležajevi i madraci', short: 'Studio spavanja', img: 'galeri',
    title: 'Madraci i kreveti Banja Luka — studio spavanja | ARDOR',
    description: 'Madraci i jastuci vodećih proizvođača. Legni prije nego kupiš i odaberi čvrstoću uz savjet stručnjaka.',
    h1: 'Studio spavanja: legni prije nego kupiš.',
    intro: 'Madraci i jastuci vodećih proizvođača, kreveti s podizanjem i tapecirani boks kreveti. Pomoći ćemo ti odabrati čvrstoću prema položaju u kojem spavaš — i prema onome tko spava pored tebe.',
    guide: [
      { q: 'Koji madrac odabrati?', a: 'Ako spavaš na boku — srednje mekan s memorijskom pjenom. Na leđima ili stomaku — čvršći. Za parove s razlikom težine preko 30 kg: džepičaste opruge koje ne prenose pokret.' },
    ],
  },
]

export const roomByKey = (k: string) => ROOMS.find((r) => r.key === k)

export const STYLES = { moderni: 'Moderni', skandinavski: 'Skandinavski', klasicni: 'Klasični', industrijski: 'Industrijski' } as const
export const COLORS = { svijetla: 'Svijetla / bijela', drvo: 'Drvo', tamna: 'Tamna / antracit', boja: 'U boji' } as const
export const MATERIALS = { tkanina: 'Tkanina', iverica: 'Iverica', mdf: 'MDF / akril', masiv: 'Masivno drvo' } as const

/** Cijena u KM, ručno (bez Intl — isti tekst svugdje). */
export const km = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' KM'
