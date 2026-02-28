import { getDatabase } from '@/lib/db/client'
import { generated_letters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const letterId = searchParams.get('id')
    if (!letterId) return NextResponse.json({ error: 'Letter ID required' }, { status: 400 })

    const db = getDatabase()
    const result = await db.select().from(generated_letters).where(eq(generated_letters.id, letterId)).limit(1)
    if (!result[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const content = result[0].content
    const blob = new TextEncoder().encode(content)

    return new Response(blob, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="visa-letter.txt"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
