import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  return (
    <div className="min-h-screen bg-page text-primary font-sans selection:bg-accent/30 flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ml-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-[84px]'}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
