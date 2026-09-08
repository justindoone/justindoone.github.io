import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    role: z.string(),
    date: z.string(),
    year: z.number(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    metrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .default([]),
    featured: z.boolean().default(false),
    // `hero` is a tier above `featured`: these are the only cases that get a
    // full-bleed panel on the homepage. Nine entries are `featured`, which
    // makes that flag a list filter rather than a front door — keep this set
    // to three so the panel band stays a choice instead of a catalogue.
    hero: z.boolean().default(false),
    hidden: z.boolean().default(false),
    order: z.number().default(99),
    accent: z.string().default('#b34a2a'),
    accentSecondary: z.string().optional(),
    cover: z.string().optional(),
    cardCover: z.string().optional(),
    // How the artwork sits inside a homepage panel. Panels are ~33vw by full
    // height, and a centre-crop at that ratio decapitates a wordmark (the
    // Greybrook lockup loses its last three letters), so flat brand covers
    // want 'contain' on the accent field. Reserve 'cover' for photography,
    // which crops anywhere without losing meaning.
    panelFit: z.enum(['cover', 'contain']).default('contain'),
    ogImage: z.string().optional(),
    video: z.string().optional(),
    socials: z
      .array(
        z.object({
          type: z.enum(['instagram', 'linkedin', 'facebook']),
          url: z.string(),
          caption: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { work };
