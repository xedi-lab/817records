import { useState } from 'react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import styles from './booking.module.css'

const MAX_HOUR = 22

interface Props {
  startTime: string
  onNext: (hours: number, endTime: string) => void
}

export function DurationSelect({ startTime, onNext }: Props) {
  const startH = parseInt(startTime)
  const maxHours = MAX_HOUR - startH
  const [hours, setHours] = useState(Math.min(2, maxHours))

  const endH = startH + hours
  const endTime = `${String(endH).padStart(2, '0')}:00`

  return (
    <div className={[styles.section, 'fade-in'].join(' ')}>
      <p className={styles.label}>Длительность</p>

      <Card>
        <div className={styles.counterRow}>
          <span className={styles.counterLabel}>{startTime} — {endTime}</span>
          <div className={styles.counter}>
            <button
              className={styles.counterBtn}
              disabled={hours <= 1}
              onClick={() => setHours(h => h - 1)}
            >−</button>
            <span className={styles.counterVal}>{hours}ч</span>
            <button
              className={styles.counterBtn}
              disabled={hours >= maxHours}
              onClick={() => setHours(h => h + 1)}
            >+</button>
          </div>
        </div>
      </Card>

      <Button fullWidth onClick={() => onNext(hours, endTime)}>
        Продолжить
      </Button>
    </div>
  )
}
