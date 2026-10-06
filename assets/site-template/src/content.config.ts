import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const translatedLink = z.object({ label: z.string(), url: z.string().min(1) });
const briefRow = z.object({ label: z.string(), text: z.string() });
const fact = z.object({ value: z.string(), label: z.string() });

const projectTranslation = z.object({
  title: z.string().optional(),
  description: z.string(),
  imageAlt: z.string().optional(),
  brief: z.array(briefRow).min(2).max(3).optional(),
  facts: z.array(fact).max(4).optional(),
  factsNote: z.string().optional(),
  links: z.array(z.object({ label: z.string() })).optional(),
  bodyNote: z.string().optional(),
}).strict();

const writingTranslation = z.object({
  title: z.string().optional(),
  description: z.string(),
  imageAlt: z.string().optional(),
  sourceNote: z.string().optional(),
  bodyNote: z.string().optional(),
}).strict();

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number().int(),
    order: z.number(),
    publication: z.enum(['public', 'draft']),
    status: z.enum(['live', 'available', 'experimental', 'in-progress', 'historical', 'discontinued']),
    source: z.enum(['open', 'private', 'mixed', 'not-applicable']),
    category: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    brief: z.array(briefRow).min(2).max(3).optional(),
    facts: z.array(fact).max(4).optional(),
    factsNote: z.string().optional(),
    links: z.array(translatedLink).default([]),
    translation: projectTranslation.optional(),
  }).superRefine((value, context) => {
    if (value.image && !value.imageAlt) context.addIssue({ code: 'custom', path: ['imageAlt'], message: 'imageAlt is required when image is present' });
    if (value.facts?.length && !value.factsNote) context.addIssue({ code: 'custom', path: ['factsNote'], message: 'factsNote is required when facts are present' });
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    publication: z.enum(['public', 'draft']),
    tags: z.array(z.string()).default([]),
    readTime: z.number().int().positive().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    source: z.object({ label: z.string(), url: z.url(), note: z.string() }).optional(),
    translation: writingTranslation.optional(),
  }).superRefine((value, context) => {
    if (value.image && !value.imageAlt) context.addIssue({ code: 'custom', path: ['imageAlt'], message: 'imageAlt is required when image is present' });
  }),
});

const translations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/translations' }),
  schema: z.object({}),
});

export const collections = { projects, writing, translations };
