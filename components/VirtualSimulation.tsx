
import React, { useState, useEffect, useRef } from 'react';
import { CropType, SimulationState } from '../types.ts';

// Realistic SVG Plant Component
const RealisticPlant: React.FC<{ growth: number, unhealthy: boolean, delay: number }> = ({ growth, unhealthy, delay }) => {
  const color = unhealthy ? '#78716c' : '#10b981';
  const leafColor = unhealthy ? '#a8a29e' : '#22c55e';
  
  return (
    <div className="relative group flex flex-col items-center transition-all duration-1000" style={{ transform: `scale(${0.3 + (growth / 100) * 0.7})`, transitionDelay: `${delay}ms` }}>
      <svg viewBox="0 0 100 120" className="w-24 h-24 drop-shadow-lg">
        <ellipse cx="50" cy="110" rx="35" ry="10" fill="#451a03" fillOpacity="0.4" />
        <path d={`M50 110 Q${50 + (unhealthy ? 10 : 0)} 60 50 ${110 - growth}`} stroke={color} strokeWidth={4 + growth/20} fill="none" strokeLinecap="round" />
        {growth > 20 && <path d="M50 90 Q20 80 15 95" fill={leafColor} />}
        {growth > 40 && <path d="M50 75 Q80 65 85 80" fill={leafColor} />}
        {growth > 80 && !unhealthy && <circle cx="50" cy={110 - growth} r="8" fill="#fbbf24" className="animate-bounce" />}
      </svg>
    </div>
  );
};

interface WeatherCell {
  id: number;
  x: number;
  y: number;
  intensity: number;
}

const VirtualSimulation: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [weatherCells, setWeatherCells] = useState<WeatherCell[]>([]);
  const [alerts, setAlerts] = useState<{id: string, msg: string}[]>([]);
  
  // Persistent simulation state
  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem('agrilert_sim_running') === 'true';
  });
  
  const [marketValue, setMarketValue] = useState(0);
  
  const [state, setState] = useState<SimulationState>(() => {
    const saved = localStorage.getItem('agrilert_sim_state');
    return saved ? JSON.parse(saved) : {
      day: 1, growth: 0, moisture: 65, pests: 2, nutrients: 100,
      cmlAttenuation: 0.15, rainfallRate: 0, isRaining: false, yieldQuality: 100, temperature: 28
    };
  });

  // Sync running state
  useEffect(() => {
    localStorage.setItem('agrilert_sim_running', isRunning.toString());
  }, [isRunning]);

  // Sync simulation data
  useEffect(() => {
    localStorage.setItem('agrilert_sim_state', JSON.stringify(state));
  }, [state]);

  // Get User Geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Fallback to Ibadan coordinates
          setUserLocation({ lat: 7.3775, lng: 3.9470 });
        }
      );
    }
  }, []);

  // Simulation Logic
  useEffect(() => {
    let interval: any;
    if (isRunning && state.growth < 100) {
      interval = setInterval(() => {
        // 1. Move/Generate Weather Cells (Simulating cloud movement)
        setWeatherCells(prev => {
          const moved = prev.map(c => ({ ...c, x: c.x + 0.5, y: c.y + Math.sin(state.day) * 0.2 }))
            .filter(c => c.x < 100);
          
          if (Math.random() > 0.95 && moved.length < 3) {
            moved.push({ id: Date.now(), x: 0, y: Math.random() * 100, intensity: 15 + Math.random() * 10 });
          }
          return moved;
        });

        // 2. Calculate Proximity to User Location (Center of grid 50,50)
        setState(prev => {
          let nearestCellDist = 100;
          let maxAttenuation = 0.1;

          weatherCells.forEach(cell => {
            const dist = Math.sqrt(Math.pow(cell.x - 50, 2) + Math.pow(cell.y - 50, 2));
            if (dist < nearestCellDist) nearestCellDist = dist;
            if (dist < 20) {
              const impact = (20 - dist) / 20 * cell.intensity;
              if (impact > maxAttenuation) maxAttenuation = impact;
            }
          });

          const isRaining = maxAttenuation > 5;
          
          if (isRaining && !prev.isRaining) {
            const id = Date.now().toString();
            setAlerts(a => [{ id, msg: `ALERT: CML detected ${maxAttenuation.toFixed(1)}dB signal drop. Precipitation imminent.` }, ...a]);
            setTimeout(() => setAlerts(a => a.filter(x => x.id !== id)), 5000);
          }

          const evaporation = prev.temperature / 150;
          const newMoisture = Math.min(100, Math.max(0, prev.moisture + (isRaining ? (maxAttenuation / 5) : -evaporation)));
          const newGrowth = Math.min(100, prev.growth + (newMoisture > 35 && newMoisture < 85 ? 0.3 : 0.05));

          return {
            ...prev,
            day: prev.day + 0.05,
            cmlAttenuation: maxAttenuation,
            isRaining,
            moisture: newMoisture,
            growth: newGrowth,
            temperature: 26 + Math.sin(prev.day * 0.5) * 5
          };
        });

        setMarketValue(Math.floor(state.growth * 1250));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, weatherCells, state.day]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-emerald-900 p-4 rounded-[2rem] flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center animate-pulse">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-300 tracking-widest">Farm Anchor Point</p>
            <p className="text-sm font-bold">
              {userLocation ? `${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E` : 'GPS Locking...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pr-4">
           <span className={`w-2 h-2 rounded-full animate-ping ${isRunning ? 'bg-green-400' : 'bg-amber-400'}`}></span>
           <span className="text-[10px] font-black uppercase tracking-widest">
             {isRunning ? 'Simulation Running' : 'Engine Standby'}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2 relative h-[500px] bg-slate-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] h-[80%] border border-emerald-500/20 rounded-full"></div>
            <div className="w-[50%] h-[50%] border border-emerald-500/20 rounded-full"></div>
            <div className="absolute w-full h-px bg-emerald-500/10"></div>
            <div className="absolute h-full w-px bg-emerald-500/10"></div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
             <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_#10b981] animate-ping"></div>
          </div>

          {weatherCells.map(cell => (
            <div 
              key={cell.id}
              className="absolute w-24 h-24 bg-blue-500/20 rounded-full blur-2xl transition-all duration-500"
              style={{ left: `${cell.x}%`, top: `${cell.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-pulse"></div>
            </div>
          ))}

          <div className="absolute inset-0 animate-[spin_4s_linear_infinite] pointer-events-none origin-center" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(16, 185, 129, 0.05) 30deg, transparent 60deg)' }}></div>

          <div className="absolute bottom-6 left-6 z-40 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">CML Radar Status</h4>
            <p className="text-white text-xs font-bold">{state.isRaining ? 'PRECIPITATION DETECTED' : 'CLEAR SKY'}</p>
          </div>
        </div>

        <div className="xl:col-span-2 relative h-[500px] bg-emerald-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden flex items-end justify-center pb-12 gap-6">
          <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${state.isRaining ? 'opacity-100' : 'opacity-0'}`}>
             <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px]"></div>
             <div className="absolute inset-0 opacity-30 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          </div>
          
          {[...Array(4)].map((_, i) => (
            <RealisticPlant key={i} growth={state.growth} unhealthy={state.moisture < 25} delay={i * 100} />
          ))}

          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 z-40">
             <button 
               onClick={() => setIsRunning(!isRunning)}
               className={`h-12 px-6 rounded-2xl font-black text-xs tracking-widest transition-all shadow-xl flex items-center gap-3
                ${isRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white shadow-emerald-500/40'}
               `}
             >
               <i className={`fa-solid ${isRunning ? 'fa-pause' : 'fa-play'}`}></i>
               {isRunning ? 'PAUSE ENGINE' : 'RESUME ENGINE'}
             </button>
             <button onClick={() => setState(p => ({ ...p, moisture: Math.min(100, p.moisture + 20) }))} className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"><i className="fa-solid fa-droplet"></i></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soil Moisture</p>
             <p className="text-2xl font-black text-slate-900">{Math.floor(state.moisture)}%</p>
           </div>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${state.moisture > 35 ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
             <i className="fa-solid fa-water"></i>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Crop Maturity</p>
             <p className="text-2xl font-black text-slate-900">{Math.floor(state.growth)}%</p>
           </div>
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
             <i className="fa-solid fa-seedling"></i>
           </div>
        </div>
        <div className="bg-emerald-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20 flex items-center justify-between">
           <div>
             <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">Yield Potential</p>
             <p className="text-2xl font-black">₦{marketValue.toLocaleString()}</p>
           </div>
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
             <i className="fa-solid fa-naira-sign"></i>
           </div>
        </div>
      </div>

      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-rose-600 text-white p-4 rounded-2xl shadow-2xl border-l-8 border-rose-400 flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 w-80 pointer-events-auto">
            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            <p className="text-xs font-bold leading-tight">{alert.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualSimulation;
