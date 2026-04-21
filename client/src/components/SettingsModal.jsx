import { useState } from 'react';
import './SettingsModal.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [appTitle, setAppTitle] = useState(settings.app_title || 'RetroBoard');
  const [appSubtitle, setAppSubtitle] = useState(settings.app_subtitle || 'Real-time retrospective collaboration');
  const [iconType, setIconType] = useState(settings.app_icon_type || 'emoji'); // 'emoji' | 'image'
  const [iconValue, setIconValue] = useState(settings.app_icon_value || '🔄');
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      app_title: appTitle,
      app_subtitle: appSubtitle,
      app_icon_type: iconType,
      app_icon_value: iconValue,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal">
        <h2>App Logo Settings</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              Save Logo Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
