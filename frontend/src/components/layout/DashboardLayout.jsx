import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#111111] text-neutral-400 font-sans selection:bg-[#3ecf8e]/30 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-neutral-950/30">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
