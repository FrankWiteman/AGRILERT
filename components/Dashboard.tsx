
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_WEATHER_HISTORY } from '../constants.tsx';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  // Use a reliable persistence pattern for the MNO toggle
  const [useLiveMNO, setUseLiveMNO] = useState(() => {
    const saved = localStorage.getItem('agrilert_use_live_mno');
    return saved === 'true';
  });

  const [liveSignal, setLiveSignal] = useState(94.2);
  const [liveAttenuation, setLiveAttenuation] = useState(0.52);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAdvisory, setAiAdvisory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Synchronize state to localStorage and notify other components
  useEffect(() => {
    localStorage.setItem('agrilert_use_live_mno', useLiveMNO.toString());
    window.dispatchEvent(new Event('mno_state_changed'));
  }, [useLiveMNO]);

  // Handle external changes to MNO state (e.g. from Farm Management tab)
  useEffect(() => {
    const handleSync = () => {
      const current = localStorage.getItem('agrilert_use_live_mno') === 'true';
      if (current !== useLiveMNO) setUseLiveMNO(current);
    };
    window.addEventListener('mno_state_changed', handleSync);
    return () => window.removeEventListener('mno_state_changed', handleSync);
  }, [useLiveMNO]);

  // Simulated telemetry fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSignal(prev => {
        const delta = (Math.random() - 0.5) * 0.8;
        return Math.min(100, Math.max(70, prev + delta));
      });
      setLiveAttenuation(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
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
        As an expert agricultural AI assistant for AGRILERT, provide a high-priority, "Live" advisory for a farmer.
        
        Current Live Telemetry:
        - Signal Source: ${useLiveMNO ? 'MTN National Gateway (Live)' : 'Internal Simulation'}
        - Link Signal Quality: ${liveSignal.toFixed(1)}%
        - Precipitation Attenuation: ${liveAttenuation.toFixed(2)} dBm
        - Location context: Oyo State, Nigeria
        
        Task:
        1. Interpret the current signal drop: ${liveAttenuation.toFixed(2)} dBm attenuation indicates what rainfall intensity?
        2. Provide one "Immediate Action" for a Maize/Rice field.
        3. Be brief, technical, yet accessible. 
        Format: Markdown. Max 80 words.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      setAiAdvisory(response.text || "Connection to Agri-Expert timed out. Retrying...");
    } catch (error) {
      console.error("AI Advisory Error:", error);
      setAiAdvisory("Failed to generate live advisory. Please ensure your API Key is valid and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = [
    { label: 'Signal Quality', value: `${liveSignal.toFixed(1)}%`, trend: useLiveMNO ? 'LIVE FEED' : 'SIMULATED', icon: 'fa-tower-broadcast', color: 'emerald' },
    { label: 'Current RSL', value: `${(-45 - liveAttenuation).toFixed(1)} dBm`, trend: 'Active', icon: 'fa-gauge-high', color: 'blue' },
    { label: 'Yield Forecast', value: '4.2 t/h', trend: '+5%', icon: 'fa-wheat-awn', color: 'amber' },
    { label: 'Soil Health', value: '82/100', trend: 'Stable', icon: 'fa-flask', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farm Insights Overview</h2>
          <p className="text-slate-500">Real-time data synchronization with {useLiveMNO ? 'Enterprise MNO Node' : 'Virtual Engine'}.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 pr-4 gap-3 shadow-sm">
             <button 
               onClick={() => setUseLiveMNO(!useLiveMNO)}
               className={`w-10 h-6 rounded-full transition-all relative ${useLiveMNO ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}
             >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useLiveMNO ? 'left-5 shadow-sm' : 'left-1'}`}></div>
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

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-wand-magic-sparkles text-emerald-400"></i>
                <h3 className="font-black uppercase tracking-widest text-sm">Live AI Agri-Expert</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-emerald-400 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-8">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Processing {useLiveMNO ? 'MTN' : 'Simulated'} Link Metrics...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 relative">
                    <i className="fa-solid fa-quote-left absolute top-4 left-4 text-emerald-200 text-2xl"></i>
                    <div className="text-slate-700 leading-relaxed font-medium relative z-10 prose prose-sm prose-emerald">
                      {aiAdvisory}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    Apply Advisory
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`rounded-[2.5rem] p-6 text-white shadow-xl overflow-hidden relative group transition-all duration-700 ${useLiveMNO ? 'bg-slate-900 border-4 border-emerald-500/20' : 'bg-emerald-900 shadow-emerald-900/10'}`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <i className="fa-solid fa-tower-broadcast text-[8rem] -rotate-12"></i>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${useLiveMNO ? 'bg-emerald-500 text-slate-900 scale-110' : 'bg-emerald-400 text-emerald-900'}`}>
              <i className={`fa-solid ${useLiveMNO ? 'fa-satellite-dish' : 'fa-tower-cell'} text-2xl ${useLiveMNO ? 'animate-bounce' : 'animate-pulse'}`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">
                {useLiveMNO ? 'MNO_GATEWAY_LAGOS_NORTH' : 'Node: IB-SOUTH-042'}
              </h1>
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-ping ${useLiveMNO ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                {useLiveMNO ? 'LIVE DATA STREAM ACTIVE' : 'SIMULATED CML ENVIRONMENT'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/5">
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Attenuation</p>
              <p className="text-2xl font-black font-mono">
                {liveAttenuation.toFixed(2)} 
                <span className="text-xs font-normal opacity-60 ml-1">dB</span>
              </p>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Packet Stability</p>
              <p className="text-2xl font-black font-mono text-emerald-400">99.9%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${stat.color}-100 text-${stat.color}-600 group-hover:rotate-12 transition-transform`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${stat.trend.includes('LIVE') ? 'bg-emerald-500 text-white animate-pulse' : (stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
