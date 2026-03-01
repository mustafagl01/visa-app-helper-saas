export const runtime = 'edge';


import { NextResponse } from 'next/server'

const DEMO_CASES = [
  { id: 'demo-1', title: 'UK Visitor Visa', status: 'documents', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export async function GET() {
  return NextResponse.json({ cases: DEMO_CASES })
}

export async function POST(req: Request) {
  const body = await req.json()
  const newCase = {
    id: Math.random().toString(36).substring(2),
    title: body.title || 'Yeni Vize Başvurusu',
    status: 'chat',
    case_profile: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  return NextResponse.json({ case: newCase })
}
