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
    const { points, level } = useGamification();
    const { balance, refreshBalance } = useWallet();
    
    const [showAgeModal, setShowAgeModal] = useState(!ageGroup);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showPaymentPortal, setShowPaymentPortal] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleAgeSelect = (group) => {
        setAgeGroup(group);
        setShowAgeModal(false);
    };

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';

    // MODULE / ACCOUNT MAPPING (Styled as Accounts)
    const modules = [
        { id: 1, title: 'History University', desc: 'Expert Wisdom & Stories', status: 'ACTIVE', type: 'Normal Two Step GOAT', balance: '₦5,000.00', growth: '+₦302.14', action: () => navigate('/history') },
        { id: 2, title: 'Finance Mastery', desc: 'Economic Independence', status: 'LOCKED', type: 'Advanced Challenge Eval', balance: '₦10,000.00', growth: '-₦54.00', action: () => navigate('/finance') },
        { id: 3, title: 'Agri Business', desc: 'Sustainable Growth', status: 'ACTIVE', type: 'Elite Funded Phase', balance: '₦3,000.00', growth: '+₦21.50', action: () => navigate('/agri') },
    ];

    if (isKid) {
        // Keep existing layout for Kids if preferred, or standardizing for now
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white px-4 pb-32 pt-6 font-sans relative overflow-x-hidden">
            <LiveNotifications />
            <DailyBonus />
            
            {showAuthModal && <AuthModal ageGroup={ageGroup} onClose={() => setShowAuthModal(false)} />}
            {showAgeModal && <AgeSelector onSelect={handleAgeSelect} />}
            {showPaymentPortal && <PaymentPortal onClose={() => setShowPaymentPortal(false)} onBalanceUpdate={refreshBalance} />}

            {/* TOP BAR / HEADER */}
            <header className="flex items-center justify-between mb-6 mt-2">
                <button onClick={() => setShowProfileMenu(true)} className="text-3xl font-light opacity-90 transition-opacity active:opacity-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21M3 6H21M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button className="text-2xl relative transition-opacity active:opacity-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="absolute top-[2px] right-[2px] w-2 h-2 bg-red-500 rounded-full border border-black"></span>
                </button>
            </header>

            {/* WELCOME BACK */}
            <h1 className="text-[26px] font-normal tracking-tight mb-8">Welcome Back, {user?.username || 'Victor Chuku'}</h1>

            {/* TOTAL PAYOUT CARD */}
            <section className="bg-[#151518] rounded-[24px] p-6 mb-8 text-center border-none relative">
                <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
                    <span className="text-[#C5A019]">🏛️</span> <span className="text-[14px]">Total Payout</span>
                </div>
                <h2 className="text-5xl font-normal tracking-tight mb-8">
                    ₦{balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </h2>
                
                {/* 3 Sub-boxes inside a darker container */}
                <div className="flex bg-[#1E1E22] p-[10px] rounded-[18px]">
                    <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
                        <span className="text-[11px] text-slate-400 mb-1 tracking-wide">Total Accounts</span>
                        <span className="text-[22px] font-normal">5</span>
                        <div className="absolute right-0 top-[15%] bottom-[15%] w-[1px] bg-white/5"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
                        <span className="text-[11px] text-slate-400 mb-1 tracking-wide">Passed</span>
                        <span className="text-[22px] font-normal">0</span>
                        <div className="absolute right-0 top-[15%] bottom-[15%] w-[1px] bg-white/5"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-2">
                        <span className="text-[11px] text-slate-400 mb-1 tracking-wide">Funded</span>
                        <span className="text-[22px] font-normal">1</span>
                    </div>
                </div>
            </section>

            {/* CAPSULE TABS (Joined Segmented Control) */}
            <div className="bg-[#151518] p-1.5 rounded-full flex gap-1 mb-10 overflow-x-auto no-scrollbar">
                {['All', 'Active', 'Passed', 'Blocked', 'Failed'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all flex-shrink-0 flex-1 ${
                            activeTab === tab 
                            ? 'bg-[#313136] text-white shadow-sm' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ACCOUNT LIST SECTION */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-[17px] font-normal text-slate-100">All Accounts (5)</h3>
                </div>
                
                <div className="space-y-6">
                    {modules.map((mod) => (
                        <div key={mod.id} className="bg-[#151518] rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
                            {/* Account Header */}
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-[18px] font-normal text-white">Account {mod.id} - 31477381{mod.id}</h4>
                                <span className={`px-3 py-1 rounded-[6px] text-[10px] font-bold tracking-wider ${
                                    mod.status === 'ACTIVE' 
                                    ? 'bg-[#0f291e] border border-green-900/50 text-[#4ade80]' 
                                    : 'bg-red-500/10 border border-red-900/50 text-red-500'
                                }`}>
                                    {mod.status}
                                </span>
                            </div>
                            <p className="text-[14px] text-slate-300 mb-6">{mod.type}</p>
                            
                            {/* Stats Columns */}
                            <div className="flex justify-between mb-8">
                                <div>
                                    <p className="text-[11px] text-slate-500 mb-1">Starting Balance</p>
                                    <p className="text-[14px] font-normal ">{mod.balance}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] text-slate-500 mb-1">Current Equity</p>
                                    <p className="text-[14px] font-normal">
                                        ₦{(parseFloat(mod.balance.replace(/[^0-9.-]+/g,"")) + parseFloat(mod.growth.replace(/[^0-9.-]+/g,""))).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] text-slate-500 mb-1">P/L</p>
                                    <p className={`text-[14px] font-normal ${mod.growth.includes('+') ? 'text-[#4ade80]' : 'text-red-500'}`}>
                                        {mod.growth}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={mod.action}
                                    className="flex-1 bg-[#F5C55A] text-black h-[50px] rounded-[16px] font-medium text-[14px] transition-transform active:scale-95 shadow-[0_4px_15px_rgba(245,197,90,0.15)]"
                                >
                                    View Dashboard
                                </button>
                                <button 
                                    onClick={() => navigate('/docs')}
                                    className="flex-1 border border-[#F5C55A] text-[#F5C55A] h-[50px] rounded-[16px] font-medium text-[14px] transition-transform active:scale-95 bg-transparent"
                                >
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
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
                    ></div>
                    
                    {/* Drawer Content */}
                    <div 
                        className="relative w-[80%] max-w-[320px] h-full bg-[#151518] shadow-2xl p-6 flex flex-col border-r border-[#2A2A2E] z-10"
                        style={{ animation: 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                        <style>{`
                            @keyframes slideRight {
                                from { transform: translateX(-100%); }
                                to { transform: translateX(0); }
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                        `}</style>

                        <button onClick={() => setShowProfileMenu(false)} className="text-slate-400 hover:text-white text-3xl self-end mb-8 font-light leading-none">
                            ×
                        </button>
                        
                        <div className="mb-10">
                            <div className="w-20 h-20 bg-[#F5C55A] rounded-full flex items-center justify-center text-black text-3xl font-light mb-4 shadow-xl">
                                {user?.username?.charAt(0)?.toUpperCase() || 'V'}
                            </div>
                            <h2 className="text-2xl font-light tracking-tight">{user?.username || 'Victor Chuku'}</h2>
                            <p className="text-slate-500 text-sm mt-1">{user?.email || 'victor@mindnest.bond'}</p>
                        </div>

                        <div className="flex-1">
                            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4 px-2">Account</div>
                            <ul className="space-y-2 text-[15px] font-light text-slate-300">
                                <li className="hover:bg-[#2A2A2E] p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-4">
                                    <span className="text-xl">⚙️</span> Settings
                                </li>
                                <li className="hover:bg-[#2A2A2E] p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-4">
                                    <span className="text-xl">🔒</span> Security
                                </li>
                                <li className="hover:bg-[#2A2A2E] p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-4">
                                    <span className="text-xl">🎫</span> Subscriptions
                                </li>
                                <li onClick={() => navigate('/services')} className="hover:bg-[#2A2A2E] p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-4">
                                    <span className="text-xl">💳</span> My Payouts
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-[#2A2A2E]">
                            <button 
                                onClick={() => { setShowProfileMenu(false); logout(); }}
                                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-[16px] font-normal text-[15px] active:scale-95 transition-transform"
                            >
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
