import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiUsers, FiClock, FiTarget, FiCheckCircle, FiChevronRight, FiCheck, FiSave, FiDownload, FiMapPin, FiFileText, FiGrid, FiFile, FiCamera, FiX, FiShield, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import TerminalLoader from '../components/TerminalLoader';
import StoreMap from '../components/map/StoreMap';
import PH_REGIONS_CITIES from '../data/phLocations.json';

// Enhanced Mock Data for the 7-section layout
const GHANA_MOCK_DATA = {
  context: {
    problem: "Seasonal water access failure affecting 1,200 people; contamination risk from river source 3 km away",
    resources: [
      "3 trained community health workers",
      "40 community volunteers",
      "₱450,000 NGO budget (WASH-Ghana)",
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
      cost: "₱350,000",
      time: "4-5 weeks",
      match: 91,
      desc: "Drill 2 boreholes (35-50 m depth) with hand pumps. Year-round supply, low ongoing cost, proven technology in West Africa.",
      pros: ["Year-round reliability", "Proven technology", "Low maintenance"],
      cons: ["Requires drilling rig rental", "Higher upfront cost"]
    },
    {
      id: 'B',
      title: "Rainwater Harvesting Network",
      cost: "₱270,000",
      time: "3 weeks",
      match: 72,
      desc: "8 community ferro-cement tanks (10,000 L each) with roof catchment on school and clinic buildings.",
      pros: ["No deep drilling needed", "Fast deployment"],
      cons: ["Fails during dry season", "Requires large roof catchment area"]
    }
  ],
  implementation: [
    { phase: "Phase 1 — Planning", tasks: ["Site assessment and hydrogeological survey", "Stakeholder meeting with village elders"] },
    { phase: "Phase 2 — Preparation", tasks: ["Procurement of drilling rig and pump parts", "Volunteer team assignment and mobilization"] },
    { phase: "Phase 3 — Deployment", tasks: ["Borehole drilling at clinic and village center", "Installation of hand pumps and surface pads"] },
    { phase: "Phase 4 — Monitoring", tasks: ["Water quality testing (E. coli, turbidity)", "Establishment of maintenance committee"] }
  ],
  compliance: [
    { req: "LGU Approval", status: "Required", why: "Public land use", who: "Municipal Mayor", time: "2 weeks", dep: "Phase 1" },
    { req: "Barangay Endorsement", status: "Required", why: "Community buy-in", who: "Brgy Captain", time: "1 week", dep: "Phase 1" },
    { req: "Landowner Permission", status: "Not Required", why: "Public clinic site", who: "N/A", time: "N/A", dep: "N/A" },
    { req: "Environmental Review", status: "Required", why: "Groundwater extraction", who: "DENR / Water Board", time: "3 weeks", dep: "Phase 2" }
  ],
  resources: {
    people: "1 Project Manager, 2 Drillers, 20 Volunteers",
    skills: "Hydrogeology, Basic Construction, Community Organizing",
    budget: "₱300,000 (Allocated from WASH-Ghana)",
    owner: "Local Water Committee (5 members)",
    sustainability: "Monthly 50 GHS collection per household for maintenance fund."
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
    totalCost: "₱300,000",
    costPerPerson: "₱250",
    timeline: "5 weeks",
    readinessScore: "85%",
    envSocial: "Eliminates 90% of plastic water waste; empowers local female committee leaders.",
    outcomes: [
      "Eliminate 4-month seasonal water gap for all households",
      "~60% reduction in waterborne disease incidence",
      "Water-fetching time reduced from 90 min/day to under 10 min"
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

  const [situationPrompt, setSituationPrompt] = useState("A village of 1,200 people in northern Ghana lacks reliable clean water access. Current sources are 2 hand-dug wells that dry up in dry season and a river 3 km away with contamination risk. We have 3 trained community health workers, support from local NGO (WASH-Ghana) with roughly ₱450,000 available, and 40 able-bodied community volunteers. Rainy season starts in 6 weeks. Main constraints: no heavy machinery on-site, limited material transport from the nearest town (Tamale, 120 km).");
  const [extractionComplete, setExtractionComplete] = useState(false);
  
  // Checklist State
  const [checkedTasks, setCheckedTasks] = useState(new Set(editProject?.components || []));
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleAnalyze = () => {
    if (!region || !city || !situationPrompt.trim()) {
      alert("Please fill out the Region, City, and Situation Input fields.");
      return;
    }
    setStep(1);
    setExtractionComplete(false);
    requestAnimationFrame(() => {
      setExtractionComplete(true);
    });
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
    const isCompleted = checkedTasks.size === totalTasks;
    const planToSave = {
      title: projectName,
      mode: 'ngo',
      final_cost: 5400, // from mock data
      is_optimized: true,
      is_completed: isCompleted,
      components: Array.from(checkedTasks), // Save the checklist items
      audit_log: [
        { action: "Impact Plan updated via CommunityPlanner", timestamp: new Date().toLocaleString() }
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
          <li>Cost: ${GHANA_MOCK_DATA.impact.totalCost}</li>
          <li>People Reached: ${GHANA_MOCK_DATA.impact.people}</li>
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
    <div className="min-h-screen bg-page text-primary p-6 md:p-12 font-sans overflow-x-hidden">
      
      {/* Header Context */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center text-[11px] font-bold tracking-widest text-muted uppercase mb-8">
          <div className="w-2 h-2 rounded-full bg-accent mr-3 animate-pulse"></div>
          COMMUNITYPLANNER <span className="mx-2 text-neutral-700">/</span> <span className="text-muted">Field Solution Intelligence</span>
        </div>

        <input 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)}
          className="text-4xl font-extrabold tracking-tight mb-4 bg-transparent border-b border-transparent hover:border-neutral-300 dark:border-neutral-700 focus:border-[#3ecf8e] focus:outline-none transition-colors w-full max-w-2xl placeholder-neutral-700"
          placeholder="Enter Project Name..."
        />
        <p className="text-muted text-sm max-w-2xl leading-relaxed">
          Describe your community's challenge in plain language. The tool extracts context, generates solution options, optimizes a deployment plan, and estimates impact.
        </p>

        {/* Wizard Steps Indicator (Theme 2 Flow) */}
        <div className="flex items-center space-x-2 md:space-x-4 mt-8 text-xs font-bold tracking-wider uppercase text-neutral-600">
          <span className={step >= 0 ? "text-accent" : ""}>01 Assess</span>
          <FiChevronRight className="text-neutral-800" />
          <span className={step >= 2 ? "text-accent" : ""}>02 Approve</span>
          <FiChevronRight className="text-neutral-800" />
          <span className={step >= 2 ? "text-accent" : ""}>03 Deploy</span>
          <FiChevronRight className="text-neutral-800" />
          <span className={step >= 2 ? "text-accent" : ""}>04 Sustain</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STATE 0: Input Form */}
        {step === 0 && (
          <motion.div 
            key="input" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto card rounded-xl overflow-hidden"
          >
            {/* Location Form */}
            <div className="p-6 md:p-8 border-b border-default">
              <h2 className="text-xl font-bold text-primary mb-1">Where will this be deployed?</h2>
              <p className="text-accent text-sm mb-6">We match parts and logistics with suppliers in your target area.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-primary font-bold mb-2 text-sm">Country</label>
                  <div className="bg-panel border border-default rounded-lg p-3 text-accent cursor-not-allowed opacity-80">
                    Philippines (Locked)
                  </div>
                </div>
                <div>
                  <label className="block text-primary font-bold mb-2 text-sm">Region *</label>
                  <select 
                    value={region} 
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCity(''); // Reset city when region changes
                    }}
                    className="w-full bg-soft border border-default rounded-lg p-3 text-primary focus:outline-none focus:border-[#3ecf8e] transition-colors"
                  >
                    <option value="">Select a region...</option>
                    {Object.keys(PH_REGIONS_CITIES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-primary font-bold mb-2 text-sm">City / Municipality *</label>
                  <select 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!region}
                    className={`w-full bg-soft border border-default rounded-lg p-3 text-primary focus:outline-none focus:border-[#3ecf8e] transition-colors ${!region ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select a city...</option>
                    {region && PH_REGIONS_CITIES[region].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-primary font-bold mb-2 text-sm">Barangay <span className="text-muted font-normal">(optional)</span></label>
                  <input 
                    type="text" placeholder="e.g. Barangay Bagumbayan" 
                    value={barangay} onChange={(e) => setBarangay(e.target.value)}
                    className="w-full bg-soft border border-default rounded-lg p-3 text-primary placeholder-neutral-600 focus:outline-none focus:border-[#3ecf8e] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Situation Input */}
            <div className="px-6 py-4 border-b border-default bg-panel-strong">
              <span className="text-[11px] font-bold text-muted uppercase tracking-widest">SITUATION INPUT *</span>
            </div>
            <div className="p-6">
              <textarea
                value={situationPrompt}
                onChange={(e) => setSituationPrompt(e.target.value)}
                rows={8}
                className="w-full bg-transparent text-primary placeholder-neutral-700 focus:outline-none text-sm leading-relaxed resize-none"
                placeholder="Describe the problem, available resources, and constraints..."
              />
            </div>
            <div className="px-6 py-4 border-t border-default bg-panel-strong flex justify-between items-center">
              <span className="text-neutral-600 text-xs">{situationPrompt.length} characters</span>
              <button 
                onClick={handleAnalyze}
                disabled={!region || !city || !situationPrompt.trim()}
                className={`font-bold text-sm px-6 py-3 rounded flex items-center transition-colors active:scale-95 ${!region || !city || !situationPrompt.trim() ? 'bg-neutral-200 dark:bg-neutral-800 text-muted cursor-not-allowed' : 'bg-accent hover:bg-accent-strong text-black'}`}
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
            
            {/* SECTION 1: Extracted Context & Map */}
            <section>
              <SectionHeader number="01" title="Extracted Community Context" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 border border-default rounded-xl overflow-hidden bg-[#f8f9fa] dark:bg-surface-soft">
                  {/* Problem */}
                  <div className="p-6 border-b md:border-b-0 md:border-r border-default">
                    <h3 className="flex items-center text-[11px] font-bold text-muted uppercase tracking-widest mb-3">
                      <FiAlertTriangle className="mr-2 text-yellow-500" /> Problem
                    </h3>
                    <p className="text-primary leading-relaxed text-sm">{GHANA_MOCK_DATA.context.problem}</p>
                  </div>
                  {/* Resources */}
                  <div className="p-6 border-b border-default">
                    <h3 className="flex items-center text-[11px] font-bold text-muted uppercase tracking-widest mb-3">
                      <FiUsers className="mr-2 text-accent" /> Resources
                    </h3>
                    <ul className="space-y-2">
                      {GHANA_MOCK_DATA.context.resources.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-neutral-300">
                          <span className="text-accent mr-2">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Constraints */}
                  <div className="p-6 border-b md:border-b-0 md:border-r border-default">
                    <h3 className="flex items-center text-[11px] font-bold text-muted uppercase tracking-widest mb-3">
                      <FiAlertTriangle className="mr-2 text-muted" /> Constraints
                    </h3>
                    <ul className="space-y-2">
                      {GHANA_MOCK_DATA.context.constraints.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-neutral-300">
                          <span className="text-muted mr-2">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Priority */}
                  <div className="p-6">
                    <h3 className="flex items-center text-[11px] font-bold text-muted uppercase tracking-widest mb-3">
                      <FiTarget className="mr-2 text-orange-500" /> Priority
                    </h3>
                    <p className="text-orange-500 font-bold uppercase tracking-wider text-sm">{GHANA_MOCK_DATA.context.priority}</p>
                  </div>
                </div>

                {/* Target Map inside Section 1 */}
                <div className="lg:col-span-1 border border-default rounded-xl bg-[#f8f9fa] dark:bg-surface-soft p-2 flex flex-col min-h-[300px]">
                  <StoreMap 
                    locationQuery={region && city ? `${city}, ${region}` : "Manila, NCR"}
                    pinType="ngo"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: Recommended Solutions */}
            <section>
              <SectionHeader number="02" title="Recommended Solutions" />
              <div className="space-y-4">
                {GHANA_MOCK_DATA.solutions.map((sol, i) => (
                  <div key={sol.id} className={`p-6 border rounded-xl bg-[#f8f9fa] dark:bg-surface-soft transition-all ${i === 0 ? 'border-[#3ecf8e]/30 shadow-accent-soft' : 'border-default'}`}>
                    
                    <div className="flex flex-wrap items-center justify-between mb-4">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center mr-4 ${i === 0 ? 'bg-accent/20 text-accent border border-[#3ecf8e]/50' : 'bg-neutral-200 dark:bg-neutral-800 text-muted'}`}>
                          {sol.id}
                        </div>
                        <h3 className={`text-lg font-bold ${i === 0 ? 'text-primary' : 'text-neutral-300'}`}>{sol.title}</h3>
                        {i === 0 && <span className="ml-4 px-2 py-0.5 rounded text-[10px] font-bold bg-accent text-black uppercase tracking-widest">BEST FIT</span>}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm font-mono text-muted">
                        <span>{sol.cost}</span>
                        <span>{sol.time}</span>
                      </div>
                    </div>

                    <p className="text-muted text-sm leading-relaxed mb-6">{sol.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: Implementation Process */}
            <section>
              <SectionHeader number="03" title="Implementation Process" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {GHANA_MOCK_DATA.implementation.map((phase, idx) => (
                  <div key={idx} className="bg-[#f8f9fa] dark:bg-surface-soft border border-default rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-6xl font-bold text-neutral-900 select-none pointer-events-none opacity-50">0{idx + 1}</div>
                    <h3 className="text-[11px] font-bold text-accent uppercase tracking-widest mb-4 relative z-10">{phase.phase}</h3>
                    <ul className="space-y-3 relative z-10">
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="text-sm text-neutral-300 leading-relaxed flex items-start">
                          <span className="text-neutral-600 mr-2 mt-0.5">▪</span> {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: Compliance & Requirements */}
            <section>
              <SectionHeader number="04" title="Compliance & Approvals" />
              <div className="bg-[#f8f9fa] dark:bg-surface-soft border border-default rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-panel-strong border-b border-default text-[10px] uppercase tracking-widest text-muted">
                      <tr>
                        <th className="px-6 py-4 font-bold">Requirement</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold">Why Required</th>
                        <th className="px-6 py-4 font-bold">Approver</th>
                        <th className="px-6 py-4 font-bold">Timeline / Dep</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {GHANA_MOCK_DATA.compliance.map((item, idx) => (
                        <tr key={idx} className="hover:bg-panel-strong transition-colors">
                          <td className="px-6 py-4 font-semibold text-primary">{item.req}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Required' ? 'bg-orange-500/20 text-orange-500' : 'bg-neutral-200 dark:bg-neutral-800 text-muted'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted">{item.why}</td>
                          <td className="px-6 py-4 text-muted">{item.who}</td>
                          <td className="px-6 py-4 text-muted font-mono text-xs">{item.time} ({item.dep})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 5: Resource & Operations Plan */}
            <section>
              <SectionHeader number="05" title="Resource & Operations Plan" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f8f9fa] dark:bg-surface-soft border border-default rounded-xl p-6">
                  <div className="flex items-center mb-4 text-accent">
                    <FiUsers className="mr-3" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Personnel & Skills</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div><strong className="text-primary block mb-1">People Needed:</strong> <span className="text-muted">{GHANA_MOCK_DATA.resources.people}</span></div>
                    <div><strong className="text-primary block mb-1">Skills Needed:</strong> <span className="text-muted">{GHANA_MOCK_DATA.resources.skills}</span></div>
                  </div>
                </div>

                <div className="bg-[#f8f9fa] dark:bg-surface-soft border border-default rounded-xl p-6">
                  <div className="flex items-center mb-4 text-blue-400">
                    <FiBriefcase className="mr-3" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Logistics & Budget</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div><strong className="text-primary block mb-1">Budget Estimate:</strong> <span className="text-muted">{GHANA_MOCK_DATA.resources.budget}</span></div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-[#f8f9fa] dark:bg-surface-soft border border-default rounded-xl p-6">
                  <div className="flex items-center mb-4 text-purple-400">
                    <FiShield className="mr-3" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Maintenance & Sustainability</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong className="text-primary block mb-1">Maintenance Owner:</strong> <span className="text-muted">{GHANA_MOCK_DATA.resources.owner}</span></div>
                    <div><strong className="text-primary block mb-1">Sustainability Plan:</strong> <span className="text-muted">{GHANA_MOCK_DATA.resources.sustainability}</span></div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: Deployment Tracker */}
            <section>
              <div className="flex justify-between items-end mb-6 border-b border-default pb-2">
                <SectionHeader number="06" title="Deployment Tracker" noBorder />
              </div>
              
              <div className="mb-6 font-mono text-xs">
                <span className={completedTasks === totalTasks ? 'text-accent' : 'text-accent'}>{completedTasks}/{totalTasks} tasks complete</span>
                <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-900 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${(completedTasks/totalTasks)*100}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-default rounded-xl overflow-hidden">
                <TaskColumn title="PREPARATION" tasks={GHANA_MOCK_DATA.actions.preparation} checkedTasks={checkedTasks} onToggle={toggleTask} />
                <TaskColumn title="DEPLOYMENT" tasks={GHANA_MOCK_DATA.actions.deployment} checkedTasks={checkedTasks} onToggle={toggleTask} />
                <TaskColumn title="TRAINING" tasks={GHANA_MOCK_DATA.actions.training} checkedTasks={checkedTasks} onToggle={toggleTask} />
                <TaskColumn title="MONITORING" tasks={GHANA_MOCK_DATA.actions.monitoring} checkedTasks={checkedTasks} onToggle={toggleTask} />
              </div>
            </section>

            {/* SECTION 7: Impact Dashboard */}
            <section>
              <SectionHeader number="07" title="Impact Dashboard" />
              <div className="bg-[#f8f9fa] dark:bg-surface-soft border border-default rounded-xl overflow-hidden">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-default">
                  <MetricCard icon={<FiUsers />} value={GHANA_MOCK_DATA.impact.people} label="BENEFICIARIES" />
                  <MetricCard icon={<span className="font-serif">₱</span>} value={GHANA_MOCK_DATA.impact.totalCost} label="EST. COST" />
                  <MetricCard icon={<FiTrendingUp />} value={GHANA_MOCK_DATA.impact.readinessScore} label="READINESS SCORE" />
                  <MetricCard icon={<FiClock />} value={GHANA_MOCK_DATA.impact.timeline} label="TIMELINE" noBorder />
                </div>

                {/* Outcomes & Environmental Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-default">
                    <div className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4">EXPECTED OUTCOMES</div>
                    <ul className="space-y-4">
                      {GHANA_MOCK_DATA.impact.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start text-sm text-neutral-300">
                          <svg className="w-5 h-5 text-accent mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4">ENVIRONMENTAL & SOCIAL IMPACT</div>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {GHANA_MOCK_DATA.impact.envSocial}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Save & Export Buttons */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 mt-12 pt-8 border-t border-default">
              <button 
                onClick={handleSavePlan}
                className="flex-1 bg-accent hover:bg-accent-strong text-black font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-[#24b47e]/20"
              >
                <FiSave className="mr-2 w-5 h-5" /> SAVE IMPACT PLAN
              </button>

              <div className="relative flex-1">
                <button 
                  id="ngo-download-btn"
                  onClick={() => setShowExportMenu(!showExportMenu)} 
                  className="w-full bg-transparent border border-[#24b47e]/50 hover:border-[#3ecf8e] text-accent font-bold rounded-xl px-6 py-4 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-wider text-sm"
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
                      className="absolute bottom-full left-0 w-full mb-3 bg-soft border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-[#2A2A2A] flex justify-between items-center bg-[#222]">
                        <span className="text-xs font-bold text-muted uppercase tracking-widest">Export Formats</span>
                        <button onClick={() => setShowExportMenu(false)} className="text-muted hover:text-primary p-1"><FiX /></button>
                      </div>
                      <div className="p-2 space-y-1">
                        <button onClick={handleDownloadWord} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-primary hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
                          <FiFileText className="mr-3 text-blue-400 group-hover:scale-110 transition-transform" /> Download as Word Document (.doc)
                        </button>
                        <button onClick={handleDownloadExcel} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-primary hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
                          <FiGrid className="mr-3 text-green-500 group-hover:scale-110 transition-transform" /> Export Tasks to Excel (.csv)
                        </button>
                        <div className="h-px bg-[#2A2A2A] my-1 mx-2" />
                        <button onClick={handleDownloadPDF} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-primary hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
                          <FiFile className="mr-3 text-red-400 group-hover:scale-110 transition-transform" /> Generate PDF Report
                        </button>
                        <button onClick={handleDownloadImage} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-primary hover:bg-[#2A2A2A] rounded-lg transition-colors flex items-center group">
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
  <div className={`flex items-center mb-6 ${noBorder ? '' : 'border-b border-default pb-2'} m-0`}>
    <div className="text-accent border border-[#3ecf8e]/30 bg-accent/10 px-1.5 py-0.5 rounded text-[10px] font-bold mr-3">{number}</div>
    <h2 className="text-xl font-bold tracking-tight text-primary uppercase">{title}</h2>
  </div>
);

const TaskColumn = ({ title, tasks, checkedTasks, onToggle }) => (
  <div className="bg-[#f8f9fa] dark:bg-surface-soft p-6">
    <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">{title}</h3>
    <ul className="space-y-3">
      {tasks.map((task, idx) => {
        const isChecked = checkedTasks.has(task);
        return (
          <li key={idx} className="flex items-start cursor-pointer group" onClick={() => onToggle(task)}>
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mr-3 mt-0.5 transition-colors ${isChecked ? 'bg-accent border-[#3ecf8e]' : 'border-neutral-300 dark:border-neutral-700 group-hover:border-[#3ecf8e]'}`}>
              {isChecked && <FiCheck className="w-3 h-3 text-black" />}
            </div>
            <span className={`text-sm transition-colors ${isChecked ? 'text-muted line-through' : 'text-neutral-300 group-hover:text-primary'}`}>{task}</span>
          </li>
        );
      })}
    </ul>
  </div>
);

const MetricCard = ({ icon, value, label, noBorder }) => (
  <div className={`p-6 ${noBorder ? '' : 'border-r border-default'}`}>
    <div className="text-accent mb-2">{icon}</div>
    <div className="text-3xl font-extrabold text-primary mb-1">{value}</div>
    <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{label}</div>
  </div>
);
