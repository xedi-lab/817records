import { Button } from '../components/Button'
import styles from './HomePage.module.css'

const BLACK_VIDEOS = ['/logo-black-1.mp4', '/logo-black-2.mp4', '/logo-black-3.mp4']

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Выбираем видео один раз при загрузке модуля и сразу начинаем prefetch
const SELECTED_VIDEO = pickRandom(BLACK_VIDEOS)
const _prefetch = document.createElement('link')
_prefetch.rel = 'preload'
_prefetch.as = 'video'
_prefetch.href = SELECTED_VIDEO
document.head.appendChild(_prefetch)

interface Props {
  userName?: string
  onBook: () => void
}

export function HomePage({ userName, onBook }: Props) {
  const videoSrc = SELECTED_VIDEO

  return (
    <div className={[styles.page, 'tab-in'].join(' ')}>
      <div className={styles.logoWrapper}>
        <video
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={styles.logoVideoEl}
        />
        <div className={styles.logoGradient} />
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>817<span className={styles.logoStar}>*</span></span>
          <span className={styles.logoCity}>Moscow</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <MetaRow label="Часы работы" value="10:00 — 22:00" />
          <MetaRow label="Запись" value="Ежедневно" />
          <MetaRow label="Услуги" value="Запись · сведение · мастеринг" />
        </div>

        <div className={styles.actions}>
          {userName && <p className={styles.greeting}>Привет, {userName}</p>}
          <Button fullWidth onClick={onBook}>Забронировать сессию</Button>
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  )
}
