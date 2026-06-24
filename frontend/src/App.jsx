import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import DashboardLayout from './components/layout/DashboardLayout';
import MakerPortal from './pages/MakerPortal';
import DashboardMetrics from './pages/DashboardMetrics';
import HumanitarianLayout from './components/layout/HumanitarianLayout';
import HumanitarianPortal from './pages/HumanitarianPortal';
import SavedProjects from './pages/SavedProjects';
import ProjectWizard from './pages/ProjectWizard';
import NGOPortal from './pages/NGOPortal';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
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
            <SavedProjects />
          </DashboardLayout>
        } />

        <Route path="/humanitarian" element={
          <HumanitarianLayout>
            <HumanitarianPortal />
          </HumanitarianLayout>
        } />

        <Route path="/settings" element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        } />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
