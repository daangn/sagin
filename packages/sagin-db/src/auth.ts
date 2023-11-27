import { type Adapter, type AdapterAccount, type AdapterUser } from '@auth/core/adapters';
import { createId } from '@paralleldrive/cuid2';
import { Role } from '@sagin/core/models';
import { and, eq } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as schema from './schema.ts';
import { SystemStats } from './system-stats.ts';

export type AdapterOptions = {
  signupPolicy: SignupPolicy;
};

const defaultOptions: Readonly<AdapterOptions> = Object.freeze({
  signupPolicy: { type: 'restricted', allowedDomains: [] },
});

export function createAdapter(db: PostgresJsDatabase<typeof schema>, { signupPolicy } = defaultOptions): Adapter {
  return {
    async createUser(data) {
      const initiatedBy = await db.query.systemStats.findFirst({
        columns: { value: true },
        where: (table, { and, eq }) =>
          and(eq(table.category, SystemStats.InitiatedBy.category), eq(table.key, SystemStats.InitiatedBy.key)),
      });
      const shouldInitiate = !initiatedBy;
      const now = new Date();

      let newUser: schema.InsertUser;
      // initiating user will automatically be system admin
      if (shouldInitiate) {
        newUser = {
          ...data,
          id: createId(),
          role: Role.SYS_ADMIN,
          approvedAt: now,
        };
      } else if (signupPolicy.type === 'restricted') {
        newUser = {
          ...data,
          id: createId(),
          role: Role.USER,
          approvedAt: shouldApproved(data, signupPolicy.allowedDomains) ? now : null,
        };
      } else {
        newUser = {
          ...data,
          id: createId(),
          role: Role.USER,
          approvedAt: now,
        };
      }

      const result = await db.transaction(async tx => {
        const result = await tx
          .insert(schema.users)
          .values(newUser)
          .returning()
          .then(res => res[0] ?? null);
        if (shouldInitiate) {
          await tx.insert(schema.systemStats).values({
            ...SystemStats.InitiatedBy,
            value: {
              user_id: newUser.id,
            },
          });
        }
        return result;
      });

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

        // ignored payload
        createdAt: undefined,
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

type SignupPolicy = { type: 'open' } | { type: 'restricted'; allowedDomains: string[] };

function shouldApproved(user: Pick<AdapterUser, 'email' | 'emailVerified'>, allowedDomains: string[]) {
  if (!user.emailVerified) {
    return false;
  }

  const [, domain] = user.email.split('@');
  return allowedDomains.some(allowedDomain => domain === allowedDomain);
}
