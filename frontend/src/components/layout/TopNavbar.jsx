import React from 'react';
import { FiSun, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function TopNavbar() {
  return (
    <header className="h-16 border-b border-neutral-800 bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8 w-full">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-6 h-6 bg-[#24b47e] rounded flex items-center justify-center text-black font-extrabold text-[10px] shadow-[0_0_10px_rgba(36,180,126,0.2)]">
          FR
        </div>
        <span className="text-[#3ecf8e] font-extrabold tracking-tight text-sm group-hover:text-white transition-colors">Field-Ready</span>
      </Link>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-neutral-900/50 border border-neutral-800 rounded-full px-3 py-1 shadow-sm">
          <FiMapPin className="text-neutral-500 w-3 h-3" />
          <span className="text-xs font-semibold text-[#3ecf8e]">Philippines • ₱ PHP</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-white active:scale-95">
          <FiSun className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
