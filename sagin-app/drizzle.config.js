const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

/** @type { import('drizzle-kit').Config } */
module.exports = {
  driver: 'pg',
  schema: './src/lib/schema.ts',
  out: './migrations',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
};
