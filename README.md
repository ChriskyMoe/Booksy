# 📘 Booksy

**AI-Powered Expense & Income Tracking for Small Businesses**

Booksy is a Next.js application that helps small businesses track income and expenses effortlessly and understand their finances through AI-powered insights.

## 🚀 Features

- **Business Authentication & Profile**: Secure authentication with Supabase Auth and business profile setup
- **Income & Expense Tracking**: Record transactions with categories, dates, payment methods, and more
- **Accounting Categories**: Default categories with support for custom categories
- **Dashboard**: View total income, expenses, net profit, cash balance, and expense breakdowns
- **Ledger View**: Chronological transaction ledger with filters (category, date range, payment method)
- **AI Financial Assistant**: Ask questions in plain language and get AI-powered financial insights
- **Multi-Currency Support**: Record transactions in multiple currencies with automatic conversion

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes & Server Actions
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI (GPT-4o-mini)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- An OpenAI API key (for AI features)

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL schema from `supabase/schema.sql` to create all tables and policies
4. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses the following main tables:

- **businesses**: Stores business profiles
- **categories**: Transaction categories (income/expense)
- **transactions**: Income and expense records
- **exchange_rates**: Currency exchange rates

See `supabase/schema.sql` for the complete schema with Row Level Security (RLS) policies.

## 🎯 Usage

1. **Sign Up**: Create an account
2. **Setup Business**: Configure your business profile (name, type, currency, fiscal year)
3. **Add Transactions**: Record income and expenses
4. **View Dashboard**: See financial overview and metrics
5. **Ask AI**: Use the AI assistant to get insights about your finances
6. **View Ledger**: Filter and view all transactions

## 🔐 Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own business data
- Authentication is handled by Supabase Auth

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app is optimized for Vercel deployment with Next.js.

## 📝 Notes

- **Exchange Rates**: The current implementation uses placeholder exchange rates. For production, integrate with a real exchange rate API (e.g., exchangerate-api.com, fixer.io)
- **AI Features**: Requires an OpenAI API key. Without it, AI features will show an error message
- **Default Categories**: Created automatically when a business is set up

## 🤝 Contributing

This is an MVP project. Feel free to extend and improve it!

## 📄 License

MIT

---

Built with ❤️ for small businesses
