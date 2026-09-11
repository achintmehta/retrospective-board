import { useState } from 'react';
import './TemplatePicker.css';

const TEMPLATES = [
  {
    id: 'standard',
    name: 'Standard Retro',
    columns: ['Went Well', 'Needs Improvement', 'Action Items'],
  },
  {
    id: '4ls',
    name: '4Ls',
    columns: ['Liked', 'Learned', 'Lacked', 'Longed For'],
  },
  {
    id: 'start-stop-continue',
    name: 'Start Stop Continue',
    columns: ['Start', 'Stop', 'Continue'],
  },
  {
    id: 'mad-sad-glad',
    name: 'Mad Sad Glad',
    columns: ['Mad', 'Sad', 'Glad'],
  },
  {
    id: 'kalm',
    name: 'KALM',
    columns: ['Keep', 'Add', 'Less', 'More'],
  },
  {
    id: 'sailboat',
    name: 'Sailboat',
    columns: ['Anchors', 'Wind', 'Rocks', 'Island'],
  },
  {
    id: 'rose-bud-thorn',
    name: 'Rose Bud Thorn',
    columns: ['Rose', 'Bud', 'Thorn'],
  },
  {
    id: 'empty',
    name: 'Empty Board',
    columns: [],
  },
];

export { TEMPLATES };

export default function TemplatePicker({ selectedTemplate, onSelect, buttonType = 'button' }) {
  const [open, setOpen] = useState(false);

  const current = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  const handleSelect = (id) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div className="template-picker">
      <button
        type={buttonType}
        className="template-picker-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="template-picker-icon">📋</span>
        <span className="template-picker-toggle-label">
          Template: <strong>{current.name}</strong>
        </span>
        <span className={`template-picker-chevron${open ? ' open' : ''}`}>▾</span>
      </button>
      <div className={`template-picker-panel${open ? ' open' : ''}`}>
        <div><div className="template-card-grid">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type={buttonType}
              className={`template-card${selectedTemplate === t.id ? ' template-card--active' : ''}`}
              onClick={() => handleSelect(t.id)}
              title={t.name}
            >
              <span className="template-card-name">{t.name}</span>
              {t.columns.length > 0 ? (
                <ul className="template-card-columns">
                  {t.columns.map((col) => (
                    <li key={col}>{col}</li>
                  ))}
                </ul>
              ) : (
                <span className="template-card-empty">Start from scratch</span>
              )}
            </button>
          ))}
        </div></div>
      </div>
    </div>
  );
}
