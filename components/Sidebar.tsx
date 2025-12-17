
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  resetFarm: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, resetFarm }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'simulation', label: 'Virtual Farm', icon: 'fa-clover' },
    { id: 'mapping', label: 'Plot Mapping', icon: 'fa-map-location-dot' },
    { id: 'advisory', label: 'Agri Advisory', icon: 'fa-lightbulb' },
    { id: 'community', label: 'Community', icon: 'fa-users' },
    { id: 'education', label: 'Learning Center', icon: 'fa-graduation-cap' },
    { id: 'profile', label: 'User Settings', icon: 'fa-user-gear' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white transition-transform duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full border-r border-slate-800">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-emerald-950">
            <i className="fa-solid fa-seedling text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black tracking-tighter">AGRILERT</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <i className={`fa-solid ${item.icon} text-lg transition-transform group-hover:scale-110`}></i>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={resetFarm}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 hover:border-rose-500 transition-all"
          >
            Reset Cultivation
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
