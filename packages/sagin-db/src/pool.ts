import { Pool } from 'pg';

export let pool: Pool;
if (process.env.NODE_ENV === 'development') {
  // persist db connection for HMR
  pool =
    global.__DB_POOL__ ||
    new Pool({
      connectionString: process.env.DB_URL,
    });
} else {
  pool = new Pool({
    connectionString: process.env.DB_URL,
  });
}

declare global {
  // biome-ignore lint/style/noVar: intended
  var __DB_POOL__: Pool;
}
