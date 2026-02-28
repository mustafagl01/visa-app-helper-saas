import { getDatabase } from '@/lib/db/client'
import { cases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// Simple consistency checker placeholder since the actual implementation 
// might have dependencies we haven't ported yet
function runConsistencyChecks(profile: any, extracted: any, reqs: any) {
  const checks = []
  if (profile?.personal?.passport_number !== extracted?.passport_number) {
    checks.push({
      check_key: 'passport_mismatch',
      status: 'failed',
      message: 'Passport number in profile does not match document'
    })
  }
  return checks
}

export async function POST(_req: Request, { params }: { params: { caseId: string } }) {
  try {
    const db = getDatabase()
    
    const result = await db.select().from(cases).where(eq(cases.id, params.caseId)).limit(1)
    if (!result[0]) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    const profile = (result[0].case_profile as any) || {}
    const extracted = profile.extracted || {}
    const checks = runConsistencyChecks(profile, extracted, {})

    // We'll just return the checks without saving them to DB for now 
    // since we didn't add consistency_checks to our D1 schema

    return NextResponse.json({ checks })
  } catch (error: any) {
    console.error('Consistency check error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
