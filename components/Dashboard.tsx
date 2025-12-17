
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MOCK_WEATHER_HISTORY } from '../constants.tsx';

interface Props {
  location: any;
  crop: any;
}

const Dashboard = ({ location, crop }: Props) => {
  const [timeStatus, setTimeStatus] = useState({ label: 'Sunny', icon: 'fa-sun', color: 'text-amber-500' });
  const [irrigationNeeded, setIrrigationNeeded] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour <= 6;
    if (isNight) setTimeStatus({ label: 'Clear Night', icon: 'fa-moon', color: 'text-indigo-400' });
    else setTimeStatus({ label: 'Clear Sky', icon: 'fa-sun', color: 'text-amber-500' });

    // Simulate irrigation detection logic based on humidity and phantom sensor data
    const humidity = parseInt(location?.climate?.humidity || '60');
    if (humidity < 50) setIrrigationNeeded(true);
  }, [location]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Farm Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-emerald-500"></i> {location.name} • {crop.name} ({crop.selectedVariety.name})
          </p>
        </div>
        
        <div className="flex gap-4">
           {irrigationNeeded && (
             <div className="px-6 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-2 animate-pulse">
                <i className="fa-solid fa-droplet"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Irrigation Required</span>
             </div>
           )}
           <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className="px-4 py-1 text-center border-r border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase">Soil PH</p>
                <p className="text-lg font-black text-emerald-600">{location.soil?.ph || '6.5'}</p>
              </div>
              <div className="px-4 py-1 text-center flex items-center gap-3">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Nowcast</p>
                   <p className={`text-sm font-black ${timeStatus.color}`}>{timeStatus.label}</p>
                </div>
                <i className={`fa-solid ${timeStatus.icon} ${timeStatus.color} text-xl`}></i>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Localized Forecast (Next 24h)</h3>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-black rounded-lg uppercase">MNO CML Signal</span>
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

        <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fa-solid fa-radar text-8xl"></i></div>
           <h3 className="text-2xl font-black uppercase italic leading-tight mb-4">Site Intelligence Report</h3>
           <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Humidity Index</p>
                 <p className="text-2xl font-black">{location?.climate?.humidity || '68%'}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Avg Temperature</p>
                 <p className="text-2xl font-black">{location?.climate?.temp || '30°C'}</p>
              </div>
           </div>
           <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-bold text-emerald-400">
              "Predicted moisture retention is stable. No rainfall detected via CML links in the 5km radius."
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
