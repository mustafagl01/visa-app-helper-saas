import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  try {
    const { caseId, letterType = 'cover', caseProfile } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        letter: 'GEMINI_API_KEY not set. Please add it to environment variables.'
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Generate a professional ${letterType} letter for a UK visa application.
Applicant profile: ${JSON.stringify(caseProfile || {}, null, 2)}
Write a complete, formal letter.`

    const result = await model.generateContent(prompt)
    const letter = result.response.text()

    return NextResponse.json({ letter })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
