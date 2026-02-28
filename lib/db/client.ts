// Helper to get D1 binding from Next.js route handlers in Cloudflare Workers
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getDb } from './index'

export function getDatabase() {
  const { env } = getRequestContext()
  return getDb(env.DB as D1Database)
}
