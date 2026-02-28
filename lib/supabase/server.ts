type QueryResult<T> = Promise<{ data: T | null; error: null }>

type QueryBuilder<T> = {
  select: (_query?: string) => QueryBuilder<T>
  eq: (_column: string, _value: unknown) => QueryBuilder<T>
  order: (_column: string, _opts?: { ascending?: boolean }) => QueryResult<T[]>
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

export async function createClient(): Promise<any> {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: <T,>(_table: string) => createQueryBuilder<T>(),
  }
}
