import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import useTheme from '../hooks/useTheme';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export default function ThemeManager({ children }) {
  const { socket } = useSocket();
  const [settings, setSettings] = useState({});

  // Initial fetch
  useEffect(() => {
    fetch(`${SERVER_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (Object.keys(data).length > 0) {
          setSettings(data);
        }
      })
      .catch(console.error);
  }, []);

  // Listen for updates
  useEffect(() => {
    if (!socket.current) return;
    const s = socket.current;
    
    const onSettingsUpdated = (newSettings) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    s.on('settings_updated', onSettingsUpdated);
    return () => s.off('settings_updated', onSettingsUpdated);
  }, [socket]);

  // Apply theme
  useTheme(settings);

  return children;
}
