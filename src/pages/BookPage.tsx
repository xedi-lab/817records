import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { haptic } from '../lib/twa'

dayjs.locale('ru')

const HOURS = [1, 2, 3, 4, 5, 6]
const START_HOUR = 10
const END_HOUR = 22

function buildTimeOptions() {
  const opts: string[] = []
  for (let h = START_HOUR; h < END_HOUR; h++) {
    opts.push(`${String(h).padStart(2, '0')}:00`)
  }
  return opts
}

const TIME_OPTIONS = buildTimeOptions()

function buildDays() {
  const days = []
  for (let i = 0; i < 14; i++) {
    days.push(dayjs().add(i, 'day'))
  }
  return days
}

const DAYS = buildDays()

export default function BookPage() {
  const nav = useNavigate()
  const [selectedDay, setSelectedDay] = useState(DAYS[0])
  const [startTime, setStartTime] = useState<string | null>(null)
  const [hours, setHours] = useState<number | null>(null)

  const endTime = startTime && hours
    ? `${String(parseInt(startTime) + hours).padStart(2, '0')}:00`
    : null

  const validHours = startTime
    ? HOURS.filter(h => parseInt(startTime) + h <= END_HOUR)
    : HOURS

  function proceed() {
    if (!startTime || !hours) return
    haptic('medium')
    nav('/confirm', {
      state: {
        date: selectedDay.format('YYYY-MM-DD'),
        dateLabel: selectedDay.format('D MMMM'),
        startTime,
        endTime,
        hours,
      }
    })
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
        <h1 className="text-[#111] font-black text-[22px] tracking-tight">Бронирование</h1>
      </div>

      <div className="px-5 space-y-7 flex-1">
        {/* Date picker */}
        <section>
          <SectionLabel>Дата</SectionLabel>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
            {DAYS.map(day => {
              const active = day.isSame(selectedDay, 'day')
              const isToday = day.isSame(dayjs(), 'day')
              return (
                <button
                  key={day.format('YYYY-MM-DD')}
                  onClick={() => { haptic('light'); setSelectedDay(day); setStartTime(null); setHours(null) }}
                  className={`flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl transition-all ${
                    active
                      ? 'bg-[#111] text-white'
                      : 'bg-white border border-[#E8E4DC] text-[#111]'
                  }`}
                >
                  <span className={`text-[9px] uppercase tracking-widest font-semibold mb-0.5 ${active ? 'text-white/60' : 'text-[#888884]'}`}>
                    {isToday ? 'сег' : day.format('dd')}
                  </span>
                  <span className="text-[18px] font-black leading-tight">{day.format('D')}</span>
                  <span className={`text-[9px] font-medium mt-0.5 ${active ? 'text-white/60' : 'text-[#888884]'}`}>
                    {day.format('MMM').replace('.', '')}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Start time */}
        <section>
          <SectionLabel>Начало сессии</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map(t => {
              const active = startTime === t
              return (
                <button
                  key={t}
                  onClick={() => { haptic('light'); setStartTime(t); setHours(null) }}
                  className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    active
                      ? 'bg-[#111] text-white'
                      : 'bg-white border border-[#E8E4DC] text-[#111]'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </section>

        {/* Duration */}
        {startTime && (
          <section>
            <SectionLabel>Длительность</SectionLabel>
            <div className="flex gap-2">
              {validHours.map(h => {
                const active = hours === h
                return (
                  <button
                    key={h}
                    onClick={() => { haptic('light'); setHours(h) }}
                    className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                      active
                        ? 'bg-[#111] text-white'
                        : 'bg-white border border-[#E8E4DC] text-[#111]'
                    }`}
                  >
                    {h}ч
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Summary pill */}
        {startTime && hours && (
          <div className="bg-white border border-[#E8E4DC] rounded-2xl px-5 py-4 flex justify-between items-center">
            <div>
              <div className="text-[#888884] text-[11px] font-medium uppercase tracking-wider mb-1">
                {selectedDay.format('D MMMM')}
              </div>
              <div className="text-[#111] font-black text-[20px] tracking-tight">
                {startTime} — {endTime}
              </div>
            </div>
            <div className="bg-[#F7F5F0] rounded-xl px-3 py-2 text-center">
              <div className="text-[#111] font-black text-[22px] leading-none">{hours}</div>
              <div className="text-[#888884] text-[10px] font-medium mt-0.5">часов</div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 pt-5 max-w-xs mx-auto w-full">
        <button
          onClick={proceed}
          disabled={!startTime || !hours}
          className="w-full bg-[#111] text-white font-semibold text-[15px] py-[18px] rounded-2xl active:scale-[0.97] transition-transform disabled:opacity-20 disabled:scale-100"
        >
          Продолжить
        </button>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#888884] text-[11px] uppercase tracking-[0.15em] font-semibold mb-3">
      {children}
    </p>
  )
}
