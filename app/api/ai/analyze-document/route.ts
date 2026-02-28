import { getDatabase } from '@/lib/db/client'
import { case_documents, cases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { geminiModel } from '@/lib/gemini/client'
import { DOCUMENT_ANALYZER_SYSTEM_PROMPT } from '@/lib/gemini/prompts/visa-advisor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const db = getDatabase()
    const { documentId, caseId, content } = await req.json()

    const prompt = `${DOCUMENT_ANALYZER_SYSTEM_PROMPT}\n\nAnalyze this document content:\n${content}`
    const result = await geminiModel.generateContent(prompt)
    const responseText = result.response.text()

    let analysis
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: responseText, verification_status: 'NEEDS_ATTENTION' }
    } catch {
      analysis = { summary: responseText, verification_status: 'NEEDS_ATTENTION' }
    }

    if (documentId) {
      await db.update(case_documents).set({
        status: analysis.verification_status === 'VERIFIED' ? 'verified' : 'needs_attention',
        ai_extracted_data: analysis.extracted_fields || {},
        ai_validation_notes: analysis.summary || '',
      }).where(eq(case_documents.id, documentId))
    }

    if (caseId && analysis.extracted_fields) {
      const caseResult = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1)
      const existing = (caseResult[0]?.case_profile as any) || {}
      const merged = { ...existing, extracted: { ...(existing.extracted || {}), ...analysis.extracted_fields } }
      await db.update(cases).set({ case_profile: merged, updated_at: new Date().toISOString() }).where(eq(cases.id, caseId))
    }

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Document analysis error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
