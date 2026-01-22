import { createClient } from '@/lib/supabase/server'

// Simple exchange rate cache
const rateCache = new Map<string, { rate: number; date: string }>()

export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  date: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1
  }

  const cacheKey = `${fromCurrency}-${toCurrency}-${date}`
  const cached = rateCache.get(cacheKey)
  if (cached && cached.date === date) {
    return cached.rate
  }

  // Try to get from database first
  const supabase = await createClient()
  const { data: existingRate } = await supabase
    .from('exchange_rates')
    .select('rate')
    .eq('from_currency', fromCurrency)
    .eq('to_currency', toCurrency)
    .eq('date', date)
    .single()

  if (existingRate) {
    rateCache.set(cacheKey, { rate: existingRate.rate, date })
    return existingRate.rate
  }

  // For MVP, use a simple fixed rate or fetch from API
  // In production, you'd use an exchange rate API like exchangerate-api.com
  // For now, return 1 as a placeholder (you should implement real API call)
  const rate = await fetchExchangeRateFromAPI(fromCurrency, toCurrency, date)

  // Store in database for future use
  await supabase.from('exchange_rates').insert({
    from_currency: fromCurrency,
    to_currency: toCurrency,
    rate,
    date,
  })

  rateCache.set(cacheKey, { rate, date })
  return rate
}

async function fetchExchangeRateFromAPI(
  fromCurrency: string,
  toCurrency: string,
  date: string
): Promise<number> {
  // Placeholder implementation
  // In production, use a real API like:
  // - exchangerate-api.com
  // - fixer.io
  // - currencylayer.com

  // For MVP, return 1 (same currency) or a fixed rate
  // You can implement actual API calls here
  console.warn(
    `Exchange rate API not implemented. Using placeholder rate for ${fromCurrency} to ${toCurrency}`
  )

  // Example: If you have an API key, you could do:
  // const response = await fetch(`https://api.exchangerate-api.com/v4/historical/${fromCurrency}/${date}`)
  // const data = await response.json()
  // return data.rates[toCurrency]

  return 1 // Placeholder
}
