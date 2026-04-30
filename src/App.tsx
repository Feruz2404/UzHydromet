import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { ContentProvider } from './store/contentStore'
import { AuthProvider } from './admin/AuthContext'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'

export function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ContentProvider>
    </LanguageProvider>
  )
}
