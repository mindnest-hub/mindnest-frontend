import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MISSIONS = [
    { id: 'finance', label: 'Finance Mission', task: 'Complete 2 Finance challenges today', xp: 200, emoji: '💰', route: '/finance' },
    { id: 'history', label: 'History Deep-Dive', task: 'Read 1 History lesson and answer its quiz', xp: 150, emoji: '📜', route: '/history' },
    { id: 'agri', label: 'Agri Sprint', task: 'Water your farm and harvest a crop', xp: 180, emoji: '🌾', route: '/agri' },
    { id: 'critical', label: 'Brain Challenge', task: 'Solve 1 Critical Thinking puzzle', xp: 120, emoji: '🧠', route: '/critical-thinking' },
    { id: 'civics', label: 'Civics Training', task: 'Spot 2 political tricks in the simulator', xp: 100, emoji: '🏛️', route: '/civics' },
];

const getDayOfWeek = () => new Date().getDay(); // 0=Sun…6=Sat
const todaysMission = MISSIONS[getDayOfWeek() % MISSIONS.length];



const DailyMissionBanner = () => {
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState(() => {
        const saved = localStorage.getItem('missionDismissedDate');
        return saved === new Date().toDateString();
    });
    const [timeLeft, setTimeLeft] = useState('');

    // Countdown to midnight
    useEffect(() => {
        const update = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('missionDismissedDate', new Date().toDateString());
        setDismissed(true);
    };

    if (dismissed) return null;

    return (
        <div className="relative bg-[#0d0d0d] border border-[#C5A019]/30 rounded-[28px] p-5 mb-8 overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-[#C5A019]/5 rounded-full blur-3xl -translate-x-10 -translate-y-10 pointer-events-none" />

            <div className="flex items-start justify-between gap-4 relative">
                <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl mt-1">{todaysMission.emoji}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A019]">⚡ Daily Mission Signal</span>
                            <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-black">Resets in {timeLeft}</span>
                        </div>
                        <h3 className="font-black text-white text-sm mb-0.5">{todaysMission.label}</h3>
                        <p className="text-slate-400 text-xs">{todaysMission.task}</p>
                        <p className="text-green-400 text-[10px] font-bold mt-1">+{todaysMission.xp} XP on completion</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <button onClick={handleDismiss} className="text-slate-600 hover:text-slate-400 text-lg leading-none">×</button>
                    <button
                        onClick={() => navigate(todaysMission.route)}
                        className="bg-[#C5A019] text-black px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap active:scale-95 transition-transform"
                    >
                        Go Now →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyMissionBanner;
