import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectTranslation = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
  problem: z.string(),
  contribution: z.string(),
  current: z.string(),
  bodyNote: z.string(),
  imageAlt: z.string().optional(),
});

const writingTranslation = z.object({
  title: z.string(),
  description: z.string(),
  bodyNote: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publication: z.enum(['public', 'draft']),
    status: z.string().min(1),
    source: z.enum(['open', 'private', 'mixed', 'not-applicable']),
    order: z.number(),
    problem: z.string(),
    contribution: z.string(),
    current: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    translations: z.record(z.string(), projectTranslation).optional(),
  }).superRefine((value, context) => {
    if (value.image && !value.imageAlt) {
      context.addIssue({ code: 'custom', path: ['imageAlt'], message: 'imageAlt is required when image is present' });
    }
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publication: z.enum(['public', 'draft']),
    publishedAt: z.coerce.date(),
    source: z.object({
      label: z.string(),
      url: z.url(),
      note: z.string(),
    }).optional(),
    translations: z.record(z.string(), writingTranslation).optional(),
  }),
});

export const collections = { projects, writing };
