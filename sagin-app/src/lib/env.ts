import * as e from 'envalid';

export default e.cleanEnv(process.env, {
  DB_URL: e.url({ desc: 'PostgreSQL connection string' }),

  NEXTAUTH_URL: e.url({ desc: 'See https://next-auth.js.org/configuration/options#nextauth_url' }),
  NEXTAUTH_SECRET: e.str({ desc: 'See https://next-auth.js.org/configuration/options#nextauth_secret' }),

  AUTH0_ISSUER: e.url({ desc: 'Base URL with Auth0 Domain' }),
  AUTH0_CLIENT_ID: e.str({ desc: 'Auth0 Client ID' }),
  AUTH0_CLIENT_SECRET: e.str({ desc: 'Auth0 client secret' }),
});
