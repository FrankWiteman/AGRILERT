
import React, { useState } from 'react';

interface Props {
  user: any;
  setUser: (u: any) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

const Profile: React.FC<Props> = ({ user, setUser, isDarkMode, setIsDarkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'billing' | 'security'>('info');
  const [isBiometricActive, setIsBiometricActive] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-36 h-36 rounded-[3.5rem] bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-5xl text-emerald-600 border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left flex-1">
               <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{user.name}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                  <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">{user.subscription} PLAN</span>
                  <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest italic">Member since {user.joined}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm max-w-fit mx-auto">
         {['info', 'billing', 'security'].map((tab: any) => (
           <button 
            key={tab} onClick={() => setActiveSubTab(tab)}
            className={`px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-emerald-500 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
           >
              {tab}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
         {activeSubTab === 'info' && (
           <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Full Name</label>
                    <input 
                      type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] outline-none ring-4 ring-transparent focus:ring-emerald-500/10 transition-all font-bold text-lg dark:text-white"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Farm Region</label>
                    <input 
                      type="text" value={user.address} onChange={(e) => setUser({...user, address: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] outline-none ring-4 ring-transparent focus:ring-emerald-500/10 transition-all font-bold text-lg dark:text-white"
                    />
                 </div>
              </div>
              <div className="pt-10 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-[3rem]">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-emerald-500 shadow-sm transition-transform hover:rotate-12">
                       <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-2xl`}></i>
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Night Mode</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isDarkMode ? 'Enabled' : 'Disabled'}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-16 h-9 rounded-full transition-colors relative ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-all shadow-md ${isDarkMode ? 'left-8' : 'left-1'}`}></div>
                 </button>
              </div>
           </div>
         )}

         {activeSubTab === 'billing' && (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 animate-in fade-in">
               <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 bg-emerald-950 p-10 rounded-[3.5rem] text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10"><i className="fa-solid fa-credit-card text-8xl"></i></div>
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-10 italic">Default Payment</p>
                     <p className="text-2xl font-black mb-1 font-mono tracking-widest">**** **** **** 4242</p>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Exp 12/26</p>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-10 rounded-[3.5rem] flex flex-col justify-between">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subscription Tier</p>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{user.subscription} PLAN</h4>
                     </div>
                     <button className="w-full py-5 bg-emerald-500 text-white font-black rounded-[1.5rem] mt-8 uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">Manage License</button>
                  </div>
               </div>
            </div>
         )}

         {activeSubTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 animate-in fade-in">
               <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border border-transparent hover:border-emerald-500/20 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-[1.75rem] flex items-center justify-center text-blue-600 text-2xl"><i className="fa-solid fa-fingerprint"></i></div>
                     <div>
                        <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Biometric Authentication</p>
                        <p className="text-xs text-slate-400 font-bold italic">Secure entry using FaceID or TouchID</p>
                     </div>
                  </div>
                  <button onClick={() => setIsBiometricActive(!isBiometricActive)} className={`w-16 h-9 rounded-full transition-colors relative ${isBiometricActive ? 'bg-blue-500' : 'bg-slate-300'}`}>
                     <div className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-all shadow-md ${isBiometricActive ? 'left-8' : 'left-1'}`}></div>
                  </button>
               </div>
               <div className="p-8 bg-rose-500/5 rounded-[3rem] border border-rose-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950 rounded-[1.75rem] flex items-center justify-center text-rose-600 text-2xl"><i className="fa-solid fa-key"></i></div>
                     <p className="text-lg font-black text-rose-600 uppercase tracking-tighter">Reset Security PIN</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-rose-300"></i>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default Profile;
