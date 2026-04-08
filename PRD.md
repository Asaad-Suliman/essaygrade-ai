# EssayGrade AI — Full Build Specification

## Overview
Build a complete SaaS web application called **EssayGrade AI** that lets teachers paste student essays and receive instant AI-powered rubric-based feedback. The app includes a public landing page, authentication, the evaluation tool, a dashboard, PDF export, and Stripe payments.

## Tech Stack (MANDATORY — do not substitute)
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database + Auth**: Supabase (use @supabase/supabase-js + @supabase/ssr)
- **AI**: Anthropic Claude API (use @anthropic-ai/sdk, model: claude-sonnet-4-20250514)
- **Payments**: Stripe (use stripe + @stripe/stripe-js)
- **PDF**: @react-pdf/renderer
- **Deployment target**: Vercel

## Project Structure
```
essaygrade-ai/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example          # template for env vars
├── src/
│   ├── app/
│   │   ├── layout.tsx          # root layout with navbar
│   │   ├── page.tsx            # public landing page
│   │   ├── login/page.tsx      # login form
│   │   ├── signup/page.tsx     # signup form
│   │   ├── dashboard/page.tsx  # list of past evaluations
│   │   ├── evaluate/page.tsx   # main AI evaluation tool
│   │   ├── pricing/page.tsx    # pricing plans
│   │   ├── api/
│   │   │   ├── evaluate/route.ts       # POST: send essay to Claude
│   │   │   ├── auth/callback/route.ts  # Supabase auth callback
│   │   │   ├── checkout/route.ts       # POST: create Stripe session
│   │   │   └── webhook/route.ts        # POST: Stripe webhook
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── EvaluationForm.tsx
│   │   ├── ResultsCard.tsx
│   │   ├── ScoreRadial.tsx     # circular score display
│   │   ├── PricingCard.tsx
│   │   └── PDFReport.tsx       # PDF template component
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # browser client
│   │   │   └── server.ts       # server client
│   │   ├── claude.ts           # Anthropic client + prompt
│   │   ├── stripe.ts           # Stripe client
│   │   └── utils.ts            # helpers
│   └── types/
│       └── index.ts            # TypeScript interfaces
```

## Database Schema (Supabase)

### Table: profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  evaluations_this_month INTEGER DEFAULT 0,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: evaluations
```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  essay_text TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  rubric_type TEXT NOT NULL,
  student_name TEXT,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own evaluations" ON evaluations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evaluations" ON evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Environment Variables (.env.local.example)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Page Specifications

### 1. Landing Page (/)
- Hero section: headline "Grade Essays in Seconds, Not Hours", subtitle, CTA button → /signup
- 3 feature cards: "AI-Powered Feedback", "Rubric-Based Scoring", "PDF Reports"
- How it works: 3 steps (Paste → Analyze → Download)
- Pricing preview: Free (10/month) vs Pro ($15/month unlimited)
- Footer with links
- Must look professional and modern. Use a blue/indigo color scheme.

### 2. Login (/login) + Signup (/signup)
- Simple centered card with email + password form
- Supabase auth (email/password)
- Redirect to /dashboard after login
- Link between login and signup pages

### 3. Dashboard (/dashboard) — PROTECTED
- Show user's plan (Free/Pro) and usage count (X/10 this month)
- Table/cards of past evaluations: date, student name, grade, rubric type, overall score
- Click any evaluation → expand to see full results
- "New Evaluation" button → /evaluate
- If no evaluations yet, show empty state with CTA

### 4. Evaluate (/evaluate) — PROTECTED
- Form with:
  - Textarea for essay (min 50 chars, max 10000 chars)
  - Student name (optional text input)
  - Grade level dropdown: Elementary, Middle School, High School, University
  - Rubric type dropdown: Argumentative, Narrative, Expository, Persuasive, Research Paper
  - Submit button
- On submit:
  - Check usage limit (free = 10/month, pro = unlimited)
  - If over limit, show upgrade prompt
  - Call /api/evaluate
  - Show loading spinner with "Analyzing essay..." text
  - Display results in ResultsCard component
  - Save to database automatically
- Results display:
  - 4 circular score indicators (1-10): Grammar, Structure, Argumentation, Critical Thinking
  - Overall letter grade (A+ through F) with color coding
  - Strengths section (green checkmarks, list of 3-5 items)
  - Areas for improvement (orange arrows, list of 3-5 items)
  - Detailed feedback paragraph (2-3 sentences)
  - "Download PDF" button
  - "Evaluate Another" button

### 5. Pricing (/pricing)
- Two cards side by side:
  - Free: 10 evaluations/month, basic feedback, $0
  - Pro: Unlimited evaluations, detailed feedback, PDF export, $15/month
- Pro card has "Subscribe" button → Stripe checkout
- Free card has "Get Started" button → /signup

## API Specifications

### POST /api/evaluate
**Request body:**
```json
{
  "essay": "string (the essay text)",
  "gradeLevel": "elementary | middle_school | high_school | university",
  "rubricType": "argumentative | narrative | expository | persuasive | research",
  "studentName": "string (optional)"
}
```

**Claude prompt (use this EXACT system prompt):**
```
You are an expert essay evaluator for educational institutions. Evaluate the following student essay based on the specified rubric type and grade level. Be constructive, specific, and encouraging.

Grade Level: {gradeLevel}
Rubric Type: {rubricType}

Respond ONLY with valid JSON in this exact format:
{
  "grammar_score": <1-10>,
  "structure_score": <1-10>,
  "argumentation_score": <1-10>,
  "critical_thinking_score": <1-10>,
  "overall_grade": "<A+|A|A-|B+|B|B-|C+|C|C-|D|F>",
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "detailed_feedback": "A 2-3 sentence summary of the essay's quality with specific, actionable advice."
}
```

**Response:** Return the parsed JSON from Claude.

### POST /api/checkout
- Create Stripe Checkout Session for Pro plan ($15/month)
- Return session URL
- On success, update user's plan in profiles table

### POST /api/webhook
- Handle Stripe webhook events:
  - checkout.session.completed → set plan to 'pro'
  - customer.subscription.deleted → set plan to 'free'

## Design Requirements
- Color scheme: Indigo/blue primary (#4F46E5), with green for success, orange for warnings
- Font: Inter (from Google Fonts)
- Responsive: mobile-first, works on phone and desktop
- All pages must have the Navbar and Footer
- Use Tailwind utility classes exclusively, no custom CSS files
- Loading states on all async operations
- Error handling with user-friendly messages
- Toast notifications for success/error feedback

## Build Order (FOLLOW THIS SEQUENCE)
1. Initialize Next.js project with TypeScript + Tailwind
2. Install all dependencies in ONE command:
   ```
   npm install @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk stripe @stripe/stripe-js @react-pdf/renderer lucide-react
   ```
3. Create project structure (all folders and files)
4. Build types/index.ts first
5. Build lib/ files (supabase client, claude client, stripe client)
6. Build components (Navbar, Footer, shared components)
7. Build landing page (/) — this is the public website
8. Build auth pages (login, signup) + auth callback
9. Build evaluate page + /api/evaluate route
10. Build dashboard page
11. Build ResultsCard + ScoreRadial components
12. Build PDF export
13. Build pricing page + Stripe checkout + webhook
14. Create .env.local.example
15. Test all pages render without errors
16. Git commit with message: "feat: complete EssayGrade AI MVP"

## Usage Limit Logic
```typescript
// In /api/evaluate route:
// 1. Get user profile
// 2. Check if current_period_start is older than 30 days
//    - If yes: reset evaluations_this_month to 0, update current_period_start
// 3. If plan === 'free' && evaluations_this_month >= 10: return 403
// 4. After successful evaluation: increment evaluations_this_month
```

## IMPORTANT CONSTRAINTS
- Do NOT use any AI model other than Claude (claude-sonnet-4-20250514)
- Do NOT use Prisma or any ORM — use Supabase JS client directly
- Do NOT use NextAuth — use Supabase Auth
- Do NOT create separate CSS files — Tailwind only
- Do NOT skip error handling — every API call needs try/catch
- Do NOT leave placeholder/TODO comments — implement everything fully
- All pages must be fully functional, not stubs
- The landing page IS the website — no separate website needed
