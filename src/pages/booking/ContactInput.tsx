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
  const phoneError = touched && phone.replace(/\D/g, '').length < 11

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    const local = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits
    const capped = local.slice(0, 10)
    setPhone(capped ? '+7' + capped : '')
  }

  function submit() {
    setTouched(true)
    if (!name.trim() || phone.replace(/\D/g, '').length < 11) return
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
        <label className={styles.inputLabel}>Телефон *</label>
        <input
          className={[styles.input, phoneError ? styles.inputError : ''].join(' ')}
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handlePhone}
          placeholder="+7 — введи номер"
        />
        {phoneError && <span className={styles.errorMsg}>Укажи номер телефона</span>}
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
