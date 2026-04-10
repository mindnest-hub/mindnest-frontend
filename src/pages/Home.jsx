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
    const [activeTab, setActiveTab] = useState('All');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // DUMMY ACCOUNTS TO MATCH SCREENSHOT
    const accounts = [
        { 
            id: 1, 
            accountNumber: '314773817',
            status: 'ACTIVE', 
            type: 'Normal Two Step GOAT', 
            startingBalance: '$5,000.00',
            currentEquity: '$5,302.14',
            pl: '+$302.14',
            isPositive: true 
        }
    ];

    return (
        <div className="min-h-screen bg-[#000000] text-white px-4 pb-32 pt-6 font-sans relative overflow-x-hidden">
            
            {/* TOP BAR / HEADER */}
            <header className="flex items-center justify-between mb-6 mt-2">
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
            <h1 className="text-[24px] font-normal tracking-tight mb-8">Welcome Back, {user?.username || 'Victor Chuku'}</h1>

            {/* TOTAL PAYOUT CARD */}
            <section className="bg-[#121214] rounded-[24px] p-6 mb-8 text-center shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[#F5C55A] text-lg">🏛️</span> 
                    <span className="text-[14px] text-slate-400 font-medium">Total Payout</span>
                </div>
                <h2 className="text-[52px] font-normal tracking-tight mb-8">
                    $0.00
                </h2>
                
                {/* 3 Distinct Sub-boxes */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#1A1A1E] rounded-[16px] py-4 flex flex-col items-center justify-center">
                        <span className="text-[11px] text-slate-400 mb-1">Total Accounts</span>
                        <span className="text-[24px] font-normal">5</span>
                    </div>
                    <div className="bg-[#1A1A1E] rounded-[16px] py-4 flex flex-col items-center justify-center">
                        <span className="text-[11px] text-slate-400 mb-1">Passed</span>
                        <span className="text-[24px] font-normal">0</span>
                    </div>
                    <div className="bg-[#1A1A1E] rounded-[16px] py-4 flex flex-col items-center justify-center">
                        <span className="text-[11px] text-slate-400 mb-1">Funded</span>
                        <span className="text-[24px] font-normal">1</span>
                    </div>
                </div>
            </section>

            {/* CAPSULE TABS */}
            <div className="bg-[#111113] p-1.5 rounded-[24px] flex justify-between mb-10 overflow-hidden">
                {['All', 'Active', 'Passed', 'Blocked', 'Failed'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2.5 px-3 rounded-full text-[13px] font-medium transition-all ${
                            activeTab === tab 
                            ? 'bg-[#2A2A2E] text-white' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ACCOUNT LIST SECTION */}
            <section>
                <div className="mb-4">
                    <h3 className="text-[18px] font-normal text-white">All Accounts (5)</h3>
                </div>
                
                <div className="space-y-6">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="bg-[#121214] rounded-[24px] p-5">
                            {/* Account Header */}
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-[17px] font-normal text-white">Account {acc.id} - {acc.accountNumber}</h4>
                                <span className={`px-3 py-1 rounded-[6px] text-[10px] font-bold tracking-wider ${
                                    acc.status === 'ACTIVE' 
                                    ? 'bg-[#0F291E] text-[#4ADE80]' 
                                    : 'bg-red-900/30 text-red-500'
                                }`}>
                                    {acc.status}
                                </span>
                            </div>
                            <p className="text-[14px] text-slate-300 mb-6">{acc.type}</p>
                            
                            {/* Stats Columns */}
                            <div className="flex justify-between mb-8 pr-2">
                                <div>
                                    <p className="text-[11px] text-slate-500 mb-1">Starting Balance</p>
                                    <p className="text-[15px] font-normal">{acc.startingBalance}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] text-slate-500 mb-1">Current Equity</p>
                                    <p className="text-[15px] font-normal">{acc.currentEquity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] text-slate-500 mb-1">P/L</p>
                                    <p className={`text-[15px] font-normal ${acc.isPositive ? 'text-[#4ADE80]' : 'text-red-500'}`}>
                                        {acc.pl}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button className="flex-1 bg-[#F5C55A] text-black h-[50px] rounded-[20px] font-medium text-[14px] active:scale-95 transition-transform">
                                    View Dashboard
                                </button>
                                <button className="flex-1 border border-[#F5C55A] text-[#F5C55A] h-[50px] rounded-[20px] font-medium text-[14px] active:scale-95 transition-transform bg-transparent">
                                    Show Credentials
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
