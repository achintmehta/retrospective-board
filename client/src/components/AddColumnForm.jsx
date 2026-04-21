import { useState } from 'react';
import './AddColumnForm.css';

export default function AddColumnForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button id="add-column-btn" className="add-column-trigger" onClick={() => setOpen(true)}>
        <span>+</span>
        <span>Add Column</span>
      </button>
    );
  }

  return (
    <form className="add-column-form" onSubmit={handleSubmit}>
      <input
        id="column-title-input"
        type="text"
        placeholder="Column name…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <div className="add-column-form-actions">
        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
          Add
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => { setOpen(false); setTitle(''); }}>
          ✕
        </button>
      </div>
    </form>
  );
}
