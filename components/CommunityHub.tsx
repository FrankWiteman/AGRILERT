
import React, { useState } from 'react';

interface Props {
  user: any;
}

const CommunityHub: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState([
    { id: '1', user: 'Farmer John', text: 'Just planted the GMO Drought King Maize. The precision rain forecast says 3 days of light showers starting tomorrow. Perfect!', likes: 12, time: '2h ago' },
    { id: '2', user: 'AgriExpert Sarah', text: 'Warning: High humidity in Oyo North. Check your beans for fungus. Use the mulch technique recommended in module 4!', likes: 45, time: '5h ago' }
  ]);
  const [input, setInput] = useState('');

  const handlePost = () => {
    if (!input.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      user: user.name,
      text: input,
      likes: 0,
      time: 'Just now'
    };
    setPosts([newPost, ...posts]);
    setInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-xl">
                 <i className="fa-solid fa-pen-nib"></i>
              </div>
              <div className="flex-1 space-y-4">
                 <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share a farm update or ask a question..."
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-emerald-500 min-h-[100px] font-medium"
                 />
                 <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                       <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><i className="fa-solid fa-camera"></i></button>
                       <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><i className="fa-solid fa-location-dot"></i></button>
                    </div>
                    <button 
                      onClick={handlePost}
                      className="px-8 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg"
                    >
                       POST TO HUB
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-4">
           {posts.map(post => (
             <div key={post.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-emerald-600">
                         {post.user.charAt(0)}
                      </div>
                      <div>
                         <p className="text-sm font-black dark:text-white">{post.user}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{post.time}</p>
                      </div>
                   </div>
                   <button className="text-slate-400"><i className="fa-solid fa-ellipsis"></i></button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{post.text}</p>
                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex gap-6">
                   <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-rose-500 transition-colors">
                      <i className="fa-regular fa-heart"></i> {post.likes} LIKES
                   </button>
                   <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-emerald-500 transition-colors">
                      <i className="fa-regular fa-comment"></i> REPLIES
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-6">
         <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl">
            <h3 className="text-xl font-black mb-2">Verified Experts</h3>
            <p className="text-xs text-emerald-100 font-medium opacity-80 mb-6">Connect with soil scientists and experienced agronomists.</p>
            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/expert${i}/40/40`} className="w-10 h-10 rounded-xl border-2 border-emerald-400" />
                    <div>
                       <p className="text-xs font-black">Dr. Emeka V.</p>
                       <p className="text-[10px] text-emerald-200 font-bold">Soil Specialist</p>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 bg-white text-emerald-700 font-black rounded-2xl mt-8 text-xs">VIEW ALL EXPERTS</button>
         </div>
      </div>
    </div>
  );
};

export default CommunityHub;
