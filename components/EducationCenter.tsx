
import React, { useState } from 'react';

const EducationCenter: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [modules, setModules] = useState([
    { id: 1, title: 'Basics of CML Data', duration: '15m', free: true, progress: 100, icon: 'fa-tower-broadcast', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 2, title: 'Optimal Seed Selection', duration: '45m', free: true, progress: 45, icon: 'fa-seedling', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 3, title: 'Advanced Soil Chemistry', duration: '2h', free: false, progress: 0, icon: 'fa-flask', videoUrl: null },
    { id: 4, title: 'Bio-tech Farming V3', duration: '4h', free: false, progress: 0, icon: 'fa-dna', videoUrl: null },
  ]);

  const handleStartModule = (mod: any) => {
    if (!mod.free) {
      alert("This is a Premium module. Upgrade to 'Cultivator Pro' in the Profile section to unlock.");
      return;
    }
    setSelectedVideo(mod);
  };

  const handleProgress = (modId: number) => {
    setModules(prev => prev.map(m => {
      if (m.id === modId) {
        const nextProgress = Math.min(100, m.progress + 15);
        return { ...m, progress: nextProgress };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Learning Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Technical mastery for climate-smart agriculture</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)} 
          className="px-10 py-5 bg-slate-900 dark:bg-slate-800 text-white dark:text-emerald-500 font-black rounded-3xl text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all shadow-3xl"
        >
          <i className="fa-solid fa-cloud-arrow-up mr-3"></i> Educator Portal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {modules.map(mod => (
          <div key={mod.id} className="bg-white dark:bg-slate-900 p-12 rounded-[5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            {!mod.free && (
              <div className="absolute top-10 right-10 px-5 py-2 bg-amber-500 text-amber-950 text-[9px] font-black rounded-2xl uppercase shadow-2xl tracking-widest italic">Cultivator Pro Only</div>
            )}
            
            <div className="flex flex-col sm:flex-row items-start gap-10 relative z-10">
              <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-4xl transition-all group-hover:scale-110 group-hover:rotate-12 ${mod.free ? 'bg-emerald-500 text-slate-900 shadow-2xl shadow-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                <i className={`fa-solid ${mod.icon}`}></i>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic mb-2">{mod.title}</h3>
                   <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                      <span><i className="fa-solid fa-play-circle text-emerald-500 mr-2"></i> 14 LESSONS</span>
                      <span><i className="fa-solid fa-clock mr-2"></i> {mod.duration}</span>
                   </div>
                </div>
                
                <div className="pt-2">
                   <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                      <span>Course Completion</span>
                      <span>{mod.progress}%</span>
                   </div>
                   <div className="w-full h-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${mod.progress}%` }}></div>
                   </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => handleStartModule(mod)}
                    className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${mod.free ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white shadow-2xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    {mod.free ? (mod.progress === 100 ? 'Review Technicals' : 'Resume Module') : 'Unlock Full Access'}
                  </button>
                  {mod.free && mod.progress < 100 && (
                    <button 
                      onClick={() => handleProgress(mod.id)}
                      className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                      title="Simulate Progress"
                    >
                      <i className="fa-solid fa-forward-step"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="max-w-6xl w-full bg-slate-900 rounded-[5rem] border border-white/10 overflow-hidden shadow-4xl flex flex-col h-[85vh]">
              <div className="p-10 flex justify-between items-center border-b border-white/5">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedVideo.title}</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">Currently Viewing • {selectedVideo.progress}% Complete</p>
                 </div>
                 <button onClick={() => setSelectedVideo(null)} className="w-14 h-14 rounded-full bg-white/5 text-white text-2xl hover:bg-rose-500 transition-all flex items-center justify-center">
                   <i className="fa-solid fa-xmark"></i>
                 </button>
              </div>
              <div className="flex-1 bg-black flex items-center justify-center p-4 md:p-10">
                 <div className="relative w-full h-full max-w-4xl max-h-[500px] rounded-[3rem] overflow-hidden border-8 border-slate-800 shadow-2xl">
                    <video className="w-full h-full object-cover" controls autoPlay>
                       <source src={selectedVideo.videoUrl} type="video/mp4" />
                       Your browser does not support the video tag.
                    </video>
                 </div>
              </div>
              <div className="p-10 bg-slate-800/50 flex flex-wrap gap-4 items-center justify-center">
                 <button onClick={() => handleProgress(selectedVideo.id)} className="px-10 py-4 bg-emerald-500 text-slate-950 font-black rounded-3xl uppercase tracking-tighter text-xs shadow-xl">Complete Lesson</button>
                 <button className="px-10 py-4 bg-white/5 text-white font-black rounded-3xl uppercase tracking-tighter text-xs">Download Study Kit</button>
              </div>
           </div>
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in zoom-in-95 duration-500">
           <div className="bg-white dark:bg-slate-900 p-14 rounded-[6rem] border border-white/5 max-w-2xl w-full text-center space-y-10 relative shadow-4xl">
              <button onClick={() => setShowUpload(false)} className="absolute top-10 right-10 text-slate-400 text-3xl hover:text-rose-500 transition-colors"><i className="fa-solid fa-xmark"></i></button>
              <div className="w-32 h-32 bg-emerald-500/10 rounded-[4rem] flex items-center justify-center text-5xl text-emerald-500 mx-auto border-4 border-emerald-500/20 shadow-inner">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Educator Gateway</h3>
                <p className="text-slate-500 font-bold leading-relaxed max-w-md mx-auto">Upload technical .MP4 modules. Our team reviews content for coordinate-locked accuracy within 48h.</p>
              </div>
              <div 
                className="border-8 border-dashed border-slate-100 dark:border-slate-800 rounded-[5rem] p-20 cursor-pointer hover:border-emerald-500/50 transition-all group bg-slate-50 dark:bg-slate-800/50"
                onClick={() => alert("Simulation: File selector opened. Select technical .MP4 curriculum.")}
              >
                 <i className="fa-solid fa-file-video text-4xl text-slate-200 dark:text-slate-700 mb-6 group-hover:scale-125 transition-transform group-hover:text-emerald-500"></i>
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Drop technical modules or Browse Library</p>
              </div>
              <div className="pt-4">
                 <button onClick={() => setShowUpload(false)} className="px-12 py-5 bg-emerald-500 text-slate-950 font-black rounded-3xl uppercase tracking-tighter text-sm shadow-2xl">Initialize Upload</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EducationCenter;
