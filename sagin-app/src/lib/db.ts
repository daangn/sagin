import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import env from '~/lib/env';
import * as schema from '~/lib/schema';

let pool: Pool;
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: env.DB_URL,
  });
} else {
  pool =
    global.__DB_POOL__ ||
    new Pool({
      connectionString: env.DB_URL,
    });
}

const db = drizzle(pool, { schema });
export default db;

declare global {
  // rome-ignore lint/style/noVar: intended
  var __DB_POOL__: Pool;
}
