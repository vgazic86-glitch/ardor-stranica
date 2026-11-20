// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// BASE_PATH: za pregled na GitHub Pages (npr. "/ardor-web"); na pravoj domeni ostaje "/".
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  site: 'https://www.ardornamjestaj.com',
  base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
})
