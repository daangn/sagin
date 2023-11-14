'use client';

import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import * as React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function SessionProvider({ children }: Props) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
