# 📘 Booksy

**AI-Powered Expense & Income Tracking for Small Businesses**

Booksy is a modern Next.js application that helps small businesses and freelancers track income and expenses effortlessly. Get clear financial insights powered by AI — no accounting degree required.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=flat-square&logo=supabase)

## 🌟 Features

### Core Functionality

- **📊 Dashboard Overview** - Real-time financial health at a glance
- **💰 Transaction Management** - Quick income & expense tracking with categories
- **📈 Visual Analytics** - Beautiful charts and spending breakdowns
- **🏷️ Smart Categories** - Organize transactions with custom categories
- **💱 Currency Converter** - Multi-currency support with live exchange rates
- **📖 Ledger View** - Comprehensive transaction history
- **🤖 AI Financial Assistant** - Get insights and answers about your finances
- **🎨 Dark/Light Mode** - Comfortable viewing in any environment

### Authentication & Security

- **Secure Login/Signup** - Powered by Supabase Auth
- **Password Reset** - Easy password recovery flow
- **Profile Management** - Business/personal profile setup
- **Avatar Upload** - Personalized user profiles

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/booksy.git
cd booksy
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. **Set up Supabase**

Run the SQL schema files in your Supabase project:

- `supabase/schema.sql` - Main database schema
- `supabase/storage.sql` - Storage configuration

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **GSAP** - Advanced animations
- **Recharts** - Data visualization
- **Lucide Icons** - Beautiful iconography

### Backend & Services

- **Supabase** - Authentication, database, and storage
- **OpenAI API** - AI-powered financial insights
- **Exchange Rate API** - Real-time currency conversion

### UI Components

- **Radix UI** - Accessible component primitives
- **next-themes** - Dark mode support
- **Custom components** - Built with shadcn/ui patterns

## 📁 Project Structure

```
booksy/
├── app/                          # Next.js App Router pages
│   ├── (authenticated)/         # Protected routes
│   │   ├── categories/          # Category management
│   │   └── currency-converter/  # Currency conversion
│   ├── api/                     # API routes
│   │   ├── ai-analysis/        # AI insights endpoint
│   │   └── chat/               # AI chat endpoint
│   ├── dashboard/              # Main dashboard
│   ├── login/                  # Authentication pages
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   └── page.tsx               # Landing page
├── components/                 # React components
│   ├── landing/               # Landing page sections
│   ├── layout/                # Layout components
│   └── ui/                    # Reusable UI components
├── lib/                       # Utilities and services
│   ├── actions/               # Server actions
│   ├── ai/                    # AI integration
│   ├── services/              # External services
│   └── supabase/              # Supabase client configs
├── public/                    # Static assets
│   └── images/               # Image assets
├── supabase/                 # Database schemas
└── types/                    # TypeScript types
```

## 🎨 Design Features

- **Modern Landing Page** - Engaging hero section with interactive mockups
- **Responsive Design** - Mobile-first approach, works on all devices
- **Smooth Animations** - GSAP-powered scroll triggers and transitions
- **Beautiful Auth Pages** - Translucent overlays with background images
- **Intuitive Dashboard** - Clean, organized financial overview
- **Accessible UI** - Built with accessibility in mind

## 📊 Key Components

### Landing Page

- Hero section with animated mockups
- Features showcase
- How it works (3-step guide)
- Testimonials with stats
- Call-to-action sections

### Dashboard

- Real-time balance display
- Income vs. expenses breakdown
- Visual charts and graphs
- Recent transactions
- Quick action buttons

### Transaction Management

- Add/edit transactions
- Category assignment
- Transaction filtering
- Export capabilities

### AI Assistant

- Natural language queries
- Financial insights
- Spending pattern analysis
- Budget recommendations

## 🔒 Security

- Supabase Row Level Security (RLS) policies
- Secure authentication flow
- Protected API routes
- Environment variable management
- HTTPS only in production

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works with any Next.js hosting provider (Netlify, AWS, etc.)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@booksy.app or open an issue on GitHub.

---

**Built with ❤️ for small businesses and freelancers**

Record transactions with:

Amount

Category

Date

Payment method

Optional fields: notes, client/vendor, currency

Accounting Categories

Default income and expense categories

Support for custom categories

Income vs expense classification

Dashboard

Total income

Total expenses

Net profit

Cash balance

Expense breakdown by category

Ledger View

Chronological transaction ledger

Monthly and yearly views

Filters by category, date range, and payment method

🤖 AI-Powered Features

AI Financial Assistant

Ask questions in plain language:

“Why was my profit lower this month?”

“How much did I spend on marketing last quarter?”

“Can I afford new equipment this month?”

Provides:

Financial explanations

Trend analysis

Actionable recommendations

Financial Analysis & Summaries

Monthly and quarterly summaries

Profit and loss overview

Expense highlights

Rule-based analysis (MVP)

Advanced forecasting planned for future versions

Multi-Currency Support

Record transactions in multiple currencies

Automatic conversion to base currency

Stores original and converted values

🛠 Tech Stack

Framework: Next.js 16 (App Router)

Styling: Tailwind CSS

Backend: Next.js API Routes & Server Actions

Authentication: Supabase Auth

Database: Supabase (PostgreSQL)

AI: OpenAI (GPT-4o-mini)

Deployment: Vercel (recommended)

🏗 System Architecture
High-Level Architecture

Frontend: Next.js + Tailwind CSS

Backend: API routes + AI service

Database: Supabase (PostgreSQL)

![High level archite](https://github.com/user-attachments/assets/8586ad7a-eaf9-4de1-97ee-dd1781c229b1)

Page Structure

    Public

    Landing page

    Login / Signup

    Authenticated

    Dashboard

    Transactions

    Ledger

    Currency Converter

    AI Assistant

Settings

🧱 Database Schema

Main tables include:

businesses – Business profiles

categories – Income and expense categories

transactions – Income and expense records

exchange_rates – Currency exchange rates

ai_insights – Generated financial summaries

See supabase/schema.sql for the complete schema with Row Level Security (RLS) policies.

![System archite-2026-01-22-173547](https://github.com/user-attachments/assets/44704ce7-fabc-4f02-a3a1-c8c0adfd3929)

🔌 API Endpoints (MVP)
POST /auth/signup
POST /auth/login
GET /dashboard
POST /transactions
GET /transactions
GET /ledger
POST /ai/query
GET /ai/summary

⚙️ Setup Instructions
Prerequisites

Node.js 18+

Supabase account

OpenAI API key

Installation

     npm install
     npm run dev

Environment Variables

      NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
      SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

      OPENAI_API_KEY=your_openai_api_key
      NEXT_PUBLIC_APP_URL=http://localhost:3000

🚀 Usage Flow

Sign up and log in

Set up a business profile

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
