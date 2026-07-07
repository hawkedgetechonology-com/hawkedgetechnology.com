const { validateFrontendEnv } = require('@hawkedge/shared');
validateFrontendEnv('web');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile workspace packages that contain raw TypeScript/JSX source.
  // @hawkedge/ui ships a pre-compiled CJS dist and must NOT be in this list,
  // otherwise webpack processes DocumentEngine.js and hits the ESM-only
  // @react-pdf/renderer bundling error.
  transpilePackages: ['@hawkedge/shared', '@hawkedge/database'],

  // Keep @react-pdf/renderer as a server runtime external (ESM-only).
  // The PDF route uses dynamic import() at runtime, so this is belt-and-suspenders.
  serverExternalPackages: ['@react-pdf/renderer', 'canvas'],
};

module.exports = nextConfig;
