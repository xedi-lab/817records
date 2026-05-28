import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { haptic, getTwaUser } from '../lib/twa'
import { api } from '../lib/api'

interface BookState {
  date: string
  dateLabel: string
  startTime: string
  endTime: string
  hours: number
}

export default function ConfirmPage() {
  const nav = useNavigate()
  const { state } = useLocation() as { state: BookState }
  const twaUser = getTwaUser()

  const [name, setName] = useState(
    twaUser ? `${twaUser.first_name}${twaUser.last_name ? ' ' + twaUser.last_name : ''}` : ''
  )
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!state) {
    nav('/')
    return null
  }

  async function submit() {
    if (!name.trim()) return
    haptic('medium')
    setLoading(true)
    setError(null)
    try {
      await api.createBooking({
        telegram_id: twaUser?.id ?? 0,
        full_name: name.trim(),
        username: twaUser?.username,
        phone: phone.trim() || undefined,
        date: state.date,
        start_time: state.startTime,
        end_time: state.endTime,
        hours: state.hours,
        comment: comment.trim() || undefined,
      })
      haptic('success')
      nav('/success', { state, replace: true })
    } catch {
      setError('Не удалось отправить заявку. Попробуй ещё раз.')
      haptic('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-svh bg-[#F7F5F0]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-5">
        <button
          onClick={() => nav(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-[#E8E4DC] flex items-center justify-center text-[#111] text-lg font-medium active:scale-95 transition-transform"
        >
          ←
        </button>
        <h1 className="text-[#111] font-black text-[22px] tracking-tight">Подтверждение</h1>
      </div>

      <div className="px-5 space-y-5 flex-1">
        {/* Booking summary */}
        <div className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8E4DC]">
            <div className="text-[#888884] text-[11px] font-semibold uppercase tracking-wider mb-0.5">Твоя бронь</div>
            <div className="text-[#111] font-black text-[24px] tracking-tight leading-tight">
              {state.startTime} — {state.endTime}
            </div>
            <div className="text-[#888884] text-[13px] font-medium mt-1">
              {state.dateLabel} · {state.hours} {state.hours === 1 ? 'час' : 'часа'}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <Field
            label="Имя *"
            value={name}
            onChange={setName}
            placeholder="Как тебя зовут?"
          />
          <Field
            label="Телефон"
            value={phone}
            onChange={setPhone}
            placeholder="+7 999 000 00 00"
            type="tel"
          />
          <Field
            label="Что будем записывать?"
            value={comment}
            onChange={setComment}
            placeholder="Необязательно, но приятно знать"
            multiline
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-[13px] font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="px-5 pb-10 pt-5 max-w-xs mx-auto w-full">
        <button
          onClick={submit}
          disabled={!name.trim() || loading}
          className="w-full bg-[#111] text-white font-semibold text-[15px] py-[18px] rounded-2xl active:scale-[0.97] transition-transform disabled:opacity-20 disabled:scale-100"
        >
          {loading ? 'Отправляем...' : 'Отправить заявку'}
        </button>
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text', multiline
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  multiline?: boolean
}) {
  const inputCls = "w-full bg-white border border-[#E8E4DC] text-[#111] rounded-xl px-4 py-3.5 text-[14px] font-medium placeholder:text-[#CCCAC4] outline-none focus:border-[#111] transition-colors resize-none"
  return (
    <div className="space-y-1.5">
      <label className="text-[#888884] text-[11px] font-semibold uppercase tracking-wider px-1">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      }
    </div>
  )
}
