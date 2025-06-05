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
      rooms: {
        Row: {
          id: string
          name: string
          type: string
          price: number
          description: string
          amenities: string[]
          capacity: number
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          price: number
          description: string
          amenities: string[]
          capacity: number
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          price?: number
          description?: string
          amenities?: string[]
          capacity?: number
          image_url?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone: string
          check_in_date: string
          check_out_date: string
          number_of_guests: number
          total_price: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone: string
          check_in_date: string
          check_out_date: string
          number_of_guests: number
          total_price: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          guest_name?: string
          guest_email?: string
          guest_phone?: string
          check_in_date?: string
          check_out_date?: string
          number_of_guests?: number
          total_price?: number
          status?: string
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