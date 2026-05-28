import { useState } from 'react'
import { Button } from '../../components/Button'
import styles from './booking.module.css'

interface Props {
  initialName: string
  onNext: (name: string, phone: string, comment: string) => void
}

export function ContactInput({ initialName, onNext }: Props) {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [touched, setTouched] = useState(false)

  const nameError = touched && !name.trim()

  function submit() {
    setTouched(true)
    if (!name.trim()) return
    onNext(name.trim(), phone.trim(), comment.trim())
  }

  return (
    <div className={[styles.section, 'fade-in'].join(' ')}>
      <p className={styles.label}>Контакт</p>

      <div className={styles.inputWrap}>
        <label className={styles.inputLabel}>Имя *</label>
        <input
          className={[styles.input, nameError ? styles.inputError : ''].join(' ')}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Как тебя зовут?"
        />
        {nameError && <span className={styles.errorMsg}>Укажи имя</span>}
      </div>

      <div className={styles.inputWrap}>
        <label className={styles.inputLabel}>Телефон</label>
        <input
          className={styles.input}
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+7 999 000 00 00"
        />
      </div>

      <div className={styles.inputWrap}>
        <label className={styles.inputLabel}>Что записываем?</label>
        <input
          className={styles.input}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Необязательно, но приятно знать"
        />
      </div>

      <Button fullWidth onClick={submit}>Продолжить</Button>
    </div>
  )
}
