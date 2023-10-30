import db from '@sagin/db';
import { createAdapter } from '@sagin/db/auth';
import { type AuthOptions, getServerSession } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

import env from '~/lib/env';

// TODO: Make it configurable
export const authOptions: AuthOptions = {
  adapter: createAdapter(db),
  providers: [
    Auth0Provider({
      issuer: env.AUTH0_ISSUER,
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
    }),
  ],
};

export type AuthUserProfile = {
  name: string;
  email: string;
  image: string;
};

export async function getCurrentUser(): Promise<AuthUserProfile | null> {
  const session = await getServerSession(authOptions);
  return (session?.user ?? null) as AuthUserProfile | null;
}
