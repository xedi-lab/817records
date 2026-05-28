import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { Card } from '../components/Card'
import type { Booking, Client, BookingStatus } from '../types'
import styles from './admin.module.css'

type Tab = 'bookings' | 'clients' | 'stats'

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('bookings')
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState<{ total_bookings: number; pending: number; confirmed: number; total_clients: number; hours_this_month: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [b, c, s] = await Promise.all([api.getBookings({ limit: 100 }), api.getClients(), api.getStats()])
      setBookings(b.bookings); setClients(c.clients); setStats(s)
    } catch {}
    setLoading(false)
  }

  async function changeStatus(id: number, status: BookingStatus) {
    await api.updateBookingStatus(id, status)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    if (stats) setStats({ ...stats, pending: bookings.filter(b => b.id !== id && b.status === 'pending').length })
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>Загрузка...</div>

  return (
    <div className={styles.wrap}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {(['bookings', 'clients', 'stats'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={[styles.tab, tab === t ? styles.tabActive : ''].join(' ')}>
            {{ bookings: 'Брони', clients: 'Клиенты', stats: 'Статы' }[t]}
            {t === 'bookings' && stats && stats.pending > 0 && (
              <span className={styles.badge}>{stats.pending}</span>
            )}
          </button>
        ))}
      </div>

      <div className="page-content">
        {/* Bookings */}
        {tab === 'bookings' && (
          <>
            <div className={styles.filterRow}>
              {(['all','pending','confirmed','completed','cancelled'] as const).map(s => (
                <button key={s} onClick={() => setFilter(s)} className={[styles.chip, filter === s ? styles.chipActive : ''].join(' ')}>
                  {{ all: 'Все', pending: 'Ждут', confirmed: 'ОК', completed: 'Готово', cancelled: 'Отмена' }[s]}
                </button>
              ))}
            </div>
            {filtered.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>Нет записей</p>}
            {filtered.map(b => <BookingCard key={b.id} booking={b} onStatus={changeStatus} />)}
          </>
        )}

        {/* Clients */}
        {tab === 'clients' && (
          <>
            {clients.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>Нет клиентов</p>}
            {clients.map(c => <ClientCard key={c.telegram_id} client={c} />)}
          </>
        )}

        {/* Stats */}
        {tab === 'stats' && stats && (
          <div className={styles.statsGrid}>
            <Stat label="Всего броней" value={stats.total_bookings} />
            <Stat label="Ожидают" value={stats.pending} accent />
            <Stat label="Подтверждено" value={stats.confirmed} />
            <Stat label="Клиентов" value={stats.total_clients} />
            <Stat label="Часов в этом месяце" value={stats.hours_this_month} span2 />
          </div>
        )}
      </div>
    </div>
  )
}

const STATUS_LABEL: Record<BookingStatus, string> = { pending: 'Ожидает', confirmed: 'Подтверждена', cancelled: 'Отменена', completed: 'Завершена' }

function BookingCard({ booking: b, onStatus }: { booking: Booking; onStatus: (id: number, s: BookingStatus) => void }) {
  return (
    <Card>
      <div className={styles.bookingHeader}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{b.full_name}</div>
          {b.username && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>@{b.username}</div>}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: { pending: '#d97706', confirmed: '#16a34a', cancelled: 'var(--danger)', completed: 'var(--text-secondary)' }[b.status] }}>
          {STATUS_LABEL[b.status]}
        </span>
      </div>
      <div className={styles.bookingMeta}>
        <strong>{b.start_time}–{b.end_time}</strong>
        <span>{b.date}</span>
        <span>{b.hours}ч</span>
      </div>
      {b.comment && <p className={styles.bookingComment}>"{b.comment}"</p>}
      {b.status === 'pending' && (
        <div className={styles.bookingActions}>
          <button className={styles.actionOk} onClick={() => onStatus(b.id, 'confirmed')}>Подтвердить</button>
          <button className={styles.actionCancel} onClick={() => onStatus(b.id, 'cancelled')}>Отменить</button>
        </div>
      )}
      {b.status === 'confirmed' && (
        <button className={styles.actionDone} onClick={() => onStatus(b.id, 'completed')}>Завершить</button>
      )}
    </Card>
  )
}

function ClientCard({ client: c }: { client: Client }) {
  return (
    <Card>
      <div className={styles.bookingHeader}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{c.full_name}</div>
          {c.username && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>@{c.username}</div>}
          {c.phone && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.phone}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{c.total_bookings}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{c.total_hours}ч</div>
        </div>
      </div>
      {c.last_visit && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>Последний визит: {c.last_visit}</p>}
    </Card>
  )
}

function Stat({ label, value, accent, span2 }: { label: string; value: number; accent?: boolean; span2?: boolean }) {
  return (
    <div className={[styles.statCard, span2 ? styles.span2 : ''].join(' ')}>
      <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: accent ? '#d97706' : 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  )
}
