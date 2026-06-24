import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const CompatibilityAlert = ({ components, onAutoFix }) => {
  const [hasMismatch, setHasMismatch] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    if (!components) return;
    
    // Check for mismatch
    const hasEsp32 = components.some(c => c.local && c.local.includes("ESP32"));
    const has5VComponent = components.some(c => c.local && (c.local.includes("Relay Module") || c.local.includes("LCD Display")));
    const hasShifter = components.some(c => c.local && c.local.includes("Logic Level Shifter"));

    if (hasEsp32 && has5VComponent && !hasShifter) {
      setHasMismatch(true);
      setFixed(false);
    } else if (hasShifter && hasMismatch) {
      setHasMismatch(false);
      setFixed(true);
      setTimeout(() => setFixed(false), 5000); // Hide success message after 5s
    }
  }, [components, hasMismatch]);

  const handleFix = async () => {
    setIsFixing(true);
    // Simulate thinking/API call
    await new Promise(resolve => setTimeout(resolve, 800));
    onAutoFix({
      orig: "Logic Level Shifter",
      local: "4-Channel Bi-Directional Logic Level Shifter",
      notes: "Auto-added to fix 3.3V to 5V logic mismatch",
      supplier: "Makerlab Electronics",
      price: 50.0,
      qty: 1
    });
    setIsFixing(false);
  };

  return (
    <AnimatePresence>
      {hasMismatch && (
        <motion.div 
          initial={{ opacity: 0, y: -10, height: 0 }} 
          animate={{ opacity: 1, y: 0, height: 'auto' }} 
          exit={{ opacity: 0, scale: 0.95, height: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden"
        >
          <div className="flex items-start">
            <div className="bg-red-500/20 p-2 rounded-lg mr-4 shrink-0 mt-1">
              <FiAlertTriangle className="text-red-500 w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Will it Explode? Logic Level Mismatch Detected!</h4>
              <p className="text-neutral-400 text-sm mt-1 leading-relaxed">
                Your <strong className="text-red-400">ESP32-WROOM</strong> uses 3.3V logic, but the <strong className="text-red-400">5V Relay / LCD</strong> requires 5V. Connecting these directly can damage your microcontroller pins or cause erratic behavior.
              </p>
            </div>
          </div>
          <button 
            onClick={handleFix}
            disabled={isFixing}
            className="shrink-0 bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-3 rounded-lg transition-colors flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-70"
          >
            {isFixing ? "Fixing..." : "+ Auto-Fix: Add Shifter (₱50)"}
          </button>
        </motion.div>
      )}

      {fixed && !hasMismatch && (
        <motion.div 
          initial={{ opacity: 0, y: -10, height: 0 }} 
          animate={{ opacity: 1, y: 0, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#24b47e]/10 border border-[#24b47e]/30 rounded-xl p-4 mb-8 flex items-center overflow-hidden"
        >
          <FiCheckCircle className="text-[#3ecf8e] w-5 h-5 mr-3" />
          <span className="text-[#3ecf8e] font-medium">Safe to build! Logic Level Shifter successfully added to your cart.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompatibilityAlert;
