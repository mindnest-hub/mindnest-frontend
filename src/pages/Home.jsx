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
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // CSS Inline variables for the bronze metallic look
    const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-[#D9A060] to-[#EBC188]";
    const borderGradient = "border-[#B67F4B]/50";
    const panelBg = "bg-[#18181a]/95 backdrop-blur-md";

    return (
        <div className="min-h-screen font-sans relative overflow-x-hidden text-white pb-32" 
             style={{ 
                 // Dark background with extremely subtle repeating pattern for mudcloth/tribal feel
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
                        {/* Custom Tree/Book Logo SVG attempt */}
                        <svg width="40" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 30 C15 30 10 32 5 35 V32 C10 29 15 27 20 27 C25 27 30 29 35 32 V35 C30 32 25 30 20 30 Z" fill="#D9A060"/>
                            <path d="M19 28 L19 12 C14 12 10 16 8 20 C10 18 14 17 19 17 M21 28 L21 12 C26 12 30 16 32 20 C30 18 26 17 21 17 M17 10 C17 15 23 15 23 10 C23 5 17 5 17 10 Z" fill="#EBC188"/>
                            <path d="M11 14 C8 14 6 16 6 18 C8 15 11 15 11 14" fill="#B67F4B"/>
                            <path d="M29 14 C32 14 34 16 34 18 C32 15 29 15 29 14" fill="#B67F4B"/>
                        </svg>
                        <div className="flex flex-col items-start leading-[1.1]">
                            <span className="text-[14px] font-bold tracking-widest text-[#EBC188] uppercase">MindNest</span>
                            <span className="text-[14px] font-bold tracking-widest text-white uppercase">Africa</span>
                        </div>
                    </div>
                </div>

                {/* PROFILE */}
                <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D9A060] to-[#6b4520] flex items-center justify-center p-[2px]">
                        <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                    </div>
                    <span className="text-[9px] uppercase font-semibold tracking-widest text-[#B67F4B]">My Profile</span>
                </button>
            </header>

            {/* WELCOME BANNER */}
            <div className="text-center mb-8 mt-2 px-4 shadow-sm z-10 relative">
                <h1 className="text-[22px] font-semibold tracking-wide text-white mb-1">Welcome Back, {user?.username || 'Victor Chuku'}!</h1>
                <p className="text-[15px] font-light text-slate-300">Let's explore MindNest Africa</p>
            </div>

            {/* GRID LAYOUT FOR 4 CARDS */}
            <div className="px-3 pb-8 relative z-10">
                <div className="grid grid-cols-2 gap-3" style={{ gridAutoRows: 'min-content' }}>
                    
                    {/* CARD 1: LEARNING PATH */}
                    <div className={`rounded-[20px] p-4 ${panelBg} border ${borderGradient} shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col items-center relative overflow-hidden`} style={{ backgroundImage: 'linear-gradient(135deg, rgba(217,160,96,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                        <h2 className="text-[13px] font-semibold text-white mb-4 z-10 pt-1">Your Learning Path</h2>
                        
                        {/* Circular Progress */}
                        <div className="relative w-[110px] h-[110px] mb-6 flex items-center justify-center">
                            {/* SVG Ring with gradient */}
                            <svg viewBox="0 0 36 36" className="w-[125px] h-[125px] absolute transform -rotate-90">
                                <defs>
                                    <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#EBC188" />
                                        <stop offset="50%" stopColor="#D9A060" />
                                        <stop offset="100%" stopColor="#8A5A2B" />
                                    </linearGradient>
                                </defs>
                                <path className="text-[#1A1A1E]" strokeWidth="4.5" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path stroke="url(#bronzeGradient)" strokeWidth="4.5" strokeDasharray="40, 100" fill="none" strokeLinecap="round" style={{filter: 'drop-shadow(0 0 4px rgba(217,160,96,0.6))'}} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute w-[80px] h-[80px] bg-[#0c0c0e] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] flex items-center justify-center">
                                <span className="text-[28px] font-light text-white tracking-tighter">40%</span>
                            </div>
                        </div>

                        {/* Completed Modules List */}
                        <div className="w-full">
                            <h3 className="text-[13px] font-semibold text-white mb-2">Completed Modules</h3>
                            <ul className="space-y-2 text-[10px] text-slate-300">
                                {['1. History', '2. Financial literacy', '3. Critical Thinking', '4. Civics'].map((item) => (
                                    <li key={item} className="flex justify-between items-center bg-[#1D1D20]/60 p-1.5 px-3 rounded-md">
                                        <span>{item}</span>
                                        <div className="flex items-center gap-1">
                                            <span>100%</span>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#4ADE80"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* CARD 2: AI COMPANION */}
                    <div className={`rounded-[20px] p-4 ${panelBg} border ${borderGradient} shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col items-center relative`} style={{ backgroundImage: 'linear-gradient(135deg, rgba(217,160,96,0.02) 0%, rgba(0,0,0,0) 100%)' }}>
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></span>
                            <span className="text-[8px] text-[#4ADE80]">MindNest AI Online</span>
                        </div>
                        
                        <h2 className="text-[13px] font-semibold text-white mt-4 mb-4 text-center">My MindNest AI Companion</h2>
                        
                        <div className="w-20 h-20 bg-gradient-to-br from-[#111] to-[#222] rounded-full border-2 border-[#D9A060] mb-5 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(217,160,96,0.2)]">
                            {/* Abstract Robot Face styling to match mockup */}
                            <div className="w-full h-full bg-[#EBC188] rounded-xl flex items-center justify-center px-1">
                                <div className="w-12 h-8 bg-black rounded-lg flex justify-around items-center px-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_4px_#4ade80]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_4px_#4ade80]"></div>
                                </div>
                            </div>
                        </div>

                        {/* List of prompt pills */}
                        <div className="w-full flex flex-col gap-2">
                            {['Law & Rights Breakdown', 'Govt. Regulations Simplified', 'Real African History Q&A', 'Financial Literacy Check', 'Pocket Lawyer consultation'].map((text, i) => (
                                <button key={i} className="w-full text-center py-2 px-2 text-[9px] bg-[#1a1a1c]/80 border border-[#B67F4B]/40 rounded-full text-slate-300 hover:text-[#EBC188] hover:border-[#D9A060] transition-colors truncate">
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CARD 3: MY MINDNEST */}
                    <div className={`rounded-[20px] p-4 ${panelBg} border ${borderGradient} shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative`}>
                        <h2 className="text-[14px] font-semibold text-white mb-4">My MindNest</h2>
                        
                        {/* Contacts / Mentors */}
                        <div className="flex flex-col gap-3 mb-6">
                            {[
                                { name: "Dr. Musa", status: "Online", img: "https://i.pravatar.cc/100?img=11" },
                                { name: "Aisha K.", status: "Online", img: "https://i.pravatar.cc/100?img=9" }
                            ].map((person, idx) => (
                                <div key={idx} className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <img src={person.img} className="w-10 h-10 rounded-full border border-[#D9A060]/50 obj-cover"/>
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4ADE80] rounded-full border border-black"></span>
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-semibold text-white leading-tight">{person.name}</h4>
                                            <span className="text-[9px] text-[#4ADE80]">{person.status}</span>
                                        </div>
                                    </div>
                                    <button className="bg-gradient-to-r from-[#D9A060] to-[#B67F4B] text-black px-3 py-1.5 rounded-full text-[10px] font-bold shadow-[0_2px_8px_rgba(217,160,96,0.3)]">
                                        Connect
                                    </button>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-[14px] font-semibold text-white mb-4">In Progress</h3>
                        <div className="flex flex-col gap-4">
                            {[
                                { id: '5', name: 'Health and Wellness', pct: 40 },
                                { id: '6', name: 'Agripreneurship', pct: 42 },
                                { id: '7', name: 'Tech', pct: 27 },
                            ].map(mod => (
                                <div key={mod.id} className="w-full">
                                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                                        <span className="text-slate-300 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#D9A060] shadow-[0_0_5px_rgba(217,160,96,0.5)]"></span>
                                            {mod.id}. {mod.name}
                                        </span>
                                        <span className="text-[#EBC188] font-bold">{mod.pct}%</span>
                                    </div>
                                    <div className="w-full h-[6px] bg-[#111] rounded-full overflow-hidden border border-[#222]">
                                        <div className="h-full bg-gradient-to-r from-[#8A5A2B] via-[#D9A060] to-[#EBC188] rounded-full shadow-[0_0_5px_rgba(217,160,96,0.8)]" style={{ width: `${mod.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CARD 4: COMMUNITY */}
                    <div className={`rounded-[20px] p-4 ${panelBg} border ${borderGradient} shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative`}>
                        <h2 className="text-[14px] font-semibold text-white mb-4">My MindNest Community</h2>
                        
                        <div className="flex justify-between items-center w-full pb-4 mb-4 border-b border-[#333]/50">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <img src="https://i.pravatar.cc/100?img=11" className="w-10 h-10 rounded-full border border-[#D9A060]/50 obj-cover"/>
                                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#4ADE80] rounded-full"></span>
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-semibold text-white leading-tight">Dr. Musa</h4>
                                    <span className="text-[9px] text-[#4ADE80]">Online</span>
                                </div>
                            </div>
                            <button className="bg-gradient-to-r from-[#D9A060] to-[#B67F4B] text-black px-3 py-1.5 rounded-full text-[10px] font-bold">
                                Connect
                            </button>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-[12px] font-semibold text-white mb-2">Discussion Forums</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-[#1a1a1c]/80 border border-[#B67F4B]/40 text-[#EBC188] text-[9px] px-2 py-1 rounded-md">#AfripreneurTips</span>
                                <span className="bg-[#1a1a1c]/80 border border-[#B67F4B]/40 text-[#EBC188] text-[9px] px-2 py-1 rounded-md">#CivicsHub</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-[12px] font-semibold text-white mb-2">Latest Activity</h3>
                            <ul className="text-[9px] text-slate-300 space-y-1.5">
                                <li className="flex items-start gap-1"><span className="text-[#D9A060]">•</span> User92: Ask me about historical sources</li>
                                <li className="flex items-start gap-1"><span className="text-[#D9A060]">•</span> User92: Ask me about historical sources</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[12px] font-semibold text-white mb-2">Upcoming Live Sessions</h3>
                            <ul className="text-[9px] text-slate-300 space-y-1.5">
                                <li className="text-[#EBC188]">May 19: Agripreneurship Workshop</li>
                                <li>May 19: Agripreneurship Workshop</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOATING ACTION CHAT BUBBLE */}
            <button className="fixed bottom-[100px] right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#EBC188] via-[#D9A060] to-[#8A5A2B] rounded-full shadow-[0_5px_15px_rgba(217,160,96,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border border-[#ffe6c4] overflow-hidden">
                <div className="absolute inset-0 bg-black/10 rounded-full"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><circle cx="8" cy="11" r="1.5"/><circle cx="12" cy="11" r="1.5"/><circle cx="16" cy="11" r="1.5"/></svg>
            </button>

            {/* Hidden Drawer for Menu */}
            {showProfileMenu && (
                <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col p-6 animate-fadeIn overflow-y-auto">
                    <button onClick={() => setShowProfileMenu(false)} className="self-end text-3xl text-white mb-6">×</button>
                    
                    <ul className="space-y-4 text-[22px] font-normal text-[#00BFFF]">
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/learn')}>
                            <span className="text-2xl">🚀</span> New Module
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/')}>
                            <span className="text-2xl">🏠</span> Home
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/events')}>
                            <span className="text-2xl">👥</span> Elite Community
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/services')}>
                            <span className="text-2xl">💳</span> My Earnings
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/finance')}>
                            <span className="text-2xl">🛍️</span> Buy Elite
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/stats')}>
                            <span className="text-2xl">📊</span> Leaderboard
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/opportunities')}>
                            <span className="text-2xl">🏷️</span> My Offers
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/stats')}>
                            <span className="text-2xl">📈</span> My Stats
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/docs')}>
                            <span className="text-2xl">🥇</span> Certificates
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/events')}>
                            <span className="text-2xl">🏆</span> Competitions
                        </li>
                        <li className="cursor-pointer flex items-center gap-3" onClick={() => navigate('/learn')}>
                            <span className="text-2xl">📚</span> Academy
                        </li>
                        
                        <li className="cursor-pointer flex items-center gap-3 text-red-500 mt-8 pt-4 border-t border-white/10" onClick={logout}>
                            <span className="text-2xl">🚪</span> Sign Out
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
