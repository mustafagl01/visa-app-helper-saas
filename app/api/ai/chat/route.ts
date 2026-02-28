import { createClient } from '@/lib/supabase/server'
import { geminiProModel } from '@/lib/gemini/client'
import { VISA_ADVISOR_SYSTEM_PROMPT } from '@/lib/gemini/prompts/visa-advisor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Demo mode: skip auth check if no user
    const userId = user?.id || 'demo-user'

    const { caseId, message, history = [] } = await req.json()

    // Save user message
    if (caseId) {
      await supabase.from('chat_messages').insert({
        case_id: caseId,
        role: 'user',
        content: message
      })
    }

    // Build chat history for Gemini
    const chatHistory = history.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const chat = geminiProModel.startChat({
      history: [
        { role: 'user', parts: [{ text: VISA_ADVISOR_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am VisaFlow AI, ready to help with UK visa applications.' }] },
        ...chatHistory
      ]
    })

    const result = await chat.sendMessage(message)
    const assistantMessage = result.response.text()

    // Detect visa type from response
    let visaTypeSet = null
    const visaTypeMatch = assistantMessage.match(/VISA_TYPE:\s*([\w-]+)/)
    if (visaTypeMatch && caseId) {
      const slug = visaTypeMatch[1]
      const { data: vt } = await supabase
        .from('visa_types').select('id').eq('slug', slug).single()
      if (vt) {
        await supabase.from('cases').update({
          visa_type_id: vt.id,
          status: 'documents'
        }).eq('id', caseId)
        visaTypeSet = { visa_type_slug: slug }
      }
    }

    // Save assistant message
    if (caseId) {
      await supabase.from('chat_messages').insert({
        case_id: caseId,
        role: 'assistant',
        content: assistantMessage
      })
    }

    return NextResponse.json({ message: assistantMessage, visaTypeSet })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
