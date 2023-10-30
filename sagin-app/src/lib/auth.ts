import { type Adapter, type AdapterAccount } from '@auth/core/adapters';
import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { type AuthOptions, getServerSession } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

import db from '~/lib/db';
import env from '~/lib/env';
import * as schema from '~/lib/schema';

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

function createAdapter(db: PostgresJsDatabase<typeof schema>): Adapter {
  return {
    async createUser(data) {
      const result = await db
        .insert(schema.users)
        .values({ ...data, id: createId() })
        .returning()
        .then(res => res[0] ?? null);
      return result;
    },
    async getUser(data) {
      const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, data))
        .then(res => res[0] ?? null);
      return result;
    },
    async getUserByEmail(data) {
      const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, data))
        .then(res => res[0] ?? null);
      return result;
    },
    async createSession(data) {
      const result = await db
        .insert(schema.sessions)
        .values(data)
        .returning()
        .then(res => res[0]);
      return result;
    },
    async getSessionAndUser(data) {
      const result = await db
        .select({
          session: schema.sessions,
          user: schema.users,
        })
        .from(schema.sessions)
        .where(eq(schema.sessions.sessionToken, data))
        .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
        .then(res => res[0] ?? null);
      return result;
    },
    async updateUser(data) {
      if (!data.id) {
        throw new Error('No user id.');
      }
      const result = await db
        .update(schema.users)
        .set(data)
        .where(eq(schema.users.id, data.id))
        .returning()
        .then(res => res[0]);
      return result;
    },
    async updateSession(data) {
      const result = await db
        .update(schema.sessions)
        .set(data)
        .where(eq(schema.sessions.sessionToken, data.sessionToken))
        .returning()
        .then(res => res[0]);
      return result;
    },
    async linkAccount(rawAccount) {
      const updatedAccount = await db
        .insert(schema.accounts)
        .values(rawAccount)
        .returning()
        .then(res => res[0]);
      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      const account: AdapterAccount = {
        ...updatedAccount,
        access_token: updatedAccount.accessToken ?? undefined,
        token_type: updatedAccount.tokenType ?? undefined,
        id_token: updatedAccount.idToken ?? undefined,
        refresh_token: updatedAccount.refreshToken ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expiresAt ?? undefined,
        session_state: updatedAccount.sessionState ?? undefined,
      };
      return account;
    },
    async getUserByAccount(account) {
      const result = await db
        .select()
        .from(schema.accounts)
        .where(
          and(
            eq(schema.accounts.providerAccountId, account.providerAccountId),
            eq(schema.accounts.provider, account.provider),
          ),
        )
        .leftJoin(schema.users, eq(schema.accounts.userId, schema.users.id))
        .then(res => res[0] ?? null);
      if (!result) {
        return null;
      }
      return result.users;
    },
    async deleteSession(sessionToken) {
      const result = await db
        .delete(schema.sessions)
        .where(eq(schema.sessions.sessionToken, sessionToken))
        .returning()
        .then(res => res[0] ?? null);
      return result;
    },
    async createVerificationToken(token) {
      const result = await db
        .insert(schema.verificationTokens)
        .values(token)
        .returning()
        .then(res => res[0]);
      return result;
    },
    async useVerificationToken(token) {
      try {
        const result = await db
          .delete(schema.verificationTokens)
          .where(
            and(
              eq(schema.verificationTokens.identifier, token.identifier),
              eq(schema.verificationTokens.token, token.token),
            ),
          )
          .returning()
          .then(res => res[0] ?? null);
        return result;
      } catch (err) {
        throw new Error('No verification token found.');
      }
    },
    async deleteUser(id) {
      await db
        .delete(schema.users)
        .where(eq(schema.users.id, id))
        .returning()
        .then(res => res[0] ?? null);
    },
    async unlinkAccount(account) {
      const { type, provider, providerAccountId, userId } = await db
        .delete(schema.accounts)
        .where(
          and(
            eq(schema.accounts.providerAccountId, account.providerAccountId),
            eq(schema.accounts.provider, account.provider),
          ),
        )
        .returning()
        .then(res => res[0] ?? null);
      return { provider, type, providerAccountId, userId };
    },
  };
}
