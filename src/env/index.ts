import 'dotenv/config'
import { z } from 'zod'

console.log(process.env.DATABASE_URL)

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error('Invalid environment variables', _env.error.format())
    throw new Error('Invalid environment variables')
}

export const env = _env.data