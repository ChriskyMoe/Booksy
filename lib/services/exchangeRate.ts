const API_KEY = 'ddb9e001d3fc1014a8161b6c'
const BASE_URL = 'https://v6.exchangerate-api.com/v6'

export interface ExchangeRateResponse {
    conversion_rates: Record<string, number>
    base_code: string
    result: string
    documentation: string
    terms_of_use: string
}

export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRateResponse> {
    try {
        const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching exchange rates:', error)
        throw error
    }
}

export function convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
): number {
    if (fromCurrency === toCurrency) return amount

    // Convert from base currency to USD first, then to target
    const usdRate = rates[fromCurrency] || 1
    const targetRate = rates[toCurrency] || 1

    return (amount / usdRate) * targetRate
}

export const SUPPORTED_CURRENCIES = [
    'USD', 'EUR', 'GBP', 'JPY', 'THB', 'MMK', 'SGD', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'
] as const

export const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    THB: 'Thai Baht',
    MMK: 'Myanmar Kyat',
    SGD: 'Singapore Dollar',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    INR: 'Indian Rupee'
}
