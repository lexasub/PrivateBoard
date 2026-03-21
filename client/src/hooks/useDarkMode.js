import { useState, useEffect } from 'react';

const THEME_CHANGE_EVENT = 'theme_change_event';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const handleThemeChange = (e) => {
      setIsDark(e.detail);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const setGlobalTheme = (newVal) => {
    setIsDark(newVal);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: newVal }));
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return [isDark, setGlobalTheme];
}
