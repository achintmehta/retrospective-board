import { useEffect } from 'react';

export default function useTheme(settings) {
  useEffect(() => {
    const root = document.documentElement;

    if (settings.theme_accent_color) {
      root.style.setProperty('--accent', settings.theme_accent_color);
      const r = parseInt(settings.theme_accent_color.slice(1, 3), 16);
      const g = parseInt(settings.theme_accent_color.slice(3, 5), 16);
      const b = parseInt(settings.theme_accent_color.slice(5, 7), 16);
      root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-rgb');
    }

    if (settings.theme_accent_hover_color) {
      root.style.setProperty('--accent-hover', settings.theme_accent_hover_color);
    } else {
      root.style.removeProperty('--accent-hover');
    }
  }, [settings.theme_accent_color, settings.theme_accent_hover_color]);
}
