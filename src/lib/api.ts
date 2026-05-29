const BASE = import.meta.env.VITE_API_URL ?? '/_/backend'

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...opts,
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`API ${res.status}: ${body}`)
    }
    return res.json()
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new Error('Timeout')
    throw e
  } finally {
    clearTimeout(tid)
  }
}

export const api = {
  trackVisit: (data: { telegram_id: number; first_name: string; username?: string }) =>
    req<{ ok: boolean }>('/users/visit', { method: 'POST', body: JSON.stringify(data) }),

  getSlots: (date: string) =>
    req<{ slots: import('../types').TimeSlot[] }>(`/slots?date=${date}`),

  createBooking: (data: {
    telegram_id: number; full_name: string; username?: string; phone?: string
    date: string; start_time: string; end_time: string; hours: number; comment?: string
  }) => req<import('../types').Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),

  getBookings: (params?: { status?: string; limit?: number; offset?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString()
    return req<{ bookings: import('../types').Booking[]; total: number }>(`/admin/bookings${q ? '?' + q : ''}`)
  },

  updateBookingStatus: (id: number, status: import('../types').BookingStatus) =>
    req<import('../types').Booking>(`/admin/bookings/${id}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    }),

  getSlotWindows: () =>
    req<{ windows: { id: number; date: string; start_time: string; end_time: string }[] }>('/admin/slot-windows'),

  createSlotWindow: (data: { date: string; start_time: string; end_time: string }) =>
    req<{ id: number; date: string; start_time: string; end_time: string }>('/admin/slot-windows', {
      method: 'POST', body: JSON.stringify(data),
    }),

  deleteSlotWindow: (id: number) =>
    req<void>(`/admin/slot-windows/${id}`, { method: 'DELETE' }),

  getClients: () =>
    req<{ clients: import('../types').Client[]; total: number }>('/admin/clients'),

  getStats: () =>
    req<{ total_bookings: number; pending: number; confirmed: number; total_clients: number; hours_this_month: number }>('/admin/stats'),

  getAnalytics: (period: 'today' | 'week' | 'month') =>
    req<any>(`/admin/analytics?period=${period}`),

  broadcast: (message: string) =>
    req<{ sent: number; failed: number; total: number }>('/admin/broadcast', {
      method: 'POST', body: JSON.stringify({ message }),
    }),
}
