import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { caseId: string } }) {
  return NextResponse.json({ documents: [] })
}

export async function POST(req: Request, { params }: { params: { caseId: string } }) {
  const body = await req.json()
  return NextResponse.json({ document: { id: Math.random().toString(36).substring(2), case_id: params.caseId, ...body } })
}
