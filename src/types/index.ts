export interface TimeSlot {
  id: string
  date: string        // YYYY-MM-DD
  start_time: string  // HH:MM
  end_time: string
  is_available: boolean
}

export interface Booking {
  id: number
  telegram_id: number
  username: string | null
  full_name: string
  phone: string | null
  date: string
  start_time: string
  end_time: string
  hours: number
  total_price: number | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  comment: string | null
  created_at: string
}

export interface Client {
  telegram_id: number
  username: string | null
  full_name: string
  phone: string | null
  total_bookings: number
  total_hours: number
  last_visit: string | null
  created_at: string
}

export type BookingStatus = Booking['status']
