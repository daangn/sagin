import { type AdapterAccount } from '@auth/core/adapters';
import { type Role, type UserMembershipStatus } from '@sagin/core/models';
import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const systemState = pgTable(
  'system_state',
  {
    category: text('category').notNull(),
    key: text('key').notNull(),
    value: jsonb('value').notNull(),
  },
  table => ({
    pk: primaryKey({ columns: [table.category, table.key] }),
    categoryIdx: index('category_idx').on(table.category),
  }),
);
export type SelectSystemState = typeof systemState.$inferSelect;
export type InsertSystemState = typeof systemState.$inferInsert;

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    role: text('role').$type<Role>().notNull(),
    preferredLanguage: text('preferred_language'),
    preferredTimeZone: text('preferred_timezone'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),

    // always require to validate membership status
    membershipStatus: text('membership_status').$type<UserMembershipStatus>().notNull(),
    membershipAcceptedAt: timestamp('membership_accepted_at', { mode: 'date' }),
    membershipDecliedAt: timestamp('membership_declied_at', { mode: 'date' }),
    membershipDeactivatedAt: timestamp('membership_deactivated_at', { mode: 'date' }),
  },
  table => ({
    cursor: index('cursor').on(table.membershipStatus, table.email),
    membership: index('member_status').on(table.membershipStatus),
  }),
);
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  preferences: many(preferences),
}));
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  },
  table => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  }),
);
export type SelectAccount = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  table => ({
    compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);

export const indexers = pgTable(
  'indexers',
  {
    id: text('id').primaryKey(),
    indexerMeta: jsonb('indexer_meta').notNull(),
    name: text('name').notNull(),
    endpoint: text('endpoint').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    dataProtectionPolicy: text('data_protection_policy'),
  },
  table => ({
    cursor: index('cursor').on(table.createdAt),
  }),
);
export const indexersRelations = relations(indexers, ({ many }) => ({
  sources: many(sources),
}));
export type SelectIndexer = typeof indexers.$inferSelect;
export type InsertIndexer = typeof indexers.$inferInsert;

export const sources = pgTable(
  'sources',
  {
    id: text('id').primaryKey(),
    sourceMeta: jsonb('source_meta').notNull(),
    indexerId: text('indexer_id')
      .notNull()
      .references(() => indexers.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    indexKey: text('index_key').notNull().unique(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    fetchedAt: timestamp('fetched_at', { mode: 'date' }),
    dataProtectionPolicy: text('data_protection_policy'),
  },
  table => ({
    cursor: index('cursor').on(table.createdAt),
  }),
);
export const sourcesRelations = relations(sources, ({ one, many }) => ({
  indexer: one(indexers, {
    fields: [sources.indexerId],
    references: [indexers.id],
  }),
  documentRelations: many($relationsSourcesDocuments),
}));
export type SelectSource = typeof sources.$inferSelect;
export type InsertSource = typeof sources.$inferInsert;

export const documents = pgTable(
  'documents',
  {
    id: text('id').primaryKey(),
    documentMeta: jsonb('document_meta').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    fetchedAt: timestamp('fetched_at', { mode: 'date' }),
    contentHtml: text('content_html'),
    contentPlain: text('content_plain'),
    contentGfm: text('content_gfm'),
    dataProtectionPolicy: text('data_protection_policy'),
  },
  table => ({
    cursor: index('cursor').on(table.createdAt),
    fetchTimeIdx: index('fetch_time_idx').on(table.fetchedAt),
  }),
);
export const documentsRelations = relations(documents, ({ many }) => ({
  sourceRelations: many($relationsSourcesDocuments),
}));
export type SelectDocument = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export const $relationsSourcesDocuments = pgTable(
  'relations_sources_documents',
  {
    sourceId: text('source_id')
      .notNull()
      .references(() => sources.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    documentId: text('document_id')
      .notNull()
      .references(() => documents.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  },
  table => ({
    pk: primaryKey({ columns: [table.sourceId, table.documentId] }),
  }),
);
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

export const preferences = pgTable(
  'preferences',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    category: text('category').notNull(),
    key: text('key').notNull(),
    value: jsonb('value').notNull(),
  },
  table => ({
    pk: primaryKey({ columns: [table.userId, table.category, table.key] }),
    userIdx: index('user_idx').on(table.userId),
    categoryIdx: index('category_idx').on(table.category),
  }),
);
export const preferencesRelations = relations(preferences, ({ one }) => ({
  user: one(users, {
    fields: [preferences.userId],
    references: [users.id],
  }),
}));
export type SelectPreference = typeof preferences.$inferSelect;
export type InsertPreference = typeof preferences.$inferInsert;
