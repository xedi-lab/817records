import { Button } from '../components/Button'
import styles from './BookLandingPage.module.css'

interface Props {
  onBook: () => void
}

export function BookLandingPage({ onBook }: Props) {
  return (
    <div className={['tab-in', styles.page].join(' ')}>
      {/* Photo banner */}
      <div className={styles.banner}>
        <img src="/studio.jpg" alt="817 RECORDS" className={styles.bannerImg} />
        <div className={styles.bannerOverlay}>
          <span className={styles.bannerTitle}>817<span className={styles.bannerStar}>*</span></span>
          <span className={styles.bannerSub}>Moscow</span>
        </div>
      </div>

      {/* Info block */}
      <div className={styles.content}>
        <div className={styles.infoGrid}>
          <InfoItem label="Длительность" value="от 1 часа" />
          <InfoItem label="Работаем" value="10:00 — 22:00" />
          <InfoItem label="Подтверждение" value="до 1 часа" />
          <InfoItem label="Дни" value="Ежедневно" />
        </div>

        <div className={styles.note}>
          Выбери удобное время — мы подтвердим бронь и напишем тебе в Telegram.
        </div>

        <Button fullWidth onClick={onBook}>Забронировать</Button>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  )
}
