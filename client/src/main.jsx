import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './contexts/SocketContext'
import { SettingsProvider } from './contexts/SettingsContext'
import HomePage from './pages/HomePage'
import BoardPage from './pages/BoardPage'
import './index.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', color: '#ff4d6d', background: '#0f1117', minHeight: '100vh' }}>
          <h2 style={{ marginBottom: '16px' }}>App crashed</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>{String(this.state.error)}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', color: '#888', marginTop: '12px' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SocketProvider>
        <BrowserRouter>
          <SettingsProvider>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/board/:boardId" element={<BoardPage />} />
              </Routes>
            </ErrorBoundary>
          </SettingsProvider>
        </BrowserRouter>
      </SocketProvider>
    </ErrorBoundary>
  </StrictMode>,
)
