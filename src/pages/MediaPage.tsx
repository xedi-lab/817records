import { useState } from 'react'
import { EquipmentPage } from './EquipmentPage'
import styles from './MediaPage.module.css'

export function MediaPage() {
  const [showEquipment, setShowEquipment] = useState(false)

  if (showEquipment) {
    return <EquipmentPage onBack={() => setShowEquipment(false)} />
  }

  return (
    <div className={[styles.page, 'tab-in'].join(' ')}>
      <div className={styles.bg} />

      <div className={styles.content}>

        {/* About */}
        <section className={styles.section}>
          <p className={styles.eyebrow}>О студии</p>
          <p className={styles.about}>
            817* — камерная студия звукозаписи в Москве. Пространство для тех,
            кто серьёзно относится к звуку. Профессиональное оборудование,
            акустика ручной сборки, атмосфера без лишнего.
          </p>
        </section>

        {/* Stats */}
        <section className={styles.section}>
          <p className={styles.eyebrow}>Цифры</p>
          <div className={styles.statsGrid}>
            <StatCard value="50+"  label="Артистов" />
            <StatCard value="10+"  label="Лет работы" />
            <StatCard value="500+" label="Сессий" />
            <StatCard value="24/7" label="Поддержка" />
          </div>
        </section>

        {/* Equipment — clickable */}
        <section className={styles.section}>
          <p className={styles.eyebrow}>Оборудование</p>
          <button className={styles.equipCard} onClick={() => setShowEquipment(true)}>
            <div className={styles.equipCardLeft}>
              <span className={styles.equipCardTitle}>Наше оборудование</span>
              <span className={styles.equipCardSub}>NEUMANN · ADAM · Apollo · и др.</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4l5 5-5 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </section>

        {/* Contacts */}
        <section className={styles.section}>
          <p className={styles.eyebrow}>Контакты</p>
          <div className={styles.contactsList}>
            <ContactRow label="Telegram" value="@msc817" href="https://t.me/msc817" />
            <ContactRow label="Адрес"    value="м. Бутырская, Огородный пр. 8с1" />
            <ContactRow label="Часы"     value="10:00 — 22:00 ежедневно" />
          </div>
        </section>

      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className={styles.contactRow}>
      <span className={styles.contactLabel}>{label}</span>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>{value}</a>
        : <span className={styles.contactValue}>{value}</span>
      }
    </div>
  )
}
