import styles from './MediaPage.module.css'

export function MediaPage() {
  return (
    <div className={[styles.page, 'tab-in'].join(' ')}>
      <div className="page-content">
        {/* About */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>О студии</p>
          <div className={styles.card}>
            <p className={styles.about}>
              817* — камерная студия звукозаписи в Москве. Пространство для тех,
              кто серьёзно относится к звуку. Профессиональное оборудование,
              акустика ручной сборки, атмосфера без лишнего.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Цифры</p>
          <div className={styles.statsGrid}>
            <StatCard value="50+" label="Артистов" />
            <StatCard value="3+" label="Года работы" />
            <StatCard value="500+" label="Сессий" />
            <StatCard value="24/7" label="Поддержка" />
          </div>
        </section>

        {/* Equipment */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Оборудование</p>
          <div className={styles.equipList}>
            <EquipRow icon="🎙" text="Конденсаторный микрофон Neumann U87" />
            <EquipRow icon="🔊" text="Мониторы Yamaha HS8" />
            <EquipRow icon="🎛" text="Аудиоинтерфейс Universal Audio Apollo" />
            <EquipRow icon="💻" text="Apple Mac Studio M2 Ultra" />
            <EquipRow icon="🎸" text="Акустическая обработка ручной работы" />
          </div>
        </section>

        {/* Contacts */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Контакты</p>
          <div className={styles.card}>
            <ContactRow label="Telegram" value="@eightonesevenbot" />
            <ContactRow label="Адрес" value="Москва" />
            <ContactRow label="Часы" value="10:00 — 22:00 ежедневно" />
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

function EquipRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className={styles.equipRow}>
      <span className={styles.equipIcon}>{icon}</span>
      <span className={styles.equipText}>{text}</span>
    </div>
  )
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.contactRow}>
      <span className={styles.contactLabel}>{label}</span>
      <span className={styles.contactValue}>{value}</span>
    </div>
  )
}
