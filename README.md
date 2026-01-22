📘 Booksy

AI-Powered Expense & Income Tracking for Small Businesses

Booksy is a Next.js application that helps small businesses record income and expenses effortlessly and understand their financial health through AI-powered insights — without requiring accounting expertise.

🧭 Overview

Small business owners often struggle with manual bookkeeping, poor financial visibility, and complex accounting tools designed for professionals rather than operators.

Booksy focuses on:

Simple bookkeeping

Clear financial visibility

AI explanations instead of accounting jargon

🎯 MVP Goal

Deliver a reliable bookkeeping system with AI-powered summaries and insights to validate whether automated financial analysis provides real value to small businesses.

👥 Target Users
Primary Users

Small business owners (shops, freelancers, service providers)

Limited accounting knowledge

Need quick answers to financial questions

Web-first users

Secondary Users

Business managers

Early-stage startup founders

✨ Features
Core Functionality (MVP)

Business Authentication & Profile

Secure authentication with Supabase Auth

Business profile setup (name, type, base currency, fiscal year)

Income & Expense Tracking

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

Page Structure

Public

Landing page

Login / Signup

Authenticated

Dashboard

Transactions

Ledger

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

🔌 API Endpoints (MVP)
  POST   /auth/signup
  POST   /auth/login
  GET    /dashboard
  POST   /transactions
  GET    /transactions
  GET    /ledger
  POST   /ai/query
  GET    /ai/summary

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
