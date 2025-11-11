import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppHeader from './components/AppHeader.jsx'
import { DataProvider } from './context/DataProvider.jsx'
import Exam2PrepPage from './pages/Exam2PrepPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import VennTrainerPage from './pages/VennTrainerPage.jsx'
import './App.css'

const THEME_STORAGE_KEY = 'ui_theme_preference'

function App() {
  const [theme, setTheme] = useState(() => {
    const initial =
      typeof window === 'undefined'
        ? 'midnight'
        : window.localStorage.getItem(THEME_STORAGE_KEY) ?? 'midnight'

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', initial)
    }

    return initial
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  }, [theme])

  const themeOptions = useMemo(
    () => [
      { value: 'midnight', label: 'Midnight Nebula' },
      { value: 'aurora', label: 'Aurora Borealis' },
      { value: 'ember', label: 'Ember Glow' },
    ],
    [],
  )

  return (
    <DataProvider>
      <BrowserRouter>
        <div className={`app-shell theme-${theme}`}>
          <AppHeader theme={theme} onThemeChange={setTheme} themeOptions={themeOptions} />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz/:lectureId" element={<QuizPage />} />
              <Route path="/exam2" element={<Exam2PrepPage />} />
              <Route path="/venn-trainer" element={<VennTrainerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
