type ToastFn = (msg: string, type: 'success' | 'error') => void
let _listener: ToastFn | null = null

export const toast = {
  success: (msg: string) => _listener?.(msg, 'success'),
  error:   (msg: string) => _listener?.(msg, 'error'),
  _subscribe: (fn: ToastFn) => {
    _listener = fn
    return () => { if (_listener === fn) _listener = null }
  },
}
