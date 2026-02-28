// Mock DB client - works without any database for preview
import { mockDb } from './mock'

export function getDatabase() {
  return mockDb
}
