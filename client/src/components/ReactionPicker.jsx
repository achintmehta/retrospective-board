import { useState, useRef, useEffect } from 'react';
import './ReactionPicker.css';

const EMOJIS = ['👍', '🎉', '😂', '❤️', '🚀', '👀'];

export default function ReactionPicker({ onSelect }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="reaction-picker-container" ref={containerRef}>
      <button 
        className="add-reaction-btn" 
        onClick={() => setOpen(!open)}
        title="Add reaction"
      >
        😀
      </button>
      
      {open && (
        <div className="reaction-picker-popup">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              className="emoji-btn"
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
