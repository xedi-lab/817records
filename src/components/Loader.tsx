import styles from './Loader.module.css'

export function Loader({ full }: { full?: boolean }) {
  return (
    <div className={[styles.wrap, full ? styles.full : ''].join(' ')}>
      <div className={styles.ring} />
    </div>
  )
}
