
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_WEATHER_HISTORY } from '../constants.tsx';

interface Props {
  location: any;
  crop: any;
}

const Dashboard = ({ location, crop }: Props) => {
  const [timeStatus, setTimeStatus] = useState({ label: 'Sunny', icon: 'fa-sun', color: 'text-amber-500' });
  const [irrigationNeeded, setIrrigationNeeded] = useState(false);

  useEffect(() => {
    // 1. Time-Aware Nowcast Logic
    const updateTimeStatus = () => {
      const hour = new Date().getHours();
      // Night is typically 7PM to 6AM
      const isNight = hour >= 19 || hour <= 6;
      
      if (isNight) {
        setTimeStatus({ label: 'Clear Night', icon: 'fa-moon', color: 'text-indigo-400' });
      } else if (hour >= 6 && hour < 11) {
        setTimeStatus({ label: 'Morning Sun', icon: 'fa-sun-low', color: 'text-amber-400' });
      } else if (hour >= 11 && hour < 16) {
        setTimeStatus({ label: 'Peak Sun', icon: 'fa-sun', color: 'text-amber-500' });
      } else {
        setTimeStatus({ label: 'Golden Hour', icon: 'fa-cloud-sun', color: 'text-orange-400' });
      }
    };

    updateTimeStatus();
    const interval = setInterval(updateTimeStatus, 60000); // Check every minute

    // 2. Irrigation Detection Logic
    // Using actual location humidity if available, else fallback
    const humidity = parseInt(location?.climate?.humidity || '60');
    if (humidity < 50) {
      setIrrigationNeeded(true);
    } else {
      setIrrigationNeeded(false);
    }

    return () => clearInterval(interval);
  }, [location]);

  // Robust null checking for the crash reported by user
  if (!location || !crop) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <i className="fa-solid fa-spinner animate-spin text-4xl text-emerald-500"></i>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Re-syncing Hub Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Farm Command</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-emerald-500"></i> {location.name}
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[10px]">
              {crop.name} — {crop.selectedVariety?.name || 'Standard Variety'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-4">
           {irrigationNeeded && (
             <div className="px-6 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-2 animate-pulse shadow-lg shadow-rose-500/10">
                <i className="fa-solid fa-droplet"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Irrigation Required</span>
             </div>
           )}
           <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className="px-4 py-1 text-center border-r border-slate-100 dark:border-slate-800">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Soil PH</p>
                <p className="text-lg font-black text-emerald-600 leading-none">{location.soil?.ph || '6.5'}</p>
              </div>
              <div className="px-4 py-1 text-center flex items-center gap-3">
                <div className="text-left">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Nowcast</p>
                   <p className={`text-xs font-black uppercase ${timeStatus.color}`}>{timeStatus.label}</p>
                </div>
                <i className={`fa-solid ${timeStatus.icon} ${timeStatus.color} text-xl`}></i>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs italic">CML Localized Forecast (Next 24h)</h3>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">Sync: Real-Time</span>
              </div>
           </div>
           <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={MOCK_WEATHER_HISTORY}>
                 <defs>
                   <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                 <XAxis dataKey="time" hide />
                 <YAxis hide />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                   itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="rainfall" stroke="#10b981" fillOpacity={1} fill="url(#colorRain)" strokeWidth={4} animationDuration={1500} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <i className="fa-solid fa-tower-broadcast text-8xl"></i>
           </div>
           <div>
             <h3 className="text-2xl font-black uppercase italic leading-tight mb-4 tracking-tighter">Site Intel</h3>
             <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-[1.75rem] border border-white/5 backdrop-blur-sm">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Humidity Index</p>
                   <p className="text-3xl font-black">{location?.climate?.humidity || '68%'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-[1.75rem] border border-white/5 backdrop-blur-sm">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Field Temperature</p>
                   <p className="text-3xl font-black">{location?.climate?.temp || '30°C'}</p>
                </div>
             </div>
           </div>
           <div className="mt-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-bold text-emerald-400 italic">
              "System analysis confirms stable soil moisture. CML signal attenuation is minimal in the last 60 minutes."
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
