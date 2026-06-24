import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../ThemeProvider';

export default function Header() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="h-20 border-b border-default bg-surface/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-10 transition-colors">
      <h1 className="text-xl font-bold tracking-tight text-primary">Project Workspace</h1>
      
      <div className="flex items-center space-x-5">
        <button 
          onClick={toggleTheme}
          title="Appearance: Switch between Light and Dark mode. Your preference is saved automatically."
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-panel transition-colors text-muted hover:text-primary active:scale-95"
        >
          {resolvedTheme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
