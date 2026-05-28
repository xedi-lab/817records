import { useState } from 'react'
import styles from './booking.module.css'

const SLOTS: string[] = []
for (let h = 10; h < 22; h++) SLOTS.push(`${String(h).padStart(2, '0')}:00`)

interface Props {
  date: string
  onSelect: (startTime: string) => void
}

export function TimeSelect({ date: _date, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function pick(t: string) {
    setSelected(t)
    onSelect(t)
  }

  return (
    <div className={[styles.section, 'fade-in'].join(' ')}>
      <p className={styles.label}>Выберите время</p>
      <div className={styles.timeGrid}>
        {SLOTS.map(t => (
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
    </div>
  )
}
