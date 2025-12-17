
import React from 'react';
import MNOIntegrator from './MNOIntegrator.tsx';

const FarmManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Farm Management & Data Integration</h2>
        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">System v2.4-MNO</span>
      </div>
      
      {/* Real-time MNO Integration Section */}
      <MNOIntegrator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Scheduler */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Operational Task List</h3>
            <button className="text-emerald-600 text-sm font-bold hover:underline">+ Add Task</button>
          </div>
          <div className="space-y-3">
            {[
              { id: 1, title: 'Apply Urea Fertilizer (South Plot)', date: 'Oct 24', status: 'Pending', priority: 'High' },
              { id: 2, title: 'Check MNO API Token Expiry', date: 'Nov 12', status: 'Pending', priority: 'Medium' },
              { id: 3, title: 'Clean CML Receiver Node Antenna', date: 'Oct 25', status: 'Pending', priority: 'Medium' },
            ].map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={task.status === 'Completed'} className="w-5 h-5 rounded-lg accent-emerald-600" />
                  <div>
                    <p className={`text-sm font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{task.date} • {task.priority} Priority</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Data Subscription</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">CML Data Plan</p>
                <p className="text-xl font-black text-emerald-900">Premium Real-Time</p>
                <p className="text-[10px] text-emerald-600 font-bold">Expires in 24 days</p>
              </div>
              <button className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all">
                Renew Data License
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmManagement;
