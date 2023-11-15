import { type AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const systemStats = pgTable('system_stats', {
  category: text('category').notNull(),
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
}, table => ({
  categoryIdx: index('category_idx').on(table.category),
}));
export type SelectSystemStat = typeof systemStats.$inferSelect;
export type InsertSystemStat = typeof systemStats.$inferInsert;

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
    userId: text('user_id').notNull()
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
  userId: text('user_id').notNull()
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

export const indexers = pgTable('indexers', {
  id: text('id').primaryKey(),
  indexerType: text('indexer_type').notNull(),
  indexerMeta: jsonb('indexer_meta').notNull(),
  name: text('name').notNull(),
  endpoint: text('endpoint').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  dataProtectionPolicy: text('data_protection_policy'),
});
export type SelectIndexer = typeof indexers.$inferSelect;
export type InsertIndexer = typeof indexers.$inferInsert;

export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  sourceType: text('source_type').notNull(),
  sourceMeta: jsonb('source_meta').notNull(),
  indexKey: text('index_key').notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  fetchedAt: timestamp('fetched_at', { mode: 'date' }),
  dataProtectionPolicy: text('data_protection_policy'),
});
export const sourcesRelations = relations(sources, ({ many }) => ({
  documentRelations: many($relationsSourcesDocuments),
}));
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
  dataProtectionPolicy: text('data_protection_policy'),
});
export const documentsRelations = relations(documents, ({ many }) => ({
  sourceRelations: many($relationsSourcesDocuments),
}));
export type SelectDocument = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export const $relationsSourcesDocuments = pgTable('relations_sources_documents', {
  sourceId: text('source_id').notNull()
    .references(() => sources.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  documentId: text('document_id').notNull()
    .references(() => documents.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
}, table => ({
  pk: primaryKey({ columns: [table.sourceId, table.documentId] }),
}));
export const sourcesDocumentsRelations = relations($relationsSourcesDocuments, ({ one }) => ({
  source: one(sources, {
    fields: [$relationsSourcesDocuments.sourceId],
    references: [sources.id],
  }),
  document: one(documents, {
    fields: [$relationsSourcesDocuments.documentId],
    references: [documents.id],
  }),
}));
