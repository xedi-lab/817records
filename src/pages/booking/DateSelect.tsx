import { useState } from 'react'
import { Card } from '../../components/Card'
import styles from './booking.module.css'

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

function isoDate(d: Date) { return d.toISOString().slice(0, 10) }

interface Props { onSelect: (date: string, label: string) => void }

export function DateSelect({ onSelect }: Props) {
  const [viewDate, setViewDate] = useState(() => new Date())
  const [selected, setSelected] = useState<string | null>(null)

  const today = isoDate(new Date())
  const maxDate = isoDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7
  const cells: (Date | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d))

  function select(date: Date) {
    const iso = isoDate(date)
    setSelected(iso)
    const label = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    onSelect(iso, label)
  }

  return (
    <div className={[styles.section, 'fade-in'].join(' ')}>
      <p className={styles.label}>Выберите дату</p>
      <Card>
        <div className={styles.calNav}>
          <button
            className={styles.calArrow}
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L6 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={styles.calMonth}>{MONTHS[month]} {year}</span>
          <button
            className={styles.calArrow}
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L10 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.calGrid}>
          {DAYS.map(d => <div key={d} className={styles.calDayName}>{d}</div>)}
          {cells.map((date, i) => {
            if (!date) return <div key={`e-${i}`} />
            const iso = isoDate(date)
            const isPast = iso < today
            const isFuture = iso > maxDate
            const isDisabled = isPast || isFuture
            const isSelected = iso === selected
            const isToday = iso === today
            return (
              <button
                key={iso}
                disabled={isDisabled}
                onClick={() => select(date)}
                className={[
                  styles.calDay,
                  !isDisabled ? styles.calDayAvail : '',
                  isPast ? styles.calDayPast : '',
                  isToday && !isSelected ? styles.calDayToday : '',
                  isSelected ? styles.calDaySelected : '',
                ].join(' ')}
              >
                {date.getDate()}
                {!isDisabled && !isSelected && <span className={styles.dot} />}
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
