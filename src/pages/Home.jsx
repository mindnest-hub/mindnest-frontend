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

    const handleAgeSelect = (group) => {
        setAgeGroup(group);
        setShowAgeModal(false);
    };

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';

    // MODULE / ACCOUNT MAPPING
    const modules = [
        { id: 1, title: 'History University', desc: 'Expert Wisdom & Stories', status: 'ACTIVE', type: 'MindNest Elite Journey', balance: '₦500', growth: '+12.5%', action: () => navigate('/history') },
        { id: 2, title: 'Finance Mastery', desc: 'Economic Independence', status: 'LOCKED', type: 'Advanced Challenge', balance: '₦1,200', growth: '+5.4%', action: () => navigate('/finance') },
        { id: 3, title: 'Agri Business', desc: 'Sustainable Growth', status: 'ACTIVE', type: 'MindNest Elite Journey', balance: '₦300', growth: '+22.1%', action: () => navigate('/agri') },
    ];

    if (isKid) {
        // ... (Keep existing layout for Kids if preferred, or standardizing for now)
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 pb-32 pt-6">
            <LiveNotifications />
            <DailyBonus />
            
            {showAuthModal && <AuthModal ageGroup={ageGroup} onClose={() => setShowAuthModal(false)} />}
            {showAgeModal && <AgeSelector onSelect={handleAgeSelect} />}
            {showPaymentPortal && <PaymentPortal onClose={() => setShowPaymentPortal(false)} onBalanceUpdate={refreshBalance} />}

            {/* TOP BAR / HEADER */}
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button className="text-2xl opacity-80">☰</button>
                    <h1 className="text-xl font-bold tracking-tight">Welcome Back, {user?.username || 'Victor Chuku'}</h1>
                </div>
                <button className="text-2xl relative">
                    🔔
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
                </button>
            </header>

            {/* SUMMARY EARNINGS CARD */}
            <section className="bg-[#111] border border-white/5 rounded-[32px] p-8 mb-8 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-500 mb-2 uppercase text-[10px] font-black tracking-[0.2em]">
                    <span>🏦</span> MindNest Earnings
                </div>
                <h2 className="text-6xl font-black tracking-tighter mb-8 leading-none">
                    ₦{balance.toLocaleString()}
                </h2>
                
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#1a1a1a] p-4 rounded-2xl flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase mb-2">Total Modules</span>
                        <span className="text-2xl font-bold">5</span>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 rounded-2xl flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase mb-2">Mastered</span>
                        <span className="text-2xl font-bold">0</span>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 rounded-2xl flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase mb-2">Elite</span>
                        <span className="text-2xl font-bold">1</span>
                    </div>
                </div>
            </section>
            {/* DAILY MISSION SIGNAL */}
            <DailyMissionBanner />

            {/* CAPSULE TABS */}
            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                {['All', 'Active', 'Mastered', 'Blocked', 'Failed'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pill-tab ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ACCOUNT LIST SECTION */}
            <section>
                <h3 className="text-lg font-bold mb-6">All Modules ({modules.length})</h3>
                
                <div className="space-y-6">
                    {modules.map((mod) => (
                        <div key={mod.id} className="bg-[#111] border border-white/5 rounded-[30px] p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-bold">{mod.title} - MN314773{mod.id}</h4>
                                <span className={`badge-status ${mod.status === 'ACTIVE' ? 'badge-active' : 'bg-red-500/10 text-red-500 opacity-50'}`}>
                                    {mod.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">{mod.type}</p>
                            
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Target</p>
                                    <p className="text-sm font-bold">{mod.balance}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Growth</p>
                                    <p className="text-sm font-bold">{mod.growth}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Earnings Points</p>
                                    <p className="text-sm font-bold text-green-400">+{points}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={mod.action}
                                    className="bg-[#C5A019] text-black h-12 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#D4B02A] transition-colors"
                                >
                                    View Dashboard
                                </button>
                                <button 
                                    onClick={() => navigate('/docs')}
                                    className="border border-[#C5A019] text-[#C5A019] h-12 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#C5A019]/5 transition-colors"
                                >
                                    Certificates
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
