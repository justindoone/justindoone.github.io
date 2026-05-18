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
    order: z.number().default(99),
    accent: z.string().default('#b34a2a'),
    cover: z.string().optional(),
  }),
});

export const collections = { work };
