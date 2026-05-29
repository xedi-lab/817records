import styles from './Header.module.css'

interface Props {
  onBack?: () => void
  title?: string
}

export function Header({ onBack, title }: Props) {
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
    </header>
  )
}
