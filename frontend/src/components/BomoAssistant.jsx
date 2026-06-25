import React from 'react';
import { motion } from 'framer-motion';

export default function BomoAssistant({ title = "BOMO", message }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#24b47e] dark:bg-[#1a8a5f] rounded-2xl p-5 md:p-6 mb-8 flex items-center relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#3ecf8e]/30"
    >
      <div className="flex-shrink-0 z-10 -ml-2 md:-ml-4 relative">
        <div className="w-20 h-20 md:w-28 md:h-28 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner p-2">
          <img 
            src="/bomo.png" 
            alt="BOMO AI" 
            className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1v2h-1v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2H2v-2h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7 11a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H7zm5-4a5 5 0 0 0-4.9 4h9.8A5 5 0 0 0 12 7zm-2 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>
      
      <div className="flex-1 w-full ml-4 md:ml-6 z-10 relative">
        <div className="bg-white dark:bg-surface text-[#1f2937] dark:text-primary rounded-2xl rounded-tl-sm p-4 md:p-5 shadow-lg relative border border-black/5 dark:border-white/5">
          {/* Speech bubble pointer */}
          <div className="absolute top-0 -left-[14px] w-0 h-0 border-t-[14px] border-t-white dark:border-t-surface border-l-[14px] border-l-transparent"></div>
          
          <h4 className="font-extrabold text-[13px] tracking-widest text-[#24b47e] dark:text-[#3ecf8e] uppercase mb-1.5">{title}</h4>
          <p className="text-sm md:text-[15px] font-medium leading-relaxed dark:text-neutral-200">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
