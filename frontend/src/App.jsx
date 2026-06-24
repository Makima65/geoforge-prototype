import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import MakerPortal from './pages/MakerPortal';
import DashboardMetrics from './pages/DashboardMetrics';
import HumanitarianLayout from './components/layout/HumanitarianLayout';
import HumanitarianPortal from './pages/HumanitarianPortal';
import SavedBuilds from './pages/SavedBuilds';
import ProjectWizard from './pages/ProjectWizard';
import NGOPortal from './pages/NGOPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <DashboardLayout>
            <DashboardMetrics />
          </DashboardLayout>
        } />

        <Route path="/wizard" element={
          <DashboardLayout>
            <ProjectWizard />
          </DashboardLayout>
        } />

        <Route path="/new" element={
          <DashboardLayout>
            <MakerPortal />
          </DashboardLayout>
        } />

        <Route path="/ngo" element={
          <DashboardLayout>
            <NGOPortal />
          </DashboardLayout>
        } />
        
        <Route path="/saved" element={
          <DashboardLayout>
            <SavedBuilds />
          </DashboardLayout>
        } />

        <Route path="/humanitarian" element={
          <HumanitarianLayout>
            <HumanitarianPortal />
          </HumanitarianLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
