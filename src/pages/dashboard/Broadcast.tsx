import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/Button'
import styles from './Dashboard.module.css'

export function Broadcast() {
  const [message, setMessage] = useState('')
  const [clientCount, setClientCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    api.getClients().then(r => setClientCount(r.total))
  }, [])

  async function send() {
    if (!message.trim()) return
    setLoading(true)
    try {
      const r = await api.broadcast(message.trim())
      setResult({ sent: r.sent, failed: r.failed })
      setMessage('')
      setConfirm(false)
    } catch {}
    setLoading(false)
  }

  if (result) {
    return (
      <div className={styles.broadcastResult}>
        <strong style={{ color: 'var(--text)' }}>{result.sent}</strong>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>сообщений доставлено</p>
        {result.failed > 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            {result.failed} не доставлено
          </p>
        )}
        <Button variant="secondary" onClick={() => setResult(null)} fullWidth>
          Новая рассылка
        </Button>
      </div>
    )
  }

  return (
    <>
      <p className={styles.broadcastHint}>
        Сообщение получат все клиенты, кто хоть раз открывал приложение.
        {clientCount !== null && ` Сейчас: ${clientCount} человек.`}
      </p>

      <textarea
        className={styles.broadcastTextarea}
        value={message}
        onChange={e => { setMessage(e.target.value); setConfirm(false) }}
        placeholder="Напиши сообщение для рассылки..."
        rows={5}
      />

      {message.trim() && !confirm && (
        <Button fullWidth variant="secondary" onClick={() => setConfirm(true)}>
          Предпросмотр
        </Button>
      )}

      {confirm && (
        <>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 14,
            fontSize: 14, color: 'var(--text)', lineHeight: 1.5, whiteSpace: 'pre-wrap',
          }}>
            {message}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
            Отправить {clientCount ?? '...'} клиентам?
          </p>
          <Button fullWidth loading={loading} onClick={send}>
            Отправить рассылку
          </Button>
          <Button fullWidth variant="ghost" onClick={() => setConfirm(false)}>
            Редактировать
          </Button>
        </>
      )}
    </>
  )
}
