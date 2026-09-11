import { useState } from 'react';
import './ThemePicker.css';

const THEME_SWATCHES = {
  'classic-dark':       'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)',
  'classic-light':      'linear-gradient(135deg, #e8ecf5 0%, #f5f7fb 100%)',
  'cyberpunk-dark':     'radial-gradient(ellipse at 20% 50%, #1a0030 0%, #0a0010 60%, #001020 100%)',
  'cyberpunk-light':    'linear-gradient(135deg, #dff0ff 0%, #eef8ff 100%)',
  'vaporwave-dark':     'linear-gradient(160deg, #1a0533 0%, #2d0d5c 50%, #0d1a4a 100%)',
  'vaporwave-light':    'linear-gradient(150deg, #fce8ff 0%, #f5e6ff 100%)',
  'sunset-dark':        'linear-gradient(160deg, #1a0800 0%, #2d1200 50%, #1a0a10 100%)',
  'sunset-light':       'linear-gradient(150deg, #fff0e0 0%, #fff8f0 100%)',
  'desert-dark':        'linear-gradient(145deg, #1a1200 0%, #2d2000 100%)',
  'desert-light':       'linear-gradient(145deg, #faf2df 0%, #fdf8ef 100%)',
  'artnouveau-dark':    'linear-gradient(150deg, #0e1a0f 0%, #1a2e1a 100%)',
  'artnouveau-light':   'linear-gradient(150deg, #f5f0e0 0%, #f8f4e8 100%)',
  'renaissance-dark':   'linear-gradient(145deg, #1a0808 0%, #2e1010 100%)',
  'renaissance-light':  'linear-gradient(145deg, #faf0dc 0%, #fdf5e8 100%)',
  'highcontrast-dark':  'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
  'highcontrast-light': 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
  'gruvbox-dark':       'linear-gradient(135deg, #282828 0%, #32302f 100%)',
  'gruvbox-light':      'linear-gradient(135deg, #f9f5d7 0%, #fbf1c7 100%)',
  'nord-dark':          'linear-gradient(135deg, #2e3440 0%, #3b4252 100%)',
  'nord-light':         'linear-gradient(135deg, #eceff4 0%, #e5e9f0 100%)',
  'solarized-dark':     'linear-gradient(135deg, #002b36 0%, #073642 100%)',
  'solarized-light':    'linear-gradient(135deg, #fdf6e3 0%, #eee8d5 100%)',
};

const THEME_GROUPS = [
  { group: 'Classic',       themes: [{ id: 'classic-dark', label: 'Dark' },       { id: 'classic-light', label: 'Light' }] },
  { group: 'Cyberpunk',     themes: [{ id: 'cyberpunk-dark', label: 'Dark' },     { id: 'cyberpunk-light', label: 'Light' }] },
  { group: 'Vaporwave',     themes: [{ id: 'vaporwave-dark', label: 'Dark' },     { id: 'vaporwave-light', label: 'Light' }] },
  { group: 'Sunset',        themes: [{ id: 'sunset-dark', label: 'Dark' },        { id: 'sunset-light', label: 'Light' }] },
  { group: 'Desert',        themes: [{ id: 'desert-dark', label: 'Dark' },        { id: 'desert-light', label: 'Light' }] },
  { group: 'Art Nouveau',   themes: [{ id: 'artnouveau-dark', label: 'Dark' },    { id: 'artnouveau-light', label: 'Light' }] },
  { group: 'Renaissance',   themes: [{ id: 'renaissance-dark', label: 'Dark' },   { id: 'renaissance-light', label: 'Light' }] },
  { group: 'High Contrast', themes: [{ id: 'highcontrast-dark', label: 'Dark' },  { id: 'highcontrast-light', label: 'Light' }] },
  { group: 'Gruvbox',       themes: [{ id: 'gruvbox-dark', label: 'Dark' },       { id: 'gruvbox-light', label: 'Light' }] },
  { group: 'Nord',          themes: [{ id: 'nord-dark', label: 'Dark' },          { id: 'nord-light', label: 'Light' }] },
  { group: 'Solarized',     themes: [{ id: 'solarized-dark', label: 'Dark' },     { id: 'solarized-light', label: 'Light' }] },
];

function formatThemeLabel(id) {
  return id.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export { THEME_SWATCHES, THEME_GROUPS };

export default function ThemePicker({ selectedTheme, onSelect, collapsible = true, buttonType = 'button' }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    onSelect(id);
    if (collapsible) setOpen(false);
  };

  const swatchBg = THEME_SWATCHES[selectedTheme] || '';

  return (
    <div className="theme-picker">
      {collapsible && (
        <button
          type={buttonType}
          className="theme-picker-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="theme-picker-toggle-swatch" style={{ background: swatchBg }} />
          <span className="theme-picker-toggle-label">
            Theme: <strong>{formatThemeLabel(selectedTheme)}</strong>
          </span>
          <span className={`theme-picker-chevron${open ? ' open' : ''}`}>▾</span>
        </button>
      )}
      <div className={`theme-picker-panel${!collapsible || open ? ' open' : ''}`}>
        <div><div>
          {THEME_GROUPS.map(({ group, themes }) => (
            <div key={group} className="theme-group">
              <span className="theme-group-label">{group}</span>
              <div className="theme-group-swatches">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type={buttonType}
                    className={`theme-swatch${selectedTheme === t.id ? ' theme-swatch--active' : ''}`}
                    onClick={() => handleSelect(t.id)}
                    title={`${group} ${t.label}`}
                    style={{ background: THEME_SWATCHES[t.id] }}
                  >
                    <span className="theme-swatch-label">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div></div>
      </div>
    </div>
  );
}
