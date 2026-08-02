import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex h-9 w-[72px] shrink-0 items-center p-1 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner ${
        theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
      } ${className}`}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Sliding Circle Knob */}
      <div
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-base-100 shadow-md transition-transform duration-300 ease-out ${
          theme === 'dark' ? 'translate-x-[36px]' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
        )}
      </div>

      {/* Background Icons (Visible on the opposite side) */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        <Sun className={`w-4 h-4 text-amber-500/50 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
        <Moon className={`w-4 h-4 text-indigo-400/50 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;
