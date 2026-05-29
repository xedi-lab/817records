import { useEffect, useRef, useState } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { Loader } from './components/Loader'
import { useTheme } from './hooks/useTheme'
import { initTwa, getTwaUser, haptic } from './lib/twa'
import { api } from './lib/api'
import { Header } from './components/Header'
import { BottomNav, type NavTab } from './components/BottomNav'
import { Button } from './components/Button'
import { HomePage } from './pages/HomePage'
import { BookLandingPage } from './pages/BookLandingPage'
import { MediaPage } from './pages/MediaPage'
import { PricingPage } from './pages/PricingPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { DateSelect } from './pages/booking/DateSelect'
import { TimeSelect } from './pages/booking/TimeSelect'
import { DurationSelect } from './pages/booking/DurationSelect'
import { ContactInput } from './pages/booking/ContactInput'
import { Summary } from './pages/booking/Summary'
import type { BookingDraft, BookingStep } from './types'
import styles from './App.module.css'

const ADMIN_IDS = [7639287231]

const emptyDraft = (): BookingDraft => ({
  date: null, dateLabel: null, startTime: null, endTime: null,
  hours: 2, name: '', phone: '', comment: '',
})

const STEP_TITLES: Record<BookingStep, string> = {
  date: 'Выбор даты', time: 'Выбор времени',
  duration: 'Длительность', contact: 'Контакт',
  summary: 'Подтверждение', done: 'Готово',
}
const STEPS: BookingStep[] = ['date', 'time', 'duration', 'contact', 'summary', 'done']

export default function App() {
  // ALL hooks at top — no conditional calls
  const [splashDone, setSplashDone] = useState(false)
  const [tgUser, setTgUser] = useState(() => getTwaUser())
  const [tab, setTab] = useState<NavTab>('home')
  const [booking, setBooking] = useState<BookingStep | null>(null)
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft())
  const [tabOverlay, setTabOverlay] = useState(false)
  const [tabOverlayLeaving, setTabOverlayLeaving] = useState(false)
  const overlayTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  useTheme()

  const isAdmin = tgUser ? ADMIN_IDS.includes(tgUser.id) : false

  useEffect(() => {
    try { initTwa() } catch {}
    const user = getTwaUser()
    if (user) {
      setTgUser(user)
      api.trackVisit({ telegram_id: user.id, first_name: user.first_name, username: user.username }).catch(() => {})
    }
  }, [])

  function startBooking() {
    haptic('medium'); setDraft(emptyDraft()); setBooking('date')
  }
  function handleBookBack() {
    const idx = STEPS.indexOf(booking!)
    if (idx <= 0) { setBooking(null); setTab('home') }
    else setBooking(STEPS[idx - 1])
  }
  function handleTabChange(t: NavTab) {
    if (t === tab) return
    haptic('light')
    setTab(t)
    overlayTimers.current.forEach(clearTimeout)
    setTabOverlay(true)
    setTabOverlayLeaving(false)
    const t1 = setTimeout(() => setTabOverlayLeaving(true), 380)
    const t2 = setTimeout(() => { setTabOverlay(false); setTabOverlayLeaving(false) }, 600)
    overlayTimers.current = [t1, t2]
  }

  // ── Build main content ─────────────────────────────────────────────────────
  let content: React.ReactNode

  if (booking !== null) {
    content = (
      <div className="page-no-nav">
        <Header onBack={handleBookBack} title={STEP_TITLES[booking]} />
        <div className="page-content">
          {booking === 'date' && (
            <DateSelect onSelect={(date, label) => {
              haptic('light'); setDraft(d => ({ ...d, date, dateLabel: label })); setBooking('time')
            }} />
          )}
          {booking === 'time' && (
            <TimeSelect date={draft.date!} onSelect={t => {
              haptic('light'); setDraft(d => ({ ...d, startTime: t })); setBooking('duration')
            }} />
          )}
          {booking === 'duration' && (
            <DurationSelect startTime={draft.startTime!} onNext={(hours, endTime) => {
              haptic('light'); setDraft(d => ({ ...d, hours, endTime })); setBooking('contact')
            }} />
          )}
          {booking === 'contact' && (
            <ContactInput
              initialName={tgUser ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}` : ''}
              onNext={(name, phone, comment) => {
                haptic('light'); setDraft(d => ({ ...d, name, phone, comment })); setBooking('summary')
              }}
            />
          )}
          {booking === 'summary' && (
            <Summary draft={draft} tgUser={tgUser} onDone={() => { haptic('success'); setBooking('done') }} />
          )}
          {booking === 'done' && (
            <div className={styles.doneScreen}>
              <div className={styles.doneIcon}>✓</div>
              <h2 className={styles.doneTitle}>Заявка отправлена!</h2>
              <p className={styles.doneSub}>Рассмотрим и уведомим тебя в Telegram</p>
              <Button fullWidth onClick={() => { setBooking(null); setTab('home'); setDraft(emptyDraft()) }}>
                На главную
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  } else {
    content = (
      <div className="page">
        <Header />
        <div className={styles.tabContent} key={tab}>
          {tab === 'home'      && <HomePage userName={tgUser?.first_name} onBook={startBooking} />}
          {tab === 'book'      && <BookLandingPage onBook={startBooking} />}
          {tab === 'prices'    && <PricingPage />}
          {tab === 'media'     && <MediaPage />}
          {tab === 'dashboard' && <DashboardPage />}
        </div>
        <BottomNav active={tab} onChange={handleTabChange} isAdmin={isAdmin} />
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {content}
      {tabOverlay && (
        <div className={[styles.tabOverlay, tabOverlayLeaving ? styles.tabOverlayLeaving : ''].join(' ')}>
          <Loader />
        </div>
      )}
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
    </>
  )
}
