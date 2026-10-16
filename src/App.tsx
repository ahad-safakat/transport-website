import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { ChatWidget } from './components/widgets/ChatWidget'
import { WhatsAppButton } from './components/widgets/WhatsAppButton'
import { QuotePrefillProvider } from './context/QuotePrefillContext'
import { scrollToSection } from './context/quotePrefill'
import { HomePage } from './pages/HomePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

function ScrollToHash() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => scrollToSection(hash.slice(1)))
      return
    }
    window.scrollTo({ top: 0 })
  }, [hash, pathname])
  return null
}

export default function App() {
  return (
    <QuotePrefillProvider>
      <ScrollToHash />
      <div className="min-h-dvh bg-white">
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <ChatWidget />
      </div>
    </QuotePrefillProvider>
  )
}
