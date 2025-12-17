
import React, { useState, useEffect, useRef } from 'react';
import { CropType, SimulationState } from '../types.ts';

// Realistic SVG Plant Component with 4 stages and health variants
const RealisticPlant: React.FC<{ growth: number, unhealthy: boolean, delay: number }> = ({ growth, unhealthy, delay }) => {
  const isDead = unhealthy && growth > 50;
  const color = unhealthy ? '#78716c' : '#10b981';
  const leafColor = unhealthy ? '#a8a29e' : '#22c55e';
  
  return (
    <div className="relative group flex flex-col items-center transition-all duration-1000" style={{ transform: `scale(${0.4 + (growth / 100) * 0.6})`, transitionDelay: `${delay}ms` }}>
      <svg viewBox="0 0 100 120" className="w-32 h-32 drop-shadow-lg">
        {/* Soil Base */}
        <ellipse cx="50" cy="110" rx="35" ry="10" fill="#451a03" fillOpacity="0.4" />
        
        {/* Main Stem */}
        <path 
          d={`M50 110 Q${50 + (unhealthy ? 10 : 0)} 60 50 ${110 - growth}`} 
          stroke={color} 
          strokeWidth={4 + growth/20} 
          fill="none" 
          strokeLinecap="round" 
        />

        {/* Dynamic Leaves based on growth stage */}
        {growth > 20 && (
          <path d="M50 90 Q20 80 15 95" fill={leafColor} className="animate-pulse" />
        )}
        {growth > 40 && (
          <path d="M50 75 Q80 65 85 80" fill={leafColor} />
        )}
        {growth > 60 && (
          <path d="M50 55 Q20 45 15 60" fill={leafColor} />
        )}
        
        {/* Fruiting Body */}
        {growth > 80 && !unhealthy && (
          <circle cx="50" cy={110 - growth} r="8" fill="#fbbf24" className="animate-bounce" />
        )}
      </svg>
      
      {/* Plant Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        Health: {unhealthy ? 'Poor' : 'Optimal'} • {Math.floor(growth)}% Mature
      </div>
    </div>
  );
};

const VirtualSimulation: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    day: 1,
    growth: 0,
    moisture: 65,
    pests: 2,
    nutrients: 100,
    cmlAttenuation: 0.15,
    rainfallRate: 0,
    isRaining: false,
    yieldQuality: 100,
    temperature: 28
  });

  const [isRunning, setIsRunning] = useState(false);
  const [telemetry, setTelemetry] = useState<string[]>(["SYSTEM READY. STANDBY FOR LINK..."]);
  const [marketValue, setMarketValue] = useState(0);

  // Logic Loop
  useEffect(() => {
    let interval: any;
    if (isRunning && state.growth < 100) {
      interval = setInterval(() => {
        setState(prev => {
          // Simulate the CML Physics (Random signal drop detection)
          const isFading = Math.random() > 0.96;
          const newAttenuation = isFading ? 15 + Math.random() * 5 : Math.max(0.1, prev.cmlAttenuation + (Math.random() - 0.5) * 0.2);
          const isRaining = newAttenuation > 10;
          const rainIntensity = isRaining ? (newAttenuation - 10) * 1.5 : 0;

          // Soil & Crop Physics
          const evaporation = prev.temperature / 150;
          const newMoisture = Math.min(100, Math.max(0, prev.moisture + (isRaining ? rainIntensity : -evaporation)));
          const nutrientUsage = (prev.growth / 1500);
          const newNutrients = Math.max(0, prev.nutrients - nutrientUsage);
          
          const growthCondition = newMoisture > 35 && newMoisture < 85 && newNutrients > 5;
          const newGrowth = Math.min(100, prev.growth + (growthCondition ? 0.4 : 0.05));
          
          // Economic calculation
          setMarketValue(Math.floor(newGrowth * 1250 * (prev.yieldQuality / 100)));

          return {
            ...prev,
            day: prev.day + 0.05,
            cmlAttenuation: newAttenuation,
            isRaining,
            rainfallRate: rainIntensity,
            moisture: newMoisture,
            nutrients: newNutrients,
            growth: newGrowth,
            temperature: 26 + Math.sin(prev.day * 0.5) * 5 // Daily temp cycle
          };
        });

        // Add to Telemetry Log
        if (Math.random() > 0.7) {
          const timestamp = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
          const packet = isRunning ? `PACKET_RCVD: ATTEN_${state.cmlAttenuation.toFixed(2)}dB_SYNC` : `IDLE_SYNC`;
          setTelemetry(prev => [packet, ...prev.slice(0, 10)]);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, state.growth, state.cmlAttenuation]);

  const handleAction = (action: string) => {
    if (action === 'irrigate') setState(p => ({ ...p, moisture: Math.min(100, p.moisture + 20) }));
    if (action === 'fertilize') setState(p => ({ ...p, nutrients: 100 }));
    if (action === 'reset') {
      setState({
        day: 1, growth: 0, moisture: 65, pests: 2, nutrients: 100,
        cmlAttenuation: 0.15, rainfallRate: 0, isRaining: false, yieldQuality: 100, temperature: 28
      });
      setIsRunning(false);
      setTelemetry(["ENGINE RESET. WAITING..."]);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Simulation Engine Viewport */}
      <div className="xl:col-span-3 flex flex-col gap-6">
        <div className="relative h-[650px] bg-slate-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden group">
          
          {/* Weather Effects Layers */}
          <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${state.isRaining ? 'opacity-100' : 'opacity-0'}`}>
             <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px]"></div>
             <div className="absolute inset-0 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          </div>
          
          {/* Environment/Sky */}
          <div className={`absolute inset-0 transition-colors duration-[3000ms] ${state.isRaining ? 'bg-slate-800' : (state.temperature > 30 ? 'bg-orange-400' : 'bg-sky-400')}`}>
             <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>

          {/* Perspective Ground Grid */}
          <div className="absolute bottom-0 w-full h-1/2 bg-emerald-950/40" style={{ transform: 'perspective(500px) rotateX(45deg)', transformOrigin: 'bottom' }}>
            <div className="w-full h-full border-t border-white/10 grid grid-cols-12">
               {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white/5 h-full"></div>)}
            </div>
          </div>

          {/* Top HUD Console */}
          <div className="relative z-30 p-8 flex justify-between items-start">
            <div className="flex flex-col gap-3">
               <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex items-center gap-6">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Environment</span>
                    <span className="text-2xl font-black text-white">{state.temperature.toFixed(1)}°C</span>
                 </div>
                 <div className="w-px h-10 bg-white/10"></div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Soil Moisture</span>
                    <span className={`text-2xl font-black ${state.moisture < 30 ? 'text-rose-400' : 'text-white'}`}>{Math.floor(state.moisture)}%</span>
                 </div>
               </div>
               
               {/* Live CML Radar Visual */}
               <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-3xl w-48 overflow-hidden">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400">CML NODE IB-42</span>
                    <span className={`w-2 h-2 rounded-full ${state.isRaining ? 'bg-blue-400 animate-ping' : 'bg-emerald-400'}`}></span>
                  </div>
                  <div className="h-8 flex items-end gap-1">
                    {[...Array(15)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-full rounded-t-sm transition-all duration-300 ${state.isRaining ? 'bg-blue-500' : 'bg-emerald-500'}`}
                        style={{ height: `${Math.random() * (state.isRaining ? 100 : 40) + 10}%` }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-[9px] font-mono text-slate-500 mt-2">LINK_LOSS: {state.cmlAttenuation.toFixed(2)}dB</p>
               </div>
            </div>

            <div className="flex flex-col items-end gap-3">
               <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black shadow-2xl shadow-emerald-500/20">
                  ₦ {marketValue.toLocaleString()} <span className="text-[10px] opacity-70">EST. YIELD VALUE</span>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Season Clock</p>
                  <p className="text-xl font-black text-white">Day {Math.floor(state.day)}</p>
               </div>
            </div>
          </div>

          {/* Farm Bed - Perspective View */}
          <div className="absolute inset-0 flex items-end justify-center pb-24 gap-4 md:gap-12 z-10">
            {[...Array(5)].map((_, i) => (
              <RealisticPlant 
                key={i} 
                growth={state.growth} 
                unhealthy={state.moisture < 25 || state.nutrients < 15}
                delay={i * 100}
              />
            ))}
          </div>

          {/* Action Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
             <button 
               onClick={() => setIsRunning(!isRunning)}
               className={`h-16 px-10 rounded-3xl font-black text-sm tracking-widest transition-all shadow-2xl flex items-center gap-3
                ${isRunning ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/40'}
               `}
             >
               <i className={`fa-solid ${isRunning ? 'fa-pause' : 'fa-play'}`}></i>
               {isRunning ? 'PAUSE SIMULATION' : 'ENGAGE LINK'}
             </button>
             
             <div className="flex gap-2 bg-slate-900/90 p-2 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                <button onClick={() => handleAction('irrigate')} className="p-4 bg-blue-600/20 text-blue-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><i className="fa-solid fa-droplet"></i></button>
                <button onClick={() => handleAction('fertilize')} className="p-4 bg-emerald-600/20 text-emerald-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"><i className="fa-solid fa-flask"></i></button>
                <button onClick={() => handleAction('reset')} className="p-4 bg-slate-800 text-slate-400 rounded-2xl hover:bg-white hover:text-black transition-all"><i className="fa-solid fa-rotate-right"></i></button>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column: Telemetry & In-depth Vitals */}
      <div className="flex flex-col gap-6">
        
        {/* Telemetry Log */}
        <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-900 shadow-xl flex flex-col h-64">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Telemetry</h3>
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           </div>
           <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[9px] text-emerald-400/70 scrollbar-hide">
              {telemetry.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-700">[{i}]</span>
                  <span>{log}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Detailed Gauges */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 space-y-6">
           <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4">
             <i className="fa-solid fa-microchip text-emerald-500"></i>
             Bio-Sensors
           </h3>

           <div className="space-y-6">
              {/* Nutrient Gauge */}
              <div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                  <span>Soil Nutrients (NPK)</span>
                  <span className="text-emerald-600">{Math.floor(state.nutrients)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${state.nutrients}%` }}></div>
                </div>
              </div>

              {/* Yield Potential */}
              <div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                  <span>Harvest Maturity</span>
                  <span className="text-amber-500">{Math.floor(state.growth)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${state.growth}%` }}></div>
                </div>
              </div>

              {/* Quality Gauge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Predicted Quality Index</p>
                 <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-slate-900">{Math.floor(state.yieldQuality)}</span>
                    <div className="flex-1 space-y-1">
                       <p className="text-[9px] text-slate-500 font-medium">Grade A Optimal</p>
                       <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-900 w-[94%]"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="mt-8">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Target Analysis</p>
              <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
                 <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                   Current CML signal suggests a localized squall in 15 minutes. Soil moisture is adequate; additional irrigation is <span className="underline">not recommended</span> for the next 24 hours.
                 </p>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default VirtualSimulation;
