
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AdvisoryItem {
  id: string;
  title: string;
  category: string;
  content: string;
  urgency: string;
  date: string;
  expanded?: boolean;
}

interface AdvisoryPanelProps {
  location: any;
  crop: any;
}

const AdvisoryPanel = ({ location, crop }: AdvisoryPanelProps) => {
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([
    {
      id: '1',
      title: 'Optimal Planting Window Detected',
      category: 'Planting',
      content: 'CML data suggests steady rainfall patterns for the next 10 days in your region. This is the ideal window for initial seed cultivation.',
      urgency: 'High',
      date: 'Latest'
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const fetchLiveAdvisory = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a specific agricultural advisory for a farmer in ${location?.name}. Crop: ${crop?.name} (${crop?.selectedVariety?.name}). Urgency: High. Include technical advice on soil and climate. JSON: {title, category, content, urgency}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text);
      setAdvisories([{ ...result, id: Date.now().toString(), date: 'Live Analysis' }, ...advisories]);
    } catch (err) { console.error(err); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">AI Agri-Advisory</h2>
          <p className="text-slate-500 text-sm font-medium">Coordinate-locked alerts and climate smart techniques.</p>
        </div>
        <button onClick={fetchLiveAdvisory} disabled={isGenerating} className="px-8 py-4 bg-slate-900 text-white dark:bg-emerald-500 dark:text-emerald-950 font-black rounded-2xl flex items-center gap-3 uppercase tracking-widest text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
          {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
          {isGenerating ? 'Analyzing Feed...' : 'Generate Live Advisory'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {advisories.map((ad) => (
          <div key={ad.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 hover:border-emerald-500 transition-all group">
             <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-3xl flex-shrink-0 ${ad.category === 'Planting' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                <i className={`fa-solid ${ad.category === 'Planting' ? 'fa-seedling' : 'fa-droplet'}`}></i>
             </div>
             <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ad.category} • {ad.date}</span>
                   <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-lg">{ad.urgency} URGENCY</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{ad.title}</h3>
                <p className={`text-slate-500 dark:text-slate-400 font-medium leading-relaxed ${ad.expanded ? '' : 'line-clamp-2'}`}>{ad.content}</p>
                <button 
                  onClick={() => setAdvisories(advisories.map(a => a.id === ad.id ? {...a, expanded: !a.expanded} : a))}
                  className="mt-4 text-emerald-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                >
                   {ad.expanded ? 'Show Less' : 'Learn More'} <i className="fa-solid fa-arrow-right-long"></i>
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisoryPanel;
