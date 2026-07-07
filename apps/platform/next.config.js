const { validateFrontendEnv } = require('@hawkedge/shared');
validateFrontendEnv('platform');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@hawkedge/ui', '@hawkedge/shared', '@hawkedge/database', '@hawkedge/auth'],
};

module.exports = nextConfig;
