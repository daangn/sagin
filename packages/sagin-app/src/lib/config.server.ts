// Don't 'use server' here (yet?)
// See https://github.com/vercel/turbo/issues/6298#issuecomment-1806917817

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as React from 'react';

import * as Constatns from '~/lib/constants.ts';
import { resolveTimeZone } from '~/lib/timezone.ts';

import { type SaginConfig, SaginConfigSchema } from './config/schema.ts';

function interpolateEnv(original: string, env = process.env): string {
  return original.replace(/\$\{([A-Z0-9\_]*)()?\}/g, (_match, varname) => {
    if (!/[A-Z0-9\_]+/.test(varname)) {
      throw new Error(`"${varname}" is not a valid variable name`);
    }
    const value = env[varname];
    if (!value) {
      throw new Error(
        `Failed to interpolate config. Environment variable "${varname}" is not provided`,
      );
    }
    return value;
  });
}

const PartialConfigSchema = SaginConfigSchema.partial({
  default_timezone: true,
});

export function loadSaginConfig(file: string, basePath = process.cwd()): Readonly<SaginConfig> {
  const configFilePath = path.join(basePath, file);
  const configFileContent = fs.readFileSync(configFilePath, 'utf-8');
  const partialConfig = PartialConfigSchema.parse(JSON.parse(interpolateEnv(configFileContent)));

  if (!partialConfig.default_timezone) {
    partialConfig.default_timezone = resolveTimeZone() || undefined;
  }

  return SaginConfigSchema.parse(partialConfig);
}

// biome-ignore lint/suspicious/noAssignInExpressions: intended
const saginConfig: Readonly<SaginConfig> = (globalThis.__SAGIN_CONFIG__ ||= Object.freeze(
  loadSaginConfig(Constatns.CONFIG_FILENAME),
));
React.experimental_taintObjectReference(
  'Do not pass full config object to the client',
  saginConfig,
);
export default saginConfig;

declare global {
  // biome-ignore lint/style/noVar: intended
  var __SAGIN_CONFIG__: Readonly<SaginConfig>;
}
