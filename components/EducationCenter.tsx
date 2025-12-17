
import React, { useState } from 'react';

const EducationCenter: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [modules, setModules] = useState([
    { id: 1, title: 'Basics of CML Data', duration: '15m', free: true, progress: 100, icon: 'fa-tower-broadcast' },
    { id: 2, title: 'Optimal Seed Selection', duration: '45m', free: true, progress: 45, icon: 'fa-seedling' },
    { id: 3, title: 'Advanced Soil Chemistry', duration: '2h', free: false, progress: 0, icon: 'fa-flask' },
    { id: 4, title: 'Bio-tech Farming V3', duration: '4h', free: false, progress: 0, icon: 'fa-dna' },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Learning Academy</h2>
          <p className="text-slate-500 font-medium">Upskill with climate-smart curriculum and technical mastery.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-8 py-4 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-emerald-500 font-black rounded-2xl text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-800 hover:scale-105 transition-all">Educator Portal</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map(mod => (
          <div key={mod.id} className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            {!mod.free && (
              <div className="absolute top-6 right-6 px-4 py-1.5 bg-amber-500 text-amber-950 text-[9px] font-black rounded-xl uppercase shadow-lg">Premium Only</div>
            )}
            <div className="flex items-start gap-8">
              <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-3xl transition-all group-hover:scale-110 group-hover:rotate-12 ${mod.free ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                <i className={`fa-solid ${mod.icon}`}></i>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{mod.title}</h3>
                <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span><i className="fa-solid fa-play-circle text-emerald-500 mr-2"></i> 14 LESSONS</span>
                  <span><i className="fa-solid fa-clock mr-2"></i> {mod.duration}</span>
                </div>
                <div className="pt-6">
                   <div className="flex justify-between items-center mb-2 text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                      <span>Course Progress</span>
                      <span>{mod.progress}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${mod.progress}%` }}></div>
                   </div>
                </div>
                <button className={`mt-8 w-full py-5 rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest transition-all ${mod.free ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {mod.free ? (mod.progress === 100 ? 'Review Module' : 'Continue Course') : 'Purchase Full Access'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 p-12 rounded-[5rem] border border-white/5 max-w-xl w-full text-center space-y-8 relative">
              <button onClick={() => setShowUpload(false)} className="absolute top-8 right-8 text-slate-400 text-2xl"><i className="fa-solid fa-xmark"></i></button>
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center text-4xl text-emerald-500 mx-auto"><i className="fa-solid fa-cloud-arrow-up"></i></div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Upload Content</h3>
              <p className="text-slate-500 font-medium">Verified educators can upload technical agricultural curriculum. Videos are reviewed within 48h.</p>
              <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 cursor-pointer hover:border-emerald-500/50 transition-all">
                 <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Drop .MP4 files or Browse</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EducationCenter;
