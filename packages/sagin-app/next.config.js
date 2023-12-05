const path = require('node:path');
const withNextIntl = require('next-intl/plugin')();

const useTurbo = process.env.TURBOPACK != null;

/** @type {import('next').NextConfig} */
module.exports = withNextIntl({
  experimental: {
    taint: true,

    // This isn't supported by Turbopack yet
    instrumentationHook: !useTurbo,

    // not quiet stable yet
    // turbotrace: {},
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },

  output: 'standalone',
});
