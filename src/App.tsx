import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initTwa } from './lib/twa'
import Home from './pages/Home'
import BookPage from './pages/BookPage'
import ConfirmPage from './pages/ConfirmPage'
import SuccessPage from './pages/SuccessPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  useEffect(() => {
    try { initTwa() } catch {}
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
