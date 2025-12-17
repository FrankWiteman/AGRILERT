
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants.tsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-emerald-900 text-white transition-transform duration-300 transform
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
    `}>
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center text-emerald-900">
            <i className="fa-solid fa-seedling text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AGRILERT</h1>
            <p className="text-xs text-emerald-300 font-medium uppercase tracking-widest">Agri-tech Hub</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${activeTab === item.id 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'}
              `}
            >
              <i className={`fa-solid ${item.icon} text-lg transition-transform group-hover:scale-110`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-emerald-800/50 rounded-2xl p-4 border border-emerald-700">
            <p className="text-sm font-semibold mb-1">Dr. Emeka Nwosu</p>
            <p className="text-xs text-emerald-300">Senior Research Scientist</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">CML Live Sync</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
