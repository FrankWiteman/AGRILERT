
import React from 'react';

interface Props {
  user: any;
  setUser: (u: any) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

const Profile: React.FC<Props> = ({ user, setUser, isDarkMode, setIsDarkMode }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-8 bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-10">
            <i className="fa-solid fa-user-gear text-[150px]"></i>
         </div>
         <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-5xl text-emerald-600 overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
            <img src="https://picsum.photos/seed/agriuser/200" alt="Avatar" className="w-full h-full object-cover" />
         </div>
         <div className="relative z-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{user.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
               <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-md">{user.subscription} PLAN</span>
               Verified Farmer since 2024
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Personal Details</h3>
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                  <input 
                    type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-emerald-500 transition-all font-bold"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Farm Address</label>
                  <input 
                    type="text" value={user.address} placeholder="Plot 14, Oyo North..."
                    onChange={(e) => setUser({...user, address: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-emerald-500 transition-all font-bold"
                  />
               </div>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">App Settings</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-moon text-indigo-400"></i>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Dark Mode</span>
                  </div>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                  </button>
               </div>

               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Biometric Lock</span>
                  </div>
                  <button className="w-14 h-8 rounded-full bg-slate-300 relative">
                     <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"></div>
                  </button>
               </div>
            </div>

            <div className="pt-4">
               <button className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20">
                  LOGOUT OF HUB
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
