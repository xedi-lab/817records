import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/Button'
import { toast } from '../../lib/toast'
import styles from './Dashboard.module.css'

const MAX_CHARS = 1000

export function Broadcast() {
  const [message, setMessage] = useState('')
  const [clientCount, setClientCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)

  useEffect(() => {
    api.getClients().then(r => setClientCount(r.total)).catch(() => {})
  }, [])

  async function send() {
    if (!message.trim() || loading) return
    setLoading(true)
    try {
      const r = await api.broadcast(message.trim())
      setResult({ sent: r.sent, failed: r.failed })
      setMessage('')
    } catch {
      toast.error('Ошибка рассылки')
    }
    setLoading(false)
  }

  if (result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className={styles.broadcastResult}>
          <strong>{result.sent}</strong>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>сообщений доставлено</p>
          {result.failed > 0 && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
              {result.failed} не доставлено
            </p>
          )}
        </div>
        <Button variant="secondary" onClick={() => setResult(null)} fullWidth>
          Новая рассылка
        </Button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {clientCount !== null && (
        <div className={styles.broadcastAudience}>
          <span className={styles.broadcastDot} />
          {clientCount} клиентов получат сообщение
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <textarea
          className={styles.broadcastTextarea}
          value={message}
          onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Текст сообщения..."
          rows={6}
        />
        <span className={styles.charCount}>{message.length}/{MAX_CHARS}</span>
      </div>

      <Button
        fullWidth
        loading={loading}
        disabled={!message.trim()}
        onClick={send}
      >
        {clientCount !== null ? `Отправить ${clientCount} клиентам` : 'Отправить'}
      </Button>
    </div>
  )
}
