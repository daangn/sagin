import * as React from 'react';

declare module 'next' {
  type NextLayoutProps<
    Props extends {
      // See https://nextjs.org/docs/app/building-your-application/routing/parallel-routes
      // btw, this will also be validated by next's ts plugin
      routes: Routes extends string | null ? Routes : never;
    } = {
      routes: null;
    },
  > = {
    children: React.ReactNode;
  } & (Props['routes'] extends string ? Record<Props['routes'], React.ReactNode> : object);

  interface NextErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
  }
}

declare module 'next/server' {
  import { NextRequest, NextFetchEvent } from 'next/server';
}
