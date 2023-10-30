import { type AdapterAccount } from '@auth/core/adapters';
import { integer, pgSchema, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const $schema = pgSchema('sagin');

export const users = $schema.table('users', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
});
export type SelectUsers = typeof users.$inferSelect;
export type InsertUsers = typeof users.$inferInsert;

export const accounts = $schema.table(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = $schema.table('sessions', {
  sessionToken: text('session_token').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = $schema.table(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
