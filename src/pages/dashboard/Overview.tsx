import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Loader } from '../../components/Loader'
import styles from './Dashboard.module.css'

export function Overview() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className={styles.statGrid}>
      <Stat label="Ожидают" value={stats.pending} amber />
      <Stat label="Подтверждено" value={stats.confirmed} />
      <Stat label="Всего броней" value={stats.total_bookings} />
      <Stat label="Клиентов" value={stats.total_clients} />
      <Stat label="Часов в этом месяце" value={stats.hours_this_month} span2 />
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
