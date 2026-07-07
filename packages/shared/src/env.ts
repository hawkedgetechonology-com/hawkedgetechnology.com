import { z } from 'zod';

export const BackendEnvSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number).optional().default('5000'),
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required.' }).url('DATABASE_URL must be a valid database URL.'),
  REDIS_URL: z.string({ required_error: 'REDIS_URL is required.' }).url('REDIS_URL must be a valid Redis connection URL.'),
  JWT_ACCESS_SECRET: z.string({ required_error: 'JWT_ACCESS_SECRET is required.' }).min(8, 'JWT_ACCESS_SECRET must be at least 8 characters.'),
  JWT_REFRESH_SECRET: z.string({ required_error: 'JWT_REFRESH_SECRET is required.' }).min(8, 'JWT_REFRESH_SECRET must be at least 8 characters.'),
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).optional().default('development'),
  ALLOWED_ORIGINS: z.string().optional(),
});

export const FrontendEnvSchema = z.object({
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required.' }).url('DATABASE_URL must be a valid database URL.'),
  API_BASE_URL: z.string().url('API_BASE_URL must be a valid connection URL.').optional(),
  JWT_ACCESS_SECRET: z.string().min(8).optional(),
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).optional().default('development'),
});

export type BackendEnv = z.infer<typeof BackendEnvSchema>;
export type FrontendEnv = z.infer<typeof FrontendEnvSchema>;

export function validateBackendEnv(): BackendEnv {
  // If we are in build/test phase of github actions without env, skip exit to allow build compilation
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    return {} as any;
  }
  
  const result = BackendEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('\x1b[31m%s\x1b[0m', '====================================================');
    console.error('\x1b[31m%s\x1b[0m', '❌ CRITICAL: BACKEND CONFIGURATION INTEGRITY CHECKS FAILED');
    console.error('\x1b[31m%s\x1b[0m', '====================================================');
    result.error.errors.forEach((err) => {
      console.error('\x1b[33m%s\x1b[0m', `  - Parameter [${err.path.join('.')}]: ${err.message}`);
    });
    console.error('\x1b[31m%s\x1b[0m', '====================================================');
    process.exit(1);
  }
  return result.data as BackendEnv;
}

export function validateFrontendEnv(appName: string): FrontendEnv {
  // Allow compile/build in CI/CD without active database connectivity
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    return {} as any;
  }

  const result = FrontendEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('\x1b[31m%s\x1b[0m', '====================================================');
    console.error('\x1b[31m%s\x1b[0m', `❌ CRITICAL: NEXT.JS APPLICATION [${appName}] ENV CHECK FAILED`);
    console.error('\x1b[31m%s\x1b[0m', '====================================================');
    result.error.errors.forEach((err) => {
      console.error('\x1b[33m%s\x1b[0m', `  - Parameter [${err.path.join('.')}]: ${err.message}`);
    });
    console.error('\x1b[31m%s\x1b[0m', '====================================================');
    process.exit(1);
  }
  return result.data as FrontendEnv;
}
