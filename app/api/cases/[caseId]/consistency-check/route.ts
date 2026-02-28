import { NextResponse } from 'next/server'

export async function POST(_req: Request, props: { params: Promise<{ caseId: string }> }) {
  const params = await props.params
  return NextResponse.json({ checks: [] })
}
