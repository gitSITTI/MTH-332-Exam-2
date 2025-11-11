import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppHeader from './components/AppHeader.jsx'
import { DataProvider } from './context/DataProvider.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import './App.css'

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="app-shell">
          <AppHeader />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz/:lectureId" element={<QuizPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
