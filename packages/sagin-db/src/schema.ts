import { type AdapterAccount } from '@auth/core/adapters';
import { index, integer, jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const systemStats = pgTable('system_stats', {
  category: text('category').notNull(),
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
}, table => ({
  categoryIdx: index('category_idx').on(table.category),
}));

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  role: text('role').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  activatedAt: timestamp('activated_at', { mode: 'date' }),
});
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const accounts = pgTable(
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
  table => ({
    compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  }),
);
export type SelectAccount = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  table => ({
    compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);
export type SelectVerificationToken = typeof verificationTokens.$inferSelect;
export type InsertVerificationToken = typeof verificationTokens.$inferInsert;

export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  sourceType: text('source_type').notNull(),
  sourceMeta: jsonb('source_meta').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  fetchedAt: timestamp('fetched_at', { mode: 'date' }),
});
export type SelectSource = typeof sources.$inferSelect;
export type InsertSource = typeof sources.$inferInsert;

export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  documentType: text('document_type').notNull(),
  documentMeta: jsonb('document_meta').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  fetchedAt: timestamp('fetched_at', { mode: 'date' }),
  contentHtml: text('content_html'),
  contentPlaintext: text('content_plaintext'),
  contentGfm: text('content_gfm'),
});
export type SelectDocument = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
