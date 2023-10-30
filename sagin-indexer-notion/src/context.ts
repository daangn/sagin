import { type Context } from '@sagin/indexer/services';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import { sourceService } from './services/source';
import { systemService } from './services/system';

export function createContext({ req, res }: CreateFastifyContextOptions): Context {
  const app = req.server;
  return {
    services: {
      source: sourceService,
      system: systemService,
    },
  };
}
