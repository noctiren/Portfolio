// Content collections. Case studies live in src/content/work/*.md so Luke can edit them like docs.
// Facts only from docs/content/cv.md and docs/content/answers.md (HR-FACTS).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    /** short line shown above the title, e.g. "ixo · Platform" */
    company: z.string(),
    role: z.string(),
    period: z.string(),
    /** position on /work and in prev/next links */
    order: z.number(),
    summary: z.string(),
    tags: z.array(z.string()),
    /** optional diagram shown at the top of the write-up */
    diagram: z.enum(['opcode']).optional(),
  }),
});

export const collections = { work };
