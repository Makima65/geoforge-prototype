import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiEye, FiShoppingCart, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function SavedBuilds() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartToDelete, setCartToDelete] = useState(null);
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

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col p-6 md:p-10 relative">
      <div className="mb-10">
        <h2 className="text-[32px] leading-tight font-extrabold tracking-tight text-white mb-2">Saved Procurement Plans</h2>
        <p className="text-[#3ecf8e] font-medium tracking-wide">Manage your finalized projects, edit quantities, and track your sourcing budget via Supabase.</p>
      </div>

      {loading ? (
        <div className="text-white text-center mt-20">Loading database...</div>
      ) : carts.length === 0 ? (
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
            <FiShoppingCart className="text-neutral-600 w-8 h-8" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">No Saved Plans Yet</h3>
          <p className="text-neutral-500 mb-8 max-w-md">You haven't finalized any procurement plans. Go back to the Maker Portal to source parts and save your tracker.</p>
          <button onClick={() => navigate('/')} className="bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-lg px-6 py-3 transition-colors">
            Start Sourcing Parts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carts.map(cart => (
            <motion.div 
              key={cart.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-colors flex flex-col"
            >
              <div className="p-6 border-b border-neutral-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border border-neutral-700 flex items-center justify-center shrink-0">
                    <FiShoppingCart className="text-[#3ecf8e] w-5 h-5" />
                  </div>
                  {cart.is_optimized && (
                    <span className="bg-[#24b47e]/10 text-[#3ecf8e] text-[10px] font-bold px-2 py-1 rounded border border-[#24b47e]/20 uppercase">
                      AI Optimized
                    </span>
                  )}
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
                    <div className="text-[#3ecf8e] font-black text-2xl">₱{cart.final_cost?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-neutral-500 text-xs mb-1">Total Parts</div>
                    <div className="text-white font-bold text-lg">{cart.components?.length || 0}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => navigate('/new', { state: { editProject: cart } })} className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-neutral-800 font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center">
                    <FiEye className="mr-2" /> View Full Tracker
                  </button>
                  <button onClick={() => setCartToDelete(cart)} className="w-full bg-transparent hover:bg-red-500/10 text-neutral-500 hover:text-red-400 font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center border border-transparent hover:border-red-500/20">
                    <FiTrash2 className="mr-2" /> Delete Plan
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
              <h3 className="text-white font-bold text-lg mb-2">Delete Procurement Plan?</h3>
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
