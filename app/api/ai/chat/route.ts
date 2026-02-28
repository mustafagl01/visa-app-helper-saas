import { getDatabase } from '@/lib/db/client'
import { chat_messages, cases, visa_types } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { geminiProModel } from '@/lib/gemini/client'
import { VISA_ADVISOR_SYSTEM_PROMPT } from '@/lib/gemini/prompts/visa-advisor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const db = getDatabase()
    const { caseId, message, history = [] } = await req.json()

    // Save user message
    if (caseId) {
      await db.insert(chat_messages).values({
        case_id: caseId,
        role: 'user',
        content: message,
      })
    }

    // Build Gemini chat history
    const chatHistory = history.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = geminiProModel.startChat({
      history: [
        { role: 'user', parts: [{ text: VISA_ADVISOR_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am VisaFlow AI, ready to help with UK visa applications.' }] },
        ...chatHistory,
      ],
    })

    const result = await chat.sendMessage(message)
    const assistantMessage = result.response.text()

    // Detect visa type
    let visaTypeSet = null
    const visaTypeMatch = assistantMessage.match(/VISA_TYPE:\s*([\w-]+)/)
    if (visaTypeMatch && caseId) {
      const slug = visaTypeMatch[1]
      const vt = await db.select().from(visa_types).where(eq(visa_types.slug, slug)).limit(1)
      if (vt[0]) {
        await db.update(cases).set({ visa_type_id: vt[0].id, status: 'documents', updated_at: new Date().toISOString() }).where(eq(cases.id, caseId))
        visaTypeSet = { visa_type_slug: slug }
      }
    }

    // Save assistant message
    if (caseId) {
      await db.insert(chat_messages).values({
        case_id: caseId,
        role: 'assistant',
        content: assistantMessage,
      })
    }

    return NextResponse.json({ message: assistantMessage, visaTypeSet })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
