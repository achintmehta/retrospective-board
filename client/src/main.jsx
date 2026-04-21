import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './contexts/SocketContext'
import HomePage from './pages/HomePage'
import BoardPage from './pages/BoardPage'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>,
)
