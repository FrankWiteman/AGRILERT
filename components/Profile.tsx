
import React, { useState } from 'react';

interface Props {
  user: any;
  setUser: (u: any) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

const Profile: React.FC<Props> = ({ user, setUser, isDarkMode, setIsDarkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'payment' | 'security'>('info');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-[3rem] bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-5xl text-emerald-600 overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left flex-1">
               <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{user.name}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">{user.subscription} STATUS</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Farmer since {user.joined}</span>
               </div>
            </div>
            <button className="px-8 py-3 bg-slate-900 text-white dark:bg-emerald-500 dark:text-emerald-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform">
               UPGRADE PRO
            </button>
         </div>
      </div>

      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-fit mx-auto overflow-hidden">
         {['info', 'payment', 'security'].map((tab: any) => (
           <button 
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
           >
              {tab}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
         {activeSubTab === 'info' && (
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 animate-in fade-in">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                    <input 
                      type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border-none outline-none focus:ring-2 ring-emerald-500 transition-all font-bold text-slate-700 dark:text-white"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Farm Address</label>
                    <input 
                      type="text" value={user.address} onChange={(e) => setUser({...user, address: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border-none outline-none focus:ring-2 ring-emerald-500 transition-all font-bold text-slate-700 dark:text-white"
                    />
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem]">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                        <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-xl`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">Appearance</p>
                        <p className="text-xs text-slate-400 font-bold uppercase">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
                   >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                   </button>
                </div>
              </div>
           </div>
         )}

         {activeSubTab === 'payment' && (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 animate-in fade-in">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Billing & Subscription</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-950 p-8 rounded-[3rem] text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-credit-card text-7xl"></i>
                     </div>
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Payment Method</p>
                     <p className="text-xl font-black mb-1">**** **** **** 4242</p>
                     <p className="text-xs font-bold text-emerald-600">Active - Default</p>
                     <button className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase transition-all">Update Card</button>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-[3rem] flex flex-col justify-between">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Tier</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{user.subscription} Hub Access</p>
                     </div>
                     <button className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg mt-4">Change Plan</button>
                  </div>
               </div>
            </div>
         )}

         {activeSubTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 animate-in fade-in">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Privacy & Security</h3>
               <div className="space-y-4">
                  {[
                    { title: 'Biometric Access', desc: 'Secure app with FaceID or Fingerprint', icon: 'fa-fingerprint', color: 'blue' },
                    { title: 'Two-Factor Auth', desc: 'Add extra layer of verification', icon: 'fa-shield-halved', color: 'emerald' },
                    { title: 'Data Privacy', desc: 'Control your farm telemetry visibility', icon: 'fa-eye-slash', color: 'amber' },
                  ].map(item => (
                    <div key={item.title} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] group hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-${item.color}-50 dark:bg-${item.color}-950/40 text-${item.color}-600 dark:text-${item.color}-400 rounded-2xl flex items-center justify-center text-xl`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-xs text-slate-400 font-bold">{item.desc}</p>
                          </div>
                       </div>
                       <i className="fa-solid fa-chevron-right text-slate-300"></i>
                    </div>
                  ))}
               </div>
            </div>
         )}
      </div>

      <div className="flex justify-center pt-8">
         <button className="flex items-center gap-3 px-8 py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
            <i className="fa-solid fa-right-from-bracket"></i> Logout of Hub
         </button>
      </div>
    </div>
  );
};

export default Profile;
