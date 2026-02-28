import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { runConsistencyChecks } from '@/lib/consistency/checker'

export async function POST(_: Request, { params }: { params: { caseId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: caseData } = await supabase
    .from('cases')
    .select('case_profile')
    .eq('id', params.caseId)
    .eq('user_id', user.id)
    .single()

  if (!caseData) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

  const profile = caseData.case_profile || {}
  const extracted = profile.extracted || {}
  const checks = runConsistencyChecks(profile, extracted, {})

  await supabase.from('consistency_checks').delete().eq('case_id', params.caseId)
  if (checks.length > 0) {
    await supabase.from('consistency_checks').insert(
      checks.map(c => ({ case_id: params.caseId, ...c, checked_at: new Date().toISOString() }))
    )
  }

  return NextResponse.json({ checks })
}
