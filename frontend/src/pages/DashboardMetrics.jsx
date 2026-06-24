import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCpu, FiGlobe } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Skeleton from '../components/Skeleton';

export default function DashboardMetrics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ engineering: 0, community: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase.from('saved_carts').select('*');
      if (data) {
        let eng = 0;
        let com = 0;
        data.forEach(cart => {
          if (cart.category === 'engineering' || !cart.category) eng += 1;
          else if (cart.category === 'impact' || cart.category === 'community') com += 1;
        });
        setStats({
          engineering: eng,
          community: com
        });
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col p-6 md:p-10 relative">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-[32px] leading-tight font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Overview Metrics</h2>
          <p className="text-neutral-500 dark:text-neutral-500 font-medium tracking-wide">Track your sourcing volume and total budget deployed across projects.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <h3 className="text-neutral-500 dark:text-neutral-500 text-[11px] font-bold uppercase tracking-widest mb-4">PROJECTS BY CATEGORY</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {loading ? (
          <>
            <Skeleton className="h-[136px] rounded-xl" />
            <Skeleton className="h-[136px] rounded-xl" />
            <Skeleton className="h-[136px] rounded-xl" />
          </>
        ) : (
          <>
            {/* Card 1: Engineering Projects */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              onClick={() => navigate('/saved', { state: { filter: 'engineering' } })}
              className="cursor-pointer group relative rounded-xl transition-all duration-300 z-0 bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-0 bg-[#0D0D12] rounded-xl -z-10 dark:block hidden"></div>
              
              <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-blue-600 dark:text-blue-500 text-[11px] font-black uppercase tracking-wider">ENGINEERING</h3>
                    <FiCpu className="text-blue-600 dark:text-blue-500 w-5 h-5 opacity-80" />
                  </div>
                  <div className="text-[36px] font-extrabold text-gray-900 dark:text-white mb-1 leading-none">
                    {loading ? "..." : stats.engineering}
                  </div>
                </div>
                <div className="text-neutral-500 dark:text-blue-500/70 text-xs font-medium mt-4">
                  Technical & Product Development
                </div>
              </div>
            </motion.div>

            {/* Card 2: Community Initiatives */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              onClick={() => navigate('/saved', { state: { filter: 'community' } })}
              className="cursor-pointer group relative rounded-xl transition-all duration-300 z-0 bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 hover:border-[#3ecf8e]/50 shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-0 bg-[#0D120F] rounded-xl -z-10 dark:block hidden"></div>
              
              <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[#24b47e] dark:text-[#3ecf8e] text-[11px] font-black uppercase tracking-wider">COMMUNITY INITIATIVES</h3>
                    <FiGlobe className="text-[#24b47e] dark:text-[#3ecf8e] w-5 h-5 opacity-80" />
                  </div>
                  <div className="text-[36px] font-extrabold text-gray-900 dark:text-white mb-1 leading-none tracking-tight">
                    {loading ? "..." : stats.community}
                  </div>
                </div>
                <div className="text-neutral-500 dark:text-[#3ecf8e]/70 text-xs font-medium mt-4">
                  Community • NGO • Public Programs
                </div>
              </div>
            </motion.div>
        </>
        )}
      </div>

      {/* Call to Action for New Project */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#3ecf8e]/5 opacity-50"></div>
        <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-[#3ecf8e]/10 rounded-full flex items-center justify-center mb-6 border border-[#3ecf8e]/20">
            <FiPlus className="text-[#3ecf8e] w-8 h-8" />
          </div>
          <h3 className="text-gray-900 dark:text-white font-extrabold text-2xl mb-3">Start a New Project</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            Choose a category and let BOMO create a structured project workspace—from planning and requirements to execution resources.
          </p>
          <button 
            onClick={() => navigate('/wizard')}
            className="bg-[#3ecf8e] hover:bg-[#2ebc7a] text-black font-extrabold text-lg rounded-xl px-8 py-4 transition-all shadow-[0_0_30px_rgba(62,207,142,0.3)] hover:shadow-[0_0_40px_rgba(62,207,142,0.5)] transform hover:-translate-y-1"
          >
            + Create New Project
          </button>
        </div>
      </motion.div>
    </div>
  );
}
