export const runtime = 'edge';


import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  return NextResponse.json({ message: "LLM API servisi geçici olarak devre dışı bırakılmıştır.", visaTypeSet: null })
}
