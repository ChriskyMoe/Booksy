export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          business_type: string | null
          base_currency: string
          fiscal_year_start_month: number
          fiscal_year_start_day: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          business_type?: string | null
          base_currency?: string
          fiscal_year_start_month?: number
          fiscal_year_start_day?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          business_type?: string | null
          base_currency?: string
          fiscal_year_start_month?: number
          fiscal_year_start_day?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          business_id: string
          name: string
          type: 'income' | 'expense'
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          type: 'income' | 'expense'
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          type?: 'income' | 'expense'
          is_default?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          business_id: string
          category_id: string
          amount: number
          currency: string
          base_amount: number
          transaction_date: string
          payment_method: 'cash' | 'card' | 'transfer' | 'other'
          client_vendor: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          category_id: string
          amount: number
          currency?: string
          base_amount: number
          transaction_date: string
          payment_method: 'cash' | 'card' | 'transfer' | 'other'
          client_vendor?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          category_id?: string
          amount?: number
          currency?: string
          base_amount?: number
          transaction_date?: string
          payment_method?: 'cash' | 'card' | 'transfer' | 'other'
          client_vendor?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exchange_rates: {
        Row: {
          id: string
          from_currency: string
          to_currency: string
          rate: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          from_currency: string
          to_currency: string
          rate: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          from_currency?: string
          to_currency?: string
          rate?: number
          date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
