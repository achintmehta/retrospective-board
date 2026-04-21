import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { useBoard } from '../hooks/useBoard';
import { useSocket } from '../contexts/SocketContext';
import Column from '../components/Column';
import AddColumnForm from '../components/AddColumnForm';
import './BoardPage.css';

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { connected } = useSocket();
  const { board, setBoard, loading, error, addColumn, deleteColumn, addCard, moveCard, deleteCard, toggleReaction, addReply, deleteReply } = useBoard(boardId);

  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('retro_username') || '');

  useEffect(() => {
    const stored = localStorage.getItem('retro_username');
    if (stored === null) {
      setShowNamePrompt(true);
    } else {
      setUsername(stored);
    }
  }, []);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      localStorage.setItem('retro_username', tempName.trim());
      setUsername(tempName.trim());
      setShowNamePrompt(false);
    }
  };

  const handleSkipName = () => {
    localStorage.setItem('retro_username', '');
    setUsername('');
    setShowNamePrompt(false);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI update
    setBoard((prev) => {
      if (!prev) return prev;
      const cols = prev.columns.map((col) => ({ ...col, cards: [...col.cards] }));
      const srcCol = cols.find((c) => c.id === source.droppableId);
      const dstCol = cols.find((c) => c.id === destination.droppableId);
      if (!srcCol || !dstCol) return prev;
      const [movedCard] = srcCol.cards.splice(source.index, 1);
      movedCard.column_id = dstCol.id;
      dstCol.cards.splice(destination.index, 0, movedCard);
      return { ...prev, columns: cols };
    });

    // Emit to server
    moveCard(draggableId, destination.droppableId, destination.index);
  };

  if (loading) {
    return (
      <div className="board-loading">
        <div className="spinner" />
        <p>Loading board…</p>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="board-error">
        <p>⚠ {error || 'Board not found'}</p>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    );
  }

  return (
    <div className="board-page">
      {showNamePrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Welcome to the Board!</h2>
            <p>Enter your name to use when posting cards.</p>
            <form onSubmit={handleSaveName}>
              <input
                type="text"
                placeholder="Your name..."
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                style={{ marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={handleSkipName}>
                  Skip (Anonymous)
                </button>
                <button type="submit" className="btn btn-primary" disabled={!tempName.trim()}>
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="board-header">
        <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}>
          ← Home
        </button>
        <div className="board-header-center">
          <h1 className="board-name">{board.name}</h1>
          <div className="board-meta">
            <span className="badge badge-count">{board.columns.length} columns</span>
            <span className="badge badge-count">
              {board.columns.reduce((acc, c) => acc + c.cards.length, 0)} cards
            </span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-indicator" title={username ? `Logged in as ${username}` : 'Logged in as Anonymous'}>
            <span className="user-icon">👤</span>
            <span className="user-label">Logged in as:</span>
            <span className="user-name">{username || 'Anonymous'}</span>
          </div>
          <div className="header-status">
            <span className={`connection-dot ${connected ? 'online' : ''}`} title={connected ? 'Connected' : 'Reconnecting…'} />
            <span className="status-text">{connected ? 'Live' : 'Reconnecting…'}</span>
          </div>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {board.columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
              onDeleteColumn={deleteColumn}
              onToggleReaction={toggleReaction}
              onAddReply={addReply}
              onDeleteReply={deleteReply}
            />
          ))}
          <AddColumnForm onAdd={addColumn} />
        </div>
      </DragDropContext>
    </div>
  );
}
