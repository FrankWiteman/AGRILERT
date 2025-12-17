
import React, { useState } from 'react';

interface Props {
  user: any;
}

const CommunityHub: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState([
    { id: '1', user: 'Farmer John', text: 'Just planted the GMO Drought King Maize. The precision rain forecast says 3 days of light showers starting tomorrow. Perfect!', likes: 12, time: '2h ago', liked: false, replies: 3, role: 'Verified Cultivator' },
    { id: '2', user: 'AgriExpert Sarah', text: 'Warning: High humidity in Oyo North. Check your beans for fungus. Use the mulch technique recommended in module 4!', likes: 45, time: '5h ago', liked: true, replies: 12, role: 'CML Specialist' }
  ]);
  const [input, setInput] = useState('');

  const handlePost = () => {
    if (!input.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      user: user.name,
      text: input,
      likes: 0,
      time: 'Just now',
      liked: false,
      replies: 0,
      role: 'Member'
    };
    setPosts([newPost, ...posts]);
    setInput('');
  };

  const toggleLike = (id: string) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          likes: p.liked ? p.likes - 1 : p.likes + 1, 
          liked: !p.liked 
        };
      }
      return p;
    }));
    if ('vibrate' in navigator) navigator.vibrate(40);
  };

  const handleReplySim = (id: string) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === id) {
        return { ...p, replies: p.replies + 1 };
      }
      return p;
    }));
    alert("Reply feature opened (Simulation mode). Your response is being processed.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-700 pb-20">
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><i className="fa-solid fa-paper-plane text-8xl text-emerald-500"></i></div>
           <div className="flex gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white text-3xl shadow-2xl shadow-emerald-500/30 flex-shrink-0">
                 <i className="fa-solid fa-pen-nib"></i>
              </div>
              <div className="flex-1 space-y-4">
                 <textarea 
                  value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Broadcast a weather alert or crop update to local farmers..."
                  className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border-none outline-none focus:ring-4 ring-emerald-500/10 min-h-[160px] font-bold text-lg text-slate-800 dark:text-white placeholder:text-slate-400"
                 />
                 <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-500 transition-all shadow-sm">
                        <i className="fa-solid fa-image"></i>
                      </button>
                      <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-500 transition-all shadow-sm">
                        <i className="fa-solid fa-location-dot"></i>
                      </button>
                    </div>
                    <button 
                      onClick={handlePost} 
                      className="px-12 py-5 bg-slate-900 dark:bg-emerald-500 text-white dark:text-emerald-950 font-black rounded-[2rem] uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-3xl shadow-slate-900/10 dark:shadow-emerald-500/20"
                    >
                      Publish Alert
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           {posts.map(post => (
             <div key={post.id} className="bg-white dark:bg-slate-900 p-12 rounded-[5rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-6 duration-700 hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-emerald-600 text-2xl border-4 border-white dark:border-slate-700 shadow-lg">
                         {post.user.charAt(0)}
                      </div>
                      <div>
                         <p className="font-black dark:text-white uppercase tracking-tighter text-xl italic">{post.user}</p>
                         <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{post.role} • {post.time}</p>
                      </div>
                   </div>
                   <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-slate-600 transition-colors"><i className="fa-solid fa-ellipsis"></i></button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-bold text-xl leading-relaxed mb-10 italic">"{post.text}"</p>
                <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex gap-12">
                   <button 
                     onClick={() => toggleLike(post.id)} 
                     className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${post.liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                   >
                      <i className={`${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`}></i> {post.likes} Farmer Likes
                   </button>
                   <button 
                     onClick={() => handleReplySim(post.id)}
                     className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-all"
                   >
                      <i className="fa-regular fa-comment-dots text-xl"></i> {post.replies} Community Replies
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-8">
         <div className="bg-emerald-600 p-12 rounded-[5rem] text-white shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform"><i className="fa-solid fa-id-badge text-9xl"></i></div>
            <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter">Verified Experts</h3>
            <p className="text-[10px] text-emerald-200 font-black uppercase tracking-widest mb-10 opacity-80 leading-relaxed italic">Consult coordinate-locked agronomists for technical field remediation.</p>
            <div className="space-y-8 relative z-10">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center justify-between group/expert cursor-pointer hover:translate-x-2 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-[2rem] border-4 border-emerald-400 bg-white shadow-xl overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=expert${i}`} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="text-lg font-black uppercase tracking-tighter leading-none italic">{i === 1 ? 'Dr. Emeka V.' : 'Agri-Tech Ken'}</p>
                          <p className="text-[9px] text-emerald-200 font-black uppercase tracking-widest mt-1">{i === 1 ? 'Soil Specialist' : 'CML Analytics'}</p>
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover/expert:opacity-100 transition-opacity">
                       <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-5 bg-white text-emerald-700 font-black rounded-3xl mt-12 text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Consult Premium Experts</button>
         </div>
         
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 italic">Trending Alerts</h4>
            <div className="space-y-6">
               {[
                 { label: 'Oyo State Rain Surge', type: 'Warning' },
                 { label: 'Urea Price Drop', type: 'Market' },
                 { label: 'Maize Season Opening', type: 'System' }
               ].map((t, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                    <p className="text-[11px] font-bold dark:text-slate-400">{t.label}</p>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t.type}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default CommunityHub;
