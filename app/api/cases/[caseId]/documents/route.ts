export const runtime = 'edge';


import { NextResponse } from 'next/server'

export async function GET(_req: Request, props: { params: Promise<{ caseId: string }> }) {
  const params = await props.params
  return NextResponse.json({ documents: [] })
}

export async function POST(req: Request, props: { params: Promise<{ caseId: string }> }) {
  const params = await props.params
  const body = await req.json()
  return NextResponse.json({ document: { id: Math.random().toString(36).substring(2), case_id: params.caseId, ...body } })
}
