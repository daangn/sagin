import { parseEnv } from 'znv';
import { z } from 'zod';

export default parseEnv(process.env, {
  DB_URL: z.string().url().describe('PostgreSQL connection url'),

  NEXTAUTH_URL: z.string().url().describe('See https://next-auth.js.org/configuration/options#nextauth_url'),
  NEXTAUTH_SECRET: z.string().describe('See https://next-auth.js.org/configuration/options#nextauth_secret'),

  AUTH0_ISSUER: z.string().url().describe('Base URL with Auth0 Domain'),
  AUTH0_CLIENT_ID: z.string().describe('Auth0 Client ID'),
  AUTH0_CLIENT_SECRET: z.string().describe('Auth0 client secret'),
});
