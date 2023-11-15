# Sagin

**Sagin (색인, [sæ-gin])** is a self-hosted, unified document search tool for a workplace.

## Feature Roadmap

- One place for searching all documents
- Fast keyword search & full-text search
- Similarity search & Summarization
- Safe AI integration with data protection policy
- Advanced filter by metadata
- Knowledge graph by references

### Supported Sources

- [x] Notion ([sagin-indexer-notion](packages/sagin-indexer-notion))
- [ ] Confluence (TBD)
- [ ] Google Docs (TBD)
- [ ] GitHub Wiki (TBD)
- [ ] Custom

## Architecture

### Overview

```
 Stores (Notion, Confluence, etc)
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

Sagin is designed that all components can share a single Postgres instance, except search.

### Search Engine

Sagin uses [MeiliSearch](https://www.meilisearch.com/) to support regular keyword search and AI search.

Sagin chose MeiliSearch because Karrot is a Korean company, and it was the only option that guaranteed meaningful quality for Korean out of the box. Others provide only a simple bi-gram tokenizer for Korean.

MeiliSearch currently supports keyword search **OR** AI(vector) search, hybrid search is still [on roadmap](https://roadmap.meilisearch.com/c/141-hybrid-search). It's fine due to we use keyword search and AI search as separated features.

It could move the search engine to Postgres and [pgvector](https://github.com/pgvector/pgvector) for even simpler deployment. A MeiliSearch adapter for this is currently under development.

It could also move the keyword search to a more solid BM25 engine such as [Tantivy](https://github.com/quickwit-oss/tantivy), or a standalone vector store that supports hybrid search in the future. This will be determined after sufficient production testing.

### Indexers

Indexers are background workers that crawl content from stores, and sync it with search indexes.

Typically, one indexer is configured for one store API with an authority. Configuring multiple indexers for the same store is not recommended for reasons such as rate limiting on the endpoint.

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

A "Store" refers to the service where the actual documents are produced. A "Source" is a specific locator among it.

When an admin user registers a source, an actual index is created and a task of synchronizing documents is registered. That is, one indexer manages multiple indexes.

### Data Protection Policy

Sagin could send data to OpenAI to request text embeddings. To protect sensitive documents, users can disable it by specifying data protection policy at indexer, source, and document level. If any of these scope are specified as protected, they will not be sent externally.

## LICENSE

See [LICENSE](LICENSE)
