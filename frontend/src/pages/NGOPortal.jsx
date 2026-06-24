import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiUsers, FiClock, FiTarget, FiCheckCircle, FiChevronRight, FiCheck, FiSave, FiDownload, FiMapPin, FiFileText, FiGrid, FiFile, FiCamera, FiX } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import TerminalLoader from '../components/TerminalLoader';
import StoreMap from '../components/map/StoreMap';
import PH_REGIONS_CITIES from '../data/phLocations.json';

// Mock Data representing the Ghana Water Crisis scenario
const GHANA_MOCK_DATA = {
  context: {
    problem: "Seasonal water access failure affecting 1,200 people; contamination risk from river source 3 km away",
    resources: [
      "3 trained community health workers",
      "40 community volunteers",
      "$8,000 NGO budget (WASH-Ghana)",
      "Proximity to Tamale district support depot"
    ],
    constraints: [
      "No heavy machinery on-site",
      "120 km from Tamale supply chain",
      "6-week deadline before rainy season",
      "Limited local construction expertise"
    ],
    priority: "HIGH — acute health risk"
  },
  solutions: [
    {
      id: 'A',
      title: "Borehole + Hand Pump",
      cost: "$6,200",
      time: "4-5 weeks",
      match: 91,
      desc: "Drill 2 boreholes (35-50 m depth) with hand pumps. Year-round supply, low ongoing cost, proven technology in West Africa.",
      pros: ["Year-round reliability", "Proven technology", "Low maintenance"],
      cons: ["Requires drilling rig rental", "Higher upfront cost"]
    },
    {
      id: 'B',
      title: "Rainwater Harvesting Network",
      cost: "$4,800",
      time: "3 weeks",
      match: 72,
      desc: "8 community ferro-cement tanks (10,000 L each) with roof catchment on school and clinic buildings.",
      pros: ["No deep drilling needed", "Fast deployment"],
      cons: ["Fails during dry season", "Requires large roof catchment area"]
    },
    {
      id: 'C',
      title: "Well Rehab + Ceramic Filter",
      cost: "$2,100",
      time: "1-2 weeks",
      match: 58,
      desc: "Rehabilitate existing wells and install ceramic filtration + SODIS training as immediate low-cost intervention.",
      pros: ["Immediate deployment", "Very cheap"],
      cons: ["Does not solve dry season volume", "Requires constant filter cleaning"]
    }
  ],
  optimizedPlan: {
    title: "Borehole + Hand Pump — Localized",
    cost: "$5,400",
    saves: "$800",
    modifications: [
      "Source drilling rig from Tamale district depot — reduces rental cost by 40%",
      "Substitute imported pump parts with locally-cast equivalents from Bolgatanga artisans",
      "Phase completion: Borehole #1 (clinic site) by week 3, Borehole #2 (village center) by week 5",
      "Volunteers handle backfilling and concrete surface pad — saves est. $800 in labor"
    ]
  },
  actions: {
    preparation: [
      "Confirm borehole siting with Tamale hydrogeologist",
      "Reserve drilling rig from district depot",
      "Order pump parts from Bolgatanga supplier",
      "Mobilize 20 volunteers for site prep"
    ],
    deployment: [
      "Drill Borehole #1 — clinic site (weeks 1-2)",
      "Install hand pump #1, water quality test",
      "Drill Borehole #2 — village center (weeks 3-4)",
      "Install hand pump #2, surface pad pour"
    ],
    training: [
      "Train 3 CHWs on pump maintenance and repair",
      "Establish water committee (5 members) with bylaws",
      "Introduce water quality test kits to committee"
    ],
    monitoring: [
      "30-day follow-up: E. coli and turbidity testing",
      "90-day pump functionality check",
      "Submit completion report to WASH-Ghana"
    ]
  },
  impact: {
    people: "1,200",
    totalCost: "$5,400",
    costPerPerson: "$4.50",
    timeline: "5 weeks",
    outcomes: [
      "Eliminate 4-month seasonal water gap for all households",
      "~60% reduction in waterborne disease incidence (WHO borehole benchmark)",
      "Water-fetching time reduced from 90 min/day to under 10 min for 340 households"
    ]
  }
};

export default function NGOPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const editProject = location.state?.editProject;
  
  const [projectName, setProjectName] = useState(editProject?.title || location.state?.projectName || "Community Situation Analysis");
  const [step, setStep] = useState(editProject ? 2 : 0); // 0 = Input, 1 = Loading, 2 = Dashboard
  
  // Location State
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');

  const [situationPrompt, setSituationPrompt] = useState("A village of 1,200 people in northern Ghana lacks reliable clean water access. Current sources are 2 hand-dug wells that dry up in dry season and a river 3 km away with contamination risk. We have 3 trained community health workers, support from local NGO (WASH-Ghana) with roughly $8,000 available, and 40 able-bodied community volunteers. Rainy season starts in 6 weeks. Main constraints: no heavy machinery on-site, limited material transport from the nearest town (Tamale, 120 km).");
  const [extractionComplete, setExtractionComplete] = useState(false);
  
  // Checklist State
  const [checkedTasks, setCheckedTasks] = useState(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleAnalyze = () => {
    if (!region || !city || !situationPrompt.trim()) {
      alert("Please fill out the Region, City, and Situation Input fields.");
      return;
    }
    setStep(1);
    setExtractionComplete(false);
    
    // Simulate AI extraction delay
    setTimeout(() => {
      setExtractionComplete(true);
    }, 4000);
  };

  const handleExtractionComplete = () => {
    setStep(2);
  };

  const toggleTask = (task) => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(task)) {
      newChecked.delete(task);
    } else {
      newChecked.add(task);
    }
    setCheckedTasks(newChecked);
  };

  const totalTasks = 14; // Hardcoded for demo based on mock data
  const completedTasks = checkedTasks.size;

  const handleSavePlan = async () => {
    const planToSave = {
      title: projectName,
      mode: 'ngo',
      final_cost: 5400, // from mock data
      is_optimized: true,
      components: [], // No physical hardware parts like Maker
      audit_log: [
        { action: "Impact Plan generated via CommunityPlanner", timestamp: new Date().toLocaleString() }
      ]
    };

    let error;
    if (editProject?.id) {
      const res = await supabase.from('saved_carts').update(planToSave).eq('id', editProject.id);
      error = res.error;
    } else {
      const res = await supabase.from('saved_carts').insert([planToSave]);
      error = res.error;
    }

    if (error) {
      console.error("Supabase error:", error);
      alert("Failed to save to cloud database.");
    } else {
      navigate('/saved');
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('ngo-results-dashboard');
    if (!element) return;
    const btn = document.getElementById('ngo-download-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generating PDF...';
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#0A0A0A', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GeoForge_ImpactPlan_${projectName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      btn.innerHTML = originalText;
      setShowExportMenu(false);
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('ngo-results-dashboard');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#0A0A0A', scale: 2 });
      const link = document.createElement('a');
      link.download = `GeoForge_ImpactPlan_${projectName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShowExportMenu(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadExcel = () => {
    const headers = ["Task Category", "Task Name", "Status"];
    const rows = [
      ...GHANA_MOCK_DATA.actions.preparation.map(t => ["PREPARATION", t, checkedTasks.has(t) ? "Complete" : "Pending"]),
      ...GHANA_MOCK_DATA.actions.deployment.map(t => ["DEPLOYMENT", t, checkedTasks.has(t) ? "Complete" : "Pending"]),
      ...GHANA_MOCK_DATA.actions.training.map(t => ["TRAINING", t, checkedTasks.has(t) ? "Complete" : "Pending"]),
      ...GHANA_MOCK_DATA.actions.monitoring.map(t => ["MONITORING", t, checkedTasks.has(t) ? "Complete" : "Pending"]),
    ];
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GeoForge_Tasks_${projectName.replace(/\s+/g, '_')}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const handleDownloadWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Impact Plan</title></head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px;">
        <h1 style="color: #24b47e;">GeoForge Impact Plan</h1>
        <h2 style="color: #333;">Project: ${projectName}</h2>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <h3>Problem Statement</h3>
        <p>${GHANA_MOCK_DATA.context.problem}</p>
        <h3>Optimized Plan</h3>
        <ul>
          ${GHANA_MOCK_DATA.optimizedPlan.modifications.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GeoForge_Plan_${projectName.replace(/\s+/g, '_')}.doc`;
    link.click();
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12 font-sans overflow-x-hidden">
      
      {/* Header Context */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center text-[11px] font-bold tracking-widest text-neutral-500 uppercase mb-8">
          <div className="w-2 h-2 rounded-full bg-[#24b47e] mr-3 animate-pulse"></div>
          COMMUNITYPLANNER <span className="mx-2 text-neutral-700">/</span> <span className="text-neutral-400">Field Solution Intelligence</span>
        </div>

        <input 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)}
          className="text-4xl font-extrabold tracking-tight mb-4 bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-[#3ecf8e] focus:outline-none transition-colors w-full max-w-2xl placeholder-neutral-700"
          placeholder="Enter Project Name..."
        />
        <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">
          Describe your community's challenge in plain language. The tool extracts context, generates solution options, optimizes a deployment plan, and estimates impact.
        </p>

        {/* Wizard Steps Indicator */}
        <div className="flex items-center space-x-2 md:space-x-4 mt-8 text-xs font-bold tracking-wider uppercase text-neutral-600">
          <span className={step >= 0 ? "text-[#3ecf8e]" : ""}>01 Extract Context</span>
          <FiChevronRight className="text-neutral-800" />
          <span className={step >= 2 ? "text-[#3ecf8e]" : ""}>02 Generate Options</span>
          <FiChevronRight className="text-neutral-800" />
          <span className={step >= 2 ? "text-[#3ecf8e]" : ""}>03 Optimize Plan</span>
          <FiChevronRight className="text-neutral-800" />
          <span className={step >= 2 ? "text-[#3ecf8e]" : ""}>04 Action Tracker</span>
          <FiChevronRight className="text-neutral-800" />
          <span className={step >= 2 ? "text-[#3ecf8e]" : ""}>05 Impact</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STATE 0: Input Form */}
        {step === 0 && (
          <motion.div 
            key="input" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden"
          >
            {/* Location Form */}
            <div className="p-6 md:p-8 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white mb-1">Where will this be deployed?</h2>
              <p className="text-[#3ecf8e] text-sm mb-6">We match parts and logistics with suppliers in your target area.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold mb-2 text-sm">Country</label>
                  <div className="bg-[#1A1A1A] border border-neutral-800 rounded-lg p-3 text-[#3ecf8e] cursor-not-allowed opacity-80">
                    Philippines (Locked)
                  </div>
                </div>
                <div>
                  <label className="block text-white font-bold mb-2 text-sm">Region *</label>
                  <select 
                    value={region} 
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCity(''); // Reset city when region changes
                    }}
                    className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#3ecf8e] transition-colors"
                  >
                    <option value="">Select a region...</option>
                    {Object.keys(PH_REGIONS_CITIES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-bold mb-2 text-sm">City / Municipality *</label>
                  <select 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!region}
                    className={`w-full bg-[#1A1A1A] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#3ecf8e] transition-colors ${!region ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select a city...</option>
                    {region && PH_REGIONS_CITIES[region].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-bold mb-2 text-sm">Barangay <span className="text-neutral-500 font-normal">(optional)</span></label>
                  <input 
                    type="text" placeholder="e.g. Barangay Bagumbayan" 
                    value={barangay} onChange={(e) => setBarangay(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#3ecf8e] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Situation Input */}
            <div className="px-6 py-4 border-b border-neutral-800 bg-[#161616]">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">SITUATION INPUT *</span>
            </div>
            <div className="p-6">
              <textarea
                value={situationPrompt}
                onChange={(e) => setSituationPrompt(e.target.value)}
                rows={8}
                className="w-full bg-transparent text-white placeholder-neutral-700 focus:outline-none text-sm leading-relaxed resize-none"
                placeholder="Describe the problem, available resources, and constraints..."
              />
            </div>
            <div className="px-6 py-4 border-t border-neutral-800 bg-[#161616] flex justify-between items-center">
              <span className="text-neutral-600 text-xs">{situationPrompt.length} characters</span>
              <button 
                onClick={handleAnalyze}
                disabled={!region || !city || !situationPrompt.trim()}
                className={`font-bold text-sm px-6 py-3 rounded flex items-center transition-colors active:scale-95 ${!region || !city || !situationPrompt.trim() ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-[#24b47e] hover:bg-[#3ecf8e] text-black'}`}
              >
                <FiTarget className="mr-2" /> Analyze Community Situation
              </button>
            </div>
          </motion.div>
        )}

        {/* STATE 1: Loading */}
        {step === 1 && (
          <motion.div key="loader" className="max-w-4xl mx-auto pt-10">
            <TerminalLoader isComplete={extractionComplete} onFinished={handleExtractionComplete} />
          </motion.div>
        )}

        {/* STATE 2: The Dashboard */}
        {step === 2 && (
          <motion.div 
            id="ngo-results-dashboard"
            key="dashboard" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto space-y-16 pb-20"
          >
            
            {/* SECTION 01: Extracted Context */}
            <section>
              <SectionHeader number="01" title="Extracted Community Context" />
              <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-800 rounded-xl overflow-hidden bg-[#111111]">
                {/* Problem */}
                <div className="p-8 border-b md:border-b-0 md:border-r border-neutral-800">
                  <h3 className="flex items-center text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                    <FiAlertTriangle className="mr-2 text-yellow-500" /> Problem
                  </h3>
                  <p className="text-white leading-relaxed text-sm">{GHANA_MOCK_DATA.context.problem}</p>
                </div>
                {/* Resources */}
                <div className="p-8 border-b border-neutral-800">
                  <h3 className="flex items-center text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                    <FiUsers className="mr-2 text-[#3ecf8e]" /> Resources
                  </h3>
                  <ul className="space-y-3">
                    {GHANA_MOCK_DATA.context.resources.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-neutral-300">
                        <span className="text-[#3ecf8e] mr-2">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Constraints */}
                <div className="p-8 border-b md:border-b-0 md:border-r border-neutral-800">
                  <h3 className="flex items-center text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                    <FiAlertTriangle className="mr-2 text-neutral-400" /> Constraints
                  </h3>
                  <ul className="space-y-3">
                    {GHANA_MOCK_DATA.context.constraints.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-neutral-300">
                        <span className="text-neutral-500 mr-2">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Priority */}
                <div className="p-8">
                  <h3 className="flex items-center text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                    <FiTarget className="mr-2 text-orange-500" /> Priority
                  </h3>
                  <p className="text-orange-500 font-bold uppercase tracking-wider text-sm">{GHANA_MOCK_DATA.context.priority}</p>
                </div>
              </div>
            </section>

            {/* SECTION 02: Recommended Solutions */}
            <section>
              <SectionHeader number="02" title="Recommended Solutions" />
              <div className="space-y-4">
                {GHANA_MOCK_DATA.solutions.map((sol, i) => (
                  <div key={sol.id} className={`p-6 border rounded-xl bg-[#111111] transition-all ${i === 0 ? 'border-[#3ecf8e]/30 shadow-[0_0_20px_rgba(36,180,126,0.05)]' : 'border-neutral-800'}`}>
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between mb-4">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center mr-4 ${i === 0 ? 'bg-[#3ecf8e]/20 text-[#3ecf8e] border border-[#3ecf8e]/50' : 'bg-neutral-800 text-neutral-400'}`}>
                          {sol.id}
                        </div>
                        <h3 className={`text-lg font-bold ${i === 0 ? 'text-white' : 'text-neutral-300'}`}>{sol.title}</h3>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm font-mono text-neutral-400">
                        <span>{sol.cost}</span>
                        <span>{sol.time}</span>
                        <div className="flex items-center">
                          {/* Match Bar */}
                          <div className="w-16 h-1 bg-neutral-800 rounded-full mr-3 overflow-hidden">
                            <div className={`h-full ${i === 0 ? 'bg-[#3ecf8e]' : 'bg-orange-500'}`} style={{ width: `${sol.match}%` }} />
                          </div>
                          <span className={i === 0 ? 'text-[#3ecf8e] font-bold' : 'text-neutral-300'}>{sol.match}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Desc */}
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">{sol.desc}</p>

                    {/* Pros/Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <div className="text-[10px] font-bold text-[#3ecf8e] uppercase tracking-widest mb-2">PROS</div>
                        <ul className="space-y-1.5">
                          {sol.pros.map((p, idx) => <li key={idx} className="text-neutral-300"><span className="text-[#3ecf8e] mr-1">+</span> {p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">CONS</div>
                        <ul className="space-y-1.5">
                          {sol.cons.map((c, idx) => <li key={idx} className="text-neutral-500"><span className="mr-1">-</span> {c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 03: Optimized Plan & Supply Chain Map */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2">
                  <SectionHeader number="03" title="Optimized Plan" />
                  <div className="border border-neutral-800 rounded-xl bg-[#111111] overflow-hidden h-full">
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-[#151515]">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded bg-[#3ecf8e]/20 text-[#3ecf8e] text-xs font-bold flex items-center justify-center mr-3 border border-[#3ecf8e]/50">A</div>
                        <h3 className="text-white font-bold">{GHANA_MOCK_DATA.optimizedPlan.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-[#3ecf8e] font-bold text-xl">{GHANA_MOCK_DATA.optimizedPlan.cost}</div>
                        <div className="text-neutral-500 text-xs">saves {GHANA_MOCK_DATA.optimizedPlan.saves}</div>
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">MODIFICATIONS APPLIED</div>
                      <ul className="space-y-4">
                        {GHANA_MOCK_DATA.optimizedPlan.modifications.map((mod, idx) => (
                          <li key={idx} className="flex text-sm text-neutral-300 leading-relaxed">
                            <span className="text-[#3ecf8e] font-mono mr-4 mt-0.5">0{idx + 1}</span>
                            {mod}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <SectionHeader number="-" title="Target Deployment Area" />
                  <div className="border border-neutral-800 rounded-xl bg-[#111111] p-2 h-full min-h-[300px] flex flex-col">
                    <StoreMap 
                      locationQuery={region && city ? `${city}, ${region}` : "Manila, NCR"}
                      pinType="ngo"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 04: Action Tracker */}
            <section>
              <div className="flex justify-between items-end mb-6 border-b border-neutral-800 pb-2">
                <SectionHeader number="04" title="Action Tracker" noBorder />
              </div>
              
              <div className="mb-6 font-mono text-xs">
                <span className={completedTasks === totalTasks ? 'text-[#3ecf8e]' : 'text-[#3ecf8e]'}>{completedTasks}/{totalTasks} tasks complete</span>
                <div className="w-full h-1 bg-neutral-900 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3ecf8e] transition-all duration-500" style={{ width: `${(completedTasks/totalTasks)*100}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800 border border-neutral-800 rounded-xl overflow-hidden">
                <TaskColumn title="PREPARATION" tasks={GHANA_MOCK_DATA.actions.preparation} checkedTasks={checkedTasks} onToggle={toggleTask} />
                <TaskColumn title="DEPLOYMENT" tasks={GHANA_MOCK_DATA.actions.deployment} checkedTasks={checkedTasks} onToggle={toggleTask} />
                <TaskColumn title="TRAINING" tasks={GHANA_MOCK_DATA.actions.training} checkedTasks={checkedTasks} onToggle={toggleTask} />
                <TaskColumn title="MONITORING" tasks={GHANA_MOCK_DATA.actions.monitoring} checkedTasks={checkedTasks} onToggle={toggleTask} />
              </div>
            </section>

            {/* SECTION 05: Impact Summary */}
            <section>
              <SectionHeader number="05" title="Impact Summary" />
              <div className="bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-neutral-800">
                  <MetricCard icon={<FiUsers />} value={GHANA_MOCK_DATA.impact.people} label="PEOPLE REACHED" />
                  <MetricCard icon={<span className="font-serif">$</span>} value={GHANA_MOCK_DATA.impact.totalCost} label="TOTAL COST" />
                  <MetricCard icon={<span className="font-serif">$</span>} value={GHANA_MOCK_DATA.impact.costPerPerson} label="COST / PERSON" />
                  <MetricCard icon={<FiClock />} value={GHANA_MOCK_DATA.impact.timeline} label="TIMELINE" noBorder />
                </div>

                {/* Outcomes */}
                <div className="p-6 md:p-8">
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">EXPECTED OUTCOMES</div>
                  <ul className="space-y-4">
                    {GHANA_MOCK_DATA.impact.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start text-sm text-neutral-300">
                        <svg className="w-5 h-5 text-[#3ecf8e] mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Save & Export Buttons */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 mt-12 pt-8 border-t border-neutral-800">
              <button 
                onClick={handleSavePlan}
                className="flex-1 bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-[#24b47e]/20"
              >
                <FiSave className="mr-2 w-5 h-5" /> SAVE IMPACT PLAN
              </button>

              <div className="relative flex-1">
                <button 
                  id="ngo-download-btn"
                  onClick={() => setShowExportMenu(!showExportMenu)} 
                  className="w-full bg-transparent border border-[#24b47e]/50 hover:border-[#3ecf8e] text-[#3ecf8e] font-bold rounded-xl px-6 py-4 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-wider text-sm"
                >
                  <FiDownload className="mr-3 w-5 h-5" />
                  VIEW PROJECT SUMMARY & DOWNLOADS
                </button>
                
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 w-full mb-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-[#2A2A2A] flex justify-between items-center bg-[#222]">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Export Formats</span>
                        <button onClick={() => setShowExportMenu(false)} className="text-neutral-500 hover:text-white p-1"><FiX /></button>
                      </div>
                      <div className="p-2 space-y-1">
                        <button onClick={handleDownloadWord} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
                          <FiFileText className="mr-3 text-blue-400 group-hover:scale-110 transition-transform" /> Download as Word Document (.doc)
                        </button>
                        <button onClick={handleDownloadExcel} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
                          <FiGrid className="mr-3 text-green-500 group-hover:scale-110 transition-transform" /> Export Tasks to Excel (.csv)
                        </button>
                        <div className="h-px bg-[#2A2A2A] my-1 mx-2" />
                        <button onClick={handleDownloadPDF} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
                          <FiFile className="mr-3 text-red-400 group-hover:scale-110 transition-transform" /> Generate PDF Report
                        </button>
                        <button onClick={handleDownloadImage} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
                          <FiCamera className="mr-3 text-purple-400 group-hover:scale-110 transition-transform" /> Save Screenshot (.png)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents
const SectionHeader = ({ number, title, noBorder }) => (
  <div className={`flex items-center mb-6 ${noBorder ? '' : 'border-b border-neutral-800 pb-2'} m-0`}>
    <div className="text-[#3ecf8e] border border-[#3ecf8e]/30 bg-[#3ecf8e]/10 px-1.5 py-0.5 rounded text-[10px] font-bold mr-3">{number}</div>
    <h2 className="text-xl font-bold tracking-tight text-white uppercase">{title}</h2>
  </div>
);

const TaskColumn = ({ title, tasks, checkedTasks, onToggle }) => (
  <div className="bg-[#111111] p-6">
    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">{title}</h3>
    <ul className="space-y-3">
      {tasks.map((task, idx) => {
        const isChecked = checkedTasks.has(task);
        return (
          <li key={idx} className="flex items-start cursor-pointer group" onClick={() => onToggle(task)}>
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mr-3 mt-0.5 transition-colors ${isChecked ? 'bg-[#3ecf8e] border-[#3ecf8e]' : 'border-neutral-700 group-hover:border-[#3ecf8e]'}`}>
              {isChecked && <FiCheck className="w-3 h-3 text-black" />}
            </div>
            <span className={`text-sm transition-colors ${isChecked ? 'text-neutral-500 line-through' : 'text-neutral-300 group-hover:text-white'}`}>{task}</span>
          </li>
        );
      })}
    </ul>
  </div>
);

const MetricCard = ({ icon, value, label, noBorder }) => (
  <div className={`p-6 ${noBorder ? '' : 'border-r border-neutral-800'}`}>
    <div className="text-[#3ecf8e] mb-2">{icon}</div>
    <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{label}</div>
  </div>
);
