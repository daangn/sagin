import { type AdapterAccount } from '@auth/core/adapters';
import {
  type DataProtection,
  type Preference,
  type Role,
  type SystemState,
  type User,
} from '@sagin/core/models';
import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { vector } from 'pgvector/drizzle-orm';

/**
 * System-wide shared state
 */
export const systemState = pgTable('system_state', {
  key: text('key').$type<SystemState.key>().primaryKey(),
  value: jsonb('value').notNull(),
});
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
    role: text('role').$type<Role.t>().notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),

    // a few preferences frequently joined
    preferredLanguage: text('preferred_language'),
    preferredTimeZone: text('preferred_timezone'),

    // always require to validate membership status
    membershipStatus: text('membership_status').$type<User.membership['kind']>().notNull(),
    membershipAcceptedAt: timestamp('membership_accepted_at', { mode: 'date' }),
    membershipDecliedAt: timestamp('membership_declied_at', { mode: 'date' }),
    membershipDeactivatedAt: timestamp('membership_deactivated_at', { mode: 'date' }),
  },
  table => ({
    cursor: index('cursor').on(table.membershipStatus, table.email),
    membershipIdx: index('membership_idx').on(table.membershipStatus),
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

/**
 * The indexer group is an unit of system integration
 *
 * Typically used by a member (hosted indexer). Multiple members are allowed.
 *
 * Connection info is not directly stored in DB because network topologies are vary.
 * It should belong to and validated by app's configuration.
 */
export const indexerGroups = pgTable(
  'indexer_groups',
  {
    groupKey: text('group_key').primaryKey(),
    groupName: text('group_name').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    dataProtectionPolicy: text('data_protection_policy').$type<DataProtection.policy>(),
  },
  table => ({
    cursor: index('cursor').on(table.createdAt),
  }),
);
export const indexerGroupsRelations = relations(indexerGroups, ({ many }) => ({
  sources: many(sources),
}));
export type SelectIndexerGroup = typeof indexerGroups.$inferSelect;
export type InsertIndexerGroup = typeof indexerGroups.$inferInsert;

/**
 * The source is a locator to begin crawling documents
 */
export const sources = pgTable(
  'sources',
  {
    id: text('id').primaryKey(),
    sourceMeta: jsonb('source_meta').notNull(),
    indexerGroup: text('indexer_group')
      .notNull()
      .references(() => indexerGroups.groupKey, { onUpdate: 'cascade', onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    fetchedAt: timestamp('fetched_at', { mode: 'date' }),
    dataProtectionPolicy: text('data_protection_policy').$type<DataProtection.policy>(),
  },
  table => ({
    cursor: index('cursor').on(table.createdAt),
    fetchTimeIdx: index('fetch_time_idx').on(table.fetchedAt),
  }),
);
export const sourcesRelations = relations(sources, ({ one, many }) => ({
  indexerGroup: one(indexerGroups, {
    fields: [sources.indexerGroup],
    references: [indexerGroups.groupKey],
  }),
  documentRelations: many($relationsSourcesDocuments),
}));
export type SelectSource = typeof sources.$inferSelect;
export type InsertSource = typeof sources.$inferInsert;

/**
 * The document is an actual content with its metadata
 */
export const documents = pgTable(
  'documents',
  {
    id: text('id').primaryKey(),
    documentMeta: jsonb('document_meta').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    fetchedAt: timestamp('fetched_at', { mode: 'date' }).notNull(),
    dataProtectionPolicy: text('data_protection_policy').$type<DataProtection.policy>(),

    // Content have its own internal representation.
    content: jsonb('content'),

    // Then converted into frequently used formats like Plain, HTML, GFM
    contentHtml: text('content_html'),
    contentPlain: text('content_plain'),
    contentGfm: text('content_gfm'),

    // Store text embedding vectors generated by OpenAI's embedding-ada-002 model
    embedding: vector('embedding', { dimensions: 1536 }),
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

// sources n <-> m documents
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

/**
 * User preferences; every personalized state goes here
 */
export const preferences = pgTable('preferences', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  // Preference key could be duplicated
  key: text('key').$type<Preference.key>().notNull(),
  value: jsonb('value').notNull(),
});
export const preferencesRelations = relations(preferences, ({ one }) => ({
  user: one(users, {
    fields: [preferences.userId],
    references: [users.id],
  }),
}));
export type SelectPreference = typeof preferences.$inferSelect;
export type InsertPreference = typeof preferences.$inferInsert;

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id').primaryKey(),
    actorId: text('actor_id').notNull(),
    actorEmail: text('actor_email'),
    actorRole: text('actor_role').$type<Role.t>(),
    entityId: text('entity_id').notNull(),
    eventName: text('event_name').notNull(),
    eventTimestamp: timestamp('event_timestamp', { mode: 'date' }).notNull(),
    eventResult: text('event_result').notNull(),
  },
  // skip indexing for insertion speed
  // maybe using bm25 could be better, revisit later anyway
  table => ({
    // actorIdx: index('actor_idx').on(table.actorId),
    // eventTimestampIdx: index('event_timestamp_idx').on(table.eventTimestamp),
    // eventNameIdx: index('event_name_idx').on(table.eventTimestamp),
  }),
);
export type SelectAuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
