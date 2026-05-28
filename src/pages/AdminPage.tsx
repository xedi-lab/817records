import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { Booking, Client, BookingStatus } from '../types'

type Tab = 'bookings' | 'clients' | 'stats'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('bookings')
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState<{
    total_bookings: number
    pending: number
    confirmed: number
    total_clients: number
    hours_this_month: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [b, c, s] = await Promise.all([
        api.getBookings({ limit: 100 }),
        api.getClients(),
        api.getStats(),
      ])
      setBookings(b.bookings)
      setClients(c.clients)
      setStats(s)
    } catch {}
    setLoading(false)
  }

  async function changeStatus(id: number, status: BookingStatus) {
    await api.updateBookingStatus(id, status)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const FILTERS: { key: BookingStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'pending', label: 'Ожидают' },
    { key: 'confirmed', label: 'Подтверждены' },
    { key: 'completed', label: 'Завершены' },
    { key: 'cancelled', label: 'Отменены' },
  ]

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#F7F5F0]">
        <div className="text-[#888884] text-[13px] font-medium">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-[#F7F5F0] pb-10">
      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex items-baseline justify-between">
        <h1 className="text-[#111] font-black text-[26px] tracking-tight">
          817<span className="text-[#F0C040]">*</span>
        </h1>
        <span className="text-[#888884] text-[12px] font-semibold uppercase tracking-wider">Admin</span>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="px-5 mb-5">
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Ожидают" value={stats.pending} highlight />
            <MiniStat label="Клиентов" value={stats.total_clients} />
            <MiniStat label="Часов / мес" value={stats.hours_this_month} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 px-5 mb-5">
        {(['bookings', 'clients', 'stats'] as Tab[]).map(t => {
          const labels = { bookings: 'Брони', clients: 'Клиенты', stats: 'Статистика' }
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all ${
                tab === t
                  ? 'bg-[#111] text-white'
                  : 'bg-white border border-[#E8E4DC] text-[#888884]'
              }`}
            >
              {labels[t]}
            </button>
          )
        })}
      </div>

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="px-5 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  filter === f.key
                    ? 'bg-[#111] text-white'
                    : 'bg-white border border-[#E8E4DC] text-[#888884]'
                }`}
              >
                {f.label}
                {f.key === 'pending' && stats && stats.pending > 0 && (
                  <span className="ml-1.5 bg-[#F0C040] text-[#111] rounded-full px-1.5 py-0.5 text-[9px] font-black">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-[#888884] text-[13px] text-center py-10">Нет записей</p>
          )}
          {filtered.map(b => (
            <BookingCard key={b.id} booking={b} onStatus={changeStatus} />
          ))}
        </div>
      )}

      {/* Clients tab */}
      {tab === 'clients' && (
        <div className="px-5 space-y-3">
          {clients.length === 0 && (
            <p className="text-[#888884] text-[13px] text-center py-10">Нет клиентов</p>
          )}
          {clients.map(c => <ClientCard key={c.telegram_id} client={c} />)}
        </div>
      )}

      {/* Stats tab */}
      {tab === 'stats' && stats && (
        <div className="px-5 grid grid-cols-2 gap-3">
          <StatCard label="Всего броней" value={stats.total_bookings} />
          <StatCard label="Ожидают" value={stats.pending} accent />
          <StatCard label="Подтверждено" value={stats.confirmed} />
          <StatCard label="Клиентов" value={stats.total_clients} />
          <StatCard label="Часов в этом месяце" value={stats.hours_this_month} span2 />
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="bg-white border border-[#E8E4DC] rounded-xl px-3 py-2.5">
      <div className={`font-black text-[22px] leading-tight tracking-tight ${highlight && value > 0 ? 'text-[#F0C040]' : 'text-[#111]'}`}>
        {value}
      </div>
      <div className="text-[#888884] text-[10px] font-medium mt-0.5">{label}</div>
    </div>
  )
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
  completed: 'Завершена',
}
const STATUS_DOT: Record<BookingStatus, string> = {
  pending: 'bg-[#F0C040]',
  confirmed: 'bg-green-400',
  cancelled: 'bg-red-400',
  completed: 'bg-[#CCCAC4]',
}

function BookingCard({ booking: b, onStatus }: { booking: Booking; onStatus: (id: number, s: BookingStatus) => void }) {
  return (
    <div className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden">
      <div className="px-4 py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-[#111] font-semibold text-[14px]">{b.full_name}</div>
            {b.username && <div className="text-[#888884] text-[12px]">@{b.username}</div>}
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
            <span className="text-[#888884] text-[11px] font-semibold">{STATUS_LABEL[b.status]}</span>
          </div>
        </div>

        <div className="flex gap-3 text-[#111] font-medium text-[13px] mb-2">
          <span className="font-black">{b.start_time}–{b.end_time}</span>
          <span className="text-[#888884]">{b.date}</span>
          <span className="text-[#888884]">{b.hours}ч</span>
        </div>

        {b.comment && (
          <div className="bg-[#F7F5F0] rounded-lg px-3 py-2 mt-2">
            <p className="text-[#888884] text-[12px] italic">"{b.comment}"</p>
          </div>
        )}
      </div>

      {b.status === 'pending' && (
        <div className="flex border-t border-[#E8E4DC]">
          <button
            onClick={() => onStatus(b.id, 'confirmed')}
            className="flex-1 py-3 text-[13px] font-semibold text-green-600 active:bg-green-50 transition-colors"
          >
            Подтвердить
          </button>
          <div className="w-px bg-[#E8E4DC]" />
          <button
            onClick={() => onStatus(b.id, 'cancelled')}
            className="flex-1 py-3 text-[13px] font-semibold text-red-500 active:bg-red-50 transition-colors"
          >
            Отменить
          </button>
        </div>
      )}
      {b.status === 'confirmed' && (
        <div className="border-t border-[#E8E4DC]">
          <button
            onClick={() => onStatus(b.id, 'completed')}
            className="w-full py-3 text-[13px] font-semibold text-[#888884] active:bg-[#F7F5F0] transition-colors"
          >
            Завершить
          </button>
        </div>
      )}
    </div>
  )
}

function ClientCard({ client: c }: { client: Client }) {
  return (
    <div className="bg-white border border-[#E8E4DC] rounded-2xl px-4 py-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[#111] font-semibold text-[14px]">{c.full_name}</div>
          {c.username && <div className="text-[#888884] text-[12px]">@{c.username}</div>}
          {c.phone && <div className="text-[#888884] text-[12px] mt-0.5">{c.phone}</div>}
        </div>
        <div className="text-right">
          <div className="text-[#111] font-black text-[18px]">{c.total_bookings}</div>
          <div className="text-[#888884] text-[10px] font-medium">{c.total_hours}ч всего</div>
        </div>
      </div>
      {c.last_visit && (
        <div className="mt-2 text-[#888884] text-[11px]">Последний визит: {c.last_visit}</div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent, span2 }: { label: string; value: number; accent?: boolean; span2?: boolean }) {
  return (
    <div className={`bg-white border border-[#E8E4DC] rounded-2xl px-4 py-4 ${span2 ? 'col-span-2' : ''}`}>
      <div className={`font-black text-[36px] leading-none tracking-tight ${accent ? 'text-[#F0C040]' : 'text-[#111]'}`}>
        {value}
      </div>
      <div className="text-[#888884] text-[12px] font-medium mt-1">{label}</div>
    </div>
  )
}
