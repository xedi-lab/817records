import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/Button'
import { Loader } from '../../components/Loader'
import styles from './Dashboard.module.css'

interface SlotWindow { id: number; date: string; start_time: string; end_time: string }

const DAYS_RU = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
const MONTHS_RU = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]}, ${DAYS_RU[d.getDay()]}`
}

function buildWeek() {
  const days = []
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
  const [saveError, setSaveError] = useState<string | null>(null)
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
    if (newStart >= newEnd) {
      setSaveError('Начало должно быть раньше конца')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const w = await api.createSlotWindow({ date, start_time: newStart, end_time: newEnd })
      setWindows(prev => [...prev, w])
      setAdding(null)
    } catch {
      setSaveError('Не удалось сохранить. Проверь соединение.')
    }
    setSaving(false)
  }

  async function deleteSlot(id: number) {
    setDeleting(id)
    try {
      await api.deleteSlotWindow(id)
      setWindows(prev => prev.filter(w => w.id !== id))
    } catch {}
    setDeleting(null)
  }

  if (loading) return <Loader />

  return (
    <>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        Добавь свободные окна на ближайшие две недели. Если окон нет — клиенты могут бронировать любое время 10–22.
      </p>

      {week.map(date => {
        const dayWindows = windows.filter(w => w.date === date)
        const isAdding = adding === date

        return (
          <div key={date} className={styles.slotDay}>
            <div className={styles.slotDayHead}>
              <div className={styles.slotDayDate}>{formatDate(date)}</div>
              <button
                onClick={() => { setAdding(isAdding ? null : date); setSaveError(null) }}
                style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}
              >
                {isAdding ? 'Отмена' : '+ Добавить'}
              </button>
            </div>

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
                      {deleting === w.id ? <span className={styles.actSpinner} /> : '×'}
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
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>—</span>
                <input
                  type="time" value={newEnd}
                  onChange={e => setNewEnd(e.target.value)}
                  className={styles.timeInput}
                />
                <Button onClick={() => addSlot(date)} loading={saving}>ОК</Button>
              </div>
            )}
            {isAdding && saveError && (
              <p style={{ fontSize: 12, color: 'var(--danger)', padding: '4px 14px 10px' }}>
                {saveError}
              </p>
            )}
          </div>
        )
      })}
    </>
  )
}
