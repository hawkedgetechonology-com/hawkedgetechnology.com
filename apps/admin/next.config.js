const { validateFrontendEnv } = require('@hawkedge/shared');
validateFrontendEnv('admin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@hawkedge/ui', '@hawkedge/shared', '@hawkedge/database'],
};

module.exports = nextConfig;
