import React from 'react';
import { FiSun, FiMoon, FiMapPin } from 'react-icons/fi';
import { useTheme } from '../ThemeProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-20 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-10 transition-colors">
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Project Workspace</h1>
      
      <div className="flex items-center space-x-5">
        <button 
          onClick={toggleTheme}
          title="Appearance: Switch between Light and Dark mode. Your preference is saved automatically."
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
        >
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
