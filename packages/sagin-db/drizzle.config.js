/** @type { import('drizzle-kit').Config } */
export default {
  driver: 'pg',
  schema: './src/schema.ts',
  out: './migrations',
  dbCredentials: {
    connectionString: process.env.DB_URL || 'postgres://sagin:sagin@0.0.0.0:5432/sagin',
  },
};
