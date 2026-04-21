import { useState } from 'react';
import './CardReplies.css';

export default function CardReplies({ replies, cardId, onAddReply, onDeleteReply }) {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    const author = localStorage.getItem('retro_username') || '';
    let imageUrl = null;

    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      try {
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';
        const r = await fetch(`${SERVER_URL}/api/upload`, { method: 'POST', body: formData });
        if (r.ok) {
          const data = await r.json();
          imageUrl = data.url;
        }
      } catch (err) {}
      setUploading(false);
    }

    onAddReply(cardId, content.trim(), author, imageUrl);
    setContent('');
    setFile(null);
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
              {r.content && <p className="reply-content">{r.content}</p>}
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
            placeholder={file ? `Attached: ${file.name}` : "Write a reply..."}
            value={content} 
            onChange={e => setContent(e.target.value)}
            disabled={uploading}
            autoFocus={!hasReplies}
          />
          <div className="reply-form-actions">
            <label className="reply-image-btn" title="Attach Image">
              📷
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0])} hidden />
            </label>
            <button type="submit" disabled={uploading || (!content.trim() && !file)} className="reply-submit-btn">
              {uploading ? '...' : (file && !content.trim() ? 'Upload' : 'Send')}
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
