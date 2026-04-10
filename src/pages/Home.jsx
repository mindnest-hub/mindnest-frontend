import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgeSelector from '../components/AgeSelector';
import DailyBonus from '../components/DailyBonus';
import Leaderboard from '../components/Leaderboard';
import LiveNotifications from '../components/LiveNotifications';
import AuthModal from '../components/AuthModal';
import PaymentPortal from '../components/PaymentPortal';
import DailyMissionBanner from '../components/DailyMissionBanner';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useWallet } from '../hooks/useWallet';

const Home = ({ ageGroup, setAgeGroup }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    // UI States
    const [activeTab, setActiveTab] = useState('My Paths');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // LEARNING PATHS DATA
    const paths = [
        { 
            id: 1, 
            pathNumber: 'HISTORY-01',
            status: 'ACTIVE', 
            type: 'History University',
            duration: '15 Lessons',
            startingDate: 'May 15, 2024',
            currentProgress: '6/15 Lessons',
            progressPct: '40%',
            action1: () => navigate('/history')
        },
        { 
            id: 2, 
            pathNumber: 'FINANCE-02',
            status: 'ACTIVE', 
            type: 'Financial Literacy',
            duration: '12 Lessons',
            startingDate: 'June 01, 2024',
            currentProgress: '2/12 Lessons',
            progressPct: '16%',
            action1: () => navigate('/finance')
        },
        { 
            id: 3, 
            pathNumber: 'AGRI-03',
            status: 'UPCOMING', 
            type: 'Agripreneurship',
            duration: '8 Lessons',
            startingDate: 'Not started',
            currentProgress: '0/8 Lessons',
            progressPct: '0%',
            action1: () => navigate('/agri')
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white px-4 pb-32 pt-6 font-sans relative overflow-x-hidden" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}>
            
            {/* TOP BAR / HEADER */}
            <header className="flex items-center justify-between mb-4 mt-2">
                <button onClick={() => setShowProfileMenu(true)} className="text-3xl font-light opacity-90">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21M3 6H21M3 18H21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button className="text-2xl relative opacity-90">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </header>

            {/* WELCOME BACK */}
            <div className="mb-6">
                <h1 className="text-[25px] font-normal tracking-tight mb-1">Welcome Back, {user?.username || 'Victor Chuku'}</h1>
                <p className="text-[14px] text-slate-400 font-light">Let's explore MindNest Africa</p>
            </div>

            {/* MY LEARNING PATH CARD */}
            <section className="bg-[#121214] rounded-[22px] p-4 mb-6 shadow-2xl relative z-10 border border-white/5">
                <div className="flex items-center justify-center gap-2 mb-4 mt-1">
                    <span className="text-[#F5C55A] text-2xl pt-1">🌳</span> 
                    <span className="text-[17px] text-white font-medium">My Learning Path</span>
                </div>
                
                {/* 2 Top Boxes */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Goal Circular Progress */}
                    <div className="bg-[#1A1A1E] rounded-[16px] p-4 flex flex-col items-center justify-center relative shadow-inner">
                        <span className="text-[11px] text-slate-300 mb-4 block text-center">Goal: Elite Member Status</span>
                        
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-md">
                                <path className="text-[#2A2A2E] stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                {/* Semi Circle progress indicator */}
                                <path className="text-[#F5C55A] stroke-current" strokeWidth="3" strokeDasharray="30, 100" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center mt-1">
                                <span className="text-[9px] text-slate-400">2 of 8 courses</span>
                                <span className="text-[22px] font-normal leading-tight mt-1 text-white">30%</span>
                                <span className="text-[9px] text-slate-400 mt-1">Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Performance Bar Chart */}
                    <div className="bg-[#1A1A1E] rounded-[16px] p-4 flex flex-col items-center justify-center relative shadow-inner">
                        <span className="text-[11px] text-slate-300 mb-4 block flex items-center gap-1"><span className="text-[#F5C55A] text-xs">🎓</span> Quiz Performance</span>
                        
                        {/* Bar Chart Fake Representation */}
                        <div className="flex items-end justify-center gap-1.5 h-[55px] mb-4 w-full px-2">
                            <div className="w-[12%] bg-[#4ADE80] h-[30%] rounded-t-[2px]"></div>
                            <div className="w-[12%] bg-[#4ADE80] h-[45%] rounded-t-[2px]"></div>
                            <div className="w-[12%] bg-[#4ADE80] h-[60%] rounded-t-[2px]"></div>
                            <div className="w-[12%] bg-[#4ADE80] h-[75%] rounded-t-[2px]"></div>
                            <div className="w-[12%] bg-[#4ADE80] h-[70%] rounded-t-[2px]"></div>
                            <div className="w-[12%] bg-[#4ADE80] h-[95%] rounded-t-[2px]"></div>
                            <div className="w-[12%] bg-[#4ADE80] h-[100%] rounded-t-[2px]"></div>
                        </div>

                        <p className="text-[10px] text-slate-300 text-center leading-relaxed">
                            Average Score: 92%<br/>
                            <span className="text-slate-500">(on 3 quizzes)</span>
                        </p>
                    </div>
                </div>
                
                {/* 3 Bottom Distinct Sub-boxes */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#1A1A1E] rounded-[14px] py-4 flex flex-col items-center justify-center shadow-inner">
                        <span className="text-[10px] text-slate-400 mb-1">Total Learning Time</span>
                        <span className="text-[16px] font-normal text-white drop-shadow-sm">150 Hours</span>
                    </div>
                    <div className="bg-[#1A1A1E] rounded-[14px] py-4 flex flex-col items-center justify-center shadow-inner">
                        <span className="text-[10px] text-slate-400 mb-1">Skills Gained</span>
                        <span className="text-[16px] font-normal text-white drop-shadow-sm">4 Badges</span>
                    </div>
                    <div className="bg-[#1A1A1E] rounded-[14px] py-4 flex flex-col items-center justify-center shadow-inner">
                        <span className="text-[10px] text-slate-400 mb-1">Certificates</span>
                        <span className="text-[16px] font-normal text-white drop-shadow-sm">2</span>
                    </div>
                </div>
            </section>

            {/* CAPSULE TABS */}
            <div className="bg-[#121214] p-1.5 rounded-[24px] flex justify-between mb-8 overflow-hidden shadow-md">
                {['My Paths', 'In Progress', 'Completed', 'Recommended'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2.5 px-3 rounded-full text-[12px] font-medium transition-all ${
                            activeTab === tab 
                            ? 'bg-[#2A2A2E] text-white shadow-sm' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ACCOUNT/PATH LIST SECTION */}
            <section>
                <div className="mb-4">
                    <h3 className="text-[16px] font-normal text-slate-100">All Learning Paths ({paths.length})</h3>
                </div>
                
                <div className="space-y-6">
                    {paths.map((path) => (
                        <div key={path.id} className="bg-[#121214] rounded-[24px] p-5 shadow-xl border border-white/5">
                            {/* Path Header */}
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[17px] font-normal text-white">{path.type}</h4>
                                <span className={`px-4 py-[3px] rounded-full text-[10px] font-bold tracking-wider ${
                                    path.status === 'ACTIVE' 
                                    ? 'bg-[#0F291E] text-[#4ADE80]' 
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                    {path.status}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-[13px] text-slate-200">Path ID: {path.pathNumber}</p>
                                <p className="text-[11px] text-slate-500">{path.duration}</p>
                            </div>
                            
                            {/* Stats Columns */}
                            <div className="flex justify-between mb-8 pr-2">
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Starting Date</p>
                                    <p className="text-[14px] font-normal text-slate-100">{path.startingDate}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-500 mb-1">Current Progress</p>
                                    <p className="text-[14px] font-normal text-slate-100">{path.currentProgress}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 mb-1">Progress %</p>
                                    <p className="text-[14px] font-normal text-slate-100">{path.progressPct}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={path.action1}
                                    className="flex-1 bg-[#F5C55A] text-[#111] h-[48px] rounded-[20px] font-medium text-[13px] active:scale-95 transition-transform shadow-[0_4px_15px_rgba(245,197,90,0.15)]"
                                >
                                    View Syllabus
                                </button>
                                <button 
                                    onClick={path.action1}
                                    className="flex-1 border border-[#F5C55A] text-[#F5C55A] h-[48px] rounded-[20px] font-medium text-[13px] active:scale-95 transition-transform bg-transparent hover:bg-[#F5C55A]/5"
                                >
                                    Start Node
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Profile Drawer Overlay */}
            {showProfileMenu && (
                <div className="fixed inset-0 z-[9999] flex">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                        onClick={() => setShowProfileMenu(false)}
                    ></div>
                    
                    {/* Drawer Content */}
                    <div className="relative w-[300px] h-full bg-[#121214] shadow-2xl p-6 flex flex-col border-r border-[#2A2A2E] z-10 animate-slide-right">
                        <button onClick={() => setShowProfileMenu(false)} className="text-slate-400 hover:text-white text-3xl self-end mb-8 font-light">×</button>
                        
                        <div className="mb-10">
                            <div className="w-16 h-16 bg-[#F5C55A] rounded-full flex items-center justify-center text-black text-2xl font-medium mb-4">
                                {user?.username?.charAt(0)?.toUpperCase() || 'V'}
                            </div>
                            <h2 className="text-[22px] font-normal">{user?.username || 'Victor Chuku'}</h2>
                            <p className="text-slate-500 text-[13px] mt-1">{user?.email || 'victor@mindnest.bond'}</p>
                        </div>

                        <div className="flex-1">
                            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4 px-2">Account</div>
                            <ul className="space-y-1 text-[15px] font-light text-slate-300">
                                <li className="hover:bg-[#1A1A1E] p-3 rounded-xl cursor-pointer flex items-center gap-4">⚙️ Settings</li>
                                <li className="hover:bg-[#1A1A1E] p-3 rounded-xl cursor-pointer flex items-center gap-4">🔒 Security</li>
                                <li className="hover:bg-[#1A1A1E] p-3 rounded-xl cursor-pointer flex items-center gap-4">🎫 Subscriptions</li>
                                <li className="hover:bg-[#1A1A1E] p-3 rounded-xl cursor-pointer flex items-center gap-4">💳 My Payouts</li>
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-[#1A1A1E]">
                            <button onClick={logout} className="w-full bg-red-500/10 text-red-500 py-4 rounded-[16px] font-normal text-[15px]">
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
