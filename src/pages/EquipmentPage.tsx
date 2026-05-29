import styles from './EquipmentPage.module.css'

const HERO_PHOTO = 1
const GRID_PHOTOS = [2, 3, 4, 5, 6, 8]

const GEAR = [
  {
    category: 'Запись',
    items: [
      { name: 'MacBook Pro 16', detail: 'M1 Pro · 2021' },
      { name: 'NEUMANN TLM 103', detail: 'Конденсаторный микрофон' },
      { name: 'SHURE SM58', detail: 'Динамический · лайв / тренировка' },
    ],
  },
  {
    category: 'Мониторинг',
    items: [
      { name: 'ADAM A7X', detail: 'Мониторы ближнего поля' },
      { name: 'Beyerdynamic DT 770 Pro', detail: 'Закрытые наушники' },
      { name: 'Beyerdynamic Pro X', detail: 'Закрытые наушники' },
    ],
  },
  {
    category: 'Интерфейсы',
    items: [
      { name: 'Antelope Zen Q', detail: '64-bit AFC' },
      { name: 'Apollo Twin X', detail: 'UAD DSP' },
    ],
  },
  {
    category: 'Программное обеспечение',
    items: [
      { name: 'Ableton Live 12', detail: 'DAW' },
      { name: 'Logic Pro', detail: 'DAW' },
      { name: 'Waves · Valhalla · FabFilter', detail: 'Плагины' },
      { name: 'Ozone 11', detail: 'Мастеринг' },
    ],
  },
  {
    category: 'Зона отдыха',
    items: [
      { name: 'PlayStation 5', detail: '' },
      { name: 'Кулер', detail: 'Горячая и холодная вода' },
      { name: 'Чай и кофе', detail: 'Для гостей' },
    ],
  },
]

interface Props {
  onBack: () => void
}

export function EquipmentPage({ onBack }: Props) {
  return (
    <div className={[styles.page, 'tab-in'].join(' ')}>

      {/* Back button */}
      <button className={styles.backBtn} onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Медиа
      </button>

      <div className={styles.content}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Студия 817 Records</p>
          <h1 className={styles.title}>Наше<br/>оборудование</h1>
          <p className={styles.address}>м. Бутырская · Огородный проезд 8с1</p>
        </div>

        {/* Hero photo */}
        <div className={styles.heroSlot}>
          <img
            src={`/equipment/${HERO_PHOTO}.jpg`}
            alt="Студия 817"
            className={styles.photo}
          />
        </div>

        {/* Photo grid */}
        <div className={styles.photoGrid}>
          {GRID_PHOTOS.map(n => (
            <div key={n} className={styles.photoSlot}>
              <img
                src={`/equipment/${n}.jpg`}
                alt={`Оборудование ${n}`}
                className={styles.photo}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          ))}
        </div>

        {/* Gear list */}
        {GEAR.map(section => (
          <div key={section.category} className={styles.section}>
            <p className={styles.sectionLabel}>{section.category}</p>
            <div className={styles.itemList}>
              {section.items.map(item => (
                <div key={item.name} className={styles.item}>
                  <span className={styles.itemName}>{item.name}</span>
                  {item.detail && <span className={styles.itemDetail}>{item.detail}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
