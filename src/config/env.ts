import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, "VITE_SUPABASE_ANON_KEY is required"),
  VITE_GOOGLE_API_KEY: z.string().min(1, "VITE_GOOGLE_API_KEY is required"),
  VITE_PREFERENCES_ID: z.string().min(1, "VITE_PREFERENCES_ID is required"),
  VITE_USER_PREFERENCES_MAIN: z
    .string()
    .email("VITE_USER_PREFERENCES_MAIN must be a valid email"),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const formattedErrors = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${formattedErrors}\n\nCheck your .env file against .env.example`
    );
  }

  return parsed.data;
}

export const env = validateEnv();
