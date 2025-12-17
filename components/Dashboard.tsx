
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_WEATHER_HISTORY } from '../constants.tsx';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  // Persistence for MNO state
  const [useLiveMNO, setUseLiveMNO] = useState(() => {
    const saved = localStorage.getItem('agrilert_use_live_mno');
    return saved === 'true';
  });

  const [liveSignal, setLiveSignal] = useState(94.2);
  const [liveAttenuation, setLiveAttenuation] = useState(0.52);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAdvisory, setAiAdvisory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('agrilert_use_live_mno', useLiveMNO.toString());
    // Dispatch a custom event so other components (like MNOIntegrator) can sync
    window.dispatchEvent(new Event('mno_state_changed'));
  }, [useLiveMNO]);

  // Simulate real-time data fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSignal(prev => {
        const delta = (Math.random() - 0.5) * 0.5;
        return Math.min(100, Math.max(70, prev + delta));
      });
      setLiveAttenuation(prev => {
        const delta = (Math.random() - 0.5) * 0.05;
        return Math.max(0.1, prev + delta);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const generateAdvisory = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiAdvisory(null);
    setShowModal(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const prompt = `
        As an expert agricultural AI assistant for AGRILERT, provide a concise, actionable advisory for a farmer in Oyo State, Nigeria.
        
        Current Telemetry:
        - CML Signal Quality: ${liveSignal.toFixed(1)}%
        - Signal Attenuation: ${liveAttenuation.toFixed(2)} dBm
        - DataSource: ${useLiveMNO ? 'MTN Live Gateway' : 'CML Simulation'}
        - Est. Rainfall (from signal drop): ${liveAttenuation > 1.2 ? 'High Probability of Heavy Rain' : 'Stable/Clear'}
        - Current Market Forecast: ₦1.2M estimated yield
        
        Provide:
        1. A brief weather prediction based on the CML signal patterns.
        2. One specific action for Maize or Rice crops (e.g., nitrogen application, pest scouting, or drainage management).
        3. A professional, encouraging closing.
        Keep it under 100 words.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      setAiAdvisory(response.text || "No advisory could be generated at this time.");
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiAdvisory("Failed to connect to AI Expert. Please check your network and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = [
    { label: 'Avg Rainfall', value: useLiveMNO ? '18.2 mm' : '12.4 mm', trend: '+14%', icon: 'fa-cloud-rain', color: 'blue' },
    { label: 'CML Signal', value: `${liveSignal.toFixed(1)}%`, trend: useLiveMNO ? 'MNO LIVE' : 'SIMULATED', icon: 'fa-tower-broadcast', color: 'emerald' },
    { label: 'Yield Forecast', value: '4.2 t/h', trend: '+5%', icon: 'fa-wheat-awn', color: 'amber' },
    { label: 'Soil Health', value: '82/100', trend: '+2%', icon: 'fa-flask', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farm Insights Overview</h2>
          <p className="text-slate-500">Real-time data from {useLiveMNO ? 'MTN Enterprise Feed' : 'CML simulation engine'}.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 pr-4 gap-3 shadow-sm">
             <button 
               onClick={() => setUseLiveMNO(!useLiveMNO)}
               className={`w-10 h-6 rounded-full transition-colors relative ${useLiveMNO ? 'bg-emerald-500' : 'bg-slate-300'}`}
             >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useLiveMNO ? 'left-5' : 'left-1'}`}></div>
             </button>
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Live MNO Integration</span>
          </div>
          <button 
            onClick={generateAdvisory}
            disabled={isGenerating}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            {isGenerating ? 'Thinking...' : 'Generate Advisory'}
          </button>
        </div>
      </div>

      {/* Modal for AI Advisory */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-wand-magic-sparkles text-emerald-400"></i>
                <h3 className="font-black uppercase tracking-widest text-sm">AGRILERT AI Expert</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-emerald-400 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-8">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Analyzing CML Data Patterns...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 relative">
                    <i className="fa-solid fa-quote-left absolute top-4 left-4 text-emerald-200 text-2xl"></i>
                    <p className="text-slate-700 leading-relaxed font-medium relative z-10 whitespace-pre-wrap italic">
                      {aiAdvisory}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all"
                  >
                    Got it, thanks!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Real-time CML Header Banner */}
      <div className={`rounded-[2rem] p-6 text-white shadow-xl overflow-hidden relative group transition-colors duration-500 ${useLiveMNO ? 'bg-slate-900 border-4 border-emerald-500/20' : 'bg-emerald-900'}`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <i className="fa-solid fa-tower-broadcast text-[8rem] -rotate-12"></i>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${useLiveMNO ? 'bg-emerald-500 text-slate-900' : 'bg-emerald-400 text-emerald-900'}`}>
              <i className={`fa-solid ${useLiveMNO ? 'fa-satellite-dish' : 'fa-tower-cell'} text-2xl animate-pulse`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">
                {useLiveMNO ? 'MTN_NODE_LAG_CENTRAL_01' : 'Node: IB-SOUTH-042'}
              </h1>
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                {useLiveMNO ? 'External MNO Link Active' : 'Active Commercial Microwave Link'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">
                {useLiveMNO ? 'Raw RSL Level' : 'Current Attenuation'}
              </p>
              <p className="text-3xl font-black font-mono">
                {useLiveMNO ? '-52.4' : `-${liveAttenuation.toFixed(2)}`} 
                <span className="text-sm font-normal opacity-60">dBm</span>
              </p>
            </div>
            <div className="h-12 w-px bg-emerald-800"></div>
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Signal Quality</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-black font-mono text-emerald-400">{liveSignal.toFixed(1)}%</p>
                <div className="flex gap-0.5 items-end h-6">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 rounded-t-sm transition-all duration-500 ${i < Math.floor(liveSignal / 20) ? 'bg-emerald-400' : 'bg-emerald-800'}`}
                      style={{ height: `${(i + 1) * 20}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${stat.color === 'emerald' ? 'emerald' : stat.color}-100 text-${stat.color === 'emerald' ? 'emerald' : stat.color}-600 group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('LIVE') ? 'bg-emerald-500 text-white animate-pulse' : (stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">{useLiveMNO ? 'Live RSL Telemetry (MTN)' : 'CML Signal vs. Rainfall Intensity'}</h3>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-blue-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Rainfall
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Signal Level
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_WEATHER_HISTORY}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRain)" />
                <Area type="monotone" dataKey="signalStrength" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSignal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">MNO Data Quality</h3>
          <div className="space-y-6 flex-1">
             <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
               <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-check-circle text-emerald-600"></i>
                  <p className="text-xs font-black uppercase text-emerald-900 tracking-tight">API Validated</p>
               </div>
               <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
                  Currently ingesting link metrics from the Nigerian National Gateway. Precision is within 0.1dBm for the Lagos-Ibadan corridor.
               </p>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Latency</span>
                  <span className="text-slate-900">42ms</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Packet Success</span>
                  <span className="text-emerald-600">99.9%</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
