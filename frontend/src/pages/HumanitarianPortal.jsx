import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiCheck, FiChevronRight, FiChevronLeft, FiAlertCircle, FiDownload } from 'react-icons/fi';
import { runVectorMatch } from '../services/api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const projectsList = [
  "Solar Water Pump",
  "Emergency Shelter",
  "Water Filtration System",
  "Disaster Communication Kit",
  "Solar Lighting System",
  "Typhoon Early Warning Device"
];

const mockComparison = [
  { orig: "Grundfos SQFlex Pump", local: "Monarch 12V Submersible Pump", notes: "Same flow rate (4.5 m³/h), available at Handyman PH" },
  { orig: "Victron 100/30 MPPT", local: "EPEver 30A MPPT", notes: "Equivalent efficiency, stocked on Lazada PH" },
  { orig: "HDPE Float Tank 500L", local: "Den Braven 500L Poly Tank", notes: "Same spec, local distributor in Cebu" },
  { orig: "Sensirion SHT31 Sensor", local: "DHT22 Module", notes: "Adequate precision for PH outdoor climate" }
];

export default function HumanitarianPortal() {
  const [step, setStep] = useState(1);
  const [project, setProject] = useState("Solar Water Pump");
  const [location, setLocation] = useState({ country: 'Philippines', region: '', city: '', barangay: '' });
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await runVectorMatch({
        project_name: project,
        country: location.country,
        region: location.region || "Unknown",
        city: location.city || "Unknown",
        mode: "humanitarian"
      });
      setMatchData(response);
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setLoading(false);
      setStep(4);
    }
  };

  const handleReset = () => {
    setStep(1);
    setMatchData(null);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('results-dashboard');
    if (!element) return;
    
    const btn = document.getElementById('download-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating PDF...</span>';
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0A0A0A',
        scale: 2
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GeoForge_Plan_${project.replace(/\\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      btn.innerHTML = originalText;
    }
  };

  const slideVariants = {
    initial: { opacity: 0, y: 15 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col">
      
      {/* Header & Stepper */}
      {step < 4 && (
        <div className="mb-10 flex flex-col items-center w-full">
          <div className="flex flex-col items-center space-y-4 mb-10 text-center">
            <div className="w-12 h-12 rounded-full border border-[#24b47e]/30 flex items-center justify-center bg-[#24b47e]/10 shadow-[0_0_15px_rgba(36,180,126,0.15)]">
              <FiHeart className="text-[#3ecf8e] w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[26px] font-extrabold text-white tracking-tight mb-1">Humanitarian Portal</h1>
              <p className="text-[#24b47e] text-sm font-medium tracking-wide">For NGOs, LGUs, and disaster response teams</p>
            </div>
          </div>

          <div className="flex items-center justify-center w-full max-w-2xl">
            {[ 
              { num: 1, label: 'Select Project' },
              { num: 2, label: 'Location' },
              { num: 3, label: 'Generate' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step > s.num ? 'bg-[#24b47e] text-black shadow-[0_0_10px_rgba(36,180,126,0.3)]' : 
                    step === s.num ? 'bg-[#24b47e] text-black shadow-[0_0_10px_rgba(36,180,126,0.3)]' : 
                    'bg-[#1A1A1A] text-neutral-600 border border-neutral-800'
                  }`}>
                    {step > s.num ? <FiCheck className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${step >= s.num ? 'text-[#24b47e]' : 'text-neutral-600'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-px mx-4 transition-colors ${step > s.num ? 'bg-[#24b47e]/40' : 'bg-neutral-800'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Select Project */}
          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="bg-[#151515] border border-neutral-800 rounded-2xl p-8 shadow-xl w-full max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-[20px] font-extrabold text-white mb-1.5">Select your project</h2>
                <p className="text-[#24b47e] text-sm">Choose the hardware project to localize for your deployment area.</p>
              </div>
              
              <div className="space-y-3">
                {projectsList.map((proj) => {
                  const isActive = project === proj;
                  return (
                    <div 
                      key={proj}
                      onClick={() => setProject(proj)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#24b47e]/5 border-[#24b47e]/50 shadow-[0_0_15px_rgba(36,180,126,0.05)]' 
                          : 'bg-[#0F0F0F] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#111111]'
                      }`}
                    >
                      <span className={`font-semibold text-[15px] ${isActive ? 'text-[#3ecf8e]' : 'text-neutral-300'}`}>{proj}</span>
                      {isActive && <FiCheck className="text-[#3ecf8e] w-5 h-5" />}
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button onClick={handleNext} disabled={!project} className="bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-lg px-6 py-3 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center shadow-lg">
                  Continue <FiChevronRight className="ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="bg-[#151515] border border-neutral-800 rounded-2xl p-8 shadow-xl w-full max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-[20px] font-extrabold text-white mb-1.5">Where will this be deployed?</h2>
                <p className="text-[#24b47e] text-sm">We match parts with PH suppliers in your area.</p>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Country</label>
                  <input type="text" value={location.country} readOnly className="w-full bg-[#0F0F0F] border border-[#24b47e]/40 rounded-xl px-4 py-3.5 text-[#3ecf8e] font-semibold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-white text-[15px] font-semibold mb-2">Region *</label>
                  <div className="relative">
                    <select 
                      value={location.region} 
                      onChange={(e) => setLocation({...location, region: e.target.value})}
                      className="w-full bg-[#0F0F0F] border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#3ecf8e]/40 focus:ring-1 focus:ring-[#3ecf8e]/40 appearance-none transition-colors"
                      required
                    >
                      <option value="" disabled className="text-neutral-600">Select a region...</option>
                      <option value="Region VIII - Eastern Visayas">Region VIII - Eastern Visayas</option>
                      <option value="NCR - National Capital Region">NCR - National Capital Region</option>
                      <option value="Region XI - Davao Region">Region XI - Davao Region</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-white text-[15px] font-semibold mb-2">City / Municipality *</label>
                  <input 
                    type="text" 
                    value={location.city} 
                    onChange={(e) => setLocation({...location, city: e.target.value})}
                    placeholder="e.g. Davao City" 
                    className="w-full bg-[#0F0F0F] border border-neutral-800 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#3ecf8e]/40 focus:ring-1 focus:ring-[#3ecf8e]/40 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-[15px] font-semibold mb-2">Barangay <span className="text-[#24b47e]/60 font-normal text-sm ml-1">(optional - for precise matching)</span></label>
                  <input 
                    type="text" 
                    value={location.barangay} 
                    onChange={(e) => setLocation({...location, barangay: e.target.value})}
                    placeholder="e.g. Barangay Bagumbayan" 
                    className="w-full bg-[#0F0F0F] border border-neutral-800 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#3ecf8e]/40 focus:ring-1 focus:ring-[#3ecf8e]/40 transition-colors" 
                  />
                </div>
                
                <div className="mt-10 pt-4 flex items-center justify-between">
                  <button type="button" onClick={handlePrev} className="text-[#24b47e] font-semibold hover:text-[#3ecf8e] transition-colors flex items-center px-2 py-2">
                    <FiChevronLeft className="mr-1" /> Back
                  </button>
                  <button type="submit" className="bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-lg px-8 py-3 active:scale-[0.98] transition-all flex items-center shadow-[0_0_15px_rgba(36,180,126,0.15)]">
                    Continue <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="bg-[#151515] border border-neutral-800 rounded-2xl p-8 shadow-xl w-full max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-[20px] font-extrabold text-white mb-1.5">Review & generate</h2>
                <p className="text-[#24b47e] text-sm">Confirm details and generate your localized ₱ PHP plan.</p>
              </div>
              
              <div className="bg-[#0F0F0F] border border-neutral-800/80 rounded-xl p-6 mb-10 shadow-sm">
                <dl className="divide-y divide-neutral-800/50">
                  <div className="py-3.5 flex justify-between">
                    <dt className="text-[#24b47e] text-[15px] font-semibold">Project</dt>
                    <dd className="text-white font-semibold text-[15px]">{project}</dd>
                  </div>
                  <div className="py-3.5 flex justify-between">
                    <dt className="text-[#24b47e] text-[15px] font-semibold">Country</dt>
                    <dd className="text-white font-semibold text-[15px]">{location.country}</dd>
                  </div>
                  <div className="py-3.5 flex justify-between">
                    <dt className="text-[#24b47e] text-[15px] font-semibold">Region</dt>
                    <dd className="text-white font-semibold text-[15px]">{location.region || "Not specified"}</dd>
                  </div>
                  <div className="py-3.5 flex justify-between">
                    <dt className="text-[#24b47e] text-[15px] font-semibold">City</dt>
                    <dd className="text-white font-semibold text-[15px]">{location.city || "Not specified"}</dd>
                  </div>
                  <div className="py-3.5 flex justify-between">
                    <dt className="text-[#24b47e] text-[15px] font-semibold">Barangay</dt>
                    <dd className="text-white font-semibold text-[15px]">{location.barangay || "Not specified"}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="w-full bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-xl px-6 py-4 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center shadow-[0_0_20px_rgba(36,180,126,0.2)] text-[16px]"
                >
                  {loading ? (
                    <span className="flex items-center text-black/80">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running Vector Match...
                    </span>
                  ) : (
                    <>Find Local Materials <FiChevronRight className="ml-2 w-5 h-5" /></>
                  )}
                </button>
                <div className="text-left w-full">
                   <button onClick={handlePrev} className="text-[#24b47e] font-semibold hover:text-[#3ecf8e] transition-colors flex items-center py-2 text-sm">
                      <FiChevronLeft className="mr-1" /> Back
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Results View */}
          {step === 4 && (
            <motion.div key="step4" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="w-full mx-auto space-y-8" id="results-dashboard">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-[28px] font-extrabold text-white tracking-tight mb-2">Localized Plan Ready</h1>
                  <p className="text-[#3ecf8e] font-mono text-[15px]">{project} • {location.city}, {location.country}</p>
                </div>
                <button onClick={handleReset} className="text-[#3ecf8e] hover:text-white flex items-center text-sm font-semibold transition-colors bg-[#24b47e]/10 px-4 py-2 rounded-lg border border-[#24b47e]/20 hover:bg-[#24b47e]/20 active:scale-95">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  New search
                </button>
              </div>

              {/* Banner */}
              <div className="bg-[#051A10] border border-[#24b47e]/40 rounded-xl p-5 flex items-center text-[#3ecf8e] shadow-[0_0_15px_rgba(36,180,126,0.05)]">
                <FiCheck className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-semibold text-[15px]">Your localized hardware plan is ready.</span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-7 flex flex-col items-center justify-center shadow-md">
                  <div className="text-[#24b47e]/80 text-[15px] font-bold mb-3">Original Parts</div>
                  <div className="text-[#3ecf8e] text-[40px] font-black leading-none">{matchData ? matchData.original_parts_count : 4}</div>
                </div>
                <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-7 flex flex-col items-center justify-center shadow-md">
                  <div className="text-[#24b47e]/80 text-[15px] font-bold mb-3">Local Alternatives</div>
                  <div className="text-[#3ecf8e] text-[40px] font-black leading-none">{matchData ? matchData.local_alternatives_count : 4}</div>
                </div>
                <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-7 flex flex-col items-center justify-center shadow-md">
                  <div className="text-[#24b47e]/80 text-[15px] font-bold mb-3">Match Quality</div>
                  <div className="text-[#3ecf8e] text-[40px] font-black leading-none">{matchData ? matchData.match_quality : "High"}</div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-[#151515] border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="px-8 py-5 border-b border-neutral-800 bg-[#111111]">
                  <h3 className="text-white font-bold text-[18px] tracking-tight">Component Comparison</h3>
                </div>
                <div className="divide-y divide-neutral-800/80">
                  {(matchData ? matchData.components : mockComparison).map((item, i) => (
                    <div key={i} className="p-8 flex flex-col md:flex-row md:items-center gap-6 hover:bg-white/[0.02] transition-colors">
                      <div className="md:w-1/3 text-neutral-300 font-semibold text-[15px]">{item.orig}</div>
                      <div className="md:w-1/3 flex items-center text-[#3ecf8e] font-bold text-[15px]">
                        <FiChevronRight className="mr-3 opacity-60 hidden md:block w-5 h-5" />
                        {item.local}
                      </div>
                      <div className="md:w-1/3 text-[#24b47e]/80 text-sm font-medium leading-relaxed">{item.notes}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Guide Card */}
              <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#24b47e]/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-full border border-[#24b47e]/40 flex items-center justify-center bg-[#051A10] shadow-[0_0_20px_rgba(36,180,126,0.15)] shrink-0">
                    <svg className="w-6 h-6 text-[#3ecf8e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-[20px] mb-1.5">Your customized field guide is ready</h4>
                    <p className="text-[#3ecf8e]/90 text-[15px] font-semibold">Parts checklist • PH supplier contacts • Assembly instructions • Offline PDF</p>
                  </div>
                </div>
                <button id="download-btn" onClick={handleDownloadPDF} className="w-full md:w-auto shrink-0 bg-[#24b47e] hover:bg-[#3ecf8e] text-black font-bold rounded-xl px-8 py-3.5 active:scale-[0.98] transition-all flex items-center justify-center shadow-[0_0_15px_rgba(36,180,126,0.2)] text-[16px] relative z-10">
                  <FiDownload className="mr-2 w-5 h-5" /> Download Guide
                </button>
              </div>

              {/* Sourcing Alert */}
              <div className="bg-[#0A0A0A] border border-neutral-800 rounded-xl p-5 flex items-start md:items-center text-neutral-400">
                <FiAlertCircle className="w-5 h-5 mr-3 mt-0.5 md:mt-0 text-[#24b47e] flex-shrink-0" />
                <span className="text-[14px] font-medium text-[#24b47e]/80">Some components may need additional sourcing. Try a nearby city or barangay if stock is unavailable.</span>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
