import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        message: 'Demo mode: GEMINI_API_KEY not configured. Please add your API key to start using the AI assistant.',
        visaTypeSet: null
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const chatHistory = history
      .filter((m: any) => typeof m?.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

    // Gemini chat history must start with a user message and alternate roles.
    const normalizedHistory = chatHistory.filter((item: any, index: number, arr: any[]) => {
      if (index === 0 && item.role !== 'user') return false
      if (index > 0 && arr[index - 1]?.role === item.role) return false
      return true
    })

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are VisaFlow AI, a helpful UK visa application assistant. Help users with their visa applications, document requirements, and letter writing.' }] },
        { role: 'model', parts: [{ text: 'I am VisaFlow AI, ready to help with UK visa applications.' }] },
        ...normalizedHistory,
      ],
    })

    const result = await chat.sendMessage(message)
    const assistantMessage = result.response.text()

    return NextResponse.json({ message: assistantMessage, visaTypeSet: null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
