import { useEffect, useState } from 'react'

export function useTheme(initial: 'light' | 'dark' = 'light'): ['light' | 'dark', () => void] {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') ?? initial
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggle() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return [theme, toggle]
}
