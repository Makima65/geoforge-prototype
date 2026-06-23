import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import MakerPortal from './pages/MakerPortal';
import HumanitarianLayout from './components/layout/HumanitarianLayout';
import HumanitarianPortal from './pages/HumanitarianPortal';
import SavedBuilds from './pages/SavedBuilds';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <DashboardLayout>
            <MakerPortal />
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
