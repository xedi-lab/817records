import { Button } from '../components/Button'
import styles from './HomePage.module.css'

interface Props {
  userName?: string
  onBook: () => void
}

export function HomePage({ userName, onBook }: Props) {
  return (
    <div className={[styles.page, 'tab-in'].join(' ')}>
      {/* GIF placeholder — будет заменён на зацикленный лого */}
      <div className={styles.gifPlaceholder}>
        <span className={styles.gifText}>817<span className={styles.gifStar}>*</span></span>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={styles.heroTitle}>817<span className={styles.star}>*</span></h1>
          <p className={styles.city}>Moscow</p>
        </div>

        <div className={styles.meta}>
          <MetaRow label="Часы работы" value="10:00 — 22:00" />
          <MetaRow label="Запись" value="Ежедневно" />
          <MetaRow label="Услуги" value="Запись · сведение · мастеринг" />
        </div>

        <div className={styles.actions}>
          {userName && <p className={styles.greeting}>Привет, {userName} 👋</p>}
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
