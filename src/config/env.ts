/**
 * Environment configuration and validation
 * This file ensures all required environment variables are present at startup
 */

interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  APP_URL: string;
}

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
] as const;

const validateEnv = (): EnvConfig => {
  const missingVars: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Please check your .env file.`
    );
  }

  return {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
  };
};

// Validate on module load
export const env = validateEnv();

// Re-export for convenience
export const {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  STRIPE_PUBLISHABLE_KEY,
  APP_URL,
} = env;
