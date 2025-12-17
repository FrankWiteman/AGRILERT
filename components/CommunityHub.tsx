
import React, { useState } from 'react';

interface Props {
  user: any;
}

const CommunityHub: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState([
    { id: '1', user: 'Farmer John', text: 'Just planted the GMO Drought King Maize. The precision rain forecast says 3 days of light showers starting tomorrow. Perfect!', likes: 12, time: '2h ago', liked: false, replies: 3 },
    { id: '2', user: 'AgriExpert Sarah', text: 'Warning: High humidity in Oyo North. Check your beans for fungus. Use the mulch technique recommended in module 4!', likes: 45, time: '5h ago', liked: true, replies: 12 }
  ]);
  const [input, setInput] = useState('');

  const handlePost = () => {
    if (!input.trim()) return;
    setPosts([{
      id: Date.now().toString(),
      user: user.name,
      text: input,
      likes: 0,
      time: 'Just now',
      liked: false,
      replies: 0
    }, ...posts]);
    setInput('');
  };

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked };
      }
      return p;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/20 flex-shrink-0">
                 <i className="fa-solid fa-pen-nib"></i>
              </div>
              <div className="flex-1 space-y-4">
                 <textarea 
                  value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Share a weather alert or crop update..."
                  className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border-none outline-none focus:ring-4 ring-emerald-500/10 min-h-[120px] font-medium text-slate-800 dark:text-white"
                 />
                 <div className="flex justify-between items-center">
                    <button className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-emerald-500 transition-all"><i className="fa-solid fa-image"></i> Add Photo</button>
                    <button onClick={handlePost} className="px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl uppercase tracking-tighter hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">Post Update</button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-4">
           {posts.map(post => (
             <div key={post.id} className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-emerald-600 text-xl border border-slate-200 dark:border-slate-700">
                         {post.user.charAt(0)}
                      </div>
                      <div>
                         <p className="font-black dark:text-white uppercase tracking-tighter">{post.user}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.time}</p>
                      </div>
                   </div>
                   <button className="text-slate-300"><i className="fa-solid fa-ellipsis-v"></i></button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-lg leading-relaxed">{post.text}</p>
                <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex gap-8">
                   <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${post.liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}>
                      <i className={`${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i> {post.likes} Likes
                   </button>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-all">
                      <i className="fa-regular fa-comment-dots"></i> {post.replies} Replies
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-6">
         <div className="bg-emerald-600 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><i className="fa-solid fa-id-card text-7xl"></i></div>
            <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Verified Experts</h3>
            <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest mb-8 opacity-80">Book priority consultation sessions.</p>
            <div className="space-y-6">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center justify-between group/expert cursor-pointer">
                    <div className="flex items-center gap-4">
                       <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=expert${i}`} className="w-12 h-12 rounded-2xl border-4 border-emerald-500 bg-white" />
                       <div>
                          <p className="text-sm font-black uppercase tracking-tighter">Dr. Emeka V.</p>
                          <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">Soil Specialist</p>
                       </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover/expert:opacity-100 transition-opacity">
                       <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 bg-white text-emerald-700 font-black rounded-2xl mt-10 text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">View Premium Directory</button>
         </div>
      </div>
    </div>
  );
};

export default CommunityHub;
