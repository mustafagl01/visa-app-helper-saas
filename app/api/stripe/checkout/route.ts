export const runtime = 'edge';


import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  return NextResponse.json({ url: null, message: 'Stripe integration coming soon' })
}
