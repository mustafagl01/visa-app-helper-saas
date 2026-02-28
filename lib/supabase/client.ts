type QueryResult<T> = Promise<{ data: T | null; error: null }>

type QueryBuilder<T> = {
  select: (_query?: string) => QueryBuilder<T>
  eq: (_column: string, _value: unknown) => QueryBuilder<T>
  order: (_column: string) => QueryResult<T[]>
  insert: (_payload: unknown) => QueryBuilder<T>
  update: (_payload: unknown) => QueryBuilder<T>
  single: () => QueryResult<T>
}

function createQueryBuilder<T>(): QueryBuilder<T> {
  return {
    select: () => createQueryBuilder<T>(),
    eq: () => createQueryBuilder<T>(),
    order: async () => ({ data: [], error: null }),
    insert: () => createQueryBuilder<T>(),
    update: () => createQueryBuilder<T>(),
    single: async () => ({ data: null, error: null }),
  }
}

export function createClient(): any {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async (..._args: any[]) => ({ data: null, error: null }),
      signUp: async (..._args: any[]) => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: <T,>(_table: string) => createQueryBuilder<T>(),
  }
}
