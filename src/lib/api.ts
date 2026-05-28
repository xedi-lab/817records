const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`)
  return res.json()
}

export const api = {
  getSlots: (date: string) =>
    req<{ slots: import('../types').TimeSlot[] }>(`/slots?date=${date}`),

  createBooking: (data: {
    telegram_id: number
    full_name: string
    username?: string
    phone?: string
    date: string
    start_time: string
    end_time: string
    hours: number
    comment?: string
  }) => req<import('../types').Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),

  getBookings: (params?: { status?: string; limit?: number; offset?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString()
    return req<{ bookings: import('../types').Booking[]; total: number }>(`/admin/bookings${q ? '?' + q : ''}`)
  },

  updateBookingStatus: (id: number, status: import('../types').BookingStatus) =>
    req<import('../types').Booking>(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getClients: () =>
    req<{ clients: import('../types').Client[]; total: number }>('/admin/clients'),

  getStats: () =>
    req<{ total_bookings: number; pending: number; confirmed: number; total_clients: number; hours_this_month: number }>('/admin/stats'),
}
