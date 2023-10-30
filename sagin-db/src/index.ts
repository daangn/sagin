import { drizzle } from 'drizzle-orm/node-postgres';

import { pool } from './pool.ts';
import * as schema from './schema.ts';

const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});
export default db;
