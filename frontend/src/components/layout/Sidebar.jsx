import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPlus, FiSave, FiClock, FiSettings, FiMapPin } from 'react-icons/fi';
import SidebarToggle from './SidebarToggle';

export default function Sidebar({ isOpen, toggle }) {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Saved Builds', path: '/saved', icon: FiSave },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <div className={`h-screen bg-[#111111] border-r border-neutral-800 flex flex-col fixed left-0 top-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-50 ${isOpen ? 'w-64' : 'w-[84px]'}`}>
      {/* Brand */}
      <div className="p-6">
        <div className={`flex items-center mb-8 ${isOpen ? 'justify-between' : 'flex-col gap-6 justify-center'}`}>
          <div className={`flex items-center space-x-3 transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden hidden'}`}>
            <div className="w-8 h-8 bg-[#3ecf8e] shrink-0 rounded-md flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_15px_rgba(36,180,126,0.2)]">
              FR
            </div>
            <span className="text-[#3ecf8e] font-extrabold tracking-tight text-lg whitespace-nowrap">Field-Ready</span>
          </div>
          {!isOpen && (
            <div className="w-8 h-8 bg-[#3ecf8e] shrink-0 rounded-md flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_15px_rgba(36,180,126,0.2)]">
              FR
            </div>
          )}
          <SidebarToggle isOpen={isOpen} toggle={toggle} />
        </div>

        {/* Location Card */}
        <div className={`bg-[#1A1A1A] border border-neutral-800 rounded-xl overflow-hidden shadow-sm transition-all duration-500 ${isOpen ? 'p-4 mb-8 opacity-100 max-h-40' : 'p-0 mb-8 opacity-0 max-h-0 border-transparent'}`}>
          <div className="flex items-center text-neutral-300 text-sm font-semibold mb-1">
            <FiMapPin className="text-[#3ecf8e] mr-2" />
            Quezon City, PH
          </div>
          <div className="text-neutral-500 text-xs font-medium ml-6">
            Currency: <span className="text-neutral-400">₱ PHP</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'bg-[#24b47e]/10 text-[#3ecf8e] border border-[#24b47e]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                } ${isOpen ? 'space-x-3' : 'justify-center'}`
              }
            >
              <item.icon className={`w-[18px] h-[18px] shrink-0 ${item.name === 'Dashboard' ? 'text-[#3ecf8e]' : ''}`} />
              <span className={`whitespace-nowrap transition-all duration-500 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className={`mt-auto border-t border-neutral-800/80 bg-neutral-900/20 transition-all duration-500 ${isOpen ? 'p-6' : 'p-4 flex justify-center'}`}>
        <div className={`flex items-center cursor-pointer group ${isOpen ? 'space-x-3' : 'justify-center'}`}>
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#3ecf8e] font-bold border border-neutral-700 group-hover:border-[#3ecf8e]/50 transition-colors">
            JR
          </div>
          <div className={`whitespace-nowrap transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 hidden'}`}>
            <div className="text-sm font-semibold text-white group-hover:text-[#3ecf8e] transition-colors">Juan Reyes</div>
            <div className="text-xs text-[#3ecf8e]/80 font-medium tracking-wide">Maker • NCR</div>
          </div>
        </div>
      </div>
    </div>
  );
}
