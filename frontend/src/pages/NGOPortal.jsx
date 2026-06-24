import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiGlobe } from 'react-icons/fi';

export default function NGOPortal() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col p-6 md:p-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <button onClick={() => navigate('/wizard')} className="mb-8 text-neutral-500 hover:text-white transition-colors flex items-center text-sm font-semibold">
          <FiChevronLeft className="mr-1" /> Back to Wizard
        </button>
        
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-12 text-center shadow-lg">
          <div className="w-20 h-20 bg-[#24b47e]/10 border border-[#24b47e]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiGlobe className="w-10 h-10 text-[#3ecf8e]" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">NGO & Community Portal</h2>
          <p className="text-neutral-400 max-w-lg mx-auto">
            This is the placeholder for the upcoming Social Impact Blueprint flow. 
            Soon, you will be able to generate context-aware deployment frameworks here.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
