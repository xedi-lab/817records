import { useLocation, useNavigate } from 'react-router-dom'

export default function SuccessPage() {
  const { state } = useLocation()
  const nav = useNavigate()

  return (
    <div className="flex flex-col min-h-svh bg-[#F7F5F0] items-center justify-center px-5 pb-10">
      <div className="w-full max-w-xs space-y-6">
        {/* Status */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#111] flex items-center justify-center mx-auto">
            <span className="text-white text-2xl">✓</span>
          </div>
          <div>
            <h1 className="text-[#111] font-black text-[28px] tracking-tight leading-tight">
              Заявка принята
            </h1>
            <p className="text-[#888884] text-[13px] font-medium mt-2 leading-relaxed">
              Подтвердим бронь в течение часа.<br />Ждём тебя в студии!
            </p>
          </div>
        </div>

        {/* Summary */}
        {state && (
          <div className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden">
            <div className="px-5 py-4">
              <div className="text-[#111] font-black text-[22px] tracking-tight">
                {state.startTime} — {state.endTime}
              </div>
              <div className="text-[#888884] text-[13px] font-medium mt-1">
                {state.dateLabel} · {state.hours} {state.hours === 1 ? 'час' : 'часа'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => nav('/', { replace: true })}
          className="w-full bg-white border border-[#E8E4DC] text-[#111] font-semibold text-[15px] py-[18px] rounded-2xl active:scale-[0.97] transition-transform"
        >
          На главную
        </button>
      </div>
    </div>
  )
}
