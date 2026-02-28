import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { caseId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('case_documents')
    .select('*')
    .eq('case_id', params.caseId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ documents: data })
}

export async function POST(req: Request, { params }: { params: { caseId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { docKey, docRequirementId } = await req.json()

  const { data: existing } = await supabase
    .from('case_documents')
    .select('id')
    .eq('case_id', params.caseId)
    .eq('doc_key', docKey)
    .single()

  if (existing) return NextResponse.json({ document: existing })

  const { data, error } = await supabase
    .from('case_documents')
    .insert({
      case_id: params.caseId,
      doc_key: docKey,
      doc_requirement_id: docRequirementId || null,
      status: 'pending'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ document: data })
}
