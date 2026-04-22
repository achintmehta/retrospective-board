import { useEffect } from 'react';

export default function useTheme(settings) {
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme_bg_color) {
      root.style.setProperty('--bg-primary', settings.theme_bg_color);
      // Derive a slightly lighter version for secondary backgrounds if needed, 
      // or just trust the user's primary choice.
    } else {
      root.style.removeProperty('--bg-primary');
    }

    if (settings.theme_font_color) {
      root.style.setProperty('--text-primary', settings.theme_font_color);
    } else {
      root.style.removeProperty('--text-primary');
    }

    if (settings.theme_dashboard_card_color) {
      root.style.setProperty('--bg-secondary', settings.theme_dashboard_card_color);
    } else {
      root.style.removeProperty('--bg-secondary');
    }

    if (settings.theme_retro_card_color) {
      root.style.setProperty('--bg-card', settings.theme_retro_card_color);
    } else {
      root.style.removeProperty('--bg-card');
    }

    if (settings.theme_column_color) {
      root.style.setProperty('--bg-column', settings.theme_column_color);
    } else {
      root.style.removeProperty('--bg-column');
    }

    if (settings.theme_accent_color) {
      root.style.setProperty('--accent', settings.theme_accent_color);
      // Convert hex to RGB for components that use rgba transparency
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
  }, [
    settings.theme_bg_color, 
    settings.theme_font_color, 
    settings.theme_dashboard_card_color, 
    settings.theme_retro_card_color, 
    settings.theme_column_color,
    settings.theme_accent_color,
    settings.theme_accent_hover_color
  ]);
}
