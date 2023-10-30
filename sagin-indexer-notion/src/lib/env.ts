import * as e from 'envalid';

export default e.cleanEnv(process.env, {
  DB_URL: e.url({ desc: 'PostgreSQL connection string' }),
  NOTION_API_KEY: e.str({ desc: 'Notion API key' }),
  MEILISEARCH_URL: e.url({ desc: 'MeiliSearch instance URL' }),
  MEILISEARCH_API_KEY: e.str({ desc: 'MeiliSearch instance master key' }),
});
