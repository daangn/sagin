import { type IndexerRouter } from '@sagin/indexer/api/trpc';
import {
  type CreateTRPCProxyClient,
  createTRPCProxyClient,
  unstable_httpBatchStreamLink,
} from '@trpc/client';

export type TrpcClient = CreateTRPCProxyClient<IndexerRouter>;

export function createTrpcClient(url: URL): TrpcClient {
  const client = createTRPCProxyClient<IndexerRouter>({
    links: [unstable_httpBatchStreamLink({ url })],
  });
  return client;
}
