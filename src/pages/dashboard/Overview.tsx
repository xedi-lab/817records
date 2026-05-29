import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Loader } from '../../components/Loader'
import styles from './Dashboard.module.css'

export function Overview() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStats()
      .then(data => { if (data) setStats(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  if (!stats) return (
    <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
      Не удалось загрузить данные
    </p>
  )

  return (
    <div className={styles.statGrid}>
      <Stat label="Ожидают" value={stats.pending ?? 0} amber />
      <Stat label="Подтверждено" value={stats.confirmed ?? 0} />
      <Stat label="Всего броней" value={stats.total_bookings ?? 0} />
      <Stat label="Клиентов" value={stats.total_clients ?? 0} />
      <Stat label="Часов в этом месяце" value={stats.hours_this_month ?? 0} span2 />
    </div>
  )
}

function Stat({ label, value, amber, span2 }: { label: string; value: number; amber?: boolean; span2?: boolean }) {
  return (
    <div className={[styles.statCard, span2 ? styles.span2 : ''].join(' ')}>
      <div className={[styles.statVal, amber ? styles.amber : ''].join(' ')}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}
