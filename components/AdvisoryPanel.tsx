
import React from 'react';

const AdvisoryPanel: React.FC = () => {
  const advisories = [
    {
      id: '1',
      title: 'Optimal Planting Window Detected',
      category: 'Planting',
      content: 'CML data suggests steady rainfall patterns for the next 10 days in Ibadan. This is the ideal window for Maize planting.',
      urgency: 'High',
      date: 'Today, 08:45 AM'
    },
    {
      id: '2',
      title: 'Pest Outbreak Alert: Fall Armyworm',
      category: 'Pest Control',
      content: 'Current humidity levels (85%+) are conducive to Fall Armyworm growth. Inspect your Cowpea fields immediately.',
      urgency: 'High',
      date: 'Yesterday'
    },
    {
      id: '3',
      title: 'Irrigation Strategy Adjustment',
      category: 'Irrigation',
      content: 'High attenuation in the local microwave link indicates an upcoming localized storm. Delay scheduled irrigation for 48 hours.',
      urgency: 'Medium',
      date: '2 days ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Climate Smart Advisories</h2>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          AI Powered
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {advisories.map((advisory) => (
          <div key={advisory.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:border-emerald-200 transition-colors">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 
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
              <p className="text-slate-500 leading-relaxed text-sm">{advisory.content}</p>
            </div>
            <div className="flex md:flex-col justify-end gap-2">
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                Learn More
              </button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
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
