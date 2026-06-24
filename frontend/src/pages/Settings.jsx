import React, { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';
import { FiUser, FiMonitor, FiSliders, FiBriefcase, FiBell, FiEye, FiDatabase, FiInfo, FiMoon, FiSun, FiSmartphone } from 'react-icons/fi';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [defaultCategory, setDefaultCategory] = useState('engineering');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'appearance', label: 'Appearance', icon: FiMonitor },
    { id: 'preferences', label: 'Preferences', icon: FiSliders },
    { id: 'workspace', label: 'Workspace', icon: FiBriefcase },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'accessibility', label: 'Accessibility', icon: FiEye },
    { id: 'data', label: 'Data & Storage', icon: FiDatabase },
    { id: 'about', label: 'About', icon: FiInfo },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
        <div className="flex flex-col space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-gray-900 dark:text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#f8f9fa] dark:bg-[#111111] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
        
        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Appearance</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Customize how the workspace looks on your device.</p>
              
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Theme</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                  >
                    <FiSun className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-blue-500' : 'text-neutral-500 dark:text-neutral-400'}`} />
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`}>Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                  >
                    <FiMoon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-blue-500' : 'text-neutral-500 dark:text-neutral-400'}`} />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`}>Dark</span>
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                  >
                    <FiSmartphone className={`w-6 h-6 mb-2 ${theme === 'system' ? 'text-blue-500' : 'text-neutral-500 dark:text-neutral-400'}`} />
                    <span className={`text-sm font-medium ${theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`}>System</span>
                  </button>
                </div>
              </div>
            </div>
            
            <hr className="border-neutral-200 dark:border-neutral-800" />
            
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Compact Layout</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Reduce spacing between elements to show more content.</div>
                </div>
                <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-not-allowed"></div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Project Preferences</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Set your defaults for new projects.</p>
              
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Default Project Category</div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDefaultCategory('engineering')}
                    className={`p-4 rounded-xl border text-left transition-all ${defaultCategory === 'engineering' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                  >
                    <div className={`font-bold mb-1 ${defaultCategory === 'engineering' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>Engineering</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Technical & Product Development</div>
                  </button>
                  <button 
                    onClick={() => setDefaultCategory('community')}
                    className={`p-4 rounded-xl border text-left transition-all ${defaultCategory === 'community' ? 'border-[#3ecf8e] bg-[#3ecf8e]/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                  >
                    <div className={`font-bold mb-1 ${defaultCategory === 'community' ? 'text-[#24b47e] dark:text-[#3ecf8e]' : 'text-gray-900 dark:text-white'}`}>Community Initiatives</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Community & NGO Programs</div>
                  </button>
                </div>
              </div>
            </div>
            
            <hr className="border-neutral-200 dark:border-neutral-800" />
            
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Default Input Method</div>
              <select className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-gray-900 dark:text-white text-sm rounded-lg p-3 outline-none">
                <option value="url">Import References (URL/Docs)</option>
                <option value="text">Start From an Idea (Text)</option>
              </select>
            </div>
          </div>
        )}

        {/* Stubs for other tabs */}
        {['profile', 'workspace', 'notifications', 'accessibility', 'data', 'about'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FiSliders className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 capitalize">{activeTab} Settings</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              These settings are currently read-only or managed by your organization's IT policy.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
