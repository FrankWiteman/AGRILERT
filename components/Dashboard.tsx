
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MOCK_WEATHER_HISTORY } from '../constants.tsx';

interface Props {
  location: any;
  crop: any;
}

const Dashboard = ({ location, crop }: Props) => {
  const [predictionStep, setPredictionStep] = useState<'ask' | 'corrective' | 'done'>('ask');
  const [accuracyAnswer, setAccuracyAnswer] = useState<boolean | null>(null);

  // Simulated 5-year historical rain data
  const historicalData = [
    { year: '2020', rain: 1200 },
    { year: '2021', rain: 1150 },
    { year: '2022', rain: 1400 },
    { year: '2023', rain: 1250 },
    { year: '2024 (Est)', rain: 1320 },
  ];

  const handleAccuracy = (isAccurate: boolean) => {
    setAccuracyAnswer(isAccurate);
    if (!isAccurate) {
      setPredictionStep('corrective');
    } else {
      setPredictionStep('done');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Farm Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-emerald-500"></i> {location.name} • {crop.name} ({crop.selectedVariety.name})
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
           <div className="px-4 py-1 text-center border-r border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase">Soil PH</p>
             <p className="text-lg font-black text-emerald-600">{location.soil?.ph || '6.5'}</p>
           </div>
           <div className="px-4 py-1 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase">Nowcast</p>
             <p className="text-lg font-black text-amber-500">Sunny</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Nowcast / Forecast */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Localized Forecast (Next 24h)</h3>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-black rounded-lg">LIVE CML DATA</span>
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

        {/* Prediction Accuracy Loop */}
        <div className={`p-8 rounded-[3rem] flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-500 ${predictionStep === 'corrective' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
           {predictionStep === 'ask' && (
             <div className="space-y-6">
               <h3 className="text-2xl font-black leading-tight">How far with the predictions?</h3>
               <p className="text-slate-400 text-sm font-medium">Is the actual weather in your field matching our forecast?</p>
               <div className="flex gap-3">
                  <button 
                    onClick={() => handleAccuracy(true)}
                    className="flex-1 py-4 bg-white/10 hover:bg-emerald-500 hover:text-white transition-all rounded-2xl font-black flex flex-col items-center gap-2"
                  >
                    <i className="fa-solid fa-thumbs-up text-xl"></i> YES
                  </button>
                  <button 
                    onClick={() => handleAccuracy(false)}
                    className="flex-1 py-4 bg-white/10 hover:bg-rose-500 hover:text-white transition-all rounded-2xl font-black flex flex-col items-center gap-2"
                  >
                    <i className="fa-solid fa-thumbs-down text-xl"></i> NO
                  </button>
               </div>
             </div>
           )}

           {predictionStep === 'corrective' && (
             <div className="space-y-6 animate-in zoom-in-95">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
                   <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 className="text-2xl font-black leading-tight">Corrective Strategy</h3>
                <p className="text-white/80 text-sm">Calibration error detected. Based on your report, we recommend immediate remediation:</p>
                <div className="space-y-2">
                   <div className="p-3 bg-white/10 rounded-xl border border-white/20 flex items-center gap-3">
                      <i className="fa-solid fa-vial"></i> <span className="text-xs font-bold">Add High-Nitrogen Manure</span>
                   </div>
                   <div className="p-3 bg-white/10 rounded-xl border border-white/20 flex items-center gap-3">
                      <i className="fa-solid fa-droplet"></i> <span className="text-xs font-bold">Supplemental Irrigation</span>
                   </div>
                </div>
                <button className="w-full py-4 bg-white text-rose-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                   SPEAK TO SPECIALIST
                </button>
             </div>
           )}

           {predictionStep === 'done' && (
             <div className="text-center py-12 space-y-4 animate-in fade-in">
                <i className="fa-solid fa-circle-check text-6xl text-emerald-500"></i>
                <h3 className="text-2xl font-black uppercase">Sync Complete</h3>
                <p className="text-slate-400 text-sm">Field data confirmed. Predictions optimized for {crop.name}.</p>
                <button onClick={() => setPredictionStep('ask')} className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Recalibrate</button>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Historical View */}
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] mb-6">5-Year Rain Distribution</h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" hide />
                    <Bar dataKey="rain" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <p className="mt-4 text-[11px] font-medium text-slate-500 leading-relaxed">Historical trends show your region is entering a decadal moist cycle. Expect +15% rainfall for the current season.</p>
         </div>

         {/* Soil Info */}
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Soil Profile</h3>
            <div className="space-y-4 py-4">
               <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Nitrogen</span>
                  <span className="text-emerald-600 uppercase">Optimal</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[75%]"></div>
               </div>
               <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Phosphorus</span>
                  <span className="text-amber-600 uppercase">Moderate</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[45%]"></div>
               </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/10">
               <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold italic">"Recommended: Top-dress with urea in 14 days."</p>
            </div>
         </div>

         {/* Yield Estimate Widget */}
         <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="font-black uppercase tracking-widest text-[10px] text-emerald-200 mb-6">Estimated Market Yield</h3>
               <p className="text-4xl font-black mb-2">₦94,200</p>
               <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Based on current commodity rates</p>
               <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                     <span>Seed Potential</span>
                     <span>{crop.yieldPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white" style={{ width: `${crop.yieldPercentage}%` }}></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
