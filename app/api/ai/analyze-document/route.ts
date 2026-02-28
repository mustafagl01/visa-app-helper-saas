import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic/client'
import { buildDocumentAnalyzerPrompt } from '@/lib/anthropic/prompts/document-analyzer'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, docKey, docName, fileBase64, mimeType } = await req.json()

  const prompt = buildDocumentAnalyzerPrompt(docKey, docName)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: fileBase64 } },
        { type: 'text', text: prompt }
      ]
    }]
  })

  const extractedText = response.content[0].type === 'text' ? response.content[0].text : '{}'
  let extractedData: Record<string, any> = {}
  try { extractedData = JSON.parse(extractedText) } catch { extractedData = { raw: extractedText } }

  const hasIssues = Array.isArray(extractedData.validation_issues) && extractedData.validation_issues.length > 0

  await supabase.from('case_documents')
    .update({
      status: hasIssues ? 'rejected' : 'verified',
      ai_extracted_data: extractedData,
      ai_validation_notes: hasIssues ? extractedData.validation_issues.join('; ') : null,
      uploaded_at: new Date().toISOString()
    })
    .eq('case_id', caseId)
    .eq('doc_key', docKey)

  const { data: caseData } = await supabase.from('cases').select('case_profile').eq('id', caseId).single()
  const currentProfile = caseData?.case_profile || {}
  const flatExtracted: Record<string, any> = {}
  for (const [k, v] of Object.entries(extractedData)) {
    if (k !== 'validation_issues') flatExtracted[`${docKey}_${k}`] = v
  }
  await supabase.from('cases').update({
    case_profile: { ...currentProfile, extracted: { ...currentProfile.extracted, ...flatExtracted } }
  }).eq('id', caseId)

  return NextResponse.json({ extractedData, status: hasIssues ? 'rejected' : 'verified' })
}
