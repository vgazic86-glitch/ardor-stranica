import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/** Članci „Inspiracija i savjeti”. Kasnije ih piše/odobrava modul Web u ARDOR aplikaciji. */
const inspiracija = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/inspiracija' }),
  schema: z.object({
    naslov: z.string(),
    opis: z.string().max(160),
    tema: z.string(),
    citanje: z.number(),
    slika: z.string(),
    datum: z.coerce.date(),
    autor: z.string().default('ARDOR dizajn tim'),
    prostorija: z.string().optional(),
  }),
})

export const collections = { inspiracija }
