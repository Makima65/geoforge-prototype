import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrendingUp, FiCheckCircle, FiDollarSign, FiActivity, FiCpu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Skeleton from '../components/Skeleton';

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
        
        {loading ? (
          <>
            <Skeleton className="h-[136px] rounded-xl" />
            <Skeleton className="h-[136px] rounded-xl" />
            <Skeleton className="h-[136px] rounded-xl" />
          </>
        ) : (
          <>
            {/* Card 1: Active Projects (Blue Theme) */}
            <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="group relative rounded-xl transition-all duration-500 z-0 bg-[#0A0A0A] border border-neutral-800 hover:border-transparent"
        >
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10"></div>
          <div className="absolute inset-0 bg-[#0D0D12] rounded-xl -z-10"></div>
          
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-blue-500 text-[11px] font-black uppercase tracking-wider">ACTIVE PROJECTS</h3>
              <FiActivity className="text-blue-500 w-4 h-4 opacity-80" />
            </div>
            <div className="text-[32px] font-extrabold text-white mb-2 leading-none">
              {loading ? "..." : stats.totalProjects}
            </div>
            <div className="text-blue-500/70 text-[10px] font-bold">
              Tracked Builds
            </div>
          </div>
        </motion.div>

        {/* Card 2: Total Budget (Green Theme) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="group relative rounded-xl transition-all duration-500 z-0 bg-[#0A0A0A] border border-neutral-800 hover:border-transparent"
        >
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#3ecf8e] to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10"></div>
          <div className="absolute inset-0 bg-[#0D120F] rounded-xl -z-10"></div>
          
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[#3ecf8e] text-[11px] font-black uppercase tracking-wider">TOTAL PHP BUDGET</h3>
              <FiTrendingUp className="text-[#3ecf8e] w-4 h-4 opacity-80" />
            </div>
            <div className="text-[32px] font-extrabold text-white mb-2 leading-none tracking-tight">
              ₱{loading ? "..." : stats.totalBudget.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </div>
            <div className="text-[#3ecf8e]/70 text-[10px] font-bold">
              Total Spend (All Time)
            </div>
          </div>
        </motion.div>

        {/* Card 3: AI Optimized (Red Theme) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="group relative rounded-xl transition-all duration-500 z-0 bg-[#0A0A0A] border border-neutral-800 hover:border-transparent"
        >
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10"></div>
          <div className="absolute inset-0 bg-[#120D0D] rounded-xl -z-10"></div>
          
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-red-500 text-[11px] font-black uppercase tracking-wider">AI OPTIMIZED BUILDS</h3>
              <FiCpu className="text-red-500 w-4 h-4 opacity-80" />
            </div>
            <div className="text-[32px] font-extrabold text-white mb-2 leading-none">
              {loading ? "..." : stats.aiOptimized}
            </div>
            <div className="text-red-500/70 text-[10px] font-bold">
              Smart Configurations
            </div>
          </div>
        </motion.div>
        </>
        )}
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
