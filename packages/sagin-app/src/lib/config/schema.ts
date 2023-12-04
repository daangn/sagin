import { z } from 'zod';

import { validateTimeZone } from '~/lib/timezone.ts';

const DatabaseConfigSchema = z
  .object({
    type: z.literal('postgres').default('postgres'),
    connection_string: z.string(),
  })
  .describe('Database configuration. Only PostgreSQL is supported');

const SearchEngineConfigSchema = z
  .union([
    z
      .object({
        type: z.literal('paradedb'),
      })
      .describe('Search by ParadeDB. This reuse database configuration'),
    z
      .object({
        type: z.literal('meilisearch'),
        baseUrl: z.string(),
        apiKey: z.string().describe('Your Meilisearch master key'),
      })
      .describe('Search by MeiliSearch'),
  ])
  .describe('Search engine configuration. Used by keyword search & similarity search');

const GraphEngineConfigSchema = z
  .union([
    z
      .object({
        type: z.literal('age'),
      })
      .describe('Search by Apache AGE. This reuse database configuration'),
    z
      .object({
        type: z.literal('neo4j'),
        auth: z
          .union([
            z.object({
              type: z.literal('basic'),
              user: z.string(),
              password: z.string(),
            }),
            z.object({
              type: z.literal('bearer'),
              token: z.string(),
            }),
          ])
          .optional(),
      })
      .describe('Search by Neo4j. Neo4j compatible engines like Memgraph are also available.'),
  ])
  .describe('Graph engine configuration. Used by page rank & property search');

const SmtpConfigSchema = z
  .object({
    host: z.string(),
    port: z.string().transform(value => parseInt(value)),
    secure: z.boolean().default(true),
    auth: z
      .object({
        user: z.string(),
        password: z.string(),
      })
      .optional(),
  })
  .describe('SMTP server configuration');

const AiProviderConfigSchema = z.object({
  type: z.literal('openai'),
  api_key: z.string(),
});

const AiConfigSchema = z
  .object({
    provider: AiProviderConfigSchema,
  })
  .describe('AI integration configuration');

const AuthProviderConfigSchema = z
  .union([
    z.object({
      provider: z.literal('auth0'),
      issuer: z.string().describe('https:// + your Auth0 application domain'),
      client_id: z.string(),
      client_secret: z.string(),
    }),
    z.object({
      provider: z.literal('okta'),
      issuer: z.string(),
      client_id: z.string(),
      client_secret: z.string(),
    }),
    z.object({
      provider: z.literal('google'),
      client_id: z.string(),
      client_secret: z.string(),
    }),
    z.object({
      provider: z.literal('github'),
      client_id: z.string(),
      client_secret: z.string(),
    }),
    z.object({
      provider: z.literal('db'),
    }),
  ])
  .describe('Auth provider configiguration');

const SignupPolicySchema = z
  .union([
    z.object({
      type: z.literal('open'),
    }),
    z.object({
      type: z.literal('restricted'),
      allowed_domains: z
        .array(z.string())
        .default([])
        .describe('Users with email matching the given domain will be automatically activated.'),
    }),
  ])
  .describe(
    'User signup policy. If "restricted", users require a confirmation from the admin to activate the account. If "open", it is automatically activated. Don\'t set it to "open" unless you are on an already restricted network.',
  );

export type SaginConfig = z.infer<typeof SaginConfigSchema>;
export const SaginConfigSchema = z.object({
  site_url: z.string().describe('Canonical URL of the app'),
  site_name: z.string().default('Sagin').describe('Site name to diplay'),
  default_locale: z.enum(['en', 'ko']).default('en').describe('Default user locale to display UI'),
  default_timezone: z
    .string()
    .refine(validateTimeZone, val => ({
      message: `${val} is not a valid timezone. It must be listed on tz database (e.g. Asia/Seoul)`,
    }))
    .describe('Default user timezone to display UI'),
  secret: z.string().describe('Used to encrypt JWT, email verification token, etc'),
  database: DatabaseConfigSchema,
  search_engine: SearchEngineConfigSchema,
  graph_engine: GraphEngineConfigSchema,
  smtp: SmtpConfigSchema.optional(),
  ai: AiConfigSchema.optional(),
  auth_providers: z.array(AuthProviderConfigSchema).min(1),
  signup_policy: SignupPolicySchema.default({
    type: 'restricted',
    allowed_domains: [],
  }),
});
