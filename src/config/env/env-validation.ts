import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().length(4).transform(Number),
});

type envType = z.infer<typeof envSchema>;

function validateEnv() {
  return envSchema.parse(process.env);
}

export { envType, validateEnv };
