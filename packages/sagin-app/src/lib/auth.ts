import Auth0Provider from '@auth/core/providers/auth0';
import OktaProvider from '@auth/core/providers/okta';
import { Role, checkRole } from '@sagin/core/models';
import db from '@sagin/db';
import { type SignupPolicy, createAdapter } from '@sagin/db/auth';
import NextAuth, { type Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import * as React from 'react';

import saginConfig from '~/lib/config.server.ts';
import * as Constants from '~/lib/constants.ts';
import { withActiveSpan } from '~/lib/telemetry.ts';

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  locale: string | null;
};

export class AuthorizationError extends Error {
  requiredRole: Role;
  currentRole: Role;

  constructor(requiredRole: Role, currentRole: Role) {
    super(`Permission denied. required: ${requiredRole}, actual: ${currentRole}`);
    this.requiredRole = requiredRole;
    this.currentRole = currentRole;
  }
}

export function userRequired(
  user: AuthUser | null | undefined,
  requiredRole: Role = Role.User,
): asserts user {
  if (!user) {
    return redirect('/api/auth/signin');
  }
  if (!checkRole(requiredRole, user.role)) {
    throw new AuthorizationError(requiredRole, user.role);
  }
}

// For RSC side
export async function getCurrentUser(requiredRole?: Role): Promise<AuthUser> {
  const session = await authCache();
  userRequired(session?.user, requiredRole);

  return session.user;
}

// For client side
export function useCurrentUser(requiredRole?: Role): AuthUser {
  const session = useSession();
  userRequired(session?.data?.user, requiredRole);

  return session.data.user;
}

const nextauth = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  secret: saginConfig.secret,
  adapter: createAdapter(db, {
    defaultLanguage: saginConfig.default_locale,
    defaultTimeZone: saginConfig.default_timezone,
    signupPolicy: {
      type: saginConfig.signup_policy.type,
      ...(saginConfig.signup_policy.type === 'restricted' && {
        allowedDomains: saginConfig.signup_policy.allowed_domains,
      }),
    } as SignupPolicy,
  }),
  providers: saginConfig.auth_providers.map(config => {
    switch (config.provider) {
      case 'auth0':
        return Auth0Provider({
          issuer: config.issuer,
          clientId: config.client_id,
          clientSecret: config.client_secret,
        });
      case 'okta':
        return OktaProvider({
          issuer: config.issuer,
          clientId: config.client_id,
          clientSecret: config.client_secret,
        });
      default:
        throw new Error(`Provider "${config.provider}" is not supported yet`);
    }
  }),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.locale = user.locale;
      }
      return token;
    },
    session({ session, user }) {
      if (user) {
        session.user.role = user.role;
        session.user.locale = user.locale;
      }
      return session;
    },
  },
});

export const { handlers } = nextauth;

type AuthFn = () => Promise<Session>;
export const auth = withActiveSpan(nextauth.auth as AuthFn, 'auth');
export const authCache = React.cache(auth);

declare module '@auth/core/types' {
  interface Session {
    user: AuthUser & DefaultSession['user'];
  }

  // biome-ignore lint/suspicious/noEmptyInterface: intended
  interface User extends AuthUser {}
}
