import React from 'react';
import TopNavbar from './TopNavbar';

export default function HumanitarianLayout({ children }) {
  return (
    <div className="min-h-screen bg-page text-primary font-sans selection:bg-accent/30 flex flex-col">
      <TopNavbar />
      <main className="flex-1 flex flex-col items-center pt-10 px-6 pb-20 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
