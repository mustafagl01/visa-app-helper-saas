import { createClient } from '@/lib/supabase/server'
import { geminiModel } from '@/lib/gemini/client'
import { DOCUMENT_ANALYZER_SYSTEM_PROMPT } from '@/lib/gemini/prompts/visa-advisor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { documentId, caseId, content, mimeType } = await req.json()

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
      await supabase.from('documents').update({
        status: analysis.verification_status === 'VERIFIED' ? 'verified' : 'needs_attention',
        ai_analysis: analysis,
        extracted_data: analysis.extracted_fields || {}
      }).eq('id', documentId)
    }

    if (caseId && analysis.extracted_fields) {
      const { data: caseData } = await supabase
        .from('cases').select('case_profile').eq('id', caseId).single()
      const merged = { ...(caseData?.case_profile || {}), extracted: { ...(caseData?.case_profile?.extracted || {}), ...analysis.extracted_fields } }
      await supabase.from('cases').update({ case_profile: merged }).eq('id', caseId)
    }

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Document analysis error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
