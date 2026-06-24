import React, { useState, useEffect } from 'react';
import './TerminalLoader.css';
import { motion } from 'framer-motion';

const TerminalLoader = ({ isComplete, onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Processing AI matching...');

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      setStatusText('Extraction Complete!');
      const timer = setTimeout(() => {
        onFinished();
      }, 150);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 40) return prev + Math.floor(Math.random() * 18) + 8;
        if (prev < 80) return prev + Math.floor(Math.random() * 10) + 4;
        if (prev < 98) return prev + Math.floor(Math.random() * 4) + 1;
        return 99;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isComplete, onFinished]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full card rounded-xl overflow-hidden shadow-2xl mb-14"
    >
      <div className="flex items-center px-4 py-3 bg-panel border-b border-default">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        </div>
        <div className="text-muted text-xs font-mono flex-1 text-center font-bold tracking-widest uppercase">
          Extracting Components...
        </div>
      </div>
      
      <div className="p-8">
        <div className="scanner-loader mb-8">
          <div className="wrapper">
            <div className="circle" />
            <div className="line-1" />
            <div className="line-2" />
            <div className="line-3" />
            <div className="line-4" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2 font-mono text-sm">
          <span className="text-accent">{statusText}</span>
          <span className="text-accent font-bold">{Math.min(progress, 100)}%</span>
        </div>
        <div className="w-full bg-soft h-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TerminalLoader;
