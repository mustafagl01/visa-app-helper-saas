import { createClient } from '@/lib/supabase/server'
import { geminiProModel } from '@/lib/gemini/client'
import { LETTER_GENERATOR_SYSTEM_PROMPT } from '@/lib/gemini/prompts/visa-advisor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { caseId, letterType = 'cover' } = await req.json()

    const { data: caseData } = await supabase
      .from('cases')
      .select('*, visa_types(name, requirements)')
      .eq('id', caseId)
      .single()

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const prompt = `${LETTER_GENERATOR_SYSTEM_PROMPT}\n\nCase Profile:\n${JSON.stringify(caseData.case_profile, null, 2)}\n\nVisa Type: ${caseData.visa_types?.name || 'Unknown'}\nLetter Type: ${letterType}\n\nGenerate the letter now:`

    const result = await geminiProModel.generateContent(prompt)
    const letterContent = result.response.text()

    await supabase.from('generated_letters').upsert({
      case_id: caseId,
      letter_type: letterType,
      content: letterContent,
      generated_at: new Date().toISOString()
    })

    return NextResponse.json({ letter: letterContent })
  } catch (error: any) {
    console.error('Letter generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
