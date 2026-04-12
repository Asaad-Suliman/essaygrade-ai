# EssayGrade AI

AI-powered essay grading tool for teachers. Paste a student essay, pick a rubric, and get detailed scores, strengths, improvement areas, and a downloadable PDF report — in seconds.

## Features

- **Rubric-based scoring** — evaluates Grammar, Structure, Argumentation, and Critical Thinking
- **5 rubric types** across all grade levels (Elementary → College)
- **PDF reports** — export professional evaluation reports instantly
- **Auth & accounts** — sign up, log in, dashboard to track past evaluations
- **Free tier** — 10 evaluations/month, no credit card required
- **Pro tier** — unlimited evaluations at $15/month

## Tech Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Framework       | Next.js 14 (App Router) |
| Language        | TypeScript              |
| Styling         | Tailwind CSS            |
| Auth & Database | Supabase                |
| AI Model        | OpenAI GPT-4o-mini      |
| Payments        | Stripe                  |
| PDF Generation  | React PDF               |
| Deployment      | Vercel                  |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/essaygrade-ai.git
cd essaygrade-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your keys:

```env
# Supabase — get from supabase.com → your project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI — get from platform.openai.com → API Keys
OPENAI_API_KEY=your_openai_api_key

# Stripe — get from dashboard.stripe.com → Developers → API Keys
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Add each environment variable:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

Then deploy to production:

```bash
vercel --prod
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── evaluate/     # Essay evaluation endpoint (OpenAI)
│   │   ├── checkout/     # Stripe checkout session
│   │   ├── webhook/      # Stripe webhook handler
│   │   └── auth/         # Supabase auth callback
│   ├── dashboard/        # User dashboard
│   ├── evaluate/         # Essay evaluation page
│   ├── pricing/          # Pricing page
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/           # Reusable UI components
├── lib/
│   ├── claude.ts         # OpenAI evaluation logic
│   ├── stripe.ts         # Stripe client
│   └── supabase/         # Supabase client (browser + server)
└── types/                # TypeScript types
```

## License

MIT
