# 📘 Booksy

**AI-powered finance suite for small businesses**

Booksy is a modern Next.js application that helps small businesses and freelancers track income, expenses, invoices, and payables with clear insights powered by AI.

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-UI-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-typed-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=flat-square&logo=supabase)

## 🌟 Features

### Core Finance

- **Dashboard Overview** – real-time financial health and KPIs
- **Transaction Management** – income & expense tracking with categories
- **Ledger View** – full transaction history with filters
- **Multi-Currency** – record transactions in multiple currencies
- **Currency Converter** – currency tools for quick conversion

### Invoices & Payments

- **Invoices** – create, edit, preview, and track invoice status
- **Invoice Items** – catalog of reusable line items
- **Payments** – record payments and update invoice status

### Receipts & OCR

- **Document Upload** – upload receipts and documents
- **OCR Pipeline** – extraction via OCR endpoints
- **Receipts** – review and manage extracted data

### Business Health

- **Health Summary** – KPIs, alerts, and planned spending
- **Insights** – actionable AI-powered analysis

### AI Assistant

- Natural language questions about finances
- Summaries and trend analysis
- Context-aware responses based on business data

### Security & Accounts

- Supabase Auth with password reset
- Row Level Security (RLS) on all tables
- Profile management and avatar upload

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase project
- OpenAI API key (for AI features)

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Create `.env.local`

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Run Supabase SQL files
   - `supabase/schema.sql`
   - `supabase/storage.sql`
   - `supabase/invoices.sql`
   - `supabase/invoice_items_catalog.sql`
   - `supabase/ai_analysis_history.sql`
   - `supabase/notification_log.sql`
   - `supabase/seed_demo_data.sql` (optional)

4. Start the dev server

   ```bash
   npm run dev
   ```

Open http://localhost:3000.

## 🏗️ Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Recharts
- Radix UI + shadcn/ui patterns
- next-themes

### Backend & Services

- Supabase (Auth, Database, Storage)
- OpenAI API for insights
- Exchange rate utilities (placeholder rates by default)

## 📁 Project Structure

```
Booksy/
├── app/                          # Next.js App Router
│   ├── (authenticated)/          # Protected app area
│   │   ├── business-health/
│   │   ├── categories/
│   │   ├── currency-converter/
│   │   ├── invoices/
│   │   ├── invoice-items/
│   │   ├── receipts/
│   │   └── upload-documents/
│   ├── api/                      # Route handlers
│   │   ├── ai-analysis/
│   │   ├── chat/
│   │   ├── cron/
│   │   ├── ocr-upload/
│   │   └── test-webhook/
│   ├── dashboard/
│   ├── ledger/
│   ├── transactions/
│   ├── ai-assistant/
│   ├── profile/
│   └── page.tsx
├── components/                   # UI + feature components
│   ├── health/
│   ├── invoices/
│   ├── landing/
│   ├── layout/
│   └── ui/
├── lib/                          # Utilities and services
│   ├── actions/
│   ├── ai/
│   ├── notifications/
│   ├── ocr/
│   ├── services/
│   └── supabase/
├── supabase/                     # SQL schema + seed data
└── types/                        # TypeScript types
```

## 🔒 Security

- Supabase RLS policies on all tables
- Protected routes and server actions
- Environment variable management

## 🚢 Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo in Vercel
3. Add environment variables
4. Deploy

Works with any Next.js hosting provider.

## 📝 Notes

- Exchange rates are placeholders; integrate a live API for production
- AI features require a valid OpenAI API key
- Default categories are created during business setup

## 🤝 Contributing

Pull requests are welcome.

## 📄 License

MIT
Add income and expense transactions

View dashboard insights

Ask financial questions using AI

Review ledger and summaries

🔐 Security

Row Level Security (RLS) enabled on all tables

Users can only access their own business data

Authentication handled by Supabase Auth

📊 Success Metrics
Quantitative

Number of businesses onboarded

Weekly active transaction entry rate

AI assistant usage frequency

Qualitative

User feedback on clarity of insights

Most common AI questions

⚠️ Risks & Assumptions
Assumptions

Small businesses prefer simple explanations over accounting detail

AI-generated insights add measurable value

Risks

Users may not trust AI insights

Poor data quality reduces accuracy

Mitigation

Transparent calculations

Clear, explainable recommendations

🚢 Deployment
Vercel

Push repository to GitHub

Import project into Vercel

Configure environment variables

Deploy

📝 Notes

Exchange rates are placeholders; production should integrate a live API

AI features require a valid OpenAI API key

Default categories are created during business setup

🤝 Contributing

This is an MVP-stage project. Contributions and improvements are welcome.

📄 License

MIT
