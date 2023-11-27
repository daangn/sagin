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
   │                    Metadata / Entities (Postgres)
Indexers ────────────►  Search Indexes      (Postgres or MeiliSearch)
   ▲                    Knowledge Graph     (Postgres or Neo4j)
   │                           ▲
   │                           │
   │                           │
  App (UI, System Admin)───────┘
```

### Database

Sagin is designed so all components can share a single Postgres instance as it is possible.

- Job queue by [Graphile Worker](https://worker.graphile.org/)
- Keyword search & similarity search by [ParadeDB](https://www.paradedb.com/)
- Graph queries & page rank by [Apache AGE](https://age.apache.org/)

This is possible thanks to Postgres' capable extension system. However, this may be difficult to use for some reasons, like organization policies using managed Postgres or for instance scale. Sagin tries to provide several options.

### Search Indexes

Sagin indexers maintain search indexes for documents, powered by [ParadeDB](https://www.paradedb.com/) or [MeiliSearch](https://meilisearch.com) (maybe adding [OpenSearch](https://opensearch.org/) later)

<details>
  <summary>Why ParadeDB?</summary>

  Sagin uses [ParadeDB](https://www.paradedb.com/) becuase not only it is a Postgres extension, but also it provides amazing features set.

  ParadeDB is based on [Tantivy](https://github.com/quickwit-oss/tantivy), implementing accurate BM25 search. Faster searches with fewer resources than ElasticSearch.

  Queries fully customizable with [BM25/HNSW hybrid scores](https://docs.paradedb.com/search/hybrid) and [ParadeQL](https://docs.paradedb.com/search/bm25#paradeql)

  One concern is that it is still very early, but there are already enough features and very active development. They responded to our requirements for a [Korean tokenizer just in one day](https://github.com/paradedb/paradedb/pull/567).

</details>

<details>
  <summary>Why MeiliSearch?</summary>

   Sagin uses [MeiliSearch](https://meilisearch.com) because Karrot is a Korean company, and it was the only option that guaranteed meaningful quality for Korean out of the box. Others provide only a simple bi-gram tokenizer for Korean.

   MeiliSearch currently supports keyword search **OR** similarity search, hybrid search is still [on roadmap](https://roadmap.meilisearch.com/c/141-hybrid-search). It's fine due to we use keyword search and AI search as separated features yet.

   Also MeiliSearch is licenced under MIT

</details>

### Knowledge Graph

TBD

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
