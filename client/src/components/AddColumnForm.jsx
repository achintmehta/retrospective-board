import { useState } from 'react';
import './AddColumnForm.css';

export default function AddColumnForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [colorMode, setColorMode] = useState('default');
  const [colorValue, setColorValue] = useState('#6c63ff');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), colorMode === 'custom' ? colorValue : null);
    setTitle('');
    setColorMode('default');
    setColorValue('#6c63ff');
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
      <div className="column-color-row">
        <span className="column-color-label">Color tint</span>
        <div className="column-color-options">
          <label className="column-color-option">
            <input
              type="radio"
              name="colorMode"
              value="default"
              checked={colorMode === 'default'}
              onChange={() => setColorMode('default')}
            />
            Default
          </label>
          <label className="column-color-option">
            <input
              type="radio"
              name="colorMode"
              value="custom"
              checked={colorMode === 'custom'}
              onChange={() => setColorMode('custom')}
            />
            Custom
          </label>
          {colorMode === 'custom' && (
            <div className="column-color-picker">
              <input
                type="color"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
              />
              <span className="column-color-swatch" style={{ background: colorValue }} />
            </div>
          )}
        </div>
      </div>
      <div className="add-column-form-actions">
        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
          Add
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => { setOpen(false); setTitle(''); setColorMode('default'); }}>
          ✕
        </button>
      </div>
    </form>
  );
}
