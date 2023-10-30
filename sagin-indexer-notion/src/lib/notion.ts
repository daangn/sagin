import { Client } from '@notionhq/client';

import env from '~/lib/env';

const notion = new Client({
  auth: env.NOTION_API_KEY,
});
export default notion;

export * from './notion/content';
export * from './notion/url';
