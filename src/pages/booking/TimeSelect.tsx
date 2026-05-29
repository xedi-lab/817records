import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Loader } from '../../components/Loader'
import styles from './booking.module.css'

interface Props {
  date: string
  onSelect: (startTime: string) => void
}

export function TimeSelect({ date, onSelect }: Props) {
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.getSlots(date)
      .then(r => {
        const available = (r.slots ?? [])
          .filter((s: any) => s.is_available)
          .map((s: any) => s.start_time as string)
        setSlots(available)
      })
      .catch(() => {
        // fallback — показываем все часы 10-21
        const fallback: string[] = []
        for (let h = 10; h < 22; h++) fallback.push(`${String(h).padStart(2, '0')}:00`)
        setSlots(fallback)
      })
      .finally(() => setLoading(false))
  }, [date])

  function pick(t: string) {
    setSelected(t)
    onSelect(t)
  }

  if (loading) return <Loader />

  return (
    <div className={[styles.section, 'fade-in'].join(' ')}>
      <p className={styles.label}>Выберите время</p>
      {slots.length === 0 ? (
        <p className={styles.empty}>На этот день нет свободного времени</p>
      ) : (
        <div className={styles.timeGrid}>
          {slots.map(t => (
            <button
              key={t}
              onClick={() => pick(t)}
              className={[
                styles.timeBtn,
                selected === t ? styles.timeBtnActive : '',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
