import { useEffect, useState } from 'react'
import styles from './Loader.module.css'

const MESSAGES = [
  { delay: 1800, text: 'загружаем...' },
  { delay: 3500, text: 'почти готово' },
  { delay: 6000, text: 'ещё секунду...' },
]

const BAR_SPEEDS = [0.58, 0.82, 0.50, 0.91, 0.68]

export function Loader({ full }: { full?: boolean }) {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const timers = MESSAGES.map(({ delay, text }) =>
      setTimeout(() => setMsg(text), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className={[styles.wrap, full ? styles.full : ''].join(' ')}>
      <div className={styles.inner}>
        <div className={styles.bars}>
          {BAR_SPEEDS.map((dur, i) => (
            <div
              key={i}
              className={styles.bar}
              style={{ animationDuration: `${dur}s`, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
        {msg && <p className={styles.msg}>{msg}</p>}
      </div>
    </div>
  )
}
