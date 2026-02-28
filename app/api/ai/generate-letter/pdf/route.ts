import { createClient } from '@/lib/supabase/server'
import { generateLetterPDF } from '@/lib/pdf/generator'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, letterType } = await req.json()

  const { data } = await supabase
    .from('generated_letters')
    .select('content')
    .eq('case_id', caseId)
    .eq('letter_type', letterType)
    .single()

  if (!data) return NextResponse.json({ error: 'Letter not found' }, { status: 404 })

  const pdfBuffer = await generateLetterPDF(data.content, letterType)

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${letterType}.pdf"`
    }
  })
}
