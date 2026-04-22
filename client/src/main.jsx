import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './contexts/SocketContext'
import { SettingsProvider } from './contexts/SettingsContext'
import HomePage from './pages/HomePage'
import BoardPage from './pages/BoardPage'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <SettingsProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
          </Routes>
        </SettingsProvider>
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>,
)
