import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import WithdrawalModal from '../components/WithdrawalModal';
import PaymentPortal from '../components/PaymentPortal';

const WEEKLY_CHALLENGES = [
    { week: 1, title: 'Finance Mastery Sprint', desc: 'Complete 3 Finance challenges this week', reward: '+500 XP + ₦200 bonus', module: '/finance', emoji: '💰' },
    { week: 2, title: 'History Champion', desc: 'Score 80%+ on the History deep-dive quiz', reward: '+400 XP + Elite badge', module: '/history', emoji: '📜' },
    { week: 3, title: 'Agri-Tycoon Race', desc: 'Harvest 3 crops before Friday', reward: '+600 XP + ₦300 bonus', module: '/agri', emoji: '🌾' },
    { week: 4, title: 'Critical Thinking Elite', desc: 'Solve all 5 river crossing puzzles', reward: '+300 XP + Rank-up', module: '/critical-thinking', emoji: '🧠' },
];

// Get current week of year
const getWeekNumber = () => Math.ceil((new Date().getDate()) / 7);
const currentChallenge = WEEKLY_CHALLENGES[(getWeekNumber() - 1) % WEEKLY_CHALLENGES.length];

const Services = () => {
    const { user } = useAuth();
    const { balance } = useWallet();
    const isKid = user?.ageGroup?.toLowerCase() === 'kids';
    const isElite = user?.isElite && (!user?.eliteExpires || new Date(user.eliteExpires) > new Date());

    const [showWithdrawal, setShowWithdrawal] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const fullServices = [
        {
            id: 'land',
            title: 'Land & Property Verification',
            partner: 'Rollin Stone Properties Ltd',
            icon: '🏢',
            desc: 'Expert verification of C of O, Governors Consent, and land surveying. Buy safely with our verified partners.',
            color: '#B8860B',
            visible: !isKid
        },
        {
            id: 'legal',
            title: 'Legal Help Desk',
            partner: 'MindNest Legal Partners',
            icon: '⚖️',
            desc: 'Get professional legal advice on tenancy, contracts, and citizen rights from certified lawyers.',
            color: '#FF4500',
            visible: !isKid
        },
        {
            id: 'junior_support',
            title: 'Junior Tech Mentorship',
            partner: 'MindNest Hub',
            icon: '🛡️',
            desc: 'Get matched with a verified mentor to help with your coding or history projects.',
            color: '#00BFFF',
            visible: isKid
        },
        {
            id: 'business',
            title: 'Business Registration (CAC)',
            partner: 'Enterprise Hub',
            icon: '📈',
            desc: 'Fast tracking your business registration and obtaining tax identification numbers (TIN).',
            color: '#00A86B',
            visible: !isKid
        },
        {
            id: 'contracts',
            title: 'Contract Review',
            partner: 'MindNest Legal',
            icon: '📄',
            desc: 'Professional review of your employment, rental, or business partnership contracts.',
            color: '#4682B4',
            visible: !isKid
        }
    ];

    const services = fullServices.filter(s => s.visible);

    return (
        <div className="section animate-fade">
            {showWithdrawal && <WithdrawalModal onClose={() => setShowWithdrawal(false)} />}
            {showPayment && <PaymentPortal onClose={() => setShowPayment(false)} />}

            {/* ─── EARNINGS & WITHDRAWAL BANNER ─── */}
            {!isKid && (
                <div className="bg-[#111] border border-white/5 rounded-[32px] p-7 mb-10 flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">🏆 My MindNest Earnings</p>
                        <p className="text-4xl font-black text-[#C5A019]">₦{balance.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {isElite ? '✅ Elite Status — Eligible to Withdraw' : '🔒 Upgrade to Elite to unlock withdrawals'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowPayment(true)}
                            className="btn btn-outline px-6 py-3 font-bold text-sm border-slate-700 hover:border-[#C5A019]"
                        >
                            💳 Top Up / Upgrade Elite
                        </button>
                        <button
                            onClick={() => setShowWithdrawal(true)}
                            className={`px-6 py-3 rounded-xl font-black text-sm transition-all active:scale-95 ${isElite ? 'bg-[#C5A019] text-black' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}
                            disabled={!isElite}
                        >
                            💸 Request Withdrawal
                        </button>
                    </div>
                </div>
            )}

            {/* ─── LIVE WEEKLY CHALLENGE ─── */}
            <div className="bg-gradient-to-r from-[#C5A019]/10 to-transparent border border-[#C5A019]/20 rounded-[28px] p-6 mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A019] mb-1">⚡ LIVE Weekly Challenge</p>
                    <h3 className="text-lg font-black text-white mb-1">{currentChallenge.emoji} {currentChallenge.title}</h3>
                    <p className="text-sm text-slate-400">{currentChallenge.desc}</p>
                    <p className="text-xs text-green-400 mt-1 font-bold">Reward: {currentChallenge.reward}</p>
                </div>
                <a href={`#${currentChallenge.module}`}
                    className="bg-[#C5A019] text-black px-6 py-3 rounded-xl font-black text-sm whitespace-nowrap active:scale-95 transition-transform">
                    Accept Challenge →
                </a>
            </div>

            {/* ─── TITLE ─── */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-3 text-white">
                    {isKid ? "Junior Support Hub 🛡️" : "Professional Services Hub 🏛️"}
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    {isKid
                        ? "Connect with verified mentors to help you grow your skills safely."
                        : "Connect with verified experts to secure your assets and protect your rights."}
                </p>
            </div>

            {/* ─── SERVICE CARDS ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map(service => (
                    <div key={service.id} className="card group hover:bg-slate-900 border-slate-800 transition-all p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <span className="text-[10px] bg-slate-800/50 text-yellow-400 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Verified Partner</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{service.title}</h3>
                        <p className="text-slate-500 text-sm font-medium mb-4 italic">by {service.partner}</p>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">{service.desc}</p>
                        <div className="flex flex-col gap-3">
                            <button className="btn btn-primary w-full py-4 font-bold shadow-lg shadow-yellow-500/10">
                                {isKid ? "Request Mentor" : "Book Consultation"}
                            </button>
                            <button className="btn btn-outline w-full py-3 text-xs font-bold">View Service Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── PARTNER CTA ─── */}
            <div className="mt-20 p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    {isKid ? "Want to become a Junior Leader? 🌟" : "Are you a Professional Service Provider? 🤝"}
                </h2>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                    {isKid
                        ? "Join our leadership program and earn special badges for helping others in the community."
                        : "Join the MindNest ecosystem as a verified partner and help thousands of Africans make safe, informed decisions."}
                </p>
                <button className="btn btn-outline px-12 py-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 font-bold">
                    {isKid ? "Apply for Leadership" : "Apply for Partnership"}
                </button>
            </div>
        </div>
    );
};

export default Services;
