import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPlus, FiSave, FiClock, FiSettings, FiMapPin } from 'react-icons/fi';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'New Project', path: '/new', icon: FiPlus },
    { name: 'Saved Builds', path: '/saved', icon: FiSave },
    { name: 'Parts History', path: '/history', icon: FiClock },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <div className="w-64 h-screen bg-[#111111] border-r border-neutral-800 flex flex-col fixed left-0 top-0">
      {/* Brand */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-[#3ecf8e] rounded-md flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_15px_rgba(36,180,126,0.2)]">
            FR
          </div>
          <span className="text-[#3ecf8e] font-extrabold tracking-tight text-lg">Field-Ready</span>
        </div>

        {/* Location Card */}
        <div className="bg-[#1A1A1A] border border-neutral-800 rounded-xl p-4 mb-8 shadow-sm">
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
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#24b47e]/10 text-[#3ecf8e] border border-[#24b47e]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon className={`w-[18px] h-[18px] ${item.name === 'Dashboard' ? 'text-[#3ecf8e]' : ''}`} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="mt-auto p-6 border-t border-neutral-800/80 bg-neutral-900/20">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#3ecf8e] font-bold border border-neutral-700 group-hover:border-[#3ecf8e]/50 transition-colors">
            JR
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-[#3ecf8e] transition-colors">Juan Reyes</div>
            <div className="text-xs text-[#3ecf8e]/80 font-medium tracking-wide">Maker • NCR</div>
          </div>
        </div>
      </div>
    </div>
  );
}
