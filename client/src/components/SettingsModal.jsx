import { useState } from 'react';
import './SettingsModal.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [appTitle, setAppTitle] = useState(settings.app_title || 'RetroBoard');
  const [appSubtitle, setAppSubtitle] = useState(settings.app_subtitle || 'Real-time retrospective collaboration');
  const [iconType, setIconType] = useState(settings.app_icon_type || 'emoji');
  const [iconValue, setIconValue] = useState(settings.app_icon_value || '🔄');
  const [themeAccentColor, setThemeAccentColor] = useState(settings.theme_accent_color || '#6c63ff');
  const [themeAccentHoverColor, setThemeAccentHoverColor] = useState(settings.theme_accent_hover_color || '#7c74ff');
  const [uploading, setUploading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setIconValue(data.url);
        setIconType('image');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload icon.');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowResetConfirm(true);
  };

  const performReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAppTitle('RetroBoard');
    setAppSubtitle('Real-time retrospective collaboration');
    setIconType('emoji');
    setIconValue('🔄');
    setThemeAccentColor('#6c63ff');
    setThemeAccentHoverColor('#7c74ff');
    setShowResetConfirm(false);
  };

  const cancelReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowResetConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      app_title: appTitle,
      app_subtitle: appSubtitle,
      app_icon_type: iconType,
      app_icon_value: iconValue,
      theme_accent_color: themeAccentColor,
      theme_accent_hover_color: themeAccentHoverColor,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal">
        <div className="modal-header">
          <h2>Settings</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Application Title</label>
              <input
                type="text"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                placeholder="RetroBoard"
              />
            </div>

            <div className="form-group">
              <label>Subtitle / Description</label>
              <input
                type="text"
                value={appSubtitle}
                onChange={(e) => setAppSubtitle(e.target.value)}
                placeholder="Real-time retrospective collaboration"
              />
            </div>

            <div className="form-group">
              <label>Logo Icon Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="iconType"
                    value="emoji"
                    checked={iconType === 'emoji'}
                    onChange={() => setIconType('emoji')}
                  />
                  Emoji
                </label>
                <label>
                  <input
                    type="radio"
                    name="iconType"
                    value="image"
                    checked={iconType === 'image'}
                    onChange={() => setIconType('image')}
                  />
                  Custom Image
                </label>
              </div>
            </div>

            {iconType === 'emoji' ? (
              <div className="form-group">
                <label>Emoji Icon</label>
                <input
                  type="text"
                  value={iconValue}
                  onChange={(e) => setIconValue(e.target.value)}
                  placeholder="🔄"
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Upload Logo</label>
                <div className="upload-box">
                  {iconValue && iconType === 'image' && (
                    <img src={`${SERVER_URL}${iconValue}`} alt="Preview" className="icon-preview" />
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  {uploading && <span className="uploading-text">Uploading...</span>}
                </div>
              </div>
            )}

            <div className="divider"></div>
            <h3 className="settings-section-title">Brand Colors</h3>

            <div className="form-group-row">
              <div className="form-group half">
                <label>Accent Color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={themeAccentColor}
                    onChange={(e) => setThemeAccentColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="color-hex-input"
                    value={themeAccentColor}
                    onChange={(e) => setThemeAccentColor(e.target.value)}
                    placeholder="#6C63FF"
                  />
                </div>
              </div>
              <div className="form-group half">
                <label>Accent Hover Color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={themeAccentHoverColor}
                    onChange={(e) => setThemeAccentHoverColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="color-hex-input"
                    value={themeAccentHoverColor}
                    onChange={(e) => setThemeAccentHoverColor(e.target.value)}
                    placeholder="#7C74FF"
                  />
                </div>
              </div>
            </div>

            <div className="danger-zone">
              <div className="danger-text">
                <h4>Reset</h4>
                <p>Revert all branding and accent colors to the application defaults.</p>
              </div>
              {!showResetConfirm ? (
                <button type="button" className="btn btn-ghost btn-reset" onClick={handleReset}>
                  Reset Defaults
                </button>
              ) : (
                <div className="confirm-reset-actions">
                  <span className="confirm-label">Are you sure?</span>
                  <button type="button" className="btn btn-primary btn-sm btn-danger" onClick={performReset}>
                    Yes, Reset
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={cancelReset}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
