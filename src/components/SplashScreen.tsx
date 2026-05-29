import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

const TAGLINES = ['no snitching', 'gang pow pow', "drxg's"]

const PRELOAD_ASSETS = [
  '/logo-black-1.mp4', '/logo-black-2.mp4', '/logo-black-3.mp4',
  '/we-are-817.jpg', '/studio.jpg', '/studio2.jpg',
]

const BAR_SPEEDS = [0.62, 0.88, 0.54, 0.96, 0.71]

function preloadAll() {
  PRELOAD_ASSETS.forEach(src => {
    if (src.endsWith('.mp4')) {
      const v = document.createElement('video')
      v.src = src; v.preload = 'auto'
    } else {
      const img = new Image(); img.src = src
    }
  })
}

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [tagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)])
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    preloadAll()
    const duration = 2500 + Math.random() * 1000   // 2.5 – 3.5 s
    const t1 = setTimeout(() => setLeaving(true), duration - 350)
    const t2 = setTimeout(onDone, duration)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={[styles.splash, leaving ? styles.leaving : ''].join(' ')}>
      <div className={styles.center}>
        <div className={styles.logo}>
          817<span className={styles.star}>*</span>
        </div>

        {/* EQ visualizer bars */}
        <div className={styles.bars}>
          {BAR_SPEEDS.map((dur, i) => (
            <div
              key={i}
              className={styles.bar}
              style={{ animationDuration: `${dur}s`, animationDelay: `${i * 0.09}s` }}
            />
          ))}
        </div>
      </div>

      <p className={styles.tagline}>{tagline}</p>
    </div>
  )
}
