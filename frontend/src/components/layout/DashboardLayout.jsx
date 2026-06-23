import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#111111] text-neutral-400 font-sans selection:bg-[#3ecf8e]/30 flex">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 flex flex-col min-h-screen bg-neutral-950/30 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isSidebarOpen ? 'ml-64' : 'ml-[84px]'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
