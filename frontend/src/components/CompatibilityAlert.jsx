import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const CompatibilityAlert = ({ isOpen, onClose, onAutoFix }) => {
  const [isFixing, setIsFixing] = useState(false);

  const handleFix = async () => {
    setIsFixing(true);
    onAutoFix({
      orig: "Logic Level Shifter",
      local: "4-Channel Bi-Directional Logic Level Shifter",
      notes: "Auto-added to fix 3.3V to 5V logic mismatch",
      supplier: "Makerlab Electronics",
      price: 50.0,
      qty: 1
    });
    setIsFixing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white dark:bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-panel-strong border border-red-500/30 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-primary transition-colors">
              <FiX className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-500/20 p-4 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                <FiAlertTriangle className="text-red-500 w-10 h-10 relative z-10" />
              </div>
              
              <h3 className="text-primary font-extrabold text-2xl mb-3">Will it Explode? Logic Level Mismatch Detected!</h3>
              
              <p className="text-muted text-base mb-8 leading-relaxed max-w-lg">
                Your <strong className="text-red-400">ESP32-WROOM</strong> uses 3.3V logic, but the <strong className="text-red-400">5V Relay / LCD</strong> requires 5V. Connecting these directly can damage your microcontroller pins or cause erratic behavior.
              </p>

              <button 
                onClick={handleFix}
                disabled={isFixing}
                className="w-full bg-red-500 hover:bg-red-600 text-primary font-bold text-lg px-6 py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isFixing ? "Applying Fix..." : "+ Auto-Fix: Add Logic Level Shifter (₱50)"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CompatibilityAlert;
