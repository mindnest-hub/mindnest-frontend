import React from 'react';
import { useAuth } from '../context/AuthContext';

const Opportunities = () => {
    const { user } = useAuth();
    const ageGroup = user?.ageGroup?.toLowerCase() || 'adults';
    const isKid = ageGroup === 'kids';
    const isTeen = ageGroup === 'teens';

    const fullList = [
        { id: 1, title: 'Seed Grant for African Agri-tech', type: 'Grant', organization: 'Lagos Foundation', deadline: 'April 30, 2026', desc: 'Up to $10k in funding for sustainable farming innovative solutions.', icon: '🌱', color: '#B8860B', target: ['adults'] },
        { id: 2, title: 'Junior Frontend Developer', type: 'Job', organization: 'Terra Code', deadline: 'Immediate', desc: 'React.js and Tailwind expertise needed for a fast-paced fintech startup.', icon: '💻', color: '#00BFFF', target: ['adults', 'teens'] },
        { id: 3, title: 'Real Estate Sales Associate', type: 'Partnership', organization: 'Rollin Stone Properties', deadline: 'Ongoing', desc: 'Join our referral network and earn high commissions on verified land sales.', icon: '🏢', color: '#FF4500', target: ['adults'] },
        { id: 4, title: 'Digital Marketing Fellowship', type: 'Training', organization: 'Google Africa', deadline: 'May 15, 2026', desc: '3-month intensive training program for aspiring tech marketers.', icon: '📊', color: '#4682B4', target: ['adults', 'teens'] },
        { id: 5, title: 'Primary School Tech Scholarship', type: 'Scholarship', organization: 'MindNest Hub', deadline: 'August 10, 2026', desc: 'Full funding for young students exploring the basics of coding and history.', icon: '🎒', color: '#FFD700', target: ['kids'] },
        { id: 6, title: 'Junior Farming Competition', type: 'Competition', organization: 'AgriJunior', deadline: 'July 20, 2026', desc: 'Win a tablet and learning kits by designing a virtual farm.', icon: '🚜', color: '#32CD32', target: ['kids', 'teens'] }
    ];

    const list = fullList.filter(item => item.target.includes(ageGroup));

    return (
        <div className="section animate-fade">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-3 text-white">Economic Opportunities 💼</h1>
                <p className="text-slate-400 max-w-2xl">Verified grants, jobs, and training programs to help you scale your future.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {list.map(item => (
                    <div key={item.id} className="card group hover:bg-slate-900 border-slate-800 transition-all p-6">
                        <div className="flex gap-6 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-widest">{item.type}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-300 mb-2">{item.organization}</p>
                                <p className="text-slate-500 text-xs uppercase tracking-wider">Deadline: {item.deadline}</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            {item.desc}
                        </p>
                        <div className="flex gap-3">
                            <button className="flex-1 btn btn-primary py-3 font-bold text-sm">Apply Now</button>
                            <button className="flex-1 btn btn-outline py-3 font-bold text-sm">Details</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <p className="text-slate-500 text-sm mb-4 italic">Only premium members can access advanced filtration once we scale.</p>
                <button className="text-yellow-400 hover:scale-105 transition-transform font-bold">Post an Opportunity →</button>
            </div>
        </div>
    );
};

export default Opportunities;
