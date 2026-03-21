import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode.js';
import { Button } from './Button.jsx';

export function DarkModeToggle({ style }) {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <Button 
      variant="secondary" 
      onClick={() => setIsDark(!isDark)}
      style={{
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      title="Toggle Dark Mode"
    >
      {isDark ? '🌙' : '☀️'}
    </Button>
  );
}
