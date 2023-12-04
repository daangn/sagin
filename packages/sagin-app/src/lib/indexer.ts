import { type SaginIndexerMetadata } from '@sagin/indexer/schema/sagin-indexer-metadata.ts';

import { type TrpcClient, createTrpcClient } from './indexer/trpc-client.ts';

export type IndexerClient = {
  type: 'trpc';
  instance: TrpcClient;
};

const registry = new Map<string, IndexerClient>();

export async function getIndexerClient(url: URL) {
  const key = url.toString();
  return registry.get(key) ?? (await registerIndexerClient(url));
}

export async function registerIndexerClient(url: URL): Promise<IndexerClient> {
  const key = url.toString();
  if (registry.has(key)) {
    throw new Error(`Given URL ${url} already registered`);
  }

  const metadataEndpoint = new URL('.well-known/sagin-indexer-metadata', url);
  try {
    const metadata = await fetch(metadataEndpoint).then<SaginIndexerMetadata>(res => res.json());
    if (metadata.protocols.length <= 0) {
      throw new Error('No protocols supported');
    }

    // Use first one
    const [protocol] = metadata.protocols;
    switch (protocol.type) {
      case 'trpc': {
        const client: IndexerClient = {
          type: 'trpc',
          instance: createTrpcClient(url),
        };
        registry.set(key, client);
        return client;
      }
      default:
        throw new Error(`Sagin app doesn't support ${protocol.type} protocol`);
    }
  } catch (e) {
    throw new Error(
      `Given URL ${url} doesn't seem to provide proper Sagin indexer implementation`,
      {
        cause: e,
      },
    );
  }
}

export function unregisterIndexerClient(url: URL) {
  const key = url.toString();
  registry.delete(key);
}
