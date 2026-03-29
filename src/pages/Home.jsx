import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgeSelector from '../components/AgeSelector';
import DailyBonus from '../components/DailyBonus';
import Leaderboard from '../components/Leaderboard';
import LiveNotifications from '../components/LiveNotifications';
import AuthModal from '../components/AuthModal';
import PaymentPortal from '../components/PaymentPortal';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useWallet } from '../hooks/useWallet';

const Home = ({ ageGroup, setAgeGroup }) => {
    const navigate = useNavigate();
    const { user, logout, deleteAccount, upgradeToElite } = useAuth();
    const { points, level, streak, getRankInfo, getNextRankInfo } = useGamification();
    const { balance, refreshBalance } = useWallet();
    
    const [showAgeModal, setShowAgeModal] = useState(!ageGroup);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showPaymentPortal, setShowPaymentPortal] = useState(false);
    const [upgrading, setUpgrading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const rank = getRankInfo();
    const nextRank = getNextRankInfo();
    const progressToNext = nextRank ? (points / nextRank.min) * 100 : 100;

    const handleAgeSelect = (group) => {
        setAgeGroup(group);
        setShowAgeModal(false);
    };

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const isAdult = !isKid && !isTeen;

    const dashboardItems = [
        { 
            id: 'learning',
            title: isKid ? 'Adventure Learning' : 'Expert Modules', 
            icon: '📚', 
            content: isKid ? 'History: Heroes of the Past' : 'History: Discovering African Wisdom',
            progress: 65,
            meta: isKid ? 'Win Junior XP!' : '3 expert lessons left',
            action: () => navigate('/history'),
            color: '#C5A019',
            visible: true
        },
        { 
            id: 'ai',
            title: isKid ? 'Smart Mascot AI' : 'Ask AI Expert', 
            icon: '🤖', 
            content: isKid ? 'Ask me anything about Africa!' : 'Need help with land or business?',
            meta: isKid ? 'Your friendly learning guide' : 'Instant answers on laws & rights',
            action: () => navigate('/ai'),
            color: '#00BFFF',
            visible: true
        },
        { 
            id: 'ops',
            title: isKid ? 'Junior Scholarships' : 'Economic Opportunities', 
            icon: '💼', 
            content: isKid ? 'School & Tech Competitions' : 'Agri Business Training available now',
            meta: isKid ? 'Apply for school rewards' : '2 new grants found',
            action: () => navigate('/opportunities'),
            color: '#006B3C',
            visible: true
        },
        { 
            id: 'legal',
            title: 'Professional Services', 
            icon: '⚖️', 
            content: 'Legal & Land Consultation',
            meta: 'Verified expert partners',
            action: () => navigate('/services'),
            color: '#FF4500',
            visible: !isKid
        }
    ].filter(item => item.visible);

    return (
        <div className="dashboard-wrapper animate-fade">
            <LiveNotifications />
            <DailyBonus />
            
            {showAuthModal && <AuthModal ageGroup={ageGroup} onClose={() => setShowAuthModal(false)} />}
            {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
            {showAgeModal && <AgeSelector onSelect={handleAgeSelect} />}
            {showPaymentPortal && <PaymentPortal onClose={() => setShowPaymentPortal(false)} onBalanceUpdate={refreshBalance} />}

            {/* WELCOME SECTION */}
            <header className="mb-8 mt-4 lg:mt-0 px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            Welcome, {user?.username || 'Champion'} 🦁
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!user && (
                            <button onClick={() => setShowAuthModal(true)} className="btn btn-primary px-6 py-2">
                                Complete Signup
                            </button>
                        )}
                        {user?.isAdmin && (
                            <button onClick={() => navigate('/admin')} className="btn btn-outline px-4 py-2 border-yellow-400 text-yellow-400">
                                ⚙️ Admin
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* QUICK STATS BAR */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Level', val: level, icon: rank.icon, color: 'var(--color-primary)' },
                    { label: 'Points', val: points.toLocaleString(), icon: '💰', color: '#fbbf24' },
                    { label: 'Streak', val: `${streak} Days`, icon: '🔥', color: '#f97316' },
                    { label: 'Wallet', val: `₦${balance.toLocaleString()}`, icon: '💳', color: '#10b981' },
                ].map((stat, i) => (
                    <div key={i} className="card p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl mb-1">{stat.icon}</span>
                        <span className="text-xs uppercase tracking-widest text-slate-500 mb-1">{stat.label}</span>
                        <span className="text-xl font-bold" style={{ color: stat.color }}>{stat.val}</span>
                    </div>
                ))}
            </section>

            {/* DASHBOARD GRID */}
            <section className="grid-cols md:grid-cols-2 lg:grid-cols-2 gap-6">
                {dashboardItems.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={item.action}
                        className="card group cursor-pointer border-l-4 p-6 transition-all hover:bg-slate-900"
                        style={{ borderLeftColor: item.color }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full uppercase tracking-widest">
                                {item.title}
                            </span>
                        </div>
                        <h3 className="text-xl mb-2 group-hover:text-yellow-400 transition-colors">
                            {item.content}
                        </h3>
                        {item.progress !== undefined ? (
                            <div className="mt-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Progress</span>
                                    <span className="text-yellow-400">{item.progress}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-yellow-400 transition-all duration-1000" 
                                        style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">{item.meta}</p>
                            </div>
                        ) : (
                             <p className="text-sm text-slate-500">{item.meta}</p>
                        )}
                    </div>
                ))}
            </section>

            {/* ANNOUNCEMENT BANNER */}
            {user && !user.isElite && (
                <div className="mt-8 relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Become an Elite Member 💎</h2>
                            <p className="text-slate-400 max-w-lg">
                                Unlock unlimited AI consultations, professional document reviews, and advanced learning modules.
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowPaymentPortal(true)}
                            className="btn btn-primary bg-yellow-400 text-slate-950 hover:bg-yellow-300 font-bold px-10 py-4 shadow-xl shadow-yellow-500/20"
                        >
                            UPGRADE NOW 🚀
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>
            )}
            
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4">
                    <div className="card max-w-md p-8 text-center bg-slate-900 border-red-500/50">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Delete Account? ⚠️</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            This action is permanent and will erase all your progress, points, and digital identity.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 btn btn-outline py-3">Keep It</button>
                            <button onClick={() => logout()} className="flex-1 btn bg-red-600 text-white hover:bg-red-700 py-3">Delete Forever</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
