import { NextLayoutProps } from 'next';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import * as React from 'react';

import { authCache, userRequired } from '~/lib/auth.ts';
import { type SaginClientConfig, SaginConfigProvider } from '~/lib/config.client.tsx';
import saginConfig from '~/lib/config.server.ts';

import './_globals.css';
import SiteHeader from './_site-header.tsx';
import ThemeProvider from './_theme-provider.tsx';

export default async function RootLayout({ children }: NextLayoutProps) {
  console.debug('@@ ROOT LAYOUT', new Date());

  const config: SaginClientConfig = {
    site_name: saginConfig.site_name,
    site_url: saginConfig.site_url,
    default_locale: saginConfig.default_locale,
  };

  const session = await authCache();
  userRequired(session?.user);

  const locale = session.user.locale || config.default_locale;
  unstable_setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head />
      <body>
        <SaginConfigProvider config={config}>
          <SessionProvider session={session}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ThemeProvider>
                <SiteHeader user={session.user} />
                {children}
              </ThemeProvider>
            </NextIntlClientProvider>
          </SessionProvider>
        </SaginConfigProvider>
      </body>
    </html>
  );
}
