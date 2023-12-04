import * as schema from '@sagin/db/schema';
import { pgGenerate } from 'drizzle-dbml-generator';

pgGenerate({
  schema,
  relational: true,
  out: 'migrations/current.dbml',
});
