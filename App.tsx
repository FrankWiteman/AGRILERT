
import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import VirtualSimulation from './components/VirtualSimulation';
import AdvisoryPanel from './components/AdvisoryPanel';
import FarmManagement from './components/FarmManagement';
import EducationCenter from './components/EducationCenter';
import CommunityHub from './components/CommunityHub';
import LiveExpert from './components/LiveExpert';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {/* Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            closeMobileMenu();
          }} 
          isOpen={isMobileMenuOpen}
        />

        <div className="flex-1 flex flex-col md:ml-64">
          <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          
          <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16">
            <div className="max-w-7xl mx-auto pb-24">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'simulation' && <VirtualSimulation />}
              {activeTab === 'advisory' && <AdvisoryPanel />}
              {activeTab === 'management' && <FarmManagement />}
              {activeTab === 'education' && <EducationCenter />}
              {activeTab === 'community' && <CommunityHub />}
            </div>
          </main>
        </div>

        {/* Floating Live Expert Assistant */}
        <LiveExpert />
      </div>
    </Router>
  );
};

export default App;
