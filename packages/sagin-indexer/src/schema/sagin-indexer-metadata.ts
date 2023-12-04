import { type FromSchema } from 'json-schema-to-ts';

// this should be const assertion, not yet supported
// See https://github.com/microsoft/TypeScript/issues/32063
// import schema from './sagin-indexer-metadata.json';

const schema = Object.freeze({
  type: 'object',
  properties: {
    protocols: {
      type: 'array',
      description:
        'Supported protocol by the implementation, client would connect via first entity of this array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['trpc'],
          },
          endpoint: {
            type: 'string',
          },
          implementation: {
            type: 'string',
          },
        },
        required: ['type', 'endpoint', 'implementation'],
        additionalProperties: false,
      },
      minLength: 1,
    },
  },
  required: ['protocols'],
  additionalProperties: false,
} as const);

export type SaginIndexerMetadata = FromSchema<typeof schema>;
