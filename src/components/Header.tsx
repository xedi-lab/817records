import styles from './Header.module.css'

interface Props {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onBack?: () => void
  title?: string
}

export function Header({ theme, onToggleTheme, onBack, title }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {onBack ? (
          <button className={styles.backBtn} onClick={onBack} aria-label="Назад">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : null}
        {title
          ? <span className={styles.title}>{title}</span>
          : <span className={styles.logo}>817<span className={styles.logoStar}>*</span></span>
        }
      </div>
      <button className={styles.themeBtn} onClick={onToggleTheme} aria-label="Сменить тему">
        {theme === 'light'
          ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42M9 13A4 4 0 109 5a4 4 0 000 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15.5 10.5A6.5 6.5 0 017.5 2.5a6.5 6.5 0 100 13 6.5 6.5 0 008-5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }
      </button>
    </header>
  )
}
