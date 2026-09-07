import { defineCollection } from 'astro:content';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { docsLoaderWithoutArchive } from './lib/docs-loader';

export const collections = {
  docs: defineCollection({
    loader: docsLoaderWithoutArchive(),
    schema: docsSchema({
      extend: z.object({
        slug: z.string().optional(),
      }),
    }),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};