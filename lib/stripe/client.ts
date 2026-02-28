import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function createCheckoutSession({
  planId,
  stripePriceId,
  caseId,
  userId,
  successUrl,
  cancelUrl,
}: {
  planId: string
  stripePriceId: string
  caseId: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { planId, caseId, userId },
  })
  return session
}
