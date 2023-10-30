import { parseEnv } from 'znv';
import { z } from 'zod';

export default parseEnv(process.env, {
  DB_URL: z.string().url().describe('PostgreSQL connection url'),
  NOTION_API_KEY: z.string().describe('Notion API key'),
  MEILISEARCH_URL: z.string().url().describe('MeiliSearch instance URL'),
  MEILISEARCH_API_KEY: z.string().describe('MeiliSearch instance master key'),
});
