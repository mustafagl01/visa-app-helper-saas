export const runtime = 'edge';


import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { content } = await req.json()
  return NextResponse.json({
    analysis: {
      summary: 'Document received. AI analysis requires Gemini API key.',
      verification_status: 'NEEDS_ATTENTION',
      extracted_fields: {}
    }
  })
}
