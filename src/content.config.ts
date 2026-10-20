import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['journal', 'guide', 'news']),
    tags: z.array(z.string()).default([]),
    // true면 사이트에 나오지 않습니다 (자동 작성 초안 검토용)
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
