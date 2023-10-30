CREATE SCHEMA "sagin_indexer";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagin_indexer"."documents" (
	"id" text PRIMARY KEY NOT NULL,
	"fulltext" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"fetched_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sagin_indexer"."sources" (
	"id" text PRIMARY KEY NOT NULL,
	"source_type" text NOT NULL,
	"source_meta" jsonb NOT NULL,
	"created_at" timestamp NOT NULL,
	"fetched_at" timestamp
);
