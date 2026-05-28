import { useState } from 'react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { api } from '../../lib/api'
import styles from './booking.module.css'
import type { BookingDraft } from '../../types'

interface Props {
  draft: BookingDraft
  tgUser: { id: number; first_name: string; username?: string } | null
  onDone: () => void
}

export function Summary({ draft, tgUser, onDone }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      await api.createBooking({
        telegram_id: tgUser?.id ?? 0,
        full_name: draft.name,
        username: tgUser?.username,
        phone: draft.phone || undefined,
        date: draft.date!,
        start_time: draft.startTime!,
        end_time: draft.endTime!,
        hours: draft.hours,
        comment: draft.comment || undefined,
      })
      onDone()
    } catch {
      setError('Не удалось отправить. Попробуй ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={[styles.section, 'fade-in'].join(' ')}>
      <p className={styles.label}>Подтверждение</p>

      <Card>
        <div className={styles.summaryRows}>
          <Row label="Дата" value={draft.dateLabel!} />
          <Row label="Время" value={`${draft.startTime} — ${draft.endTime}`} />
          <Row label="Длительность" value={`${draft.hours} ч`} />
          <div className={styles.summaryDivider} />
          <Row label="Имя" value={draft.name} />
          {draft.phone && <Row label="Телефон" value={draft.phone} />}
          {draft.comment && <Row label="Комментарий" value={draft.comment} />}
        </div>
      </Card>

      {error && <p style={{ color: 'var(--danger)', fontSize: 13, textAlign: 'center' }}>{error}</p>}

      <Button fullWidth loading={loading} onClick={submit}>
        Отправить заявку
      </Button>
      <p className={styles.hint}>Подтвердим в течение часа</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryRow}>
      <span className={styles.summaryKey}>{label}</span>
      <span className={styles.summaryVal}>{value}</span>
    </div>
  )
}
