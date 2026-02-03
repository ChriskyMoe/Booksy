const API_KEY = process.env.EXCHANGE_RATE_API_KEY 
const BASE_URL = process.env.EXCHANGE_RATE_BASE_URL

export interface ExchangeRateResponse {
    conversion_rates: Record<string, number>
    base_code: string
    result: string
    documentation: string
    terms_of_use: string
}

export interface HistoricalDataPoint {
    date: string
    rate: number
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

export async function getHistoricalRates(
    baseCurrency: string,
    targetCurrency: string,
    startDate: string,
    endDate: string
): Promise<HistoricalDataPoint[]> {
    try {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const dataPoints: HistoricalDataPoint[] = []

        // Generate dates between start and end (limiting to reasonable number for API calls)
        const dates: Date[] = []
        const currentDate = new Date(start)

        // Limit to 30 data points to avoid too many API calls
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        const step = Math.max(1, Math.floor(daysDiff / 30))

        while (currentDate <= end) {
            dates.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + step)
        }

        // Fetch data for each date
        for (const date of dates) {
            const year = date.getFullYear()
            const month = date.getMonth() + 1 // No leading zeros
            const day = date.getDate() // No leading zeros

            const response = await fetch(`${BASE_URL}/${API_KEY}/history/${baseCurrency}/${year}/${month}/${day}`)

            if (response.ok) {
                const data = await response.json()
                if (data.result === 'success' && data.conversion_rates[targetCurrency]) {
                    dataPoints.push({
                        date: date.toISOString().split('T')[0],
                        rate: data.conversion_rates[targetCurrency]
                    })
                }
            }

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        return dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } catch (error) {
        console.error('Error fetching historical rates:', error)
        // Return empty array if API fails
        return []
    }
}

export async function getHistoricalRatesForPeriod(
    baseCurrency: string,
    targetCurrency: string,
    period: '1D' | '5D' | '1M' | '1Y' | '5Y'
): Promise<HistoricalDataPoint[]> {
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
        case '1D':
            startDate.setDate(startDate.getDate() - 1)
            break
        case '5D':
            startDate.setDate(startDate.getDate() - 5)
            break
        case '1M':
            startDate.setMonth(startDate.getMonth() - 1)
            break
        case '1Y':
            startDate.setFullYear(startDate.getFullYear() - 1)
            break
        case '5Y':
            startDate.setFullYear(startDate.getFullYear() - 5)
            break
    }

    const formatDate = (date: Date) => date.toISOString().split('T')[0]

    return getHistoricalRates(
        baseCurrency,
        targetCurrency,
        formatDate(startDate),
        formatDate(endDate)
    )
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
    'USD', 'EUR', 'GBP', 'JPY', 'THB', 'MMK', 'SGD', 'AUD', 'CAD', 'CHF', 'CNY', 'INR',
    'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RUB',
    'TRY', 'ILS', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'LBP', 'EGP', 'MAD',
    'TND', 'DZD', 'LYD', 'NGN', 'KES', 'GHS', 'ZAR', 'BWP', 'NAD', 'SZL', 'LSL', 'MWK',
    'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'VES', 'BOB', 'PYG', 'GYD', 'SRD',
    'KRW', 'VND', 'PHP', 'IDR', 'MYR', 'LKR', 'PKR', 'BDT', 'NPR', 'MVR', 'AFN', 'MGA'
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
    INR: 'Indian Rupee',
    HKD: 'Hong Kong Dollar',
    NZD: 'New Zealand Dollar',
    SEK: 'Swedish Krona',
    NOK: 'Norwegian Krone',
    DKK: 'Danish Krone',
    PLN: 'Polish Zloty',
    CZK: 'Czech Koruna',
    HUF: 'Hungarian Forint',
    RON: 'Romanian Leu',
    BGN: 'Bulgarian Lev',
    HRK: 'Croatian Kuna',
    RUB: 'Russian Ruble',
    TRY: 'Turkish Lira',
    ILS: 'Israeli Shekel',
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    QAR: 'Qatari Riyal',
    KWD: 'Kuwaiti Dinar',
    BHD: 'Bahraini Dinar',
    OMR: 'Omani Rial',
    JOD: 'Jordanian Dinar',
    LBP: 'Lebanese Pound',
    EGP: 'Egyptian Pound',
    MAD: 'Moroccan Dirham',
    TND: 'Tunisian Dinar',
    DZD: 'Algerian Dinar',
    LYD: 'Libyan Dinar',
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    GHS: 'Ghanaian Cedi',
    ZAR: 'South African Rand',
    BWP: 'Botswana Pula',
    NAD: 'Namibian Dollar',
    SZL: 'Swazi Lilangeni',
    LSL: 'Lesotho Loti',
    MWK: 'Malawian Kwacha',
    BRL: 'Brazilian Real',
    MXN: 'Mexican Peso',
    ARS: 'Argentine Peso',
    CLP: 'Chilean Peso',
    COP: 'Colombian Peso',
    PEN: 'Peruvian Sol',
    UYU: 'Uruguayan Peso',
    VES: 'Venezuelan Bolívar',
    BOB: 'Bolivian Boliviano',
    PYG: 'Paraguayan Guarani',
    GYD: 'Guyana Dollar',
    SRD: 'Surinamese Dollar',
    KRW: 'South Korean Won',
    VND: 'Vietnamese Dong',
    PHP: 'Philippine Peso',
    IDR: 'Indonesian Rupiah',
    MYR: 'Malaysian Ringgit',
    LKR: 'Sri Lankan Rupee',
    PKR: 'Pakistani Rupee',
    BDT: 'Bangladeshi Taka',
    NPR: 'Nepalese Rupee',
    MVR: 'Maldivian Rufiyaa',
    AFN: 'Afghan Afghani',
    MGA: 'Malagasy Ariary'
}
