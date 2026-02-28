import { getDatabase } from '@/lib/db/client'
import { cases, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const DEMO_USER_ID = 'demo-user'

export async function GET() {
  try {
    const db = getDatabase()
    const result = await db
      .select()
      .from(cases)
      .where(eq(cases.user_id, DEMO_USER_ID))
      .orderBy(cases.created_at)

    return NextResponse.json({ cases: result })
  } catch (error: any) {
    console.error('GET /api/cases error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const db = getDatabase()
    const body = await req.json()

    const newCase = await db
      .insert(cases)
      .values({
        user_id: DEMO_USER_ID,
        title: body.title || 'Yeni Vize Başvurusu',
        status: 'chat',
        case_profile: {},
      })
      .returning()

    return NextResponse.json({ case: newCase[0] })
  } catch (error: any) {
    console.error('POST /api/cases error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
