import React from 'react';
import { FiSun, FiMapPin } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="h-20 border-b border-neutral-800 bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-10">
      <h1 className="text-xl font-bold tracking-tight text-white">Maker Portal</h1>
      
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-2 bg-neutral-900/50 border border-[#24b47e]/30 rounded-full px-4 py-1.5 shadow-[0_0_10px_rgba(36,180,126,0.05)]">
          <FiMapPin className="text-[#3ecf8e] w-4 h-4" />
          <span className="text-sm font-semibold text-[#3ecf8e]">Quezon City, PH • ₱ PHP</span>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white active:scale-95">
          <FiSun className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
