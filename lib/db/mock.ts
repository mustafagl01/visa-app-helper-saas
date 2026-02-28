// In-memory mock database for preview/demo purposes

const mockCases: any[] = []
const mockMessages: any[] = []
const mockLetters: any[] = []

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const mockDb = {
  select: () => ({
    from: (table: any) => ({
      where: (_cond: any) => ({
        limit: (_n: number) => Promise.resolve([]),
        orderBy: (_col: any) => Promise.resolve([]),
      }),
      orderBy: (_col: any) => Promise.resolve([]),
      limit: (_n: number) => Promise.resolve([]),
    }),
  }),
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: () => {
        const row = { id: uuid(), ...data, created_at: new Date().toISOString() }
        return Promise.resolve([row])
      },
    }),
  }),
  update: (table: any) => ({
    set: (data: any) => ({
      where: (_cond: any) => ({
        returning: () => Promise.resolve([{ id: 'mock', ...data }]),
      }),
    }),
  }),
  delete: (table: any) => ({
    where: (_cond: any) => Promise.resolve([]),
  }),
}
