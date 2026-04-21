import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import AddCardForm from './AddCardForm';
import './Column.css';

export default function Column({ column, onAddCard, onDeleteCard, onDeleteColumn, onToggleReaction, onAddReply, onDeleteReply }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDeleteColumn(column.id);
  };

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-header-left">
          <h3 className="column-title">{column.title}</h3>
          <span className="badge badge-count">{column.cards.length}</span>
        </div>
        <button
          className={`btn btn-icon column-delete-btn${confirmDelete ? ' confirm' : ''}`}
          onClick={handleDeleteClick}
          onBlur={() => setConfirmDelete(false)}
          title={confirmDelete ? 'Click to confirm delete' : 'Delete column'}
        >
          {confirmDelete ? '✓?' : '⋯'}
        </button>
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
