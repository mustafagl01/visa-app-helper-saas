import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic/client'
import { buildLetterPrompt } from '@/lib/anthropic/prompts/letter-generator'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, letterType } = await req.json()

  const { data: caseData } = await supabase
    .from('cases').select('case_profile').eq('id', caseId).single()

  const profile = caseData?.case_profile || {}
  const prompt = buildLetterPrompt(letterType, profile, profile.extracted || {})

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })

  const letterContent = response.content[0].type === 'text' ? response.content[0].text : ''

  const { data: existing } = await supabase
    .from('generated_letters').select('id')
    .eq('case_id', caseId).eq('letter_type', letterType).single()

  if (existing) {
    await supabase.from('generated_letters')
      .update({ content: letterContent, is_finalized: false, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
  } else {
    await supabase.from('generated_letters').insert({ case_id: caseId, letter_type: letterType, content: letterContent })
  }

  return NextResponse.json({ content: letterContent })
}
