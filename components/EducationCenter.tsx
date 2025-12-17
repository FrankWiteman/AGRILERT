
import React from 'react';

const EducationCenter: React.FC = () => {
  const modules = [
    { id: 1, title: 'Basics of CML Data', duration: '15m', free: true, progress: 100, icon: 'fa-tower-broadcast' },
    { id: 2, title: 'Optimal Seed Selection', duration: '45m', free: true, progress: 20, icon: 'fa-seedling' },
    { id: 3, title: 'Advanced Soil Chemistry', duration: '2h', free: false, progress: 0, icon: 'fa-flask' },
    { id: 4, title: 'Bio-tech Farming V3', duration: '4h', free: false, progress: 0, icon: 'fa-dna' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Knowledge Base</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Upskill your farming with verified climate-smart techniques.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <i className="fa-solid fa-trophy text-amber-500"></i>
          <span className="font-black text-slate-800 dark:text-white">LEVEL 2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(mod => (
          <div key={mod.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            {!mod.free && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-amber-950 text-[10px] font-black rounded-lg uppercase flex items-center gap-1 shadow-lg">
                <i className="fa-solid fa-lock"></i> PRO ONLY
              </div>
            )}
            
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl transition-all group-hover:scale-110 ${mod.free ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                <i className={`fa-solid ${mod.icon}`}></i>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{mod.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span><i className="fa-regular fa-clock mr-1"></i> {mod.duration}</span>
                  <span><i className="fa-regular fa-circle-play mr-1"></i> 12 Lessons</span>
                </div>
                
                <div className="pt-4">
                   <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase text-emerald-600">
                      <span>Progress</span>
                      <span>{mod.progress}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${mod.progress}%` }}></div>
                   </div>
                </div>

                <button 
                  className={`mt-6 w-full py-4 rounded-2xl font-black text-xs uppercase transition-all ${mod.free ? 'bg-slate-900 text-white hover:bg-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                >
                  {mod.free ? (mod.progress > 0 ? 'RESUME MODULE' : 'START LEARNING') : 'UPGRADE TO UNLOCK'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationCenter;
