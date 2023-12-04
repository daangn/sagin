import { Pool } from 'pg';

const pool: Readonly<Pool> =
  // biome-ignore lint/suspicious/noAssignInExpressions: intended
  (global.__DB_POOL__ ||= new Pool({
    connectionString: process.env.DB_URL,
  }));
export default pool;

declare global {
  // biome-ignore lint/style/noVar: intended
  var __DB_POOL__: Readonly<Pool>;
}
