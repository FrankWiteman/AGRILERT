
import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 md:left-64 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
        <div className="hidden sm:flex items-center bg-slate-100 px-4 py-2 rounded-xl w-64 lg:w-96">
          <i className="fa-solid fa-search text-slate-400 mr-2"></i>
          <input 
            type="text" 
            placeholder="Search crop guides, weather trends..." 
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
          <i className="fa-solid fa-bell text-xl"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900">Aisha Ibrahim</p>
            <p className="text-[10px] text-slate-500">Oyo State Farm</p>
          </div>
          <img 
            src="https://picsum.photos/seed/agrilert/40/40" 
            alt="Profile" 
            className="w-10 h-10 rounded-xl border border-slate-200 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
