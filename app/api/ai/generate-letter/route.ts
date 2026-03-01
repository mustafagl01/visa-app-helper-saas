import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  return NextResponse.json({ letter: "LLM API servisi geçici olarak devre dışı bırakılmıştır. Mektup oluşturulamıyor." })
}
