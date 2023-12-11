-- https://github.com/pgvector/pgvector
CREATE EXTENSION IF NOT EXISTS vector
  SCHEMA public;

-- https://github.com/paradedb/paradedb/tree/dev/pg_search
-- required for using Postgres as a search engine
CREATE EXTENSION IF NOT EXISTS pg_search
  CASCADE;

-- https://github.com/apache/age
-- required for using Postgres as graph engine
CREATE EXTENSION IF NOT EXISTS age;
