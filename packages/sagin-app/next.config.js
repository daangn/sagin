const withNextIntl = require('next-intl/plugin')();

const useTurbo = process.env.TURBOPACK != null;

/** @type {import('next').NextConfig} */
module.exports = withNextIntl({
  experimental: {
    taint: true,

    // This isn't supported by Turbopack yet
    instrumentationHook: !useTurbo,
  },
});
