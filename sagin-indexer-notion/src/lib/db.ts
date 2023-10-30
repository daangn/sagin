import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import env from '~/lib/env';

export const sharedPool = new Pool({
  connectionString: env.DB_URL,
});

const db = drizzle(sharedPool);
export default db;
