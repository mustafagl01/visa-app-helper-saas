import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// Used in API routes — DB binding comes from Cloudflare Workers env
export function getDb(d1: any) {
  return drizzle(d1, { schema })
}

// For type convenience
export type AppDB = ReturnType<typeof getDb>
export * from './schema'
