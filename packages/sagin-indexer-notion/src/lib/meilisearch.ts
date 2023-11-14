import { MeiliSearch } from 'meilisearch';

import env from '~/lib/env.ts';

const meilisearch = new MeiliSearch({
  host: env.MEILISEARCH_URL,
  apiKey: env.MEILISEARCH_API_KEY,
});
export default meilisearch;
