
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
  const [isProUpgradePending, setIsProUpgradePending] = useState(false);

  const handleUpgrade = () => {
    setIsProUpgradePending(true);
    setTimeout(() => {
      setUser({ ...user, subscription: 'Cultivator Pro' });
      setIsProUpgradePending(false);
      alert("Successfully upgraded to Cultivator Pro! Premium modules and expert directory unlocked.");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><i className="fa-solid fa-user-gear text-[10rem]"></i></div>
         <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-44 h-44 rounded-[4rem] bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-6xl text-emerald-600 border-8 border-white dark:border-slate-800 shadow-3xl overflow-hidden group/avatar">
               <img 
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                 alt="Avatar" 
                 className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" 
               />
            </div>
            <div className="text-center md:text-left flex-1 space-y-3">
               <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{user.name}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${user.subscription === 'Free' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
                    {user.subscription} License
                  </span>
                  <span className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest italic">Hub Member since {user.joined}</span>
               </div>
            </div>
            {user.subscription === 'Free' && (
              <button 
                onClick={handleUpgrade}
                disabled={isProUpgradePending}
                className="px-10 py-5 bg-emerald-500 text-slate-950 font-black rounded-3xl text-xs uppercase tracking-tighter shadow-3xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProUpgradePending ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : null}
                {isProUpgradePending ? 'Processing Payment...' : 'Go Cultivator Pro'}
              </button>
            )}
         </div>
      </div>

      <div className="flex bg-white dark:bg-slate-900 p-3 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm max-w-fit mx-auto transition-all">
         {['info', 'billing', 'security'].map((tab: any) => (
           <button 
            key={tab} onClick={() => setActiveSubTab(tab)}
            className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-emerald-500 text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
           >
              {tab === 'info' ? 'Field Data' : tab}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
         {activeSubTab === 'info' && (
           <div className="bg-white dark:bg-slate-900 p-14 rounded-[6rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-12 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-6 tracking-widest italic">Farmer Signature</label>
                    <input 
                      type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[3rem] outline-none ring-8 ring-transparent focus:ring-emerald-500/5 transition-all font-black text-xl italic dark:text-white placeholder:text-slate-300"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-6 tracking-widest italic">Default Farm Node</label>
                    <input 
                      type="text" value={user.address} onChange={(e) => setUser({...user, address: e.target.value})}
                      placeholder="e.g. Oyo North, Nigeria"
                      className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[3rem] outline-none ring-8 ring-transparent focus:ring-emerald-500/5 transition-all font-black text-xl italic dark:text-white placeholder:text-slate-300"
                    />
                 </div>
              </div>
              <div className="pt-12 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[4rem]">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-xl transition-transform hover:rotate-12 border border-slate-100 dark:border-white/5">
                       <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-3xl`}></i>
                    </div>
                    <div>
                       <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Night Mode</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{isDarkMode ? 'Vision Optimized' : 'High Visibility'}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    if ('vibrate' in navigator) navigator.vibrate(50);
                  }} 
                  className={`w-20 h-10 rounded-full transition-colors relative shadow-inner ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
                 >
                    <div className={`absolute top-1.5 w-7 h-7 bg-white rounded-full transition-all shadow-3xl ${isDarkMode ? 'left-11' : 'left-1.5'}`}></div>
                 </button>
              </div>
           </div>
         )}

         {activeSubTab === 'billing' && (
            <div className="bg-white dark:bg-slate-900 p-14 rounded-[6rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-12 animate-in fade-in duration-700">
               <div className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-1 bg-emerald-950 p-12 rounded-[4.5rem] text-white relative overflow-hidden group shadow-4xl">
                     <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform"><i className="fa-solid fa-credit-card text-[9rem]"></i></div>
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-12 italic">Primary Payment Anchor</p>
                     <p className="text-3xl font-black mb-1 font-mono tracking-[0.2em]">**** **** **** 4242</p>
                     <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest italic">Secured • Exp 12/26</p>
                     <button className="mt-12 px-10 py-4 bg-white/10 hover:bg-white/20 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all">Update Card Details</button>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-12 rounded-[4.5rem] flex flex-col justify-between shadow-inner">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Active License Tier</p>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">{user.subscription}</h4>
                        <p className="text-xs font-bold text-slate-400 mt-4 leading-relaxed italic">Your CML analytics and precision alerts are currently linked to this proyect ID.</p>
                     </div>
                     <button 
                        onClick={() => alert("Simulation: Directing to MNO Gateway for plan modification...")}
                        className="w-full py-6 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-black rounded-3xl mt-12 uppercase tracking-tighter text-sm shadow-3xl hover:scale-105 active:scale-95 transition-all"
                     >
                       Scale Hub Resources
                     </button>
                  </div>
               </div>
               <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[3rem] border border-slate-100 dark:border-white/5">
                 <h5 className="text-[10px] font-black uppercase tracking-widest mb-4 text-slate-400 italic">Historical Transactions</h5>
                 <div className="space-y-4">
                    {[
                      { item: 'License Renewal', date: 'Oct 24, 2024', status: 'Success', val: '₦5,000' },
                      { item: 'Precision SMS Alert Hub', date: 'Sep 12, 2024', status: 'Success', val: '₦1,200' }
                    ].map((tx, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-bold">
                         <div>
                            <p className="dark:text-white">{tx.item}</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase">{tx.date}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-emerald-500">{tx.val}</p>
                            <p className="text-[8px] uppercase tracking-widest text-slate-500">{tx.status}</p>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
         )}

         {activeSubTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 p-14 rounded-[6rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 animate-in fade-in duration-700">
               <div 
                 onClick={() => setIsBiometricActive(!isBiometricActive)}
                 className="flex items-center justify-between p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[4rem] border border-transparent hover:border-emerald-500/20 transition-all cursor-pointer group shadow-inner"
               >
                  <div className="flex items-center gap-8">
                     <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-3xl transition-all shadow-2xl ${isBiometricActive ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                       <i className="fa-solid fa-fingerprint"></i>
                     </div>
                     <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Biometric Secure-Entry</p>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-2 italic">FaceID / TouchID Telemetry Authentication</p>
                     </div>
                  </div>
                  <div className={`w-20 h-10 rounded-full transition-colors relative shadow-inner ${isBiometricActive ? 'bg-blue-500' : 'bg-slate-300'}`}>
                     <div className={`absolute top-1.5 w-7 h-7 bg-white rounded-full transition-all shadow-3xl ${isBiometricActive ? 'left-11' : 'left-1.5'}`}></div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div 
                    className="p-10 bg-rose-500/5 rounded-[4rem] border border-rose-500/10 flex items-center justify-between hover:bg-rose-500/10 transition-all cursor-pointer group"
                    onClick={() => alert("Simulation: Verification email sent for Hub PIN reset.")}
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950 rounded-[1.75rem] flex items-center justify-center text-rose-600 text-2xl group-hover:rotate-12 transition-transform"><i className="fa-solid fa-key-skeleton"></i></div>
                        <p className="text-lg font-black text-rose-600 uppercase tracking-tighter italic leading-none">Reset Hub PIN</p>
                     </div>
                     <i className="fa-solid fa-chevron-right text-rose-300"></i>
                  </div>
                  
                  <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[4rem] border border-slate-100 dark:border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition-all cursor-pointer group">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[1.75rem] flex items-center justify-center text-slate-400 text-2xl group-hover:rotate-12 transition-transform shadow-sm"><i className="fa-solid fa-shield-halved"></i></div>
                        <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Login History</p>
                     </div>
                     <i className="fa-solid fa-chevron-right text-slate-300"></i>
                  </div>
               </div>
               
               <div className="p-8 bg-amber-500/5 rounded-[3rem] border border-amber-500/10 flex items-center gap-6">
                 <i className="fa-solid fa-triangle-exclamation text-amber-500 text-2xl"></i>
                 <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-relaxed">System Note: Precision field data is encrypted with AES-256. Coordinate-locking prevents unauthorized MNO telemetry access.</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default Profile;
