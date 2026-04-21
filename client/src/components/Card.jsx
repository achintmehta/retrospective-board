import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import ReactionPicker from './ReactionPicker';
import CardReplies from './CardReplies';
import { renderTextWithImages } from '../utils/textParser';
import './Card.css';

export default function Card({ card, index, onDelete, onToggleReaction, onAddReply, onDeleteReply }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (!showConfirm) { setShowConfirm(true); return; }
    onDelete(card.id);
    setShowConfirm(false);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card${snapshot.isDragging ? ' card--dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-content">{renderTextWithImages(card.content)}</div>
          {card.image_url && (
            <div className="card-image-wrap">
              <img 
                src={`${import.meta.env.VITE_SERVER_URL || ''}${card.image_url}`} 
                alt="attachment" 
                className="card-image" 
              />
            </div>
          )}
          
          {(card.reactions?.length > 0) && (
            <div className="card-reactions">
              {card.reactions.map(r => (
                <button 
                  key={r.emoji} 
                  className="reaction-badge"
                  onClick={() => onToggleReaction(card.id, r.emoji, true /* remove */)}
                  title="Remove reaction"
                >
                  {r.emoji} <span className="reaction-count">{r.count}</span>
                </button>
              ))}
            </div>
          )}

          <div className="card-footer">
            <div className="footer-left">
              {card.author ? (
                <span className="badge badge-author">✦ {card.author}</span>
              ) : (
                <span className="badge badge-anon">Anonymous</span>
              )}
            </div>
            <div className="footer-right">
              <ReactionPicker onSelect={(emoji) => onToggleReaction(card.id, emoji, false)} />
              <button
                className={`card-delete-btn${showConfirm ? ' confirm' : ''}`}
                onClick={handleDelete}
                onBlur={() => setShowConfirm(false)}
                title={showConfirm ? 'Click again to confirm' : 'Delete card'}
              >
                {showConfirm ? '✓?' : '✕'}
              </button>
            </div>
          </div>
          <CardReplies
            replies={card.replies}
            cardId={card.id}
            onAddReply={onAddReply}
            onDeleteReply={onDeleteReply}
          />
        </div>
      )}
    </Draggable>
  );
}
