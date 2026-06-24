import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiEye, FiShoppingCart, FiClock, FiAlertTriangle, FiGlobe, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Skeleton from '../components/Skeleton';

export default function SavedProjects() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartToDelete, setCartToDelete] = useState(null);
  const [deleteActionType, setDeleteActionType] = useState(null); // 'soft' or 'hard'
  const [activeTab, setActiveTab] = useState('engineering'); // 'engineering', 'community', or 'trash'
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
    
    if (deleteActionType === 'hard') {
      // Permanently delete from Supabase
      await supabase.from('saved_carts').delete().eq('id', cartToDelete.id);
      setCarts(carts.filter(c => c.id !== cartToDelete.id));
    } else {
      // Soft Delete: Move to Trash
      const now = new Date().toISOString();
      await supabase.from('saved_carts').update({ deleted_at: now }).eq('id', cartToDelete.id);
      setCarts(carts.map(c => c.id === cartToDelete.id ? { ...c, deleted_at: now } : c));
    }
    
    setCartToDelete(null);
    setDeleteActionType(null);
  };

  const handleRestore = async (cart) => {
    await supabase.from('saved_carts').update({ deleted_at: null }).eq('id', cart.id);
    setCarts(carts.map(c => c.id === cart.id ? { ...c, deleted_at: null } : c));
  };

  const filteredCarts = carts.filter(cart => {
    if (activeTab === 'trash') return cart.deleted_at !== null;
    
    // For active tabs, hide deleted items
    if (cart.deleted_at !== null) return false;

    if (activeTab === 'community') return cart.category === 'impact' || cart.category === 'community' || cart.mode === 'ngo';
    if (activeTab === 'engineering') return cart.category === 'engineering' || cart.mode === 'maker' || (!cart.category && cart.mode !== 'ngo');
    return false;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col p-6 md:p-10 relative">
      <div className="mb-8">
        <h2 className="text-[32px] leading-tight font-extrabold tracking-tight text-primary mb-2">Saved Projects</h2>
        <p className="text-accent font-medium tracking-wide">View, manage, and continue your saved projects.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-surface-soft p-1.5 rounded-xl border border-default w-full max-w-xl">
        <button
          onClick={() => setActiveTab('engineering')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'engineering' ? 'bg-soft text-blue-400 shadow-sm' : 'text-muted hover:text-primary hover:bg-panel-strong'}`}
        >
          <FiShoppingCart className="mr-2" /> Engineering Projects
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'community' ? 'bg-soft text-accent shadow-sm' : 'text-muted hover:text-primary hover:bg-panel-strong'}`}
        >
          <FiGlobe className="mr-2" /> Community Initiatives
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'trash' ? 'bg-soft text-red-400 shadow-sm' : 'text-muted hover:text-primary hover:bg-panel-strong'}`}
        >
          <FiTrash2 className="mr-2" /> Trash
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-surface-soft border border-default rounded-2xl h-[260px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-default">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <Skeleton className="w-20 h-6 rounded" />
                </div>
                <Skeleton className="w-3/4 h-6 rounded mb-2" />
                <Skeleton className="w-1/2 h-4 rounded" />
              </div>
              <div className="p-6 bg-surface-strong flex-1 flex flex-col justify-between">
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
        <div className="bg-surface-soft border border-default rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-soft rounded-full flex items-center justify-center mb-6">
            {activeTab === 'engineering' ? <FiShoppingCart className="text-blue-500 w-8 h-8" /> : activeTab === 'community' ? <FiGlobe className="text-accent w-8 h-8" /> : <FiTrash className="text-red-400 w-8 h-8" />}
          </div>
          <h3 className="text-primary font-bold text-xl mb-2">
            {activeTab === 'trash' ? 'Archive is Empty' : `No Saved ${activeTab === 'engineering' ? 'Projects' : 'Initiatives'} Yet`}
          </h3>
          <p className="text-muted mb-8 max-w-md">
            {activeTab === 'engineering' 
              ? "You haven't finalized any engineering projects. Go back to create a new project and save your tracker."
              : activeTab === 'community'
              ? "You haven't saved any community initiatives yet. Go to create a new project to start planning."
              : "Items deleted from your projects will appear here for 14 days before being permanently removed."}
          </p>
          {activeTab !== 'trash' && (
            <button onClick={() => navigate(activeTab === 'engineering' ? '/wizard' : '/wizard')} className={`font-bold rounded-lg px-6 py-3 transition-colors ${activeTab === 'engineering' ? 'bg-blue-500 hover:bg-blue-400 text-black' : 'bg-accent hover:bg-accent-strong text-black'}`}>
              {activeTab === 'engineering' ? 'Start a Project' : 'Plan an Initiative'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCarts.map(cart => {
            const isNgo = cart.category === 'impact' || cart.category === 'community' || cart.mode === 'ngo';
            const daysLeft = cart.deleted_at ? 14 - Math.floor((new Date() - new Date(cart.deleted_at)) / (1000 * 60 * 60 * 24)) : 0;
            
            return (
              <motion.div 
                key={cart.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-surface-soft border border-default rounded-2xl overflow-hidden transition-colors flex flex-col ${activeTab === 'trash' ? 'opacity-80 grayscale hover:grayscale-0' : 'hover:border-neutral-600'}`}
              >
                <div className="p-6 border-b border-default">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-soft border flex items-center justify-center shrink-0 ${activeTab === 'trash' ? 'border-red-500/30' : isNgo ? 'border-accent-soft' : 'border-blue-500/30'}`}>
                      {isNgo ? <FiGlobe className={activeTab === 'trash' ? 'text-red-400 w-5 h-5' : 'text-accent w-5 h-5'} /> : <FiShoppingCart className={activeTab === 'trash' ? 'text-red-400 w-5 h-5' : 'text-blue-400 w-5 h-5'} />}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {activeTab === 'trash' ? (
                        <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-500/20 uppercase flex items-center">
                          <FiAlertTriangle className="mr-1" /> Auto-deletes in {Math.max(0, daysLeft)} days
                        </span>
                      ) : (
                        <>
                          {cart.is_optimized && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${isNgo ? 'bg-accent/10 text-accent border-[#24b47e]/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                              AI Optimized
                            </span>
                          )}
                          {cart.is_completed && (
                            <span className="bg-neutral-200 dark:bg-neutral-800 text-primary text-[10px] font-bold px-2 py-1 rounded border border-neutral-600 uppercase">
                              Completed
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <h3 className="text-primary font-bold text-lg leading-snug mb-1 line-clamp-1" title={cart.title}>{cart.title}</h3>
                  <div className="flex items-center text-muted text-xs font-medium">
                    <FiClock className="mr-1.5" /> {activeTab === 'trash' ? 'Trashed' : 'Saved'} {new Date(cart.deleted_at || cart.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-surface-strong flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-muted text-xs mb-1">Total Budget</div>
                      <div className={`font-black text-2xl ${activeTab === 'trash' ? 'text-red-400' : isNgo ? 'text-accent' : 'text-blue-400'}`}>₱{cart.final_cost?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted text-xs mb-1">{isNgo ? 'Action Items' : 'Total Parts'}</div>
                      <div className="text-primary font-bold text-lg">{isNgo ? '14' : (cart.components?.length || 0)}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeTab === 'trash' ? (
                      <>
                        <button onClick={() => handleRestore(cart)} className="w-full bg-soft hover:bg-panel-strong text-primary border border-default font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center">
                          <FiRefreshCcw className="mr-2" /> Restore Project
                        </button>
                        <button onClick={() => { setCartToDelete(cart); setDeleteActionType('hard'); }} className="w-full bg-transparent hover:bg-red-500/10 text-muted hover:text-red-400 font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center border border-transparent hover:border-red-500/20">
                          <FiTrash2 className="mr-2" /> Delete Permanently
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => navigate(isNgo ? '/ngo' : '/new', { state: { editProject: cart } })} className="w-full bg-soft hover:bg-panel-strong text-primary border border-default font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center">
                          <FiEye className="mr-2" /> {isNgo ? 'View Impact Plan' : 'View Full Tracker'}
                        </button>
                        <button onClick={() => { setCartToDelete(cart); setDeleteActionType('soft'); }} className="w-full bg-transparent hover:bg-red-500/10 text-muted hover:text-red-400 font-semibold rounded-lg px-4 py-2.5 transition-colors text-sm flex items-center justify-center border border-transparent hover:border-red-500/20">
                          <FiTrash2 className="mr-2" /> Move to Trash
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {/* Delete Confirmation Modal */}
        {cartToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <div className="bg-surface-soft border border-default rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="text-primary font-bold text-lg mb-2">
                {deleteActionType === 'hard' ? 'Delete Permanently?' : `Move to Trash?`}
              </h3>
              <p className="text-muted text-sm mb-6">
                {deleteActionType === 'hard' 
                  ? `Are you sure you want to permanently delete "${cartToDelete.title}"? This action cannot be undone.`
                  : `Are you sure you want to move "${cartToDelete.title}" to the trash? It will be permanently deleted after 14 days.`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setCartToDelete(null); setDeleteActionType(null); }} className="bg-transparent border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 text-primary font-semibold rounded-lg py-2.5 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-primary font-semibold rounded-lg py-2.5 transition-colors">
                  {deleteActionType === 'hard' ? 'Yes, Delete' : 'Move to Trash'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
