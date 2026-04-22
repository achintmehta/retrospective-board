import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import useTheme from '../hooks/useTheme';

const SettingsContext = createContext(null);
const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export function SettingsProvider({ children }) {
  const { socket } = useSocket();
  const [settings, setSettings] = useState({
    app_title: 'RetroBoard',
    app_subtitle: 'Real-time retrospective collaboration',
    app_icon_type: 'emoji',
    app_icon_value: '🔄',
    theme_bg_color: '#0f1117',
    theme_font_color: '#e8eaf6',
    theme_dashboard_card_color: '#1a1d27',
    theme_retro_card_color: '#1e2130',
    theme_column_color: '#1a1d27',
    theme_accent_color: '#6c63ff',
    theme_accent_hover_color: '#7c74ff'
  });

  // Fetch initial
  useEffect(() => {
    fetch(`${SERVER_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(console.error);
  }, []);

  // Sync real-time updates
  useEffect(() => {
    if (!socket.current) return;
    const s = socket.current;
    
    const onSettingsUpdated = (newSettings) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    s.on('settings_updated', onSettingsUpdated);
    return () => s.off('settings_updated', onSettingsUpdated);
  }, [socket]);

  // Apply visual theme
  useTheme(settings);

  const updateSettings = async (newSettings) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      setSettings(data);
      return data;
    } catch (err) {
      console.error('Failed to save settings:', err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
