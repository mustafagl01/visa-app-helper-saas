import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId, caseId } = await req.json()

  const { data: plan } = await supabase.from('plans').select('*').eq('id', planId).single()
  if (!plan || !plan.stripe_price_id) {
    return NextResponse.json({ error: 'Plan not found or no Stripe price configured' }, { status: 400 })
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await createCheckoutSession({
    planId,
    stripePriceId: plan.stripe_price_id,
    caseId,
    userId: user.id,
    successUrl: `${origin}/dashboard/case/${caseId}?payment=success`,
    cancelUrl: `${origin}/dashboard/case/${caseId}?payment=cancelled`,
  })

  await supabase.from('purchases').insert({
    user_id: user.id,
    case_id: caseId,
    plan_id: planId,
    stripe_session_id: session.id,
    status: 'pending'
  })

  return NextResponse.json({ url: session.url })
}
