const { loadEnv } = require('vite');

const env = loadEnv('development', process.cwd(), '');

/** @type { import('drizzle-kit').Config } */
module.exports = {
  driver: 'pg',
  schema: './src/schema.ts',
  out: './migrations',
  dbCredentials: {
    connectionString: env.DB_URL,
  },
};
