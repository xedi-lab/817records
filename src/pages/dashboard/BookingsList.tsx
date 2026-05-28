import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Loader } from '../../components/Loader'
import type { Booking, BookingStatus } from '../../types'
import styles from './Dashboard.module.css'

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Ожидает', confirmed: 'Подтверждена',
  cancelled: 'Отменена', completed: 'Завершена',
}
const DOT_CLASS: Record<BookingStatus, string> = {
  pending: styles['dot-pending'], confirmed: styles['dot-confirmed'],
  cancelled: styles['dot-cancelled'], completed: styles['dot-completed'],
}
const FILTERS: { key: BookingStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'pending', label: 'Ждут' },
  { key: 'confirmed', label: 'OK' },
  { key: 'completed', label: 'Готово' },
  { key: 'cancelled', label: 'Отмена' },
]

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [pending, setPending] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getBookings({ limit: 100 }).then(r => {
      setBookings(r.bookings)
      setPending(r.bookings.filter(b => b.status === 'pending').length)
    }).finally(() => setLoading(false))
  }, [])

  async function changeStatus(id: number, status: BookingStatus) {
    await api.updateBookingStatus(id, status)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <Loader />

  return (
    <>
      <div className={styles.filterRow}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={[styles.chip, filter === f.key ? styles.active : ''].join(' ')}
          >
            {f.label}
            {f.key === 'pending' && pending > 0 && (
              <span className={styles.badge}>{pending}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
          Нет записей
        </p>
      )}

      {filtered.map(b => (
        <div key={b.id} className={[styles.bookingCard, 'slide-up'].join(' ')}>
          <div className={styles.bookingHead}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className={styles.bookingName}>{b.full_name}</div>
                {b.username && <div className={styles.bookingUser}>@{b.username}</div>}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                <span className={[styles.statusDot, DOT_CLASS[b.status]].join(' ')} />
                {STATUS_LABEL[b.status]}
              </span>
            </div>
          </div>
          <div className={styles.bookingMeta}>
            <strong>{b.start_time}–{b.end_time}</strong>
            <span>{b.date}</span>
            <span>{b.hours}ч</span>
            {b.phone && <span>{b.phone}</span>}
          </div>
          {b.comment && <div className={styles.bookingComment}>"{b.comment}"</div>}
          {b.status === 'pending' && (
            <div className={styles.bookingActions}>
              <button className={[styles.actBtn, styles.actOk].join(' ')} onClick={() => changeStatus(b.id, 'confirmed')}>Подтвердить</button>
              <button className={[styles.actBtn, styles.actCancel].join(' ')} onClick={() => changeStatus(b.id, 'cancelled')}>Отменить</button>
            </div>
          )}
          {b.status === 'confirmed' && (
            <div className={styles.bookingActions}>
              <button className={[styles.actBtn, styles.actDone].join(' ')} onClick={() => changeStatus(b.id, 'completed')}>Завершить</button>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
