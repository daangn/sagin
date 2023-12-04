import { getRequestConfig } from 'next-intl/server';
import { type IntlConfig } from 'use-intl/core';

type RequestConfig = Omit<IntlConfig, 'locale'>;
type GetRequestConfig = (params: { locale: string }) => RequestConfig | Promise<RequestConfig>;

const requestConfig: GetRequestConfig = getRequestConfig(async ({ locale }) => {
  const messages = await import(`../messages/${locale}.json`).then(mod => mod.default);
  return { messages };
});

export default requestConfig;
