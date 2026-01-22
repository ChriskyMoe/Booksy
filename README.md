# 📘 Booksy

<div align="center">

**AI-Powered Expense & Income Tracking for Small Businesses**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Track income and expenses effortlessly with AI-powered financial insights — no accounting expertise required.*

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

**Booksy** is a modern bookkeeping application designed specifically for small businesses. It combines simple transaction tracking with AI-powered financial insights, making it easy for business owners to understand their finances without needing accounting knowledge.

### Why Booksy?

- 🎯 **Simple & Intuitive**: No complex accounting jargon, just clear financial insights
- 🤖 **AI-Powered**: Ask questions in plain language and get actionable financial advice
- 💰 **Multi-Currency**: Track transactions in multiple currencies with automatic conversion
- 🔒 **Secure**: Built with Supabase Auth and Row Level Security
- 📊 **Comprehensive**: Dashboard, ledger, and detailed financial analytics

---

## ✨ Features

### 🔐 Authentication & Business Setup
- Secure email/password authentication with Supabase Auth
- Business profile configuration (name, type, currency, fiscal year)
- Automatic default category creation

### 💸 Income & Expense Tracking
- Record transactions with detailed information:
  - Amount, category, date, payment method
  - Optional: client/vendor, currency, notes
- Full CRUD operations for transactions
- Multi-currency support with automatic base currency conversion

### 🗂️ Category Management
- Pre-configured default categories:
  - Income: Sales
  - Expenses: Cost of Goods Sold, Rent, Utilities, Marketing, Transportation
- Create custom categories for income and expenses
- Automatic income vs expense classification

### 📊 Dashboard & Analytics
- **Financial Overview**:
  - Total income and expenses
  - Net profit calculation
  - Cash balance tracking
- **Expense Breakdown**: Visual category-wise expense analysis
- **Recent Transactions**: Quick view of latest entries

### 📒 Ledger & Journal View
- Chronological transaction listing
- Advanced filtering:
  - By category
  - By date range
  - By payment method
- Export-ready data structure

### 🤖 AI Financial Assistant
- **Natural Language Queries**: Ask questions like:
  - "Why was my profit lower this month?"
  - "How much did I spend on marketing?"
  - "Can I afford new equipment this month?"
- **Financial Insights**: Get AI-powered analysis of your financial health
- **Actionable Recommendations**: Receive clear, jargon-free advice

### 🌍 Multi-Currency Support
- Record transactions in multiple currencies
- Automatic conversion to base currency
- Exchange rate storage and management

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Backend** | Next.js Server Actions & API Routes |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) |
| **Database** | [Supabase PostgreSQL](https://supabase.com/database) |
| **AI** | [OpenAI GPT-4o-mini](https://openai.com/) |
| **Deployment** | [Vercel](https://vercel.com/) (recommended) |

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- A **Supabase** account ([sign up free](https://supabase.com))
- An **OpenAI API key** (optional, for AI features)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/booksy.git
cd booksy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to **SQL Editor** in your Supabase dashboard
3. Copy and run the SQL schema from `supabase/schema.sql`
4. Go to **Settings** > **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI Configuration (optional - for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. First Time Setup

1. **Sign Up**: Create a new account
2. **Set Up Business**: 
   - Enter business name
   - Select business type (optional)
   - Choose base currency
   - Set fiscal year start date
3. **Start Tracking**: Add your first transaction!

---

## 📚 Documentation

### Project Structure

```
booksy/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── transactions/      # Transaction management
│   ├── ledger/            # Ledger view with filters
│   ├── ai-assistant/      # AI financial assistant
│   └── ...
├── components/            # React components
├── lib/
│   ├── actions/          # Server actions
│   ├── ai/              # AI integration
│   └── supabase/        # Supabase clients
├── supabase/
│   └── schema.sql       # Database schema
└── types/               # TypeScript types
```

### Database Schema

The application uses the following main tables:

- **`businesses`**: Business profiles and settings
- **`categories`**: Transaction categories (income/expense)
- **`transactions`**: Income and expense records
- **`exchange_rates`**: Currency exchange rate storage

All tables are protected with **Row Level Security (RLS)** policies ensuring users can only access their own data.

See [`supabase/schema.sql`](./supabase/schema.sql) for the complete schema.

### API & Server Actions

The application uses Next.js Server Actions for data operations:

- `lib/actions/business.ts` - Business profile management
- `lib/actions/transactions.ts` - Transaction CRUD operations
- `lib/actions/categories.ts` - Category management
- `lib/actions/dashboard.ts` - Dashboard data aggregation
- `lib/ai/insights.ts` - AI-powered financial insights

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | ❌ Optional |
| `NEXT_PUBLIC_APP_URL` | Application URL | ❌ Optional |

---

## 🎯 Usage Guide

### Adding Transactions

1. Navigate to **Transactions** page
2. Click **+ Add Transaction**
3. Fill in the required fields:
   - Category (income or expense)
   - Amount
   - Date
   - Payment method
4. Optionally add client/vendor and notes
5. Click **Add Transaction**

### Viewing Financial Overview

- **Dashboard**: See total income, expenses, profit, and cash balance
- **Expense Breakdown**: Visual representation of expenses by category
- **Recent Transactions**: Latest transaction entries

### Using the AI Assistant

1. Go to **AI Assistant** page
2. Ask questions in plain language:
   - "Why was my profit lower this month?"
   - "What are my biggest expenses?"
   - "Can I afford to buy new equipment?"
3. Or click quick question templates
4. Get AI-powered insights and recommendations

### Filtering Transactions

1. Navigate to **Ledger** page
2. Use filters:
   - **Category**: Filter by transaction category
   - **Date Range**: Select start and end dates
   - **Payment Method**: Filter by cash, card, transfer, etc.
3. Click **Clear Filters** to reset

---

## 🔐 Security

- ✅ **Row Level Security (RLS)**: All database tables protected with RLS policies
- ✅ **Authentication**: Secure authentication handled by Supabase Auth
- ✅ **Data Isolation**: Users can only access their own business data
- ✅ **Server-Side Validation**: All data operations validated server-side
- ✅ **Environment Variables**: Sensitive keys stored securely

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **New Project**
   - Import your GitHub repository

3. **Configure Environment Variables**:
   - Add all variables from `.env.local` in Vercel dashboard
   - Go to **Settings** > **Environment Variables**

4. **Deploy**:
   - Click **Deploy**
   - Your app will be live in minutes!

### Other Deployment Options

- **Netlify**: Similar process to Vercel
- **Railway**: Supports PostgreSQL and Next.js
- **Self-hosted**: Deploy on your own server with Docker

---

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Server Actions for data mutations

---

## 📝 Notes & Limitations

### Current Limitations

- **Exchange Rates**: Uses placeholder rates. For production, integrate with a real API:
  - [exchangerate-api.com](https://www.exchangerate-api.com/)
  - [fixer.io](https://fixer.io/)
  - [currencylayer.com](https://currencylayer.com/)

- **AI Features**: Requires OpenAI API key. Without it, AI features will display an error message.

- **Email Verification**: Email confirmation is disabled by default for development. Enable in Supabase dashboard for production.

### Future Enhancements

- [ ] Real-time exchange rate integration
- [ ] CSV/PDF export functionality
- [ ] Financial reports generation
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Recurring transactions
- [ ] Invoice generation

---

## 🤝 Contributing

Contributions are welcome! This is an MVP project, and we'd love your help to make it better.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com) for backend infrastructure
- [OpenAI](https://openai.com/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All contributors and users of Booksy

---

## 📞 Support

- 📖 **Documentation**: See [SETUP.md](./SETUP.md) for detailed setup instructions
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/booksy/issues)
- 💬 **Discussions**: Join discussions on [GitHub Discussions](https://github.com/yourusername/booksy/discussions)

---

<div align="center">

**Built with ❤️ for small businesses**

[⭐ Star this repo](https://github.com/yourusername/booksy) if you find it helpful!

</div>
