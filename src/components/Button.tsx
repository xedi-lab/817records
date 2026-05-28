import styles from './Button.module.css'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
}

export function Button({ children, onClick, variant = 'primary', fullWidth, disabled, loading, type = 'button' }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        styles.btn,
        styles[variant],
        fullWidth ? styles.full : '',
      ].join(' ')}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  )
}
