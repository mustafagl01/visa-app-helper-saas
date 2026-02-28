import { getDatabase } from '@/lib/db/client'
import { cases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { caseId: string } }) {
  try {
    const db = getDatabase()
    const result = await db
      .select()
      .from(cases)
      .where(eq(cases.id, params.caseId))
      .limit(1)

    if (!result[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ case: result[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { caseId: string } }) {
  try {
    const db = getDatabase()
    const body = await req.json()

    const updated = await db
      .update(cases)
      .set({ ...body, updated_at: new Date().toISOString() })
      .where(eq(cases.id, params.caseId))
      .returning()

    return NextResponse.json({ case: updated[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
