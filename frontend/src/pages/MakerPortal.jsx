import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft, FiHelpCircle, FiX, FiPlus, FiTrash2, FiMapPin, FiDownload, FiSave, FiList, FiMinus, FiEdit3, FiAlertTriangle, FiFileText, FiGrid, FiFile, FiCamera } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { runVectorMatch } from '../services/api';
import { supabase } from '../services/supabase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import StoreMap from '../components/map/StoreMap';
import AnimatedCheckbox from '../components/AnimatedCheckbox';
import TerminalLoader from '../components/TerminalLoader';
import GenerateButton from '../components/GenerateButton';
import MarkCompleteCard from '../components/MarkCompleteCard';
import CompatibilityAlert from '../components/CompatibilityAlert';

export default function MakerPortal() {
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('I want to build a smart automated greenhouse. It needs to monitor soil moisture, ambient temperature, and automatically trigger 12V water pumps and ventilation fans. I want to monitor everything remotely over WiFi.');
  const [inputMode, setInputMode] = useState('url'); // 'url' or 'text'
  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [step, setStep] = useState(0);
  const [currentProject, setCurrentProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [useSmartRecommendations, setUseSmartRecommendations] = useState(true);
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Custom item states
  const [customName, setCustomName] = useState('');
  const [customSpec, setCustomSpec] = useState('');

  useEffect(() => {
    // If navigated from SavedBuilds with editProject in state
    if (location.state && location.state.editProject) {
      const editData = location.state.editProject;
      setCurrentProject({
        ...editData,
        components: editData.components,
        cost: '₱' + (editData.final_cost || 0).toLocaleString()
      });
      setUseSmartRecommendations(editData.is_optimized);
      setIsUpdatingMode(true);
      setStep(1); // Jump straight to shopping checklist
      
      // Clear state so refresh doesn't trigger it again
      window.history.replaceState({}, document.title);
    } else if (location.state && location.state.toolType) {
      setInputMode(location.state.toolType);
    }
  }, [location]);

  // Helper to calculate dynamic total based on selections and quantities
  const calculateTotalCost = (project) => {
    if (!project || !project.components) return 0;
    return project.components.reduce((acc, curr) => {
      const selectedOpt = curr.options ? curr.options[curr.selectedOptionIndex] : null;
      const price = selectedOpt ? selectedOpt.price : (curr.price || 0);
      return acc + (price * (curr.qty || 1));
    }, 0);
  };

  // Mismatch Detection Logic
  const hasEsp32 = currentProject?.components?.some(c => c.local && c.local.includes("ESP32"));
  const has5VComponent = currentProject?.components?.some(c => c.local && (c.local.includes("Relay Module") || c.local.includes("LCD Display")));
  const hasShifter = currentProject?.components?.some(c => c.local && c.local.includes("Logic Level Shifter"));
  const hasMismatch = hasEsp32 && has5VComponent && !hasShifter;
  
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchRecent() {
      const { data } = await supabase
        .from('saved_carts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data && data.length > 0) {
        const formatted = data.map(cart => ({
          title: cart.title,
          date: new Date(cart.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          parts: cart.components ? cart.components.length : 0,
          cost: '₱' + (cart.final_cost || 0).toLocaleString(undefined, {maximumFractionDigits: 0}),
          localScore: cart.is_optimized ? 100 : 85,
          components: cart.components,
        }));
        setProjects(formatted);
      }
    }
    fetchRecent();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Give time for the button's click animation to play
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setIsExtracting(true);
    setExtractionComplete(false);
    
    try {
      const payload = {
        project_name: inputMode === 'text' ? prompt : "Extracted Build Specs",
        url: inputMode === 'url' ? url : undefined,
        country: "Philippines",
        region: "NCR",
        city: "Manila",
        mode: "maker"
      };
      const result = await runVectorMatch(payload);
      
      const componentsWithOptions = result.components.map(c => {
        const basePrice = c.price || 500;
        return {
          ...c,
          qty: 1,
          selectedOptionIndex: 1, // Default to standard
          options: [
            { type: 'Premium Selection', seller: 'DigiSupply Warehouse', stock: Math.floor(Math.random() * 1000) + 100, price: basePrice * 1.5, match: '98%' },
            { type: 'Standard Edition', seller: c.supplier || 'MakerStore', stock: Math.floor(Math.random() * 500) + 50, price: basePrice, match: '95%' },
            { type: 'Direct Factory Outlet', seller: 'NextDay Chip Co', stock: Math.floor(Math.random() * 20) + 5, price: Math.floor(basePrice * 0.7), match: '88%' }
          ]
        };
      });

      const newProject = {
        title: result.project_title,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        parts: result.components.length,
        localScore: result.match_quality === 'High' ? 100 : 70,
        thumbnail_url: result.thumbnail_url,
        author_name: result.author_name,
        components: componentsWithOptions
      };
      
      // Calculate initial cost
      newProject.cost = '₱' + calculateTotalCost(newProject).toLocaleString();
      
      setProjects([newProject, ...projects]);
      setCurrentProject(newProject);
      setUrl('');
      setExtractionComplete(true);
    } catch (err) {
      console.error(err);
      setIsExtracting(false);
      setLoading(false);
    }
  };

  const handleExtractionDone = () => {
    setIsExtracting(false);
    setExtractionComplete(false);
    setLoading(false);
    setStep(1);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('maker-results-dashboard');
    if (!element) return;
    const btn = document.getElementById('maker-download-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generating PDF...';
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#0A0A0A', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GeoForge_Tracker_${currentProject.title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      btn.innerHTML = originalText;
      setShowExportMenu(false);
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('maker-results-dashboard');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#0A0A0A', scale: 2 });
      const link = document.createElement('a');
      link.download = `GeoForge_Tracker_${currentProject.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShowExportMenu(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadExcel = () => {
    if (!currentProject || !currentProject.components) return;
    
    // Create CSV content
    const headers = ["Item Name", "Specification", "Quantity", "Supplier", "Price (PHP)"];
    const rows = currentProject.components.map(item => [
      `"${item.local}"`,
      `"${item.notes || ''}"`,
      item.qty || 1,
      `"${item.supplier || 'Standard'}"`,
      item.price || 0
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GeoForge_BOM_${currentProject.title.replace(/\s+/g, '_')}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const handleDownloadWord = () => {
    if (!currentProject || !currentProject.components) return;
    
    // Create a beautifully formatted HTML structure that Word can open
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Procurement Plan</title></head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px;">
        <h1 style="color: #24b47e;">GeoForge Procurement Plan</h1>
        <h2 style="color: #333;">Project: ${currentProject.title}</h2>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color: #f5f5f5; text-align: left;">
              <th>Item Name</th>
              <th>Specification</th>
              <th>Qty</th>
              <th>Supplier</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${currentProject.components.map(item => `
              <tr>
                <td><strong>${item.local}</strong></td>
                <td>${item.notes || 'Standard Spec'}</td>
                <td>${item.qty || 1}</td>
                <td>${item.supplier || 'Local Supply'}</td>
                <td>P${(item.price || 0) * (item.qty || 1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h3 style="text-align: right; margin-top: 20px;">Total Estimated Cost: PHP ${calculateTotalCost(currentProject).toLocaleString()}</h3>
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GeoForge_Plan_${currentProject.title.replace(/\s+/g, '_')}.doc`;
    link.click();
    setShowExportMenu(false);
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  const deleteItem = (idx) => {
    const updated = { ...currentProject };
    const compName = updated.components[idx].local;
    updated.components.splice(idx, 1);
    
    updated.audit_log = [...(updated.audit_log || []), { action: `Removed ${compName} from list`, timestamp: new Date().toLocaleString() }];
    
    setCurrentProject(updated);
  };

  const updateQty = (idx, delta) => {
    const updated = { ...currentProject };
    const oldQty = updated.components[idx].qty || 1;
    const newQty = oldQty + delta;
    if (newQty > 0 && oldQty !== newQty) {
      updated.components[idx].qty = newQty;
      const compName = updated.components[idx].local;
      updated.audit_log = [...(updated.audit_log || []), { action: `Changed ${compName} quantity from ${oldQty} to ${newQty}`, timestamp: new Date().toLocaleString() }];
      setCurrentProject(updated);
    }
  };

  const addCustomItem = () => {
    if (!customName.trim()) return;
    const updated = { ...currentProject };
    updated.components.push({
      orig: customName,
      local: customName,
      notes: customSpec || 'Custom specification',
      qty: 1,
      selectedOptionIndex: 1,
      options: [
        { type: 'Premium Selection', seller: 'DigiSupply', stock: 50, price: 500, match: '90%' },
        { type: 'Standard Edition', seller: 'MakerStore', stock: 100, price: 300, match: '95%' },
        { type: 'Direct Factory Outlet', seller: 'Direct', stock: 10, price: 200, match: '80%' }
      ],
      isCustom: true
    });
    
    updated.audit_log = [...(updated.audit_log || []), { action: `Added custom item: ${customName}`, timestamp: new Date().toLocaleString() }];
    
    setCurrentProject(updated);
    setCustomName('');
    setCustomSpec('');
  };

  const toggleBought = (idx, checked) => {
    const updated = { ...currentProject };
    const compName = updated.components[idx].local;
    updated.components[idx].isBought = checked;
    updated.audit_log = [...(updated.audit_log || []), { action: `Marked ${compName} as ${checked ? 'Purchased' : 'Not Purchased'}`, timestamp: new Date().toLocaleString() }];
    setCurrentProject(updated);
  };

  const updateTitle = (e) => {
    const updated = { ...currentProject };
    updated.title = e.target.value;
    setCurrentProject(updated);
  };

  const selectPartOption = (itemIdx, optionIdx) => {
    const updated = { ...currentProject };
    updated.components[itemIdx].selectedOptionIndex = optionIdx;
    setCurrentProject(updated);
  };

  const saveCartToDatabase = async () => {
    if (!currentProject) return;

    const cartToSave = {
      title: currentProject.title,
      final_cost: useSmartRecommendations ? calculateTotalCost(currentProject) * 0.75 : calculateTotalCost(currentProject),
      is_optimized: useSmartRecommendations,
      is_completed: currentProject.is_completed || false,
      components: currentProject.components,
      audit_log: currentProject.audit_log || [
        { action: "Project finalized and saved to Tracker", timestamp: new Date().toLocaleString() }
      ]
    };

    if (isUpdatingMode && currentProject.id) {
      cartToSave.audit_log.push({ action: "Project Updated via Maker Portal", timestamp: new Date().toLocaleString() });
      
      const { error } = await supabase
        .from('saved_carts')
        .update(cartToSave)
        .eq('id', currentProject.id);

      if (error) {
        console.error("Supabase error:", error);
        alert("Failed to update cloud database.");
      } else {
        alert("Procurement Plan Successfully Updated!");
        navigate('/saved');
      }
    } else {
      const { error } = await supabase
        .from('saved_carts')
        .insert([cartToSave]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Failed to save to cloud database.");
      } else {
        navigate('/saved');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col p-6 md:p-10">
      <AnimatePresence mode="wait">
        
        {/* STEP 0: Dashboard */}
        {step === 0 && (
          <motion.div key="step0" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="w-full">
            <div className="mb-10">
              <h2 className="text-[32px] leading-tight font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                {location.state?.projectName ? location.state.projectName : "Ready to build something?"}
              </h2>
              <p className="text-[#3ecf8e] font-medium tracking-wide">
                {inputMode === 'url' ? 'Paste a tutorial link to generate a localized ₱ PHP parts list & budget tracker.' : 'Describe your engineering idea to generate a complete architecture and parts list.'}
              </p>
            </div>

            {isExtracting ? (
              <TerminalLoader isComplete={extractionComplete} onFinished={handleExtractionDone} />
            ) : (
              <div className="bg-[#151515] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden mb-14 shadow-lg">
                <div className="p-8">
                  <form onSubmit={handleSubmit}>
                    {inputMode === 'url' ? (
                      <>
                        <label className="block text-gray-900 dark:text-white font-semibold mb-3 text-[15px] uppercase tracking-wider text-xs text-neutral-500 dark:text-neutral-500">YOUTUBE OR GITHUB URL</label>
                        <div className="bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 mb-6 flex items-center transition-all focus-within:border-[#3ecf8e]/40 focus-within:ring-1 focus-within:ring-[#3ecf8e]/40">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-transparent px-4 py-3 text-gray-900 dark:text-white placeholder-neutral-600 focus:outline-none font-mono text-sm"
                            required={inputMode === 'url'}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="block text-gray-900 dark:text-white font-semibold mb-3 text-[15px] uppercase tracking-wider text-xs text-neutral-500 dark:text-neutral-500">SITUATION INPUT</label>
                        <div className="bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 mb-6 flex flex-col transition-all focus-within:border-[#3ecf8e]/40 focus-within:ring-1 focus-within:ring-[#3ecf8e]/40">
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={5}
                            className="w-full bg-transparent p-4 text-gray-900 dark:text-white placeholder-neutral-600 focus:outline-none text-sm leading-relaxed resize-none"
                            required={inputMode === 'text'}
                          />
                          <div className="px-4 pb-3 flex justify-between items-center mt-2 border-t border-neutral-200 dark:border-neutral-800/50 pt-3">
                            <span className="text-neutral-500 dark:text-neutral-500 text-xs">{prompt.length} characters</span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <GenerateButton disabled={loading} />
                  </form>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-[11px] font-bold text-[#24b47e] tracking-[0.2em] uppercase mb-5">Recent Projects</h3>
              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <motion.div 
                    key={idx}
                    onClick={() => {
                      if(project.components) {
                        setViewProject(project);
                      }
                    }}
                    whileHover={{ scale: 1.005, backgroundColor: "rgba(26, 26, 26, 1)" }}
                    whileTap={{ scale: 0.995 }}
                    className="bg-[#f8f9fa] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 cursor-pointer transition-colors duration-200 flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      {project.thumbnail_url ? (
                        <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-neutral-300 dark:border-neutral-700/50">
                          <img src={project.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-16 rounded-lg shrink-0 bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                          <FiHelpCircle className="text-neutral-600 w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-bold text-[17px] mb-1.5 group-hover:text-neutral-200 transition-colors line-clamp-1">{project.title}</h4>
                        <div className="text-sm text-neutral-500 dark:text-neutral-500 font-medium flex items-center">
                          {project.author_name && <span className="mr-3 text-[#3ecf8e]/80 truncate max-w-[120px]">{project.author_name}</span>}
                          <span>{project.date}</span>
                          <span className="mx-2 text-neutral-700">•</span>
                          <span>{project.parts} parts</span>
                          <span className="mx-2 text-neutral-700">•</span>
                          <span className="text-neutral-600 dark:text-neutral-400">{project.cost}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-[#3ecf8e] font-bold text-[15px]">
                      {project.localScore}% local
                      <FiChevronRight className="ml-1.5 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Shopping Checklist */}
        {step === 1 && currentProject && (
          <motion.div key="step1" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="w-full">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1 mr-8">
                <div className="flex items-center group mb-1 border-b border-transparent hover:border-neutral-300 dark:border-neutral-700 focus-within:border-[#3ecf8e] pb-1 transition-colors w-fit">
                  <FiEdit3 className="text-neutral-500 dark:text-neutral-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input 
                    type="text" 
                    value={currentProject.title} 
                    onChange={updateTitle}
                    className="text-[32px] font-extrabold text-gray-900 dark:text-white tracking-tight bg-transparent outline-none w-full min-w-[300px]"
                    placeholder="Name your build..."
                  />
                </div>
                <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1">Check off items as you buy them, and track your quantities.</p>
              </div>
              <button onClick={() => setStep(2)} className="bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-lg px-6 py-2.5 active:scale-[0.98] transition-all flex items-center shadow-[0_0_15px_rgba(36,180,126,0.2)]">
                SEARCH SUPPLIERS <FiChevronRight className="ml-2" />
              </button>
            </div>

            <div className="bg-[#f8f9fa] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-lg p-6">
              <div className="grid grid-cols-12 text-gray-900 dark:text-white font-bold text-sm mb-4 px-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div className="col-span-4">Item name</div>
                <div className="col-span-3">Desired specifications</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Reliability</div>
                <div className="col-span-1 text-right">Action</div>
              </div>
              
              <div className="space-y-2">
                {currentProject.components?.map((item, idx) => (
                  <div key={idx} className={`grid grid-cols-12 items-center py-4 px-2 hover:bg-white/[0.02] transition-colors border-b border-neutral-200 dark:border-neutral-800/50 ${item.isBought ? 'opacity-50' : ''}`}>
                    <div className="col-span-4 pr-4">
                      {isUpdatingMode ? (
                        <AnimatedCheckbox 
                          id={`chk-${idx}`} 
                          label={item.local} 
                          checked={!!item.isBought} 
                          onChange={(checked) => toggleBought(idx, checked)} 
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="text-neutral-200 font-medium">{item.local}</span>
                          {hasMismatch && (item.local.includes("ESP32") || item.local.includes("Relay Module") || item.local.includes("LCD Display")) && (
                            <div className="relative group ml-2 flex items-center cursor-pointer" onClick={() => setShowWarningModal(true)}>
                              <FiAlertTriangle className="text-red-500 w-4 h-4 animate-pulse" />
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap backdrop-blur-md">
                                Logic Level Mismatch
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`col-span-3 text-sm ${item.isBought ? 'text-neutral-600 line-through' : 'text-neutral-600 dark:text-neutral-400'}`}>{item.notes || 'Standard Spec'}</div>
                    <div className="col-span-2 flex flex-col items-center justify-center">
                      <div className="flex items-center space-x-2 bg-[#0F0F0F] border border-neutral-200 dark:border-neutral-800 rounded-lg px-2 py-1">
                        <button onClick={() => updateQty(idx, -1)} className="text-neutral-500 dark:text-neutral-500 hover:text-gray-900 dark:text-white px-2">-</button>
                        <span className="text-gray-900 dark:text-white font-mono w-4 text-center">{item.qty || 1}</span>
                        <button onClick={() => updateQty(idx, 1)} className="text-neutral-500 dark:text-neutral-500 hover:text-gray-900 dark:text-white px-2">+</button>
                      </div>
                      <span className="text-[10px] text-[#24b47e] mt-1 font-semibold bg-[#24b47e]/10 px-1.5 py-0.5 rounded border border-[#24b47e]/20">Orig: 1</span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className="bg-[#24b47e]/10 text-[#3ecf8e] text-xs font-bold px-2 py-1 rounded border border-[#24b47e]/20">High</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button onClick={() => deleteItem(idx)} className="text-neutral-500 dark:text-neutral-500 hover:text-red-400 transition-colors text-sm flex items-center justify-end w-full">
                        <FiX className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <div className="flex-1 bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3">
                  <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="New Custom Item..." className="bg-transparent text-gray-900 dark:text-white w-full outline-none text-sm" />
                </div>
                <div className="flex-1 bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3">
                  <input type="text" value={customSpec} onChange={(e) => setCustomSpec(e.target.value)} placeholder="Specify attributes..." className="bg-transparent text-gray-900 dark:text-white w-full outline-none text-sm" />
                </div>
                <button onClick={addCustomItem} className="border border-[#24b47e] text-[#3ecf8e] hover:bg-[#24b47e]/10 font-bold rounded-lg px-5 py-3 transition-all flex items-center text-sm uppercase tracking-wider shrink-0">
                  <FiPlus className="mr-2" /> Add Custom Item
                </button>
              </div>
            </div>
            
            <button onClick={() => setStep(0)} className="mt-8 text-neutral-500 dark:text-neutral-500 hover:text-gray-900 dark:text-white transition-colors flex items-center text-sm font-semibold">
              <FiChevronLeft className="mr-1" /> Back to Dashboard
            </button>
          </motion.div>
        )}

        {/* STEP 2: Sourced Parts Selection */}
        {step === 2 && currentProject && (
          <motion.div key="step2" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="w-full">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-[32px] font-extrabold text-gray-900 dark:text-white tracking-tight">Sourced Parts</h1>
                <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1">I found these active components in supplier warehouse stocks. Pick the best matching version.</p>
              </div>
              <button onClick={() => setStep(3)} className="bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-lg px-6 py-2.5 active:scale-[0.98] transition-all flex items-center shadow-[0_0_15px_rgba(36,180,126,0.2)]">
                FIND BEST DEAL <FiChevronRight className="ml-2" />
              </button>
            </div>

            <div className="space-y-8">
              {currentProject.components?.map((item, idx) => (
                <div key={idx} className="bg-[#f8f9fa] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-5 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    <div className="flex items-center">
                      <h3 className="text-gray-900 dark:text-white font-bold text-[17px] mr-3">{item.local}</h3>
                      <span className="bg-[#24b47e]/10 text-[#3ecf8e] text-[11px] font-bold px-2 py-0.5 rounded border border-[#24b47e]/20 uppercase">{item.notes}</span>
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Count: {item.qty || 1}</div>
                  </div>

                  <div className="space-y-3">
                    {item.options?.map((opt, i) => {
                      const isSelected = item.selectedOptionIndex === i;
                      return (
                        <div key={i} onClick={() => selectPartOption(idx, i)} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-[#24b47e] bg-[#24b47e]/5' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] hover:border-neutral-600'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${isSelected ? 'border-[#3ecf8e]' : 'border-neutral-600'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-900 dark:text-white font-bold text-[15px] mb-1">{item.local} ({opt.type})</div>
                            <div className="text-neutral-500 dark:text-neutral-500 text-[13px] flex gap-6">
                              <span>Seller: <span className="text-neutral-300">{opt.seller}</span></span>
                              <span>Available stock: <span className="text-neutral-300">{opt.stock}</span></span>
                              <span>Price: <span className="text-neutral-300">₱{opt.price.toLocaleString()} each</span></span>
                            </div>
                          </div>
                          <div className="text-[#3ecf8e] font-bold text-sm">{opt.match} match</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(1)} className="mt-8 text-neutral-500 dark:text-neutral-500 hover:text-gray-900 dark:text-white transition-colors flex items-center text-sm font-semibold">
              <FiChevronLeft className="mr-1" /> Back to Checklist
            </button>
          </motion.div>
        )}

        {/* STEP 3: Smart Replacements & Bundle Savings */}
        {step === 3 && currentProject && (
          <motion.div key="step3" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="w-full">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[#3ecf8e] text-sm font-bold mb-1 flex items-center">
                  <FiMapPin className="mr-2" /> Secgy the Sourcing Bot
                </p>
                <h1 className="text-[32px] font-extrabold text-gray-900 dark:text-white tracking-tight">Smart Replacements & Bundle Savings</h1>
                <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1">Great news! I swapped out unavailable boards for equivalents, bundled items, and lowered your final price!</p>
              </div>
              <button onClick={() => setStep(4)} className="bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-lg px-6 py-2.5 active:scale-[0.98] transition-all flex items-center shadow-[0_0_15px_rgba(36,180,126,0.2)]">
                GO TO TRACKER SUMMARY <FiChevronRight className="ml-2" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Standard Cost Card */}
              <div 
                onClick={() => setUseSmartRecommendations(false)}
                className={`bg-[#f8f9fa] dark:bg-[#111111] border rounded-2xl p-8 cursor-pointer transition-all ${!useSmartRecommendations ? 'border-[#3ecf8e] shadow-[0_0_20px_rgba(36,180,126,0.1)]' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-600'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg">Standard Selections</h3>
                  {!useSmartRecommendations && <div className="bg-[#3ecf8e] text-black text-xs font-bold px-2 py-1 rounded">SELECTED</div>}
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-6">₱{calculateTotalCost(currentProject).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <ul className="space-y-4 text-neutral-600 dark:text-neutral-400 text-sm">
                  <li className="flex items-start"><span className="text-neutral-500 dark:text-neutral-500 mr-2">•</span> Uses your exact manual selections</li>
                  <li className="flex items-start"><span className="text-neutral-500 dark:text-neutral-500 mr-2">•</span> Multiple individual shipping fees</li>
                  <li className="flex items-start"><span className="text-neutral-500 dark:text-neutral-500 mr-2">•</span> Standard retail pricing</li>
                </ul>
              </div>

              {/* Optimized Cost Card */}
              <div 
                onClick={() => setUseSmartRecommendations(true)}
                className={`bg-[#051A10] border rounded-2xl p-8 cursor-pointer transition-all relative overflow-hidden ${useSmartRecommendations ? 'border-[#3ecf8e] shadow-[0_0_30px_rgba(36,180,126,0.15)]' : 'border-[#24b47e]/40 opacity-70 hover:opacity-100'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[#3ecf8e] font-bold text-lg">Secgy's Recommendations</h3>
                  {useSmartRecommendations && <div className="bg-[#3ecf8e] text-black text-xs font-bold px-2 py-1 rounded">SELECTED</div>}
                </div>
                <div className="text-4xl font-black text-[#3ecf8e] mb-6">₱{(calculateTotalCost(currentProject) * 0.75).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <ul className="space-y-5 text-[13px]">
                  <li className="flex items-center"><span className="bg-[#24b47e]/20 text-[#3ecf8e] font-bold px-2 py-0.5 rounded border border-[#24b47e]/30 mr-4 shrink-0 uppercase">REPLACED</span> <span className="text-neutral-300">In-stock equivalent board suggestion (Fits project specs)</span></li>
                  <li className="flex items-center"><span className="bg-[#24b47e]/20 text-[#3ecf8e] font-bold px-2 py-0.5 rounded border border-[#24b47e]/30 mr-4 shrink-0 uppercase">CONSOLIDATED</span> <span className="text-neutral-300">Shipped from single supplier (Saved separate shipping fees)</span></li>
                  <li className="flex items-center"><span className="bg-[#24b47e]/20 text-[#3ecf8e] font-bold px-2 py-0.5 rounded border border-[#24b47e]/30 mr-4 shrink-0 uppercase">BULK DEALS</span> <span className="text-neutral-300">Swapped to multi-pack cables (Saves unit cost)</span></li>
                </ul>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="mt-8 text-neutral-500 dark:text-neutral-500 hover:text-gray-900 dark:text-white transition-colors flex items-center text-sm font-semibold">
              <FiChevronLeft className="mr-1" /> Back to Parts Selection
            </button>
          </motion.div>
        )}

        {/* STEP 4: Tracker Cart Overview */}
        {step === 4 && currentProject && (
          <motion.div key="step4" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="w-full" id="maker-results-dashboard">
            <div className="mb-8">
              <h1 className="text-[32px] font-extrabold text-gray-900 dark:text-white tracking-tight">
                {isUpdatingMode ? "Update Saved Build" : "Send Parts to Tracker"}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1">
                {isUpdatingMode ? "Confirm details to overwrite your existing procurement tracker." : "Confirm details and load everything into your unified procurement tracker."}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Cart Items */}
              <div className="flex-1 bg-[#f8f9fa] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-[#0F0F0F]">
                  <h3 className="text-gray-900 dark:text-white font-bold text-[17px]">Shopping Cart Items</h3>
                </div>
                <div className="divide-y divide-neutral-800/80 overflow-y-auto max-h-[450px] custom-scrollbar">
                  {currentProject.components?.map((item, idx) => {
                    const selectedOpt = item.options ? item.options[item.selectedOptionIndex] : null;
                    const price = selectedOpt ? selectedOpt.price : (item.price || 0);
                    return (
                      <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div>
                          <div className="text-gray-900 dark:text-white font-bold text-[15px] mb-1">{item.local}</div>
                          <div className="text-neutral-500 dark:text-neutral-500 text-[13px]">{item.notes} (Qty: {item.qty || 1})</div>
                        </div>
                        <div className="text-gray-900 dark:text-white font-bold text-right">
                           <div className={useSmartRecommendations ? "line-through text-neutral-600 text-sm" : ""}>₱{(price * (item.qty || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                           {useSmartRecommendations && <div className="text-[#3ecf8e]">₱{(price * (item.qty || 1) * 0.75).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {isUpdatingMode && (
                  <div className="mt-auto p-6 border-t border-neutral-200 dark:border-neutral-800 bg-[#0F0F0F] flex justify-start">
                    <MarkCompleteCard 
                      isCompleted={currentProject.is_completed}
                      onToggle={(val) => {
                        const updated = { ...currentProject, is_completed: val };
                        updated.audit_log = [...(updated.audit_log || []), { action: `Marked project as ${val ? 'Completed/Archived' : 'Active'}`, timestamp: new Date().toLocaleString() }];
                        setCurrentProject(updated);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary */}
              <div className="w-full lg:w-[420px] flex flex-col space-y-6">
                
                {/* Real Geolocation Map */}
                <div className="bg-[#f8f9fa] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xl">
                   <h3 className="text-gray-900 dark:text-white font-bold text-[15px] mb-3 flex items-center"><FiMapPin className="text-[#3ecf8e] mr-2" /> Supply Chain Map</h3>
                   <div className="w-full h-[300px] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                     <StoreMap />
                   </div>
                </div>

                <div className="bg-[#f8f9fa] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-gray-900 dark:text-white font-bold text-[18px] mb-6">Order Summary</h3>
                  
                  <div className="flex justify-between mb-5 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                    <span className="text-neutral-600 dark:text-neutral-400">Final Total Cost</span>
                    <span className="text-gray-900 dark:text-white font-black text-xl">₱{(useSmartRecommendations ? calculateTotalCost(currentProject) * 0.75 : calculateTotalCost(currentProject)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  
                  <div className="flex justify-between mb-8">
                    <span className="text-neutral-600 dark:text-neutral-400">Sourcing Status</span>
                    <span className="text-[#3ecf8e] font-semibold">All items ready</span>
                  </div>

                  <div className="space-y-4">
                    <button onClick={saveCartToDatabase} className="w-full bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-xl px-6 py-4 active:scale-[0.98] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(36,180,126,0.2)] text-[13px] tracking-wide uppercase">
                      <FiSave className="mr-2 w-5 h-5" /> {isUpdatingMode ? "UPDATE PROCUREMENT PLAN" : "SAVE PROCUREMENT PLAN"}
                    </button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowExportMenu(!showExportMenu)} 
                        className="w-full bg-transparent border border-[#24b47e]/50 hover:border-[#3ecf8e] text-[#3ecf8e] font-bold rounded-xl px-6 py-4 active:scale-[0.98] transition-all flex items-center justify-center text-[13px] tracking-wide"
                      >
                        <FiDownload className="mr-2 w-5 h-5" /> VIEW PROJECT SUMMARY & DOWNLOADS
                      </button>

                      <AnimatePresence>
                        {showExportMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-0 right-0 mb-3 bg-white dark:bg-[#0A0A0A] border border-[#3ecf8e]/30 rounded-xl shadow-2xl overflow-hidden flex flex-col z-10"
                          >
                            <button onClick={handleDownloadWord} className="flex items-center px-5 py-4 text-gray-900 dark:text-white hover:bg-[#151515] hover:text-[#3ecf8e] transition-colors border-b border-neutral-200 dark:border-neutral-800 text-[13px] font-semibold text-left">
                              <FiFileText className="mr-3 w-5 h-5" /> Download as Word Document
                            </button>
                            <button onClick={handleDownloadExcel} className="flex items-center px-5 py-4 text-gray-900 dark:text-white hover:bg-[#151515] hover:text-[#3ecf8e] transition-colors border-b border-neutral-200 dark:border-neutral-800 text-[13px] font-semibold text-left">
                              <FiGrid className="mr-3 w-5 h-5" /> Export as Excel (CSV)
                            </button>
                            <button onClick={handleDownloadPDF} id="maker-download-btn" className="flex items-center px-5 py-4 text-gray-900 dark:text-white hover:bg-[#151515] hover:text-[#3ecf8e] transition-colors border-b border-neutral-200 dark:border-neutral-800 text-[13px] font-semibold text-left">
                              <FiFile className="mr-3 w-5 h-5" /> Generate PDF Report
                            </button>
                            <button onClick={handleDownloadImage} className="flex items-center px-5 py-4 text-gray-900 dark:text-white hover:bg-[#151515] hover:text-[#3ecf8e] transition-colors text-[13px] font-semibold text-left">
                              <FiCamera className="mr-3 w-5 h-5" /> Save Screenshot (.png)
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(3)} className="mt-8 text-neutral-500 dark:text-neutral-500 hover:text-gray-900 dark:text-white transition-colors flex items-center text-sm font-semibold">
              <FiChevronLeft className="mr-1" /> Back to Optimization
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewProject && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }}
              className="bg-[#f8f9fa] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-[#0A0A0A]">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-xl">{viewProject.title}</h3>
                  <p className="text-[#3ecf8e] text-sm mt-1 font-semibold">Total Budget: {viewProject.cost}</p>
                </div>
                <button onClick={() => setViewProject(null)} className="text-neutral-500 dark:text-neutral-500 hover:text-gray-900 dark:text-white transition-colors bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-4 uppercase tracking-wider text-neutral-500 dark:text-neutral-500">Project Parts List</h4>
                <div className="space-y-3">
                  {viewProject.components?.map((comp, idx) => (
                    <div key={idx} className="bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-gray-900 dark:text-white font-bold text-[15px] mb-1">{comp.local}</div>
                        <div className="text-neutral-500 dark:text-neutral-500 text-xs">Original: {comp.orig}</div>
                      </div>
                      <div className="text-gray-900 dark:text-white font-bold text-sm bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1">
                        Qty: {comp.qty || 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] flex justify-end">
                <button 
                  onClick={() => {
                    setCurrentProject(viewProject);
                    setViewProject(null);
                    setStep(1);
                  }} 
                  className="bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-lg px-6 py-2.5 transition-colors text-sm flex items-center"
                >
                  <FiPlus className="mr-2" /> Modify & Update Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Warning Modal Overlay */}
      <CompatibilityAlert 
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onAutoFix={(newComponent) => {
          const updated = { ...currentProject, components: [...currentProject.components, newComponent] };
          updated.audit_log = [...(updated.audit_log || []), { action: "AI Auto-Fix applied for logic mismatch", timestamp: new Date().toLocaleString() }];
          setCurrentProject(updated);
        }} 
      />
    </div>
  );
}
