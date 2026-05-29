import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/Button'
import { Loader } from '../../components/Loader'
import { toast } from '../../lib/toast'
import styles from './Dashboard.module.css'

interface SlotWindow { id: number; date: string; start_time: string; end_time: string }

const DAYS_RU = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return { date: `${d.getDate()} ${MONTHS_RU[d.getMonth()]}`, day: DAYS_RU[d.getDay()] }
}

function buildWeek() {
  const days: string[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export function SlotManager() {
  const [windows, setWindows] = useState<SlotWindow[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)
  const [newStart, setNewStart] = useState('10:00')
  const [newEnd, setNewEnd] = useState('22:00')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const week = buildWeek()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const r = await api.getSlotWindows()
      setWindows(r.windows)
    } catch {}
    setLoading(false)
  }

  async function addSlot(date: string) {
    if (newStart >= newEnd) { toast.error('Начало должно быть раньше конца'); return }
    setSaving(true)
    try {
      const w = await api.createSlotWindow({ date, start_time: newStart, end_time: newEnd })
      setWindows(prev => [...prev, w])
      setAdding(null)
      toast.success('Окно добавлено')
    } catch {
      toast.error('Не удалось сохранить')
    }
    setSaving(false)
  }

  async function deleteSlot(id: number) {
    setDeleting(id)
    try {
      await api.deleteSlotWindow(id)
      setWindows(prev => prev.filter(w => w.id !== id))
    } catch {
      toast.error('Не удалось удалить')
    }
    setDeleting(null)
  }

  if (loading) return <Loader />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>
        Свободные временные окна на ближайшие 14 дней. Без окон — доступно любое время 10–22.
      </p>

      {week.map(date => {
        const dayWindows = windows.filter(w => w.date === date)
        const isAdding = adding === date
        const { date: dateStr, day } = formatDate(date)

        return (
          <div key={date} className={styles.slotDay}>
            <div className={styles.slotDayHead}>
              <div>
                <span className={styles.slotDayDate}>{dateStr}</span>
                <span className={styles.slotDayDay}> · {day}</span>
              </div>
              <button
                className={styles.slotAddBtn}
                onClick={() => setAdding(isAdding ? null : date)}
              >
                {isAdding ? '✕' : '+'}
              </button>
            </div>

            {dayWindows.length === 0 && !isAdding && (
              <div className={styles.slotEmpty}>нет окон</div>
            )}

            {dayWindows.length > 0 && (
              <div className={styles.slotList}>
                {dayWindows.map(w => (
                  <div key={w.id} className={styles.slotItem}>
                    <span className={styles.slotTime}>{w.start_time} — {w.end_time}</span>
                    <button
                      className={styles.slotDel}
                      onClick={() => deleteSlot(w.id)}
                      disabled={deleting === w.id}
                    >
                      {deleting === w.id
                        ? <span className={styles.actSpinner} style={{ width: 12, height: 12 }} />
                        : '×'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isAdding && (
              <div className={styles.slotAddForm}>
                <input
                  type="time" value={newStart}
                  onChange={e => setNewStart(e.target.value)}
                  className={styles.timeInput}
                />
                <span style={{ color: 'var(--text-secondary)', fontSize: 18, flexShrink: 0 }}>—</span>
                <input
                  type="time" value={newEnd}
                  onChange={e => setNewEnd(e.target.value)}
                  className={styles.timeInput}
                />
                <Button onClick={() => addSlot(date)} loading={saving}>
                  Добавить
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
