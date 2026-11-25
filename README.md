# ARDOR — javna web stranica (ardornamjestaj.com)

Statična stranica (Astro 7) koja katalog, dostupnost i akcije čita iz ARDOR aplikacije, a upite šalje natrag u aplikaciju (stranica „Web stranica” u aplikaciji).

## Naredbe

```bash
pnpm install
pnpm sync       # preuzmi sadržaj iz aplikacije (src/data/cms.json, public/cms/)
pnpm dev        # http://localhost:4321 — bez preuzetog sadržaja: zadani tekstovi i primjerni katalog
pnpm build      # statične stranice u dist/
pnpm preview    # pregled izgrađenog dist/
```

## Postavke (varijable okruženja)

| Varijabla | Značenje |
| --- | --- |
| `ARDOR_API_URL` | adresa aplikacije za izgradnju: `scripts/sync-cms.mjs` preuzme katalog, tekstove i članke (CMS u aplikaciji: Web stranica → Tekstovi na webu / Članci) i fotografije u `public/cms/`. Npr. `https://app.ardornamjestaj.com`. Prazno = zadani tekstovi i primjerni katalog. |
| `PUBLIC_ARDOR_API_URL` | ista adresa, koristi je preglednik (obrasci, AI savjetnik, pitanja o materijalima). |
| `PUBLIC_GA4_ID` | Google Analytics 4 (`G-…`). Prazno = isključeno. Pali se tek nakon pristanka na kolačiće. |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel. Prazno = isključeno. Samo uz „Prihvati sve”. |

## Struktura

```
src/data/site.ts        podaci firme, meni, prostorije (SEO naslovi, opisi, vodiči za kupce)
src/data/catalog.ts     katalog iz API-ja (GET /api/web/katalog) ili primjerni katalog
src/content/inspiracija članci (Markdown) — „Inspiracija i savjeti”
src/layouts/Base.astro  zaglavlje, podnožje, SEO (canonical, Open Graph, schema.org FurnitureStore), kolačići
src/scripts/site.ts     tema, animacije, brzi kontakt, kolačići, GA4/Meta s Consent Mode
src/components/         LeadForm (ponuda/posjet/mjerenje + fotografije), Advisor (AI savjetnik), MaterialsAsk, Catalog …
public/_redirects       stare adrese (*.html, novost.php) → nove (301)
```

## Objava (Cloudflare Pages — preporuka)

1. Repo na GitHub (privatni), npr. `ardor-web`.
2. Cloudflare → Workers & Pages → Create → Pages → poveži repo. Build: `pnpm build`, izlaz `dist`, varijable iz tablice gore.
3. Pages → Settings → Builds → **Deploy hook** → kopiraj adresu u Render (aplikacija) kao `WEB_DEPLOY_HOOK`. Nakon izmjene artikla na webu aplikacija sama pokrene novu izgradnju (za 2 min).
4. Dok domena nije prebačena, privremenu adresu (`https://<ime>.pages.dev`) upiši u Render kao `WEB_ORIGINS`, da obrasci rade.
5. Domena: Custom domains → `www.ardornamjestaj.com` i `ardornamjestaj.com`. **Prije prebacivanja DNS-a provjeri MX zapise (e-pošta) i Resend zapise** — moraju ostati isti.
6. Cijene i dostupnost se mijenjaju i bez izmjene na webu — preporuka: dnevna izgradnja (Cloudflare cron ili GitHub Action koji pozove deploy hook, npr. svaki dan u 6:00).

Napomena: aplikacija je na besplatnom Render planu koji „zaspi”; prvi upit nakon pauze može čekati do ~1 min. Za brz obrazac i AI preporučuje se plaćeni Render plan.
