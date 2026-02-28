# VisaFlow — AI-Powered Visa Application Assistant

UK ve Schengen vize başvurularını adım adım yöneten, belge toplayan, mektup üreten ve tutarlılık kontrolü yapan yarı-otonom SaaS platformu.

## Tech Stack
- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Styling:** TailwindCSS + shadcn/ui
- **State:** Zustand
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** Anthropic Claude API (claude-sonnet-4-5)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Hetzner VPS + Dokploy

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Features
- AI chat advisor — determines correct visa type
- Document collection with live source links
- AI document reading (OCR + data extraction)
- Automatic letter generation (sponsor, cover, support letters)
- Cross-document consistency checker
- Step-by-step GOV.UK form guide
- Application status tracker
