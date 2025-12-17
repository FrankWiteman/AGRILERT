
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_WEATHER_HISTORY } from '../constants.tsx';

interface Props {
  location: any;
  crop: any;
}

const Dashboard = ({ location, crop }: Props) => {
  const [accuracyFeedback, setAccuracyFeedback] = useState<boolean | null>(null);
  const [showSpecialist, setShowSpecialist] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Farm Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-emerald-500"></i> {location.name} • {crop.name} ({crop.selectedVariety.name})
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
           <div className="px-4 py-1 text-center border-r border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase">Soil Health</p>
             <p className="text-lg font-black text-emerald-600">88%</p>
           </div>
           <div className="px-4 py-1 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase">Nowcast</p>
             <p className="text-lg font-black text-amber-500">Cloudy</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Weather Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">CML Signal Rainfall (24h)</h3>
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                   <i className="fa-solid fa-cloud-rain"></i>
                 </div>
              </div>
           </div>
           <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={MOCK_WEATHER_HISTORY}>
                 <defs>
                   <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="time" hide />
                 <Tooltip />
                 <Area type="monotone" dataKey="rainfall" stroke="#10b981" fillOpacity={1} fill="url(#colorRain)" strokeWidth={4} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Prediction Accuracy Widget */}
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <i className="fa-solid fa-radar text-[120px]"></i>
           </div>
           <div className="relative z-10">
              <h3 className="text-2xl font-black leading-tight mb-4">Are our predictions matching your field reality?</h3>
              <div className="flex gap-4">
                 <button 
                  onClick={() => setAccuracyFeedback(true)}
                  className={`flex-1 py-4 rounded-2xl font-black transition-all ${accuracyFeedback === true ? 'bg-emerald-500 text-white shadow-[0_0_20px_#10b981]' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                 >
                    <i className="fa-solid fa-thumbs-up mr-2"></i> YES
                 </button>
                 <button 
                  onClick={() => { setAccuracyFeedback(false); setShowSpecialist(true); }}
                  className={`flex-1 py-4 rounded-2xl font-black transition-all ${accuracyFeedback === false ? 'bg-rose-500 text-white shadow-[0_0_20px_#f43f5e]' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                 >
                    <i className="fa-solid fa-thumbs-down mr-2"></i> NO
                 </button>
              </div>
           </div>
           
           {showSpecialist && (
             <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in duration-500">
                <p className="text-xs text-slate-300 mb-3">Discrepancy detected. Immediate corrective actions recommended:</p>
                <div className="flex gap-2 mb-4">
                   <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded-lg">IRRIGATE (6AM)</div>
                   <div className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded-lg">MULCHING</div>
                </div>
                <button className="w-full py-3 bg-white text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-2">
                   <i className="fa-solid fa-headset"></i> SPEAK TO AGRI-SPECIALIST
                </button>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Expect Yield', value: crop.yieldPercentage + '%', icon: 'fa-chart-pie', color: 'emerald' },
          { label: 'Growth Phase', value: 'Seedling', icon: 'fa-seedling', color: 'blue' },
          { label: 'Moisture', value: '64%', icon: 'fa-droplet', color: 'cyan' },
          { label: 'Planting Window', value: '5 Days', icon: 'fa-calendar-check', color: 'amber' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
             <div className={`w-12 h-12 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 rounded-2xl flex items-center justify-center text-xl`}>
                <i className={`fa-solid ${stat.icon}`}></i>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
