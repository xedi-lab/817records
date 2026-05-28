import styles from './BottomNav.module.css'

export type NavTab = 'home' | 'book' | 'media' | 'dashboard'

interface Props {
  active: NavTab
  onChange: (tab: NavTab) => void
  isAdmin: boolean
}

export function BottomNav({ active, onChange, isAdmin }: Props) {
  const tabs = [
    { id: 'home' as NavTab, label: 'Главная', icon: IconHome },
    { id: 'book' as NavTab, label: 'Запись', icon: IconCalendar },
    { id: 'media' as NavTab, label: 'Медиа', icon: IconStar },
    ...(isAdmin ? [{ id: 'dashboard' as NavTab, label: 'Панель', icon: IconDash }] : []),
  ]

  return (
    <nav className={styles.nav}>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={[styles.tab, active === id ? styles.tabActive : ''].join(' ')}
          onClick={() => onChange(id)}
        >
          <span className={styles.icon}><Icon active={active === id} /></span>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  )
}

function IconHome({ active }: { active: boolean }) {
  return active
    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
    : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M3 12v9h18V12"/></svg>
}

function IconCalendar({ active }: { active: boolean }) {
  return active
    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11z"/></svg>
    : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}

function IconStar({ active }: { active: boolean }) {
  return active
    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

function IconDash({ active }: { active: boolean }) {
  return active
    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
    : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
}
