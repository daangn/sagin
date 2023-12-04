'use client';

import * as React from 'react';

import { type SaginConfig } from '~/lib/config/schema.ts';

export type SaginClientConfig = Pick<SaginConfig, 'site_name' | 'site_url' | 'default_locale'>;

const ConfigContext = React.createContext<SaginClientConfig | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  config: SaginClientConfig;
};

export function SaginConfigProvider({ config, children }: ProviderProps) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useSaginConfig() {
  const config = React.use(ConfigContext);
  if (!config) {
    throw new Error('Config must be provided');
  }
  return config;
}
