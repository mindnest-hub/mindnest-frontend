import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = ({ ageGroup, setAgeGroup }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    // UI States
    const [activeTab, setActiveTab] = useState('My Paths');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // CSS Inline variables for the bronze metallic look
    const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-[#D9A060] to-[#EBC188]";
    const borderGradient = "border-[#B67F4B]/50";
    const panelBg = "bg-[#18181a]/95 backdrop-blur-md";

    const paths = [
        { 
            id: 1, 
            pathNumber: 'PATH-01',
            status: 'ACTIVE', 
            type: 'Mali Empire Narrative Challenge',
            startingDate: 'May 15, 2024',
            currentProgress: '4/15 Lessons',
            progressPct: '26%',
            action1: () => navigate('/history')
        },
        { 
            id: 2, 
            pathNumber: 'PATH-02',
            status: 'ACTIVE', 
            type: 'Financial Modeling Mastery',
            startingDate: 'June 01, 2024',
            currentProgress: '1/12 Lessons',
            progressPct: '8%',
            action1: () => navigate('/finance')
        }
    ];

    return (
        <div className="min-h-screen font-sans relative overflow-x-hidden text-white pb-40" 
             style={{ 
                 backgroundColor: '#070707',
                 backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-scales.png"), linear-gradient(180deg, #0f0f10 0%, #050505 100%)',
                 backgroundBlendMode: 'overlay'
             }}>
             
            {/* TOP HEADER */}
            <header className="flex justify-between items-start px-5 pt-8 pb-4">
                {/* MENU */}
                <button onClick={() => setShowProfileMenu(true)} className="flex flex-col items-center gap-1 opacity-90 transition-opacity hover:opacity-100">
                    <svg width="30" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9A060" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                    <span className="text-[9px] uppercase font-semibold tracking-widest text-[#B67F4B]">Menu</span>
                </button>

                {/* LOGO */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <svg width="40" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 30 C15 30 10 32 5 35 V32 C10 29 15 27 20 27 C25 27 30 29 35 32 V35 C30 32 25 30 20 30 Z" fill="#D9A060"/>
                            <path d="M19 28 L19 12 C14 12 10 16 8 20 C10 18 14 17 19 17 M21 28 L21 12 C26 12 30 16 32 20 C30 18 26 17 21 17 M17 10 C17 15 23 15 23 10 C23 5 17 5 17 10 Z" fill="#EBC188"/>
                            <path d="M11 14 C8 14 6 16 6 18 C8 15 11 15 11 14" fill="#B67F4B"/>
                            <path d="M29 14 C32 14 34 16 34 18 C32 15 29 15 29 14" fill="#B67F4B"/>
                        </svg>
                        <div className="flex flex-col items-center leading-[1.1]">
                            <span className="text-[14px] font-bold tracking-widest text-[#EBC188] uppercase">MindNest</span>
                            <span className="text-[14px] font-bold tracking-widest text-[#EBC188] uppercase">Africa</span>
                        </div>
                    </div>
                </div>

                {/* NOTIFICATIONS */}
                <button className="flex flex-col items-center gap-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9A060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"/><path d="M13.73 21A2 2 0 0 1 10.27 21"/></svg>
                </button>
            </header>

            {/* USER HEADER */}
            <div className="flex items-center px-5 mb-6 shadow-sm z-10 relative">
                <div className="flex-1">
                    <h1 className="text-[20px] font-semibold tracking-wide text-white mb-1">Welcome Back, {user?.username || 'Victor P.'}!</h1>
                    <p className="text-[13px] font-light text-[#D9A060]">Let's explore MindNest Africa</p>
                </div>
                <div className="flex flex-col items-end">
                    <img src="https://i.pravatar.cc/100?img=12" alt="Student" className="w-12 h-12 rounded-full border border-[#D9A060] mb-1" />
                    <span className="text-[8px] text-slate-300 bg-[#D9A060]/20 px-1.5 py-0.5 rounded text-right max-w-[80px] leading-tight">Active Student since Jan 2024</span>
                </div>
            </div>

            {/* TABS */}
            <div className="px-5 mb-8 overflow-x-auto relative z-10">
                <div className="flex bg-[#121214]/60 p-1 rounded-full border border-white/5 w-max min-w-full">
                    {['My Paths', 'In Progress', 'Completed', 'Recommended'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-4 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                                activeTab === tab 
                                ? 'bg-gradient-to-r from-[#D9A060] to-[#8A5A2B] text-black shadow-sm' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* DASHBOARD CONTENT GRID */}
            <div className="px-3 pb-8 relative z-10 flex flex-col gap-4">
                    
                {/* CARD A: LEARNING PATH */}
                <div className={`rounded-[20px] p-4 ${panelBg} border ${borderGradient} shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative flex flex-col`} style={{ backgroundImage: 'linear-gradient(135deg, rgba(217,160,96,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Circular Progress & Completed */}
                        <div className="flex flex-col items-center border-r border-[#2A2A2A] pr-4">
                            <h2 className="text-[12px] font-semibold text-[#EBC188] mb-4 text-center">Goal: Career Acceleration</h2>
                            <div className="relative w-[100px] h-[100px] mb-4 flex items-center justify-center">
                                <svg viewBox="0 0 36 36" className="w-[110px] h-[110px] absolute transform -rotate-90">
                                    <defs>
                                        <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#EBC188" />
                                            <stop offset="50%" stopColor="#D9A060" />
                                            <stop offset="100%" stopColor="#8A5A2B" />
                                        </linearGradient>
                                    </defs>
                                    <path className="text-[#1A1A1E]" strokeWidth="4.5" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path stroke="url(#bronzeGradient)" strokeWidth="4.5" strokeDasharray="37.5, 100" fill="none" strokeLinecap="round" style={{filter: 'drop-shadow(0 0 4px rgba(217,160,96,0.6))'}} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute w-[70px] h-[70px] bg-[#0c0c0e] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center">
                                    <span className="text-[16px] font-light text-white leading-none">37.5%</span>
                                    <span className="text-[7px] text-slate-400 mt-1">Complete</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-300 font-light italic mb-4">3 of 8 courses</span>
                            
                            <div className="w-full">
                                <h3 className="text-[11px] font-semibold text-[#D9A060] mb-2 uppercase tracking-wide">Completed Modules</h3>
                                <ul className="space-y-1.5 text-[9px] text-slate-300">
                                    {['1. History', '2. Financial Literacy', '3. Critical Thinking', '4. Civics'].map((item) => (
                                        <li key={item} className="flex justify-between items-center bg-[#1D1D20]/60 p-1.5 px-2 rounded border border-[#2A2A2A]">
                                            <span className="truncate pr-2">{item}</span>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <span className="text-[#4ADE80]">100%</span>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="#4ADE80"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Prop-firm Stats & Current Paths */}
                        <div className="flex flex-col">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <div className="bg-[#1D1D20]/80 p-2 rounded-lg border border-[#D9A060]/30 text-center shadow-inner">
                                    <div className="text-[9px] text-slate-400">Total Accounts</div>
                                    <div className="text-[14px] font-bold text-white">8</div>
                                </div>
                                <div className="bg-[#1D1D20]/80 p-2 rounded-lg border border-[#D9A060]/30 text-center shadow-inner">
                                    <div className="text-[9px] text-slate-400">Passed</div>
                                    <div className="text-[14px] font-bold text-[#4ADE80]">1</div>
                                </div>
                                <div className="bg-[#1D1D20]/80 p-2 rounded-lg border border-[#D9A060]/30 text-center shadow-inner">
                                    <div className="text-[9px] text-slate-400">Funded</div>
                                    <div className="text-[14px] font-bold text-[#F5C55A]">3</div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[11px] font-semibold text-[#D9A060] mb-3 uppercase tracking-wide">All Learning Paths (4)</h3>
                                <div className="space-y-3">
                                    {paths.map(path => (
                                        <div key={path.id} className="bg-[#1D1D20]/60 rounded-xl p-3 border border-white/5 relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-[11px] font-semibold text-white leading-tight w-[70%]">{path.type}</h4>
                                                <span className="text-[7px] bg-[#0F291E] text-[#4ADE80] px-2 py-0.5 rounded-sm font-bold shadow-[0_0_5px_#4ade80]">{path.status}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-[8px] text-slate-500">Started: <span className="text-white">{path.startingDate}</span></div>
                                                    <div className="text-[8px] text-[#D9A060] mt-0.5">{path.currentProgress}</div>
                                                </div>
                                                <button onClick={path.action1} className="text-[8px] bg-gradient-to-br from-[#EBC188] to-[#B67F4B] text-black px-3 py-1 rounded font-bold hover:shadow-[0_0_10px_rgba(217,160,96,0.6)]">
                                                    Continue
                                                </button>
                                            </div>
                                             {/* Mini progress line */}
                                             <div className="absolute bottom-0 left-0 h-[2px] bg-[#333] w-full">
                                                <div className="h-full bg-gradient-to-r from-[#D9A060] to-[#EBC188]" style={{ width: path.progressPct }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD B: AI COMPANION */}
                <div className={`rounded-[20px] p-5 ${panelBg} border ${borderGradient} shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative`}>
                    
                    <div className="flex flex-col lg:flex-row gap-5">
                        {/* Main AI Area */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[#D9A060]/20">
                                <div className="relative">
                                    {/* Yellow Smiley Face Robot */}
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] rounded-full border border-[#D9A060] flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                        <div className="flex flex-col items-center">
                                            <div className="flex gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                            </div>
                                            <div className="w-6 h-1 mt-1 border-b-2 border-black rounded-[50%]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <h2 className="text-[15px] font-bold text-white mb-1 flex items-center gap-2">
                                        MindNest Africa AI Online
                                        <span className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></span>
                                    </h2>
                                    <p className="text-[11px] text-[#D9A060]">Ready for Your Questions.</p>
                                </div>
                            </div>

                            {/* Chat interaction */}
                            <div className="bg-[#121214] rounded-xl p-4 border border-white/5 mb-4 shadow-inner">
                                <p className="text-[13px] text-white italic mb-2">"How can I help you explore one of our foundational modules today?"</p>
                                <div className="flex items-center bg-[#1D1D20] rounded-lg border border-[#D9A060]/30 p-1 px-3 mt-4">
                                    <input type="text" placeholder="Start with a complex module question..." disabled className="bg-transparent border-none text-[11px] w-full text-slate-400 py-2 focus:outline-none" />
                                    <button className="bg-gradient-to-br from-[#EBC188] to-[#D9A060] text-black w-6 h-6 rounded flex items-center justify-center hover:scale-105 transition-transform">→</button>
                                </div>
                            </div>

                            {/* Grid of categories on "dark wood" texture */}
                            <div className="bg-[#1F1710] rounded-xl p-4 border border-[#3E2723] shadow-inner" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        'History (African and World)', 
                                        'Financial Literacy (Investment & Savings)', 
                                        'Critical Thinking (Analysis & Debate)', 
                                        'Civics (Rights & Government Structure)', 
                                        'Health and Wellness (Mind & Body)', 
                                        'Agripreneurship (Business of Farming)', 
                                        'Tech (Coding & Digital Tools)'
                                    ].map((cat, i) => (
                                        <button key={i} className="text-left w-full p-2 bg-black/60 border border-[#D9A060]/30 rounded-lg text-[9px] text-[#EBC188] hover:bg-[#D9A060]/20 hover:border-[#D9A060] transition-colors leading-tight backdrop-blur-sm shadow-sm">
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Professional Verification Column */}
                        <div className="w-full lg:w-[30%] border-t lg:border-t-0 lg:border-l border-[#D9A060]/20 pt-4 lg:pt-0 lg:pl-4 flex flex-col justify-center">
                            <h3 className="text-[12px] font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span className="text-[#4ADE80] font-black">✓</span> Verify with a Professional Partner
                            </h3>
                            <div className="flex flex-col gap-4">
                                <button className="flex items-center gap-3 p-4 bg-[#1D1D20]/80 rounded-xl border border-[#D9A060]/20 hover:border-[#D9A060] hover:shadow-[0_0_15px_rgba(217,160,96,0.15)] transition-all text-left">
                                    <span className="text-2xl drop-shadow-md">⚖️</span>
                                    <span className="text-[12px] text-[#EBC188] font-medium leading-tight">Consult with a local Lawyer</span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-[#1D1D20]/80 rounded-xl border border-[#D9A060]/20 hover:border-[#D9A060] hover:shadow-[0_0_15px_rgba(217,160,96,0.15)] transition-all text-left">
                                    <span className="text-2xl drop-shadow-md">📊</span>
                                    <span className="text-[12px] text-[#EBC188] font-medium leading-tight">Talk to a licensed Financial Advisor</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD C: COMMUNITY & MENTORSHIP */}
                <div className={`rounded-[20px] p-5 ${panelBg} border ${borderGradient} shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative`}>
                    <h2 className="text-[15px] font-bold text-[#EBC188] mb-5">My MindNest Community</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Feed & Live Sessions */}
                        <div>
                            {/* Mentors */}
                            <div className="flex gap-4 overflow-x-auto pb-4 mb-4 border-b border-[#D9A060]/20">
                                {[
                                    { name: "Dr. Musa", loc: "Nairobi", img: "https://i.pravatar.cc/100?img=11" },
                                    { name: "Aisha K.", loc: "Lagos", img: "https://i.pravatar.cc/100?img=9" }
                                ].map((person, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2 min-w-[70px] flex-shrink-0">
                                        <div className="relative">
                                            <img src={person.img} className="w-[45px] h-[45px] rounded-full border-2 border-[#D9A060] object-cover"/>
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4ADE80] rounded-full border border-black shadow-[0_0_5px_#4ade80]"></span>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-[10px] font-semibold text-white truncate w-full">{person.name}</h4>
                                            <span className="text-[8px] text-[#D9A060] block">Consultant</span>
                                        </div>
                                        <button className="bg-gradient-to-r from-[#D9A060] to-[#B67F4B] text-black px-2 py-1 rounded-md text-[8px] font-bold w-full uppercase shadow-md hover:brightness-110">Connect</button>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-5">
                                <h3 className="text-[11px] font-bold text-white mb-2 uppercase tracking-wide">Active Discussion Forums</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-[#1D1D20] border border-[#D9A060]/40 text-[#EBC188] text-[9px] px-2.5 py-1.5 rounded-md hover:bg-[#D9A060]/10 cursor-pointer">#AfripreneurTips</span>
                                    <span className="bg-[#1D1D20] border border-[#D9A060]/40 text-[#EBC188] text-[9px] px-2.5 py-1.5 rounded-md hover:bg-[#D9A060]/10 cursor-pointer">#PolicyTalk</span>
                                    <span className="bg-[#1D1D20] border border-[#D9A060]/40 text-[#EBC188] text-[9px] px-2.5 py-1.5 rounded-md hover:bg-[#D9A060]/10 cursor-pointer">#CivicsHub</span>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h3 className="text-[11px] font-bold text-[#4ADE80] mb-2 uppercase tracking-wide flex items-center gap-2">Latest Activity Feed</h3>
                                <ul className="text-[10px] text-slate-300 bg-[#121214]/80 p-3 rounded-lg border border-[#D9A060]/20 shadow-inner">
                                    <li className="flex items-start gap-2">
                                        <div className="w-5 h-5 bg-[#333] rounded-full flex-shrink-0 mt-0.5 border border-[#D9A060]"></div>
                                        <div className="leading-snug"><span className="text-[#D9A060] font-semibold">User92:</span> Ask me about historical sources regarding the Mali Empire's trade routes.</div>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-[11px] font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2"><span className="text-[12px] animate-pulse">🔴</span> Upcoming Live Sessions</h3>
                                <div className="bg-[#1a1c1d] rounded-lg p-3 border border-red-900/40 hover:border-red-500/40 transition-colors shadow-inner">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] text-red-400 font-bold tracking-wider">May 19, 14:00 GMT</span>
                                        <button className="bg-red-600/20 text-red-400 border border-red-500/50 px-3 py-1 rounded text-[9px] font-bold hover:bg-red-600/40">JOIN</button>
                                    </div>
                                    <span className="text-[12px] text-white block">Agripreneurship Workshop: Scaling Local Farms</span>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div className="bg-[#1D1D20]/50 rounded-xl p-4 border border-[#B67F4B]/20 h-full flex flex-col">
                            <h3 className="text-[12px] font-bold text-[#EBC188] mb-4 text-center tracking-widest uppercase">Member Leaderboard</h3>
                            <div className="flex flex-col gap-3 flex-1">
                                {/* Rank 1 - Active User */}
                                <div className="flex items-center gap-3 bg-gradient-to-r from-[#D9A060]/20 to-transparent p-2 rounded-lg border-l-4 border-[#D9A060] relative hover:bg-[#D9A060]/30 transition-colors cursor-pointer">
                                    <div className="w-6 h-6 bg-gradient-to-br from-[#EBC188] to-[#D9A060] text-black rounded-full flex items-center justify-center font-black text-[11px] shadow-sm">1</div>
                                    <img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full border-2 border-[#D9A060]"/>
                                    <div className="flex-1">
                                        <span className="text-[12px] font-bold text-[#EBC188] tracking-wide">Victor P. <span className="font-normal text-slate-400">(Lagos)</span></span>
                                        <span className="block text-[9px] text-[#4ADE80] font-semibold mt-0.5">Top Contributor (Current)</span>
                                    </div>
                                    <div className="text-[14px]">⭐</div>
                                </div>

                                {/* Rank 2 */}
                                <div className="flex items-center gap-3 p-2 border-b border-[#333] hover:bg-[#111]/30 rounded-lg transition-colors cursor-pointer">
                                    <div className="w-6 h-6 bg-[#333] border border-[#555] text-white rounded-full flex items-center justify-center font-bold text-[11px]">2</div>
                                    <img src="https://i.pravatar.cc/100?img=5" className="w-9 h-9 rounded-full border border-[#444] opacity-80"/>
                                    <div className="flex-1">
                                        <span className="text-[12px] font-semibold text-slate-200">Sarah T. <span className="font-normal text-slate-500">(Cairo)</span></span>
                                    </div>
                                </div>

                                {/* Rank 3 */}
                                <div className="flex items-center gap-3 p-2 hover:bg-[#111]/30 rounded-lg transition-colors cursor-pointer">
                                    <div className="w-6 h-6 bg-[#333] border border-[#555] text-white rounded-full flex items-center justify-center font-bold text-[11px]">3</div>
                                    <img src="https://i.pravatar.cc/100?img=15" className="w-9 h-9 rounded-full border border-[#444] opacity-80"/>
                                    <div className="flex-1">
                                        <span className="text-[12px] font-semibold text-slate-200">Kwame N. <span className="font-normal text-slate-500">(Accra)</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* FLOATING ACTION CHAT BUBBLE - "Consultative AI Assistant" */}
            <div className="fixed bottom-[100px] right-4 z-[90] flex flex-col items-end pointer-events-none">
                <div className="bg-[#111]/90 backdrop-blur-md px-3 py-1.5 rounded-[12px] border border-[#D9A060]/50 mb-3 flex flex-col items-end mr-3 shadow-2xl pointer-events-auto">
                    <span className="text-[11px] font-black text-[#EBC188] uppercase tracking-wide">Consultative AI Assistant</span>
                    <span className="text-[9px] text-[#4ADE80] font-bold flex items-center gap-1.5 mt-0.5"><span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></span> Available Now</span>
                </div>
                <button className="w-[72px] h-[72px] bg-[#1a1a1a] rounded-full shadow-[0_10px_30px_rgba(217,160,96,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border border-[#ffe6c4] overflow-hidden relative pointer-events-auto group">
                    {/* Dark/Tribal halo effect inner border */}
                    <div className="absolute inset-1 rounded-full border-2 border-[#D9A060] border-dashed opacity-60 animate-[spin_12s_linear_infinite]"></div>
                    {/* The yellow smiley face robot head */}
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] rounded-full border-2 border-[#111] flex items-center justify-center relative z-10 shadow-[inner_0_0_10px_rgba(0,0,0,0.5)] group-hover:brightness-110">
                        <div className="flex flex-col items-center">
                            <div className="flex gap-2.5 mb-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#111]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#111]"></div>
                            </div>
                            <div className="w-7 h-1.5 mt-1 border-b-4 border-[#111] rounded-[50%]"></div>
                        </div>
                    </div>
                </button>
            </div>

            {/* Hidden Drawer for Menu */}
            {showProfileMenu && (
                <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col p-6 animate-fadeIn overflow-y-auto w-[300px] border-r border-[#333]/50 shadow-[20px_0_40px_rgba(0,0,0,0.8)]">
                    <button onClick={() => setShowProfileMenu(false)} className="absolute top-6 right-6 text-3xl text-white mb-6">×</button>
                    
                    <h2 className="text-[#00BFFF] font-bold text-2xl mb-8 tracking-wider mt-4">Menu</h2>
                    
                    <ul className="space-y-4 text-[18px] font-medium text-[#00BFFF] flex-1">
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/learn')}>
                            <span className="text-2xl">🚀</span> New Module
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/')}>
                            <span className="text-2xl">🏠</span> Home
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/events')}>
                            <span className="text-2xl">👥</span> Elite Community
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/services')}>
                            <span className="text-2xl">💳</span> My Earnings
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/finance')}>
                            <span className="text-2xl">🛍️</span> Buy Elite
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/stats')}>
                            <span className="text-2xl">📊</span> Leaderboard
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/opportunities')}>
                            <span className="text-2xl">🏷️</span> My Offers
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/stats')}>
                            <span className="text-2xl">📈</span> My Stats
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/docs')}>
                            <span className="text-2xl">🥇</span> Certificates
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/events')}>
                            <span className="text-2xl">🏆</span> Competitions
                        </li>
                        <li className="cursor-pointer flex items-center gap-3 hover:bg-[#111] p-2 rounded-lg" onClick={() => navigate('/learn')}>
                            <span className="text-2xl">📚</span> Academy
                        </li>
                    </ul>
                    
                    <div className="pt-6 border-t border-white/10 mt-4 pb-12">
                        <li className="cursor-pointer flex items-center gap-3 text-red-500 font-medium text-[18px] hover:bg-red-500/10 p-2 rounded-lg" onClick={logout}>
                            <span className="text-2xl">🚪</span> Sign Out
                        </li>
                    </div>
                </div>
            )}
            
            {/* Dark overlay when menu is open */}
            {showProfileMenu && (
                <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"></div>
            )}
        </div>
    );
};

export default Home;
