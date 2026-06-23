import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrendingUp, FiCheckCircle, FiDollarSign, FiActivity, FiCpu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function DashboardMetrics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProjects: 0, totalBudget: 0, aiOptimized: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase.from('saved_carts').select('*');
      if (data) {
        let budget = 0;
        let optimized = 0;
        data.forEach(cart => {
          budget += (cart.final_cost || 0);
          if (cart.is_optimized) optimized += 1;
        });
        setStats({
          totalProjects: data.length,
          totalBudget: budget,
          aiOptimized: optimized
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
          <h2 className="text-[32px] leading-tight font-extrabold tracking-tight text-white mb-2">Overview Metrics</h2>
          <p className="text-neutral-500 font-medium tracking-wide">Track your sourcing volume and total budget deployed across projects.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#3ecf8e]/10 rounded-full blur-2xl"></div>
          <div className="flex items-center text-neutral-400 mb-4 font-semibold text-sm">
            <FiActivity className="text-[#3ecf8e] mr-2 w-5 h-5" />
            Total Active Projects
          </div>
          <div className="text-4xl font-black text-white">
            {loading ? "..." : stats.totalProjects}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center text-neutral-400 mb-4 font-semibold text-sm">
            <FiDollarSign className="text-blue-400 mr-2 w-5 h-5" />
            Total PHP Budget
          </div>
          <div className="text-4xl font-black text-white">
            ₱{loading ? "..." : stats.totalBudget.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#3ecf8e]/20 rounded-full blur-2xl"></div>
          <div className="flex items-center text-neutral-400 mb-4 font-semibold text-sm">
            <FiCpu className="text-[#3ecf8e] mr-2 w-5 h-5" />
            AI Optimized Builds
          </div>
          <div className="text-4xl font-black text-white">
            {loading ? "..." : stats.aiOptimized}
          </div>
        </motion.div>
      </div>

      {/* Call to Action for New Project */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-neutral-800 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#3ecf8e]/5 opacity-50"></div>
        <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-[#3ecf8e]/10 rounded-full flex items-center justify-center mb-6 border border-[#3ecf8e]/20">
            <FiPlus className="text-[#3ecf8e] w-8 h-8" />
          </div>
          <h3 className="text-white font-extrabold text-2xl mb-3">Ready to build something?</h3>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Create a new project to automatically generate a localized ₱ PHP parts list and budget tracker directly from any hardware tutorial link.
          </p>
          <button 
            onClick={() => navigate('/new')}
            className="bg-[#3ecf8e] hover:bg-[#2ebc7a] text-black font-extrabold text-lg rounded-xl px-8 py-4 transition-all shadow-[0_0_30px_rgba(62,207,142,0.3)] hover:shadow-[0_0_40px_rgba(62,207,142,0.5)] transform hover:-translate-y-1"
          >
            + Create New Project
          </button>
        </div>
      </motion.div>
    </div>
  );
}
