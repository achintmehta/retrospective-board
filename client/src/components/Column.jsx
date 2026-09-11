import { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import AddCardForm from './AddCardForm';
import './Column.css';

export default function Column({ column, onAddCard, onDeleteCard, onDeleteColumn, onToggleReaction, onAddReply, onDeleteReply, onUpdateColor, onRenameColumn }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const colorInputRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const handleTitleClick = () => {
    setDraftTitle(column.title);
    setEditingTitle(true);
  };

  const saveTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    }
    setEditingTitle(false);
  };

  const cancelTitle = () => {
    setEditingTitle(false);
    setDraftTitle(column.title);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); saveTitle(); }
    if (e.key === 'Escape') { e.preventDefault(); cancelTitle(); }
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDeleteColumn(column.id);
  };

  const handleColorChange = (e) => {
    onUpdateColor(column.id, e.target.value);
  };

  const handleColorIconClick = () => {
    setTimeout(() => colorInputRef.current?.click(), 0);
  };

  const colStyle = column.color ? { '--col-tint': column.color } : undefined;

  return (
    <div className="column" style={colStyle}>
      <div className="column-header">
        <div className="column-header-left">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              className="column-title-input"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={saveTitle}
              maxLength={60}
            />
          ) : (
            <h3
              className="column-title"
              onClick={handleTitleClick}
              title="Click to rename"
            >
              {column.title}
            </h3>
          )}
          <span className="badge badge-count">{column.cards.length}</span>
        </div>
        <div className="column-header-actions">
          <div className="column-color-btn-wrap">
            <button
              className="btn btn-icon column-color-btn"
              onClick={handleColorIconClick}
              title="Change column color"
              type="button"
            >
              <span
                className="column-color-dot"
                style={{ background: column.color || 'var(--glass-border)' }}
              />
            </button>
            <input
              ref={colorInputRef}
              type="color"
              className="column-color-input-hidden"
              value={column.color || '#6c63ff'}
              onChange={handleColorChange}
              tabIndex={-1}
            />
          </div>
          <button
            className={`btn btn-icon column-delete-btn${confirmDelete ? ' confirm' : ''}`}
            onClick={handleDeleteClick}
            onBlur={() => setConfirmDelete(false)}
            title={confirmDelete ? 'Click to confirm delete' : 'Delete column'}
          >
            {confirmDelete ? '✓?' : '✕'}
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`column-cards${snapshot.isDraggingOver ? ' column-cards--over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onDelete={onDeleteCard}
                onToggleReaction={onToggleReaction}
                onAddReply={onAddReply}
                onDeleteReply={onDeleteReply}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <AddCardForm onAdd={(content, author, imageUrl) => onAddCard(column.id, content, author, imageUrl)} />
    </div>
  );
}
