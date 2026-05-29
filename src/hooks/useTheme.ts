import { useEffect } from 'react'

export function useTheme(): 'dark' {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  }, [])

  return 'dark'
}
