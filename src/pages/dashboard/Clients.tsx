import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Loader } from '../../components/Loader'
import type { Client } from '../../types'
import styles from './Dashboard.module.css'

export function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getClients().then(r => setClients(r.clients)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  if (clients.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>Нет клиентов</p>
  }

  return (
    <>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{clients.length} клиентов</p>
      {clients.map(c => (
        <div key={c.telegram_id} className={[styles.clientCard, 'slide-up'].join(' ')}>
          <div>
            <div className={styles.clientName}>{c.full_name}</div>
            {c.username && <div className={styles.clientUser}>@{c.username}</div>}
            {c.phone && <div className={styles.clientPhone}>{c.phone}</div>}
            {c.last_visit && <div className={styles.clientLast}>Последний визит: {c.last_visit}</div>}
          </div>
          <div className={styles.clientStats}>
            <div className={styles.clientCount}>{c.total_bookings}</div>
            <div className={styles.clientHours}>{c.total_hours}ч</div>
          </div>
        </div>
      ))}
    </>
  )
}
