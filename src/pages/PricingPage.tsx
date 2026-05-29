import styles from './PricingPage.module.css'

const SERVICES = [
  { file: '/price-work.jpg',        label: 'Запись' },
  { file: '/price-mix-master.jpg',  label: 'Сведение / Мастеринг' },
  { file: '/price-custom-beat.jpg', label: 'Custom Beat' },
  { file: '/price-leasing.jpg',     label: 'Лизинг бита' },
  { file: '/price-distribution.jpg',label: 'Дистрибуция' },
  { file: '/price-learning.jpg',    label: 'Обучение' },
]

export function PricingPage() {
  return (
    <div className={[styles.page, 'tab-in'].join(' ')}>
      <div className="page-content">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Услуги</p>
          <h2 className={styles.title}>Цены</h2>
        </div>

        <div className={styles.list}>
          {SERVICES.map(({ file, label }) => (
            <div key={file} className={styles.item}>
              <p className={styles.itemLabel}>{label}</p>
              <img src={file} alt={label} className={styles.itemImg} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
