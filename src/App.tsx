import { useEffect, useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { initTwa, getTwaUser, haptic } from './lib/twa'
import { Header } from './components/Header'
import { Button } from './components/Button'
import { DateSelect } from './pages/booking/DateSelect'
import { TimeSelect } from './pages/booking/TimeSelect'
import { DurationSelect } from './pages/booking/DurationSelect'
import { ContactInput } from './pages/booking/ContactInput'
import { Summary } from './pages/booking/Summary'
import { AdminPage } from './pages/AdminPage'
import type { BookingDraft, BookingStep, Page } from './types'
import styles from './App.module.css'

const ADMIN_IDS = [7639287231]

const emptyDraft = (): BookingDraft => ({
  date: null, dateLabel: null,
  startTime: null, endTime: null,
  hours: 2, name: '', phone: '', comment: '',
})

export default function App() {
  const tgUser = getTwaUser()
  const colorScheme = (window as any).Telegram?.WebApp?.colorScheme ?? 'light'
  const [theme, toggleTheme] = useTheme(colorScheme)

  const isAdmin = tgUser ? ADMIN_IDS.includes(tgUser.id) : false

  const [page, setPage] = useState<Page>('home')
  const [step, setStep] = useState<BookingStep>('date')
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft())

  useEffect(() => { try { initTwa() } catch {} }, [])

  const steps: BookingStep[] = ['date', 'time', 'duration', 'contact', 'summary', 'done']
  const stepTitles: Record<BookingStep, string> = {
    date: 'Выбор даты', time: 'Выбор времени',
    duration: 'Длительность', contact: 'Контакт',
    summary: 'Подтверждение', done: 'Готово',
  }

  function startBooking() { haptic('medium'); setPage('booking'); setStep('date') }

  function handleBack() {
    if (page === 'booking') {
      const idx = steps.indexOf(step)
      if (idx <= 0) { setPage('home'); return }
      setStep(steps[idx - 1])
    } else {
      setPage('home')
    }
  }

  // ── Booking flow ──────────────────────────────────────────────────────
  if (page === 'booking') {
    return (
      <div className="page">
        <Header theme={theme} onToggleTheme={toggleTheme} onBack={handleBack} title={stepTitles[step]} />
        <div className="page-content">
          {step === 'date' && (
            <DateSelect onSelect={(date, label) => {
              haptic('light')
              setDraft(d => ({ ...d, date, dateLabel: label }))
              setStep('time')
            }} />
          )}
          {step === 'time' && (
            <TimeSelect date={draft.date!} onSelect={startTime => {
              haptic('light')
              setDraft(d => ({ ...d, startTime }))
              setStep('duration')
            }} />
          )}
          {step === 'duration' && (
            <DurationSelect startTime={draft.startTime!} onNext={(hours, endTime) => {
              haptic('light')
              setDraft(d => ({ ...d, hours, endTime }))
              setStep('contact')
            }} />
          )}
          {step === 'contact' && (
            <ContactInput
              initialName={tgUser ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}` : ''}
              onNext={(name, phone, comment) => {
                haptic('light')
                setDraft(d => ({ ...d, name, phone, comment }))
                setStep('summary')
              }}
            />
          )}
          {step === 'summary' && (
            <Summary draft={draft} tgUser={tgUser} onDone={() => { haptic('success'); setStep('done') }} />
          )}
          {step === 'done' && (
            <div className={styles.doneScreen}>
              <div className={styles.doneIcon}>✓</div>
              <h2 className={styles.doneTitle}>Заявка отправлена!</h2>
              <p className={styles.doneSub}>
                Рассмотрим и уведомим тебя в Telegram
              </p>
              <Button fullWidth onClick={() => { setPage('home'); setDraft(emptyDraft()) }}>
                На главную
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Admin ─────────────────────────────────────────────────────────────
  if (page === 'admin') {
    return (
      <div className="page">
        <Header theme={theme} onToggleTheme={toggleTheme} onBack={() => setPage('home')} title="Управление" />
        <AdminPage />
      </div>
    )
  }

  // ── Home ──────────────────────────────────────────────────────────────
  return (
    <div className="page">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className={styles.homeContent}>
        <div className={styles.hero}>
          <p className={styles.heroLabel}>Студия звукозаписи</p>
          <h1 className={styles.heroTitle}>817<span className={styles.heroStar}>*</span></h1>
          <p className={styles.heroCity}>Санкт-Петербург</p>
        </div>

        <div className={styles.homeActions}>
          {tgUser && <p className={styles.greeting}>Привет, {tgUser.first_name}</p>}
          <Button fullWidth onClick={startBooking}>Забронировать</Button>
          {isAdmin && (
            <Button fullWidth variant="ghost" onClick={() => setPage('admin')}>
              Панель управления
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
