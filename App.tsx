
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import VirtualSimulation from './components/VirtualSimulation.tsx';
import AdvisoryPanel from './components/AdvisoryPanel.tsx';
import FarmManagement from './components/FarmManagement.tsx';
import EducationCenter from './components/EducationCenter.tsx';
import CommunityHub from './components/CommunityHub.tsx';
import LiveExpert from './components/LiveExpert.tsx';
import PlotMapper from './components/PlotMapper.tsx';
import LocationSetup from './components/LocationSetup.tsx';
import CropSelection from './components/CropSelection.tsx';
import Profile from './components/Profile.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('agrilert_theme') === 'dark');
  
  // App State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agrilert_user');
    return saved ? JSON.parse(saved) : { name: 'New Farmer', address: '', subscription: 'Free', email: '' };
  });

  const [farmLocation, setFarmLocation] = useState<any>(() => {
    const saved = localStorage.getItem('agrilert_location');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedCrop, setSelectedCrop] = useState<any>(() => {
    const saved = localStorage.getItem('agrilert_crop');
    return saved ? JSON.parse(saved) : null;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('agrilert_location', JSON.stringify(farmLocation));
    localStorage.setItem('agrilert_crop', JSON.stringify(selectedCrop));
    localStorage.setItem('agrilert_user', JSON.stringify(user));
    localStorage.setItem('agrilert_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [farmLocation, selectedCrop, user, isDarkMode]);

  const resetFarm = () => {
    setFarmLocation(null);
    setSelectedCrop(null);
    setActiveTab('dashboard');
  };

  return (
    <Router>
      <div className={`flex min-h-screen font-sans overflow-hidden ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        {!farmLocation ? (
          <LocationSetup onComplete={setFarmLocation} />
        ) : !selectedCrop ? (
          <CropSelection location={farmLocation} onComplete={setSelectedCrop} />
        ) : (
          <>
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
              isOpen={isMobileMenuOpen}
              resetFarm={resetFarm}
            />

            <div className="flex-1 flex flex-col md:ml-64 relative overflow-hidden">
              <Header 
                user={user} 
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                locationName={farmLocation.name}
              />
              
              <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16 scrollbar-hide">
                <div className="max-w-7xl mx-auto pb-24">
                  {activeTab === 'dashboard' && <Dashboard location={farmLocation} crop={selectedCrop} />}
                  {activeTab === 'mapping' && <PlotMapper location={farmLocation} />}
                  {activeTab === 'simulation' && <VirtualSimulation crop={selectedCrop} />}
                  {activeTab === 'advisory' && <AdvisoryPanel location={farmLocation} crop={selectedCrop} />}
                  {activeTab === 'management' && <FarmManagement user={user} setUser={setUser} />}
                  {activeTab === 'education' && <EducationCenter />}
                  {activeTab === 'community' && <CommunityHub user={user} />}
                  {activeTab === 'profile' && <Profile user={user} setUser={setUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
                </div>
              </main>
              
              <LiveExpert location={farmLocation} crop={selectedCrop} />
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
