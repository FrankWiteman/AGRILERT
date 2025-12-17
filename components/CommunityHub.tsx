
import React from 'react';

const CommunityHub: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex gap-4">
            <img src="https://picsum.photos/seed/me/100/100" className="w-12 h-12 rounded-2xl" alt="Me" />
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-3">
              <input 
                type="text" 
                placeholder="Share your experience with the latest rainfall forecast..." 
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>
            <button className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { user: 'Babatunde O.', role: 'Rice Specialist', text: 'The CML alert saved my harvest yesterday! We were able to cover the drying area 30 minutes before the heavy downpour.', likes: 24, replies: 5 },
            { user: 'Grace K.', role: 'Farmer (Kaduna)', text: 'Can anyone recommend drought-resistant Cowpea varieties suitable for the current soil temp in the North?', likes: 12, replies: 18 },
          ].map((post, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-xl" alt="User" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{post.user}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">{post.role}</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{post.text}</p>
              <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600">
                  <i className="fa-regular fa-heart"></i> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600">
                  <i className="fa-regular fa-comment"></i> {post.replies}
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 ml-auto">
                  <i className="fa-solid fa-share-nodes"></i> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Trending Topics</h3>
          <div className="space-y-4">
            {[
              { tag: '#CMLAccuracy', posts: '1.2k' },
              { tag: '#RiceHarvest2024', posts: '850' },
              { tag: '#OyoStateFarming', posts: '640' },
              { tag: '#ClimateResilience', posts: '2k+' },
            ].map(topic => (
              <div key={topic.tag} className="flex justify-between items-center group cursor-pointer">
                <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">{topic.tag}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-400 font-black">{topic.posts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-3xl text-white">
          <h3 className="font-black text-xl mb-2">Connect with Experts</h3>
          <p className="text-xs text-emerald-100 mb-4 opacity-80">Book a 1-on-1 session with Dr. Emeka or other agronomists.</p>
          <button className="w-full py-3 bg-white text-emerald-700 font-bold rounded-2xl text-sm shadow-xl shadow-black/10">
            Browse Experts
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
