import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  CLIENT_URL: z.string().url(),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must contain at least 32 characters"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");

  console.error(
    result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }))
  );

  process.exit(1);
}

export const env = result.data;
