
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
      content: 'Commercial Microwave Link (CML) data suggests a steady rainfall pattern for the next 10 days in your region. This moisture is ideal for initial seed cultivation and nutrient uptake.',
      urgency: 'High',
      date: 'Latest System Feed'
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const fetchLiveAdvisory = async () => {
    if (isGenerating || !location || !crop) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const prompt = `Act as an expert agronomist. Generate ONE specific agricultural advisory for a farmer in ${location.name}. 
      Details: Crop is ${crop.name} (${crop.selectedVariety?.name || 'Standard Variety'}), Month is ${currentMonth}, Soil pH is ${location.soil?.ph || '6.5'}.
      Include technical advice on irrigation, fertilizer, or pest control based on these parameters. 
      Return as JSON with fields: title, category, content, urgency ('Low', 'Medium', 'High').`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { 
          responseMimeType: "application/json",
          temperature: 0.7 
        }
      });
      
      const result = JSON.parse(response.text);
      const newItem: AdvisoryItem = {
        ...result,
        id: Date.now().toString(),
        date: 'Real-Time Analysis',
        expanded: false
      };
      
      setAdvisories([newItem, ...advisories]);
    } catch (err) { 
      console.error("Advisory Error:", err);
      alert("AI Sync failed. Please try again later.");
    } finally { 
      setIsGenerating(false); 
    }
  };

  const toggleExpand = (id: string) => {
    setAdvisories(prev => prev.map(ad => ad.id === id ? { ...ad, expanded: !ad.expanded } : ad));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">AI Advisor</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Coordinate-locked alerts and climate-smart techniques</p>
        </div>
        <button 
          onClick={fetchLiveAdvisory} 
          disabled={isGenerating} 
          className="px-8 py-5 bg-slate-900 text-white dark:bg-emerald-500 dark:text-emerald-950 font-black rounded-[2rem] flex items-center gap-3 uppercase tracking-tighter text-xs shadow-3xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
        >
          {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
          {isGenerating ? 'Synthesizing Data...' : 'Generate Real-Time Advisory'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {advisories.map((ad) => (
          <div key={ad.id} className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transition-transform group-hover:scale-125">
               <i className={`fa-solid ${ad.category === 'Planting' ? 'fa-seedling' : 'fa-vial'} text-8xl`}></i>
             </div>
             
             <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-4xl flex-shrink-0 relative z-10 transition-transform group-hover:scale-110 ${ad.urgency === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <i className={`fa-solid ${ad.category === 'Planting' ? 'fa-seedling' : ad.category === 'Pest Control' ? 'fa-bug' : 'fa-droplet'}`}></i>
             </div>
             
             <div className="flex-1 relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ad.category}</span>
                      <span className="text-slate-200 dark:text-slate-800">•</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{ad.date}</span>
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${ad.urgency === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                     {ad.urgency} Priority Alert
                   </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter leading-tight italic">{ad.title}</h3>
                <p className={`text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-sm ${ad.expanded ? '' : 'line-clamp-2'}`}>{ad.content}</p>
                
                <button 
                  onClick={() => toggleExpand(ad.id)}
                  className="mt-6 text-emerald-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:gap-5 transition-all"
                >
                   {ad.expanded ? 'Condense Insight' : 'Learn Technical Details'} <i className="fa-solid fa-arrow-right-long"></i>
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisoryPanel;
