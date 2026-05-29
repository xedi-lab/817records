import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Loader } from '../../components/Loader'
import styles from './Dashboard.module.css'

type Period = 'today' | 'week' | 'month'

interface AnalyticsData {
  period: string
  total: number
  confirmed: number
  cancelled: number
  total_hours: number
  by_date: { date: string; count: number; hours: number; confirmed: number }[]
}

export function Analytics() {
  const [period, setPeriod] = useState<Period>('week')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getAnalytics(period).then(d => { if (d) setData(d) }).catch(() => {}).finally(() => setLoading(false))
  }, [period])

  const maxCount = data ? Math.max(...data.by_date.map(d => d.count), 1) : 1

  return (
    <>
      <div className={styles.periodTabs}>
        {(['today', 'week', 'month'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={[styles.periodTab, period === p ? styles.active : ''].join(' ')}
          >
            {{ today: 'Сегодня', week: 'Неделя', month: 'Месяц' }[p]}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : data && (
        <>
          <div className={styles.statGrid}>
            <Stat label="Заявок" value={data.total} />
            <Stat label="Подтверждено" value={data.confirmed} />
            <Stat label="Отменено" value={data.cancelled} />
            <Stat label="Часов" value={data.total_hours} />
          </div>

          {data.by_date.length > 0 && (
            <div>
              <p className={styles.sectionLabel} style={{ marginBottom: 10 }}>По датам</p>
              <div className={styles.barChart}>
                {data.by_date.map(d => (
                  <div key={d.date} className={styles.barRow}>
                    <span className={styles.barDate}>{d.date.slice(5)}</span>
                    <div className={styles.barWrap}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${(d.count / maxCount) * 100}%` }}
                      >
                        {d.count > 0 && <span className={styles.barCount}>{d.count}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 28, textAlign: 'right' }}>
                      {d.hours}ч
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a
            href={`${import.meta.env.VITE_API_URL ?? '/_/backend'}/admin/export`}
            download
            className={styles.exportBtn}
          >
            ↓ Выгрузить Excel
          </a>
        </>
      )}
    </>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statVal}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}
