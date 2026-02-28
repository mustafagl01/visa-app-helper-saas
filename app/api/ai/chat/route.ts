import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic/client'
import { VISA_ADVISOR_SYSTEM_PROMPT, VISA_ADVISOR_TOOLS } from '@/lib/anthropic/prompts/visa-advisor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, message, history = [] } = await req.json()

  await supabase.from('chat_messages').insert({ case_id: caseId, role: 'user', content: message })

  const { data: caseData } = await supabase
    .from('cases').select('case_profile').eq('id', caseId).single()

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: VISA_ADVISOR_SYSTEM_PROMPT,
    tools: VISA_ADVISOR_TOOLS as any,
    messages: [
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]
  })

  let profileUpdates: Record<string, any> = {}
  let visaTypeSet: any = null

  for (const block of response.content) {
    if (block.type === 'tool_use') {
      if (block.name === 'update_case_profile') {
        profileUpdates = { ...profileUpdates, ...(block.input as any).updates }
      }
      if (block.name === 'set_visa_type') {
        visaTypeSet = block.input
      }
    }
  }

  if (Object.keys(profileUpdates).length > 0) {
    const merged = { ...(caseData?.case_profile || {}), ...profileUpdates }
    await supabase.from('cases').update({ case_profile: merged }).eq('id', caseId)
  }

  if (visaTypeSet) {
    const { data: vt } = await supabase
      .from('visa_types').select('id').eq('slug', visaTypeSet.visa_type_slug).single()
    if (vt) {
      await supabase.from('cases').update({ visa_type_id: vt.id, status: 'documents' }).eq('id', caseId)
    }
  }

  const textContent = response.content.find((b: any) => b.type === 'text')
  const assistantMessage = (textContent as any)?.text || ''

  await supabase.from('chat_messages').insert({ case_id: caseId, role: 'assistant', content: assistantMessage })

  return NextResponse.json({ message: assistantMessage, visaTypeSet, profileUpdates })
}
