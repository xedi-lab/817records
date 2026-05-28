import styles from './Card.module.css'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  className?: string
}

export function Card({ children, onClick, active, disabled, className }: Props) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={[
        styles.card,
        onClick ? styles.clickable : '',
        active ? styles.active : '',
        disabled ? styles.disabled : '',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}
