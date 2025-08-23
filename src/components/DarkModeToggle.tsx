"use client";
import { useDarkMode } from './DarkModeProvider';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 cursor-pointer hover:opacity-80 border border-gray-800 dark:border-gray-400"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
      }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
          light_mode
        </span>
      ) : (
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
          dark_mode
        </span>
      )}
    </button>
  );
}
