import { useState, useEffect } from 'react';
import './AddCardForm.css';

export default function AddCardForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [storedAuthor, setStoredAuthor] = useState('');

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setStoredAuthor(localStorage.getItem('retro_username') || '');
    }
  }, [open]);

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
          setContent(prev => prev + (prev ? '\n' : '') + `[Image: ${data.url}]\n`);
        }
      } catch (err) {
        console.error('Image upload failed', err);
      }
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    let authorName = '';
    if (!isAnonymous && storedAuthor) {
      authorName = storedAuthor;
    }
    
    onAdd(content.trim(), authorName, null);
    setContent('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button className="add-card-trigger" onClick={() => setOpen(true)}>
        + Add a card
      </button>
    );
  }

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <textarea
        id="card-content-input"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
        rows={3}
      />
      
      <div className="form-extras">
        <label className="image-upload-btn">
          <span>{uploading ? 'Uploading...' : '📷 Attach Image'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} hidden disabled={uploading} />
        </label>
        
        {storedAuthor && (
          <div className="author-options">
            <label>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Post anonymously
            </label>
          </div>
        )}
      </div>

      <div className="add-card-form-actions">
        <button type="submit" className="btn btn-primary" disabled={!content.trim() || uploading}>
          Add Card
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => { setOpen(false); setContent(''); }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
