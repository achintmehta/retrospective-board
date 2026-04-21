import { useState } from 'react';
import { renderTextWithImages } from '../utils/textParser';
import './CardReplies.css';

export default function CardReplies({ replies, cardId, onAddReply, onDeleteReply }) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const storedAuthor = localStorage.getItem('retro_username') || '';

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setUploading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      try {
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';
        const r = await fetch(`${SERVER_URL}/api/upload`, { method: 'POST', body: formData });
        if (r.ok) {
          const data = await r.json();
          setContent(prev => prev + (prev ? ' ' : '') + `[Image: ${data.url}] `);
        }
      } catch (err) {}
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const author = !isAnonymous && storedAuthor ? storedAuthor : '';
    onAddReply(cardId, content.trim(), author, null);
    setContent('');
  };

  const hasReplies = replies && replies.length > 0;

  if (!open && !hasReplies) {
    return (
      <button className="open-replies-btn" onClick={() => setOpen(true)}>
        💬 Reply
      </button>
    );
  }

  return (
    <div className="card-replies-container">
      {hasReplies && (
        <div className="replies-list">
          {replies.map(r => (
            <div key={r.id} className="reply-item">
              <div className="reply-header">
                <span className="reply-author">{r.author || 'Anonymous'}</span>
                <button onClick={() => onDeleteReply(cardId, r.id)} className="reply-delete" title="Delete reply">✕</button>
              </div>
              <div className="reply-content">{renderTextWithImages(r.content)}</div>
              {r.image_url && (
                <img src={`${import.meta.env.VITE_SERVER_URL || ''}${r.image_url}`} alt="reply attach" className="reply-image" />
              )}
            </div>
          ))}
        </div>
      )}

      {open ? (
        <form className="reply-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder={"Write a reply..."}
            value={content} 
            onChange={e => setContent(e.target.value)}
            disabled={uploading}
            autoFocus={!hasReplies}
          />
          <div className="reply-form-actions">
            <div className="reply-options">
              <label className="reply-image-btn" title="Attach Image">
                {uploading ? '⏳' : '📷'}
                <input type="file" accept="image/*" onChange={handleFileChange} hidden disabled={uploading} />
              </label>

              {storedAuthor && (
                <label className="reply-anon-toggle">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span>Anon</span>
                </label>
              )}
            </div>
            
            <button type="submit" disabled={!content.trim() || uploading} className="reply-submit-btn">
              Send
            </button>
          </div>
        </form>
      ) : (
        <button className="open-replies-btn" onClick={() => setOpen(true)}>
          💬 Add another reply
        </button>
      )}
    </div>
  );
}
