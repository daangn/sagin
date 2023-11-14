import { redirect } from 'next/navigation';
import * as React from 'react';

import { getCurrentUser } from '~/lib/auth.ts';

import './_globals.css';
import SessionProvider from './_session-provider.tsx';
import SiteHeader from './_site-header.tsx';
import ThemeProvider from './_theme-provider.tsx';

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    return redirect('/api/auth/signin');
  }

  return (
    <html lang='en'>
      <head />
      <body>
        <ThemeProvider>
          <SessionProvider>
            <SiteHeader profile={user} />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
