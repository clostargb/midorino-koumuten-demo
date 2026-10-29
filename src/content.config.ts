import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { WORK_CATEGORIES, NEWS_CATEGORIES, EMPLOYMENT_TYPES } from './lib/categories';

const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(40),
      date: z.coerce.date(),
      area: z.string().min(1),
      category: z.enum(WORK_CATEGORIES),
      cover: image(),
      coverAlt: z.string().min(1),
      summary: z.string().min(1).max(120),
    }),
});

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string().min(1).max(60),
    date: z.coerce.date(),
    category: z.enum(NEWS_CATEGORIES),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string().min(1).max(40),
    employment: z.enum(EMPLOYMENT_TYPES),
    open: z.boolean(),
    salary: z.string().min(1),
    summary: z.string().min(1).max(120),
  }),
});

export const collections = { works, news, jobs };
