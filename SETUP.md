# Booksy Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Run the Database Schema**
   - In your Supabase dashboard, go to **SQL Editor**
   - Open the file `supabase/schema.sql` from this project
   - Copy and paste the entire SQL script
   - Click **Run** to execute
   - This will create all necessary tables, functions, and security policies

3. **Get Your Supabase Credentials**
   - Go to **Settings** > **API**
   - Copy your **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - Copy your **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Copy your **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - keep this secret!

### 3. Set Up OpenAI (Optional - for AI features)

1. **Get an OpenAI API Key**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an account or sign in
   - Go to **API Keys** section
   - Create a new API key
   - Copy the key (you won't be able to see it again!)

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

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Time Setup

1. **Sign Up**: Create a new account
2. **Set Up Business**: 
   - Enter your business name
   - Select business type (optional)
   - Choose base currency
   - Set fiscal year start date
3. **Start Tracking**: Add your first transaction!

## Troubleshooting

### Database Errors

- Make sure you've run the SQL schema in Supabase
- Check that Row Level Security (RLS) is enabled on all tables
- Verify your Supabase credentials in `.env.local`

### Authentication Issues

- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that email confirmation is disabled in Supabase (for development) or verify your email

### AI Features Not Working

- Verify `OPENAI_API_KEY` is set in `.env.local`
- Check that you have credits in your OpenAI account
- The app will show an error message if the API key is missing

### Exchange Rates

- Currently uses placeholder rates (1:1 conversion)
- For production, integrate with a real exchange rate API:
  - [exchangerate-api.com](https://www.exchangerate-api.com/)
  - [fixer.io](https://fixer.io/)
  - [currencylayer.com](https://currencylayer.com/)

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

The app is optimized for Vercel with Next.js.

## Support

For issues or questions, check the main README.md file.
