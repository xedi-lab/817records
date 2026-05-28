import { useNavigate } from 'react-router-dom'
import { haptic } from '../lib/twa'

export default function Home() {
  const nav = useNavigate()

  function book() {
    haptic('medium')
    nav('/book')
  }

  return (
    <div className="flex flex-col min-h-svh bg-[#F7F5F0] px-5">
      {/* Logo block */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <div className="font-black text-[96px] leading-none tracking-tighter text-[#111] select-none">
            817<span className="text-[#F0C040]">*</span>
          </div>
          <div className="text-[#888884] text-[11px] tracking-[0.3em] uppercase mt-1 font-medium">
            RECORDS
          </div>
        </div>

        {/* Info */}
        <div className="w-full max-w-xs space-y-2">
          <InfoRow label="Санкт-Петербург" />
          <InfoRow label="Ежедневно 10:00 — 22:00" />
          <InfoRow label="Запись · сведение · мастеринг" />
        </div>
      </div>

      {/* CTA */}
      <div className="pb-10 pt-6 w-full max-w-xs mx-auto space-y-3">
        <button
          onClick={book}
          className="w-full bg-[#111] text-white font-semibold text-[15px] py-[18px] rounded-2xl active:scale-[0.97] transition-transform"
        >
          Забронировать время
        </button>
        <p className="text-center text-[#888884] text-[12px]">
          Подтверждаем в течение часа
        </p>
      </div>
    </div>
  )
}

function InfoRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#E8E4DC] rounded-xl px-4 py-3">
      <div className="w-1 h-1 rounded-full bg-[#CCCAC4] flex-shrink-0" />
      <span className="text-[#111] text-[13px] font-medium">{label}</span>
    </div>
  )
}
