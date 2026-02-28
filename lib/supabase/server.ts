// Stub - Supabase removed, using mock DB
export function createClient() {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'demo-user' } } }) },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null }) }) }) }),
      delete: () => ({ eq: async () => ({ data: null }) }),
    }),
  }
}
