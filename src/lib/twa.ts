import WebApp from '@twa-dev/sdk'

export function initTwa() {
  try {
    WebApp.ready()
    WebApp.expand()
  } catch {}
}

export function getTwaUser() {
  try {
    // Сначала пробуем напрямую через window (надёжнее на iOS)
    const tg = (window as any).Telegram?.WebApp
    const directUser = tg?.initDataUnsafe?.user
    if (directUser?.id) return directUser

    // Фолбэк через SDK
    const sdkUser = WebApp?.initDataUnsafe?.user
    if (sdkUser?.id) return sdkUser

    return null
  } catch {
    return null
  }
}

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
  try {
    if (type === 'success' || type === 'error') {
      WebApp.HapticFeedback.notificationOccurred(type)
    } else {
      WebApp.HapticFeedback.impactOccurred(type)
    }
  } catch {}
}
