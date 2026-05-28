import { useState } from 'react'
import { Overview } from './Overview'
import { BookingsList } from './BookingsList'
import { SlotManager } from './SlotManager'
import { Analytics } from './Analytics'
import { Broadcast } from './Broadcast'
import { Clients } from './Clients'
import styles from './Dashboard.module.css'

type DashTab = 'overview' | 'bookings' | 'slots' | 'analytics' | 'broadcast' | 'clients'

const TABS: { id: DashTab; label: string }[] = [
  { id: 'overview',   label: 'Обзор' },
  { id: 'bookings',   label: 'Брони' },
  { id: 'slots',      label: 'Слоты' },
  { id: 'analytics',  label: 'Аналитика' },
  { id: 'broadcast',  label: 'Рассылка' },
  { id: 'clients',    label: 'Клиенты' },
]

export function DashboardPage() {
  const [tab, setTab] = useState<DashTab>('overview')

  return (
    <div className={['tab-in', styles.wrap].join(' ')}>
      <div className={styles.tabsWrap}>
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[styles.tab, tab === t.id ? styles.tabActive : ''].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} className={['page-content', 'fade-in'].join(' ')}>
        {tab === 'overview'  && <Overview />}
        {tab === 'bookings'  && <BookingsList />}
        {tab === 'slots'     && <SlotManager />}
        {tab === 'analytics' && <Analytics />}
        {tab === 'broadcast' && <Broadcast />}
        {tab === 'clients'   && <Clients />}
      </div>
    </div>
  )
}
