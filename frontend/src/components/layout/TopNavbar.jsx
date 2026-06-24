import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';

export default function TopNavbar() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-default bg-surface/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8 w-full transition-colors">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-6 h-6 bg-accent rounded flex items-center justify-center text-black font-extrabold text-[10px] shadow-[0_0_10px_rgba(36,180,126,0.2)]">
          FR
        </div>
        <span className="text-accent font-extrabold tracking-tight text-sm group-hover:text-primary transition-colors">Field-Ready</span>
      </Link>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          title="Appearance: Switch between Light and Dark mode. Your preference is saved automatically."
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-panel transition-colors text-muted hover:text-primary active:scale-95"
        >
          {resolvedTheme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
