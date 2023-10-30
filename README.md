# Sagin

**Sagin (색인, [sæ-gin])** is a self-hosted, unified document search tool for a workplace.

## Features

### Supported Sources

- [x] Notion ([sagin-indexer-notion](sagin-indexer-notion))
- [ ] Confluence (TBD)
- [ ] Google Docs (TBD)
- [ ] GitHub Wiki (TBD)
- [ ] Custom

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

### Database

Sagin is designed that all components can share a single Postgres instance. Even including search (if allow to use it as vector store)

### Search Engine

Sagin uses [MeiliSearch](https://www.meilisearch.com/) by default to support regular full-text and AI search. (Expect it will eventually work as hybrid, [not yet supported](https://github.com/orgs/meilisearch/discussions/621))

If only AI search used, you can move vector store to [pgvector](https://github.com/pgvector/pgvector) for an simple infrastructure. A MeiliSearch adapter for this is currently under development.

### Indexers

Indexers are background workers that crawl content from sources, sync it with search indexes.

Typically, one indexer is configured for one target API with authorization.

```
  Notion    Confluence    GitHub
     ▲           ▲           ▲
     │           │           │
     │           │           │
  Indexer     Indexer     Indexer
     │           │           │
     └───────────┼───────────┘
                 │
                 ▼
              Database
```

Configuring multiple indexers for the same target is not recommended for reasons such as rate limit on the endpoint.

## LICENSE

See [LICENSE](LICENSE)
