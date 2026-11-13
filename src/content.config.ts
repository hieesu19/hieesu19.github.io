import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    status: z.string().optional(),
    stack: z.string().optional(),
    author: z.string().optional(),
    bookTitle: z.string().optional(),
    tone: z.string().optional(),
    read: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
