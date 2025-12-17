
import React from 'react';

interface Props {
  user: any;
  locationName: string;
  onMenuToggle: () => void;
}

const Header: React.FC<Props> = ({ user, locationName, onMenuToggle }) => {
  return (
    <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-0 md:left-64 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="md:hidden w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500">
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
          <i className="fa-solid fa-location-dot text-emerald-500 text-xs"></i>
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{locationName}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400">
           <i className="fa-solid fa-bell"></i>
           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        </button>
        <div className="flex items-center gap-3 ml-2 group cursor-pointer">
           <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{user.name}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase">{user.subscription} Plan</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 overflow-hidden shadow-sm">
              <img src="https://picsum.photos/seed/agriuser/100" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
