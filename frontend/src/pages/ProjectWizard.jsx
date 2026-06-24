import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCpu, FiGlobe, FiLink, FiEdit3, FiUser, FiUsers, FiArrowRight, FiChevronLeft } from 'react-icons/fi';

export default function ProjectWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // State
  const [category, setCategory] = useState(null);
  const [toolType, setToolType] = useState(null);
  const [projectName, setProjectName] = useState('');

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = () => {
    if (category === 'engineering') {
      navigate('/new', { state: { toolType, projectName } });
    } else {
      navigate('/ngo', { state: { toolType, projectName } });
    }
  };

  const getOrbColor = () => {
    if (category === 'engineering') return 'from-cyan-500 via-blue-500 to-purple-600';
    if (category === 'impact') return 'from-green-500 via-emerald-500 to-teal-600';
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
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col pt-12 px-8 lg:px-20 relative overflow-hidden bg-page text-primary">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="mb-16 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary max-w-2xl leading-[1.1]">
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
                <h4 className="text-[11px] font-bold text-muted tracking-[0.2em] uppercase mb-6">Create a New Project</h4>
                
                <SelectionCard 
                  title="ENGINEERING" subtitle="Design, build, or prototype technical solutions including hardware, software, automation, and engineering workflows." icon={FiCpu} 
                  selected={category === 'engineering'} onClick={() => { setCategory('engineering'); nextStep(); }} 
                />
                <SelectionCard 
                  title="COMMUNITY INITIATIVES" subtitle="Plan and organize community, NGO, education, sustainability, and public-benefit initiatives." icon={FiGlobe} 
                  selected={category === 'impact'} onClick={() => { setCategory('impact'); nextStep(); }} 
                />
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h4 className="text-[11px] font-bold text-muted tracking-[0.2em] uppercase mb-6">Select how you want to start</h4>
                <SelectionCard title="IMPORT REFERENCES" subtitle="Import information from YouTube, GitHub, documents, or external sources to create a project foundation." icon={FiLink} selected={toolType === 'url'} onClick={() => { setToolType('url'); nextStep(); }} />
                <SelectionCard title="START FROM AN IDEA" subtitle="Describe your concept in text and let BOMO create an initial project structure." icon={FiEdit3} selected={toolType === 'text'} onClick={() => { setToolType('text'); nextStep(); }} />
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h4 className="text-[11px] font-bold text-muted tracking-[0.2em] uppercase mb-6">Give it a name</h4>
                <div className="bg-soft border border-default rounded-2xl p-2 mb-6">
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="What should we call this project?"
                    className="w-full bg-transparent p-4 text-primary text-lg placeholder-neutral-600 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button 
                  onClick={handleFinish}
                  disabled={!projectName.trim()}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${projectName.trim() ? 'bg-accent hover:bg-accent-strong text-black shadow-[0_0_20px_rgba(62,207,142,0.3)]' : 'bg-soft text-muted cursor-not-allowed'}`}
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
              className="absolute top-1/2 left-0 -mt-6 w-12 h-12 bg-neutral-200 dark:bg-neutral-800/50 hover:bg-neutral-700 rounded-2xl flex items-center justify-center text-muted hover:text-primary transition-colors backdrop-blur-sm z-20"
            >
              <FiChevronLeft className="w-6 h-6" />
            </motion.button>
          )}

          <motion.div 
            variants={orbVariants}
            animate={step === 3 ? "pulse" : "idle"}
            className="relative w-64 h-64 flex items-center justify-center"
          >
            {/* The actual glow */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${getOrbColor()} rounded-[40%] blur-xl opacity-70 animate-spin-slow`} style={{ animationDuration: '10s' }} />
            <div className={`absolute inset-2 bg-gradient-to-bl ${getOrbColor()} rounded-[60%] blur-2xl opacity-50 animate-spin-slow`} style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className={`absolute inset-4 bg-gradient-to-t ${getOrbColor()} rounded-full blur-md opacity-90`} />
            
            <div className="relative z-10 text-primary drop-shadow-2xl">
              {category === 'engineering' ? <FiCpu className="w-20 h-20" /> : <FiGlobe className="w-20 h-20" />}
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
                  <h2 className="text-3xl font-bold text-primary mb-4">Create a New<br/>Project.</h2>
                  <p className="text-muted text-sm leading-relaxed max-w-[280px] ml-auto">
                    Select the project category that best matches your goal. This helps BOMO prepare the appropriate tools and workflow for your project.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="text-[11px] font-bold text-blue-500 tracking-[0.2em] uppercase mb-2">Selected Category: {category === 'engineering' ? 'Engineering' : 'Community Initiatives'}</div>
                  <h2 className="text-3xl font-bold text-primary mb-4">Create Your Project.</h2>
                  <p className="text-muted text-sm leading-relaxed max-w-[280px] ml-auto">
                    Choose an input method to continue. BOMO will adapt the workflow based on your selected project category and input source.
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="text-[11px] font-bold text-accent tracking-[0.2em] uppercase mb-2 bg-accent/10 px-3 py-1 inline-block rounded-full ml-auto">FINAL STEP</div>
                  <h2 className="text-3xl font-bold text-primary mb-4 mt-2">The Final Touch.</h2>
                  <p className="text-muted text-sm leading-relaxed max-w-[280px] ml-auto">
                    What name should we give to this {category === 'engineering' ? 'engineering' : 'impact'} project? This helps us keep things organized.
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
    className={`p-6 rounded-3xl border cursor-pointer transition-all flex items-start ${selected ? 'bg-accent/5 border-accent-soft shadow-lg' : 'bg-panel-strong border-transparent hover:bg-soft'}`}
  >
    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center mr-5 ${selected ? 'bg-white/10 text-primary' : 'bg-white dark:bg-black/50 text-muted'}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-primary font-bold text-lg leading-tight mb-2">{title}</div>
      <div className="text-muted text-xs font-medium leading-relaxed">{subtitle}</div>
    </div>
  </motion.div>
);

const SquareCard = ({ title, icon: Icon, selected, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-6 rounded-3xl border flex flex-col items-center justify-center cursor-pointer transition-all aspect-square ${selected ? 'bg-accent/5 border-accent-soft shadow-lg' : 'bg-panel-strong border-transparent hover:bg-soft'}`}
  >
    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${selected ? 'bg-white/10 text-primary' : 'bg-white dark:bg-black/50 text-muted'}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-primary font-bold text-sm tracking-wider uppercase">{title}</div>
  </motion.div>
);
