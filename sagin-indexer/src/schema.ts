import { jsonb, pgSchema, text, timestamp } from 'drizzle-orm/pg-core';

export const schema = pgSchema('sagin_indexer');

export const sources = schema.table('sources', {
  id: text('id').notNull().primaryKey(),
  sourceType: text('source_type').notNull(),
  sourceMeta: jsonb('source_meta').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  fetchedAt: timestamp('fetched_at', { mode: 'date' }),
});

export const documents = schema.table('documents', {
  id: text('id').notNull().primaryKey(),
  documentType: text('document_type').notNull(),
  documentMeta: jsonb('document_meta').notNull(),
  fulltext: text('fulltext'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  fetchedAt: timestamp('fetched_at', { mode: 'date' }),
});
