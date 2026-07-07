import type { Config } from 'tailwindcss';
import { tailwindBaseConfig } from '@hawkedge/config';

const config: Config = {
  ...tailwindBaseConfig,
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
