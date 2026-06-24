import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiEye, FiShoppingCart, FiClock, FiAlertTriangle, FiGlobe } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Skeleton from '../components/Skeleton';

export default function SavedBuilds() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartToDelete, setCartToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('maker'); // 'maker' or 'ngo'
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    const { data, error } = await supabase
      .from('saved_carts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setCarts(data);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!cartToDelete) return;
    await supabase.from('saved_carts').delete().eq('id', cartToDelete.id);
    setCarts(carts.filter(c => c.id !== cartToDelete.id));
    setCartToDelete(null);
  };

  const filteredCarts = carts.filter(cart => {
    if (activeTab === 'ngo') return cart.mode === 'ngo';
    return !cart.mode || cart.mode === 'maker'; // Default to maker for legacy carts
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col p-6 md:p-10 relative">
      <div className="mb-8">
        <h2 className="text-[32px] leading-tight font-extrabold tracking-tight text-white mb-2">Saved Projects</h2>
        <p className="text-[#3ecf8e] font-medium tracking-wide">Manage your finalized maker builds and NGO impact plans.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-[#111111] p-1.5 rounded-xl border border-neutral-800 w-full max-w-md">
        <button
          onClick={() => setActiveTab('maker')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'maker' ? 'bg-[#1A1A1A] text-blue-400 shadow-sm' : 'text-neutral-500 hover:text-white hover:bg-[#161616]'}`}
        >
          <FiShoppingCart className="mr-2" /> Maker Builds
        </button>
        <button
          onClick={() => setActiveTab('ngo')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'ngo' ? 'bg-[#1A1A1A] text-[#3ecf8e] shadow-sm' : 'text-neutral-500 hover:text-white hover:bg-[#161616]'}`}
        >
          <FiGlobe className="mr-2" /> NGO Plans
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-[#111111] border border-neutral-800 rounded-2xl h-[260px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <Skeleton className="w-20 h-6 rounded" />
                </div>
                <Skeleton className="w-3/4 h-6 rounded mb-2" />
                <Skeleton className="w-1/2 h-4 rounded" />
              </div>
              <div className="p-6 bg-[#0A0A0A] flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="w-16 h-3 rounded mb-2" />
                    <Skeleton className="w-24 h-8 rounded" />
                  </div>
                  <div className="flex flex-col items-end">
                    <Skeleton className="w-16 h-3 rounded mb-2" />
                    <Skeleton className="w-8 h-6 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCarts.length === 0 ? (
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
            {activeTab === 'maker' ? <FiShoppingCart className="text-blue-500 w-8 h-8" /> : <FiGlobe className="text-[#3ecf8e] w-8 h-8" />}
          </div>
          <h3 className="text-white font-bold text-xl mb-2">No Saved {activeTab === 'maker' ? 'Builds' : 'Plans'} Yet</h3>
          <p className="text-neutral-500 mb-8 max-w-md">
            {activeTab === 'maker' 
              ? "You haven't finalized any procurement plans. Go back to the Maker Portal to source parts and save your tracker."
              : "You haven't saved any Impact Planning frameworks yet. Go to the Impact Planning Engine to analyze a community."}
          </p>
          <button onClick={() => navigate('/')} className={`font-bold rounded-lg px-6 py-3 transition-colors ${activeTab === 'maker' ? 'bg-blue-500 hover:bg-blue-400 text-black' : 'bg-[#24b47e] hover:bg-[#3ecf8e] text-black'}`}>
            {activeTab === 'maker' ? 'Start Sourcing Parts' : 'Analyze Community'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCarts.map(cart => (
            <motion.div 
              key={cart.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-colors flex flex-col`}
            >
              <div className="p-6 border-b border-neutral-800">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-[#1A1A1A] border flex items-center justify-center shrink-0 ${activeTab === 'ngo' ? 'border-[#3ecf8e]/30' : 'border-blue-500/30'}`}>
                    {activeTab === 'ngo' ? <FiGlobe className="text-[#3ecf8e] w-5 h-5" /> : <FiShoppingCart className="text-blue-400 w-5 h-5" />}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {cart.is_optimized && (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${activeTab === 'ngo' ? 'bg-[#24b47e]/10 text-[#3ecf8e] border-[#24b47e]/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        AI Optimized
                      </span>
                    )}
                    {cart.is_completed && (
                      <span className="bg-neutral-800 text-white text-[10px] font-bold px-2 py-1 rounded border border-neutral-600 uppercase">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg leading-snug mb-1 line-clamp-1" title={cart.title}>{cart.title}</h3>
                <div className="flex items-center text-neutral-500 text-xs font-medium">
                  <FiClock className="mr-1.5" /> Saved {new Date(cart.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="p-6 bg-[#0A0A0A] flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-neutral-500 text-xs mb-1">Total Budget</div>
                    <div className={`font-black text-2xl ${activeTab === 'ngo' ? 'text-[#3ecf8e]' : 'text-blue-400'}`}>₱{cart.final_cost?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-neutral-500 text-xs mb-1">{activeTab === 'ngo' ? 'Action Items' : 'Total Parts'}</div>
                    <div className="text-white font-bold text-lg">{activeTab === 'ngo' ? '14' : (cart.components?.length || 0)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => navigate(activeTab === 'ngo' ? '/ngo' : '/new', { state: { editProject: cart } })} className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-neutral-800 font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center">
                    <FiEye className="mr-2" /> {activeTab === 'ngo' ? 'View Impact Plan' : 'View Full Tracker'}
                  </button>
                  <button onClick={() => setCartToDelete(cart)} className="w-full bg-transparent hover:bg-red-500/10 text-neutral-500 hover:text-red-400 font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center border border-transparent hover:border-red-500/20">
                    <FiTrash2 className="mr-2" /> Delete {activeTab === 'ngo' ? 'Plan' : 'Build'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {/* Delete Confirmation Modal */}
        {cartToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Delete {activeTab === 'ngo' ? 'Impact Plan' : 'Procurement Plan'}?</h3>
              <p className="text-neutral-400 text-sm mb-6">Are you sure you want to delete "{cartToDelete.title}"? This action cannot be undone.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setCartToDelete(null)} className="bg-transparent border border-neutral-700 hover:bg-neutral-800 text-white font-semibold rounded-lg py-2.5 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg py-2.5 transition-colors">Yes, Delete</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
