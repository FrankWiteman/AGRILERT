
import React, { useState, useEffect } from 'react';

interface Props {
  crop: any;
}

const VirtualSimulation: React.FC<Props> = ({ crop }) => {
  const [day, setDay] = useState(1);
  const [growth, setGrowth] = useState(0);
  const [tasks, setTasks] = useState<{ id: string, label: string, done: boolean, icon: string }[]>([
    { id: '1', label: 'Apply Organic Manure', done: false, icon: 'fa-vial' },
    { id: '2', label: 'Early Morning Irrigation', done: false, icon: 'fa-droplet' },
    { id: '3', label: 'Inspect Leaf Nodes', done: false, icon: 'fa-magnifying-glass' },
  ]);
  const [expectedYield, setExpectedYield] = useState(85000);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    setExpectedYield(prev => prev + (Math.random() * 500));
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setGrowth(prev => Math.min(100, prev + 0.1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-[500px] bg-emerald-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden flex items-end justify-center pb-20">
           <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-white">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Planting Window</p>
              <h4 className="text-xl font-black">OPENS IN 4 DAYS</h4>
              <p className="text-[10px] text-slate-400 font-bold">Recommended: May 12th - May 18th</p>
           </div>
           
           <div className="relative z-10 text-center space-y-4">
              <div className="transition-transform duration-1000" style={{ transform: `scale(${0.5 + (growth / 100) * 1.5})` }}>
                <i className={`fa-solid ${growth > 50 ? 'fa-wheat-awn' : 'fa-seedling'} text-8xl text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]`}></i>
              </div>
              <div className="bg-black/60 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-emerald-400 font-black text-xs">
                DAY {Math.floor(day)} OF 90
              </div>
           </div>

           {/* Dirt Ground */}
           <div className="absolute bottom-0 w-full h-24 bg-[#451a03]"></div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase">Daily Task sync</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">Input your physical farm activities to keep the simulation accurate.</p>
              <div className="space-y-3">
                {tasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group ${task.done ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <i className={`fa-solid ${task.icon}`}></i>
                      {task.label}
                    </div>
                    <i className={`fa-solid ${task.done ? 'fa-circle-check' : 'fa-circle-plus opacity-20'}`}></i>
                  </button>
                ))}
              </div>
           </div>

           <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-600/20">
              <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-2">Live Yield Estimate</p>
              <p className="text-4xl font-black">₦{expectedYield.toLocaleString()}</p>
              <div className="mt-6 flex justify-between items-center text-xs font-bold text-emerald-100">
                <span>Current Maturity</span>
                <span>{Math.floor(growth)}%</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${growth}%` }}></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualSimulation;
