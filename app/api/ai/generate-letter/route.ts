import { getDatabase } from '@/lib/db/client'
import { cases, visa_types, generated_letters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { geminiProModel } from '@/lib/gemini/client'
import { LETTER_GENERATOR_SYSTEM_PROMPT } from '@/lib/gemini/prompts/visa-advisor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const db = getDatabase()
    const { caseId, letterType = 'cover' } = await req.json()

    const caseResult = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1)
    const caseData = caseResult[0]
    if (!caseData) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    let visaTypeName = 'Unknown'
    if (caseData.visa_type_id) {
      const vtResult = await db.select().from(visa_types).where(eq(visa_types.id, caseData.visa_type_id)).limit(1)
      visaTypeName = vtResult[0]?.name || 'Unknown'
    }

    const prompt = `${LETTER_GENERATOR_SYSTEM_PROMPT}\n\nCase Profile:\n${JSON.stringify(caseData.case_profile, null, 2)}\n\nVisa Type: ${visaTypeName}\nLetter Type: ${letterType}\n\nGenerate the letter now:`

    const geminiResult = await geminiProModel.generateContent(prompt)
    const letterContent = geminiResult.response.text()

    await db.insert(generated_letters).values({
      case_id: caseId,
      letter_type: letterType,
      content: letterContent,
    })

    return NextResponse.json({ letter: letterContent })
  } catch (error: any) {
    console.error('Letter generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
