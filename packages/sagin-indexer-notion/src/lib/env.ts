import { parseEnv } from 'znv';
import { z } from 'zod';

// See https://github.com/lostfictions/znv/issues/12
// See https://github.com/microsoft/TypeScript/issues/47663
export default parseEnv(process.env, {
  DB_URL: z.string().url().describe('PostgreSQL connection url'),
  NOTION_API_KEY: z.string().describe('Notion API key'),
  MEILISEARCH_URL: z.string().url().describe('MeiliSearch instance URL'),
  MEILISEARCH_API_KEY: z.string().describe('MeiliSearch instance master key'),
});
