import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../ThemeProvider';
import { Link } from 'react-router-dom';

export default function TopNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-[#f8f9fa] dark:bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8 w-full transition-colors">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-6 h-6 bg-[#24b47e] rounded flex items-center justify-center text-black font-extrabold text-[10px] shadow-[0_0_10px_rgba(36,180,126,0.2)]">
          FR
        </div>
        <span className="text-[#3ecf8e] font-extrabold tracking-tight text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Field-Ready</span>
      </Link>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          title="Appearance: Switch between Light and Dark mode. Your preference is saved automatically."
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
        >
          {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
