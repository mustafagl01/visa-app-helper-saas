import { NextResponse } from 'next/server'

const DEMO_CASE = {
  id: 'demo-1',
  title: 'UK Visitor Visa',
  status: 'documents',
  case_profile: {},
  visa_type_id: 'vt-uk-sv',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export async function GET(_req: Request, { params }: { params: { caseId: string } }) {
  return NextResponse.json({ case: { ...DEMO_CASE, id: params.caseId } })
}

export async function PATCH(req: Request, { params }: { params: { caseId: string } }) {
  const body = await req.json()
  return NextResponse.json({ case: { ...DEMO_CASE, ...body, id: params.caseId } })
}
