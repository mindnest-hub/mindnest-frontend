import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';

const LearningCenter = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { level } = useGamification();

    const modules = [
        { 
            id: 'history', 
            title: 'History & Identity', 
            icon: '🌍', 
            desc: ageGroup === 'adults' ? 'Strategic lessons from African roots.' : 'Discover stories of African innovation.', 
            path: '/history', 
            level: 1,
            color: '#B8860B' 
        },
        { 
            id: 'finance', 
            title: 'Financial Literacy', 
            icon: '💰', 
            desc: ageGroup === 'adults' ? 'Wealth building and risk management.' : 'Master saving habits and money mindset.', 
            path: '/finance', 
            level: 1,
            color: '#00A86B' 
        },
        { 
            id: 'critical', 
            title: 'Critical Thinking', 
            icon: '🧠', 
            desc: ageGroup === 'adults' ? 'Strategic decision frameworks.' : 'Logic puzzles and bias awareness.', 
            path: '/critical-thinking', 
            level: 2,
            color: '#CD5C5C' 
        },
        { 
            id: 'agri', 
            title: 'Agripreneurship', 
            icon: '🌱', 
            desc: ageGroup === 'adults' ? 'Farming business and agri-finance.' : 'Sustainable food systems awareness.', 
            path: '/agri', 
            level: 2,
            color: '#2E8B57' 
        },
        { 
            id: 'tech', 
            title: 'Tech & AI', 
            icon: '💻', 
            desc: ageGroup === 'adults' ? 'AI productivity and digital income.' : 'AI awareness and digital skills.', 
            path: '/tech', 
            level: 3,
            color: '#4682B4' 
        },
        { 
            id: 'health', 
            title: 'Health & Wellness', 
            icon: '🌿', 
            desc: ageGroup === 'adults' ? 'Integrated physical and mental stability.' : 'Building healthy habits.', 
            path: '/health', 
            level: 1,
            color: '#DB7093' 
        },
        { 
            id: 'civics', 
            title: 'Civics & Ethics', 
            icon: '⚖️', 
            desc: ageGroup === 'adults' ? 'Governance and leadership.' : 'Responsibility and community awareness.', 
            path: '/civics', 
            level: 2,
            color: '#DAA520' 
        },
    ];

    return (
        <div className="section animate-fade">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-3 text-white">MindNest Academy 📚</h1>
                <p className="text-slate-400 max-w-2xl">
                    7 core pillars of knowledge designed for the next generation of African leaders. 
                    Your current level of mastery is: <strong className="text-yellow-400">Level {level}</strong>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((mod) => (
                    <div 
                        key={mod.id} 
                        className="card group hover:scale-[1.02] cursor-pointer transition-all border-b-4"
                        style={{ borderBottomColor: mod.color }}
                        onClick={() => navigate(mod.path)}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-5xl">{mod.icon}</span>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Difficulty</span>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3].map((star) => (
                                        <div 
                                            key={star} 
                                            className={`w-2 h-2 rounded-full ${star <= mod.level ? 'bg-yellow-400' : 'bg-slate-800'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl mb-3 group-hover:text-yellow-400 transition-colors">
                            {mod.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-6 flex-1">
                            {mod.desc}
                        </p>

                        <button className="btn btn-outline w-full py-3 text-sm font-bold group-hover:bg-slate-900 transition-colors">
                            ENTER MODULE
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-20 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center">
                <h2 className="text-2xl font-bold mb-4">Complete All Modules to Earn the "MindNest Master" Certificate 🏆</h2>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                    Mastery shows you have the financial, historical, and technical knowledge to lead and innovate in the 21st century.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                     <span className="px-4 py-2 bg-slate-800 rounded-lg text-xs text-slate-300">✓ Digital Certificate</span>
                     <span className="px-4 py-2 bg-slate-800 rounded-lg text-xs text-slate-300">✓ Industry Badges</span>
                     <span className="px-4 py-2 bg-slate-800 rounded-lg text-xs text-slate-300">✓ Partner Access</span>
                </div>
            </div>
        </div>
    );
};

export default LearningCenter;
