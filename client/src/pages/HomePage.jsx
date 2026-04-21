import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import './HomePage.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export default function HomePage() {
  const { socket, connected } = useSocket();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [creating, setCreating] = useState(false);

  // Load board list
  useEffect(() => {
    fetch(`${SERVER_URL}/api/boards`)
      .then((r) => r.json())
      .then(setBoards)
      .catch(console.error);
  }, []);

  // Live board creation/deletion events
  useEffect(() => {
    if (!socket.current) return;
    const s = socket.current;
    const onCreated = (board) => setBoards((prev) => [board, ...prev]);
    const onDeleted = ({ boardId }) => setBoards((prev) => prev.filter((b) => b.id !== boardId));
    s.on('board_created', onCreated);
    s.on('board_deleted', onDeleted);
    return () => { s.off('board_created', onCreated); s.off('board_deleted', onDeleted); };
  }, [socket]);

  const handleCreate = (e) => {
    e.preventDefault();
    const name = newBoardName.trim() || 'Retro Board';
    if (!socket.current) return;
    setCreating(true);
    socket.current.emit('create_board', { name }, ({ ok, board }) => {
      setCreating(false);
      if (ok) {
        setNewBoardName('');
        navigate(`/board/${board.id}`);
      }
    });
  };

  const handleDelete = (e, boardId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this board permanently?')) return;
    socket.current?.emit('delete_board', { boardId });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo">
            <span className="logo-icon">🔄</span>
            <div>
              <h1 className="logo-title">RetroBoard</h1>
              <p className="logo-sub">Real-time retrospective collaboration</p>
            </div>
          </div>
          <div className="header-status">
            <span className={`connection-dot ${connected ? 'online' : ''}`} />
            <span className="status-text">{connected ? 'Live' : 'Connecting…'}</span>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="create-section">
          <h2 className="section-title">Create a Board</h2>
          <form className="create-form" onSubmit={handleCreate}>
            <input
              id="board-name-input"
              type="text"
              placeholder="Sprint 42 Retrospective…"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              autoFocus
            />
            <button id="create-board-btn" type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating…' : '+ New Board'}
            </button>
          </form>
        </section>

        <section className="boards-section">
          <h2 className="section-title">
            All Boards
            <span className="badge badge-count">{boards.length}</span>
          </h2>
          {boards.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No boards yet. Create your first retrospective board above.</p>
            </div>
          ) : (
            <ul className="boards-grid">
              {boards.map((board) => (
                <li
                  key={board.id}
                  className="board-card"
                  onClick={() => navigate(`/board/${board.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/board/${board.id}`)}
                >
                  <div className="board-card-icon">📋</div>
                  <div className="board-card-info">
                    <span className="board-card-name">{board.name}</span>
                    <span className="board-card-date">{formatDate(board.created_at)}</span>
                  </div>
                  <button
                    className="btn btn-icon board-delete-btn"
                    onClick={(e) => handleDelete(e, board.id)}
                    title="Delete board"
                    aria-label="Delete board"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
