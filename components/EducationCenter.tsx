
import React from 'react';

const EducationCenter: React.FC = () => {
  const courses = [
    { id: 1, title: 'Basics of CML Rainfall Data', duration: '45 mins', level: 'Beginner', thumbnail: 'https://picsum.photos/seed/edu1/400/250' },
    { id: 2, title: 'Climate Smart Rice Cultivation', duration: '1.2 hrs', level: 'Intermediate', thumbnail: 'https://picsum.photos/seed/edu2/400/250' },
    { id: 3, title: 'Digital Financial Literacy', duration: '30 mins', level: 'All Levels', thumbnail: 'https://picsum.photos/seed/edu3/400/250' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Climate Smart Training</h2>
          <p className="text-slate-500">Master the technology that drives your productivity.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">Your Progress</p>
            <p className="text-sm font-black text-emerald-600">Level 4 Certified</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <i className="fa-solid fa-trophy"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                {course.level}
              </div>
              <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-play text-white text-5xl"></i>
              </button>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{course.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-bold mb-4">
                <span><i className="fa-regular fa-clock mr-1"></i> {course.duration}</span>
                <span><i className="fa-regular fa-circle-play mr-1"></i> 8 Lessons</span>
              </div>
              <button className="w-full py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">
                Resume Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationCenter;
