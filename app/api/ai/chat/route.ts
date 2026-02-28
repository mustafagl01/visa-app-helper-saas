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

    const chatHistory = history.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are VisaFlow AI, a helpful UK visa application assistant. Help users with their visa applications, document requirements, and letter writing.' }] },
        { role: 'model', parts: [{ text: 'I am VisaFlow AI, ready to help with UK visa applications.' }] },
        ...chatHistory,
      ],
    })

    const result = await chat.sendMessage(message)
    const assistantMessage = result.response.text()

    return NextResponse.json({ message: assistantMessage, visaTypeSet: null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
