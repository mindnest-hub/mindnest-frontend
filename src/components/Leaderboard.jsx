import React, { useEffect, useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useWallet } from '../hooks/useWallet';

const Leaderboard = ({ onClose }) => {
    const { getLeaderboard, getUserRank } = useLeaderboard();
    const { verifyLocation, isLoading: isLocating } = useLocation();
    const { user } = useAuth();
    const { points } = useGamification();
    const { balance } = useWallet();

    const [list, setList] = useState([]);
    const [rank, setRank] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL');
    const [userLoc, setUserLoc] = useState(() => JSON.parse(localStorage.getItem('userLocation')) || null);

    useEffect(() => {
        // Initial data sync
        setList(getLeaderboard());
        setRank(getUserRank());

        // Automatic location check if not verified
        if (!userLoc) {
            handleVerify();
        }
    }, []);

    const handleVerify = async () => {
        const result = await verifyLocation();
        if (result) setUserLoc(result);
        setList(getLeaderboard()); // Refresh to show flags if synced
    };

    // --- PODIUM LAYOUT ---
    // 1st (list[0]), 2nd (list[1]), 3rd (list[2])
    const topThree = list.slice(0, 3);
    const others = list.slice(3);

    return (
        <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto no-scrollbar pt-6 pb-20 animate-[slideIn_0.3s_ease]">
            {/* HEADER */}
            <header className="flex items-center justify-between px-6 mb-12">
                <button onClick={onClose} className="text-2xl opacity-80">☰</button>
                <h1 className="text-xl font-bold tracking-tight">Leaderboard</h1>
                <button className="text-2xl relative">
                    🔔
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
                </button>
            </header>

            {/* PODIUM SECTION */}
            <section className="px-6 mb-12 relative flex items-end justify-center gap-4 text-center">
                {/* 2ND PLACE */}
                {topThree[1] && (
                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                        <span className="text-2xl mb-1">🌐</span>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">
                             - 
                        </p>
                        <p className="text-[11px] font-bold text-slate-300 truncate w-full mb-1">
                            {topThree[1].username}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mb-4">₦{topThree[1].totalEarnings.toLocaleString()}</p>
                        <div className="w-full bg-[#1a1a1a] border border-white/5 rounded-t-xl p-4 shadow-xl">
                            <img src="https://img.icons8.com/color/96/000000/trophy.png" className="w-16 grayscale opacity-60 m-auto mt-2" alt="Silver Trophy" />
                        </div>
                    </div>
                )}

                {/* 1ST PLACE */}
                {topThree[0] && (
                    <div className="flex flex-col items-center flex-1 max-w-[140px] transform -translate-y-4">
                        <span className="text-4xl mb-2">{userLoc?.flag || '🇳🇬'}</span>
                        <p className="text-[12px] font-black text-white truncate w-full mb-1">
                            {topThree[0].username}
                        </p>
                        <p className="text-[11px] text-slate-500 font-bold mb-4">₦{topThree[0].totalEarnings.toLocaleString()}</p>
                        <div className="w-full bg-[#111] border border-[#C5A019]/20 rounded-t-2xl p-6 shadow-2xl relative">
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#C5A019]/10 rounded-full blur-2xl"></div>
                            <img src="https://img.icons8.com/color/144/000000/trophy.png" className="w-24 m-auto relative z-10" alt="Gold Trophy" />
                        </div>
                    </div>
                )}

                {/* 3RD PLACE */}
                {topThree[2] && (
                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                        <span className="text-2xl mb-1">🌍</span>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">
                             - 
                        </p>
                        <p className="text-[11px] font-bold text-slate-300 truncate w-full mb-1">
                            {topThree[2].username}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mb-4">₦{topThree[2].totalEarnings.toLocaleString()}</p>
                        <div className="w-full bg-[#1a1a1a] border border-white/5 rounded-t-xl p-4 shadow-xl">
                            <img src="https://img.icons8.com/color/96/000000/trophy.png" className="w-14 hue-rotate-180 opacity-50 m-auto mt-2" alt="Bronze Trophy" />
                        </div>
                    </div>
                )}
            </section>

            {/* TOP ACCOUNTS SECTION */}
            <section className="px-6">
                <h2 className="text-xl font-bold mb-6">Top Accounts</h2>

                {/* TABS */}
                <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                    <button onClick={() => setActiveTab('ALL')} className={`pill-tab ${activeTab === 'ALL' ? 'active' : ''}`}>ALL</button>
                    <button onClick={() => setActiveTab('T1')} className={`pill-tab ${activeTab === 'T1' ? 'active' : ''}`}>-₦182 - ₦249,860</button>
                    <button onClick={() => setActiveTab('T2')} className={`pill-tab ${activeTab === 'T2' ? 'active' : ''}`}>₦249k - ₦499k</button>
                </div>

                {/* TABLE */}
                <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                                <th className="px-5 py-4">RANK</th>
                                <th className="px-5 py-4">NAME</th>
                                <th className="px-5 py-4">EQUITY</th>
                                <th className="px-5 py-4 text-right">PROFIT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {list.map((u, i) => (
                                <tr 
                                    key={u.username} 
                                    className={`text-[12px] group hover:bg-white/5 transition-colors ${u.username === user?.username && 'bg-[#C5A019]/5'}`}
                                >
                                    <td className="px-5 py-5 font-bold text-slate-400">#{i + 1}</td>
                                    <td className="px-5 py-5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg opacity-80">{u.username === user?.username ? userLoc?.flag || '🇳🇬' : '🌐'}</span>
                                            <span className="font-bold tracking-tight text-white">{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 font-bold">₦{u.totalEarnings.toLocaleString()}</td>
                                    <td className="px-5 py-5 text-right font-black text-green-400">
                                        +{Math.floor(u.totalEarnings / 10).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {list.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-xs">
                                        No Mastered Journeys Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* VERIFICATION PROMPT */}
                {!userLoc && (
                    <div className="mt-8 bg-[#C5A019]/10 border border-[#C5A019]/30 p-6 rounded-[28px] text-center">
                        <p className="text-[11px] font-black uppercase tracking-widest text-[#C5A019] mb-4">Location Verification Required</p>
                        <p className="text-xs text-slate-400 mb-6">Verify your real location to claim your official country flag and rank globally.</p>
                        <button 
                            disabled={isLocating}
                            onClick={handleVerify}
                            className="w-full bg-[#C5A019] text-black h-12 rounded-xl font-bold transition-transform active:scale-95"
                        >
                            {isLocating ? 'Verifying Signal...' : 'Verify Real User'}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Leaderboard;
