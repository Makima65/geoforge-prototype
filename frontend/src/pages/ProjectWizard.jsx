import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCpu, FiGlobe, FiBriefcase, FiLink, FiEdit3, FiUser, FiUsers, FiArrowRight } from 'react-icons/fi';

export default function ProjectWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // State
  const [category, setCategory] = useState(null);
  const [toolType, setToolType] = useState(null);
  const [stakeholders, setStakeholders] = useState(null);
  const [projectName, setProjectName] = useState('');

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = () => {
    if (category === 'maker') {
      navigate('/new');
    } else {
      navigate('/ngo');
    }
  };

  const getOrbColor = () => {
    if (category === 'maker') return 'from-cyan-500 via-blue-500 to-purple-600';
    if (category === 'ngo') return 'from-green-500 via-emerald-500 to-teal-600';
    if (category === 'business') return 'from-amber-500 via-orange-500 to-red-600';
    return 'from-indigo-500 via-purple-500 to-pink-500'; // Default
  };

  const orbVariants = {
    idle: {
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    },
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col pt-12 px-8 lg:px-20 relative overflow-hidden bg-black text-white">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="mb-16 relative z-10">
        <h4 className="text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-4">Inquire</h4>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white max-w-2xl leading-[1.1]">
          Ready to bring your next idea to life?
        </h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10 h-full pb-20">
        
        {/* LEFT COLUMN: Selectors */}
        <div className="w-full lg:w-1/3 flex flex-col space-y-4 pr-10">
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h4 className="text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-6">Project Categories</h4>
                
                <SelectionCard 
                  title="Maker / Tech" subtitle="Hardware & Software" icon={FiCpu} 
                  selected={category === 'maker'} onClick={() => { setCategory('maker'); nextStep(); }} 
                />
                <SelectionCard 
                  title="Social Impact" subtitle="NGO & Community" icon={FiGlobe} 
                  selected={category === 'ngo'} onClick={() => { setCategory('ngo'); nextStep(); }} 
                />
                <SelectionCard 
                  title="Business" subtitle="Enterprise Solutions" icon={FiBriefcase} 
                  selected={category === 'business'} onClick={() => { setCategory('business'); nextStep(); }} 
                />
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h4 className="text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-6">Select Tool Type</h4>
                {category === 'maker' ? (
                  <>
                    <SelectionCard title="URL Extractor" subtitle="From YouTube/GitHub" icon={FiLink} selected={toolType === 'url'} onClick={() => { setToolType('url'); nextStep(); }} />
                    <SelectionCard title="Describe Idea" subtitle="AI text generation" icon={FiEdit3} selected={toolType === 'text'} onClick={() => { setToolType('text'); nextStep(); }} />
                  </>
                ) : (
                  <>
                    <SelectionCard title="WASH Framework" subtitle="Water & Sanitation" icon={FiGlobe} selected={toolType === 'wash'} onClick={() => { setToolType('wash'); nextStep(); }} />
                    <SelectionCard title="Energy Blueprint" subtitle="Solar & Power" icon={FiCpu} selected={toolType === 'energy'} onClick={() => { setToolType('energy'); nextStep(); }} />
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h4 className="text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-6">How Many Stakeholders?</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SquareCard title="1 User" icon={FiUser} selected={stakeholders === '1'} onClick={() => { setStakeholders('1'); nextStep(); }} />
                  <SquareCard title="2 Users" icon={FiUsers} selected={stakeholders === '2'} onClick={() => { setStakeholders('2'); nextStep(); }} />
                  <SquareCard title="3 Users" icon={FiUsers} selected={stakeholders === '3'} onClick={() => { setStakeholders('3'); nextStep(); }} />
                  <SquareCard title="Community" icon={FiGlobe} selected={stakeholders === 'all'} onClick={() => { setStakeholders('all'); nextStep(); }} />
                </div>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h4 className="text-[11px] font-bold text-neutral-500 tracking-[0.2em] uppercase mb-6">Give it a name</h4>
                <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-2 mb-6">
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="What should we call this project?"
                    className="w-full bg-transparent p-4 text-white text-lg placeholder-neutral-600 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button 
                  onClick={handleFinish}
                  disabled={!projectName.trim()}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${projectName.trim() ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-[#1A1A1A] text-neutral-500 cursor-not-allowed'}`}
                >
                  Review Summary <FiArrowRight className="ml-2" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* CENTER COLUMN: The Glowing Orb */}
        <div className="w-full lg:w-1/3 flex items-center justify-center py-20 lg:py-0 relative">
          
          {/* Back Buttons mapped to the orb path */}
          {step > 1 && (
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={prevStep}
              className="absolute top-1/2 left-0 -mt-6 w-12 h-12 bg-neutral-800/50 hover:bg-neutral-700 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-white transition-colors backdrop-blur-sm z-20"
            >
              <FiChevronLeft className="w-6 h-6" />
            </motion.button>
          )}

          <motion.div 
            variants={orbVariants}
            animate={step === 4 ? "pulse" : "idle"}
            className="relative w-64 h-64 flex items-center justify-center"
          >
            {/* The actual glow */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${getOrbColor()} rounded-[40%] blur-xl opacity-70 animate-spin-slow`} style={{ animationDuration: '10s' }} />
            <div className={`absolute inset-2 bg-gradient-to-bl ${getOrbColor()} rounded-[60%] blur-2xl opacity-50 animate-spin-slow`} style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className={`absolute inset-4 bg-gradient-to-t ${getOrbColor()} rounded-full blur-md opacity-90`} />
            
            {/* Center icon */}
            <div className="relative z-10 text-white drop-shadow-2xl">
              {category === 'maker' ? <FiCpu className="w-20 h-20" /> : category === 'ngo' ? <FiGlobe className="w-20 h-20" /> : <FiBriefcase className="w-20 h-20" />}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Dynamic Copy */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center pl-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className="text-right"
            >
              {step === 1 && (
                <>
                  <h2 className="text-3xl font-bold text-white mb-4">Let's start your<br/>project.</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-[280px] ml-auto">
                    First, choose a primary category on the left to tell me what you're working on.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="text-[11px] font-bold text-blue-500 tracking-[0.2em] uppercase mb-2">DEVELOPING: {category}</div>
                  <h2 className="text-3xl font-bold text-white mb-4">Perfect Choice.</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-[280px] ml-auto">
                    Now, select the tool type. Whether it's extracting from a link or starting from a raw idea, specialized AI will be used.
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="text-[11px] font-bold text-blue-500 tracking-[0.2em] uppercase mb-2">{category} • {toolType}</div>
                  <h2 className="text-3xl font-bold text-white mb-4">Almost There.</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-[280px] ml-auto">
                    How many stakeholders or primary users will be interacting with this application initially?
                  </p>
                </>
              )}
              {step === 4 && (
                <>
                  <div className="text-[11px] font-bold text-blue-500 tracking-[0.2em] uppercase mb-2 bg-blue-500/10 px-3 py-1 inline-block rounded-full ml-auto">FINAL STEP</div>
                  <h2 className="text-3xl font-bold text-white mb-4 mt-2">The Final Touch.</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-[280px] ml-auto">
                    What name should we give to this amazing {category} project? This helps us keep things organized.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// Helper Components
const SelectionCard = ({ title, subtitle, icon: Icon, selected, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-6 rounded-3xl border cursor-pointer transition-all flex items-center ${selected ? 'bg-[#2A2A2A] border-white/20 shadow-lg' : 'bg-[#151515] border-transparent hover:bg-[#1A1A1A]'}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-5 ${selected ? 'bg-white/10 text-white' : 'bg-black/50 text-neutral-400'}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-white font-bold text-lg">{title}</div>
      <div className="text-neutral-500 text-[11px] font-bold tracking-widest uppercase mt-1">{subtitle}</div>
    </div>
  </motion.div>
);

const SquareCard = ({ title, icon: Icon, selected, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-6 rounded-3xl border flex flex-col items-center justify-center cursor-pointer transition-all aspect-square ${selected ? 'bg-[#2A2A2A] border-white/20 shadow-lg' : 'bg-[#151515] border-transparent hover:bg-[#1A1A1A]'}`}
  >
    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${selected ? 'bg-white/10 text-white' : 'bg-black/50 text-neutral-400'}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-white font-bold text-sm tracking-wider uppercase">{title}</div>
  </motion.div>
);
