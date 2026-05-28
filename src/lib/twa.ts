import WebApp from '@twa-dev/sdk'

export function initTwa() {
  WebApp.ready()
  WebApp.expand()
}

export function getTwaUser() {
  return WebApp.initDataUnsafe?.user ?? null
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
