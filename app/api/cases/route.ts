import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'demo-user'

    const { data, error } = await supabase
      .from('cases')
      .select('*, visa_types(name, country)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ cases: data || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'demo-user'

    const body = await req.json()

    const { data, error } = await supabase
      .from('cases')
      .insert({ user_id: userId, title: body.title || 'Yeni Başvuru', status: 'chat', case_profile: {} })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ case: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
