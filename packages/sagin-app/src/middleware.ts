import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'never',
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
