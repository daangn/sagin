import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type TrpcContext, indexerRouter } from '@sagin/indexer/api/trpc';
import saginIndexerMetadataSchema from '@sagin/indexer/schema/sagin-indexer-metadata.json';
import { type CreateFastifyContextOptions, fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { type FastifyInstance } from 'fastify';

import { sourceService } from './services/source.ts';
import { systemService } from './services/system.ts';

export function setupTrpc(app: FastifyInstance) {
  app.withTypeProvider<JsonSchemaToTsProvider>().route({
    method: 'GET',
    url: '/.well-known/sagin-indexer-metadata',
    schema: {
      response: {
        200: saginIndexerMetadataSchema,
      },
    },
    handler: (req, reply) => {
      const url = new URL(req.url);
      reply.send({
        protocols: [
          {
            type: 'trpc',
            endpoint: new URL('/api/trpc', url).toString(),
            implementation: '@sagin/indexer-notion',
          },
        ],
      });
    },
  });

  app.register(fastifyTRPCPlugin, {
    prefix: '/api/trpc',
    trpcOptions: {
      router: indexerRouter,
      createContext({ req, res }: CreateFastifyContextOptions): TrpcContext {
        return {
          services: {
            source: sourceService,
          },
        };
      },
    },
  });
}
