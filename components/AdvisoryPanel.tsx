
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AdvisoryItem {
  id: string;
  title: string;
  category: string;
  content: string;
  urgency: string;
  date: string;
}

// Fixed: Defined AdvisoryPanelProps to accept location and crop from App.tsx
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
      content: 'CML data suggests steady rainfall patterns for the next 10 days in Ibadan. This is the ideal window for Maize planting.',
      urgency: 'High',
      date: 'Latest'
    },
    {
      id: '2',
      title: 'Pest Outbreak Alert: Fall Armyworm',
      category: 'Pest Control',
      content: 'Current humidity levels (85%+) are conducive to Fall Armyworm growth. Inspect your Cowpea fields immediately.',
      urgency: 'High',
      date: 'Recent'
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const fetchLiveAdvisory = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const useLiveMNO = localStorage.getItem('agrilert_use_live_mno') === 'true';

      const prompt = `
        Generate a professional agricultural advisory for a farmer in ${location?.name || 'Nigeria'}. 
        Context: The farmer uses a CML-based rainfall monitoring system (AGRILERT) and is currently managing ${crop?.name || 'their farm'}.
        Current Mode: ${useLiveMNO ? 'Live MNO Feed' : 'Simulated Data'}.
        
        Please provide exactly ONE advisory in this JSON format:
        {
          "title": "Short catchy title",
          "category": "One of: Planting, Irrigation, Pest Control, or Harvest",
          "content": "Specific actionable advice based on current climate trends in Nigeria",
          "urgency": "High or Medium"
        }
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);
      const newAdvisory: AdvisoryItem = {
        id: Date.now().toString(),
        title: result.title,
        category: result.category,
        content: result.content,
        urgency: result.urgency,
        date: 'Generated Now'
      };

      setAdvisories([newAdvisory, ...advisories]);
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Climate Smart Advisories</h2>
          <p className="text-slate-500 text-sm">Real-time alerts powered by AI & CML Telemetry.</p>
        </div>
        <button 
          onClick={fetchLiveAdvisory}
          disabled={isGenerating}
          className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
        >
          {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
          {isGenerating ? 'Generating...' : 'Live AI Advisory'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {advisories.map((advisory) => (
          <div key={advisory.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:border-emerald-200 transition-all group animate-in slide-in-from-bottom-4 duration-500">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110
              ${advisory.category === 'Planting' ? 'bg-emerald-100 text-emerald-600' : 
                advisory.category === 'Pest Control' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}
            `}>
              <i className={`fa-solid ${
                advisory.category === 'Planting' ? 'fa-seedling' : 
                advisory.category === 'Pest Control' ? 'fa-bugs' : 'fa-droplet'
              }`}></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{advisory.category} • {advisory.date}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${advisory.urgency === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {advisory.urgency} Urgency
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{advisory.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">{advisory.content}</p>
            </div>
            <div className="flex md:flex-col justify-end gap-2">
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                Learn More
              </button>
              <button 
                onClick={() => setAdvisories(advisories.filter(a => a.id !== advisory.id))}
                className="flex-1 md:flex-none px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisoryPanel;
