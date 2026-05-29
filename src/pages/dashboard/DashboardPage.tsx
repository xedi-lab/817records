import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { BookingsList } from './BookingsList'
import { SlotManager } from './SlotManager'
import { Analytics } from './Analytics'
import { Broadcast } from './Broadcast'
import { Clients } from './Clients'
import styles from './Dashboard.module.css'

type DashView = 'home' | 'bookings' | 'slots' | 'analytics' | 'broadcast' | 'clients'

const VIEW_TITLES: Record<Exclude<DashView, 'home'>, string> = {
  bookings: 'Брони', slots: 'Окна', analytics: 'Аналитика',
  broadcast: 'Рассылка', clients: 'Клиенты',
}

export function DashboardPage() {
  const [view, setView] = useState<DashView>('home')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    api.getStats().then(d => { if (d) setStats(d) }).catch(() => {})
  }, [])

  // ── Sub-view ────────────────────────────────────────────────────────────────
  if (view !== 'home') {
    return (
      <div className={['tab-in', styles.subWrap].join(' ')}>
        <button className={styles.subBack} onClick={() => setView('home')}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Панель
        </button>
        <p className={styles.subTitle}>{VIEW_TITLES[view]}</p>
        <div className="page-content">
          {view === 'bookings'  && <BookingsList />}
          {view === 'slots'     && <SlotManager />}
          {view === 'analytics' && <Analytics />}
          {view === 'broadcast' && <Broadcast />}
          {view === 'clients'   && <Clients />}
        </div>
      </div>
    )
  }

  // ── Home ────────────────────────────────────────────────────────────────────
  const pending = stats?.pending ?? 0

  return (
    <div className={['tab-in', styles.homeWrap].join(' ')}>
      <div className="page-content">

        {/* Header */}
        <div className={styles.homeHeader}>
          <p className={styles.homeEyebrow}>Панель управления</p>
          <h1 className={styles.homeTitle}>817<span style={{ color: 'var(--text-secondary)' }}>*</span></h1>
        </div>

        {/* Quick stats */}
        <div className={styles.quickStats}>
          <QuickStat label="Ожидают" value={stats?.pending ?? '—'} accent={pending > 0} />
          <QuickStat label="Броней"  value={stats?.total_bookings ?? '—'} />
          <QuickStat label="Клиентов" value={stats?.total_clients ?? '—'} />
        </div>

        {/* Брони — wide tile */}
        <button className={[styles.tile, styles.tileWide].join(' ')} onClick={() => setView('bookings')}>
          <div className={styles.tileWideLeft}>
            <div className={styles.tileIcon}><IcoBookings /></div>
            <div>
              <p className={styles.tileTitle}>Брони</p>
              <p className={styles.tileSub}>
                {pending > 0 ? `${pending} ожидают подтверждения` : 'Управление заявками'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {pending > 0 && <span className={styles.badge}>{pending}</span>}
            <IcoArrow />
          </div>
        </button>

        {/* 2-column grid */}
        <div className={styles.tilesGrid}>
          <button className={styles.tile} onClick={() => setView('slots')}>
            <div className={styles.tileIcon}><IcoSlots /></div>
            <p className={styles.tileTitle}>Окна</p>
            <p className={styles.tileSub}>Расписание</p>
            <IcoArrow small />
          </button>

          <button className={styles.tile} onClick={() => setView('analytics')}>
            <div className={styles.tileIcon}><IcoAnalytics /></div>
            <p className={styles.tileTitle}>Аналитика</p>
            <p className={styles.tileSub}>Статистика</p>
            <IcoArrow small />
          </button>

          <button className={styles.tile} onClick={() => setView('broadcast')}>
            <div className={styles.tileIcon}><IcoBroadcast /></div>
            <p className={styles.tileTitle}>Рассылка</p>
            <p className={styles.tileSub}>Клиентам</p>
            <IcoArrow small />
          </button>

          <button className={styles.tile} onClick={() => setView('clients')}>
            <div className={styles.tileIcon}><IcoClients /></div>
            <p className={styles.tileTitle}>Клиенты</p>
            <p className={styles.tileSub}>База данных</p>
            <IcoArrow small />
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function QuickStat({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  return (
    <div className={styles.quickStat}>
      <span className={[styles.quickVal, accent ? styles.quickAccent : ''].join(' ')}>{value}</span>
      <span className={styles.quickLabel}>{label}</span>
    </div>
  )
}

function IcoArrow({ small }: { small?: boolean }) {
  const s = small ? 14 : 18
  return (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 4l5 5-5 5" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IcoBookings() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg>
}
function IcoSlots() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function IcoAnalytics() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
function IcoBroadcast() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.88 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
}
function IcoClients() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
}
