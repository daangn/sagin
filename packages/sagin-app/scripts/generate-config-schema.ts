import { writeFileSync } from 'node:fs';
import * as path from 'node:path';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { SaginConfigSchema } from '../src/lib/config/schema.ts';

const jsonSchema = zodToJsonSchema(SaginConfigSchema, 'config');

const schemaFilePath = path.join(process.cwd(), 'sagin-config-schema.json');
writeFileSync(schemaFilePath, JSON.stringify(jsonSchema, null, 2), 'utf-8');
