# Sagin

**Sagin (색인, [sægin])** is a self-hosted, unified document search tool for a workplace.

## Supported Sources

- [x] Notion ([sagin-indexer-notion](sagin-indexer-notion))
- [ ] Confluence (TBD)
- [ ] Google Docs (TBD)
- [ ] GitHub Wiki (TBD)
- Custom

NOTE: Sagin does not magically support federated search for those cloud services. Instead, the user should specify exactly where the document is stored, like a specific database (Notion), space (Coufluence), etc.

## Architecture

### Overview

```
Sources (Notion, Confluence, etc)
   ▲
   │
   │                  Database (Postgres)
Indexers ───────────► Search Engine (MeiliSearch or pgvector)
   ▲                           ▲
   │                           │
   │                           │
  App (UI, System Admin)───────┘

```

### Indexers

Indexers are workers that crawl content from sources, sync it with search indexes.

Typically, one indexer is configured for one source type.

## LICENSE

See [LICENSE](LICENSE)
