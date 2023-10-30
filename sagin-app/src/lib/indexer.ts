import { type IndexerRouter } from '@sagin/indexer/services';
import { type CreateTRPCProxyClient, createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export type IndexerClient = CreateTRPCProxyClient<IndexerRouter>;

export function createIndexerClient(url: URL): IndexerClient {
  const client = createTRPCProxyClient<IndexerRouter>({
    links: [httpBatchLink({ url })],
  });
  return client;
}
