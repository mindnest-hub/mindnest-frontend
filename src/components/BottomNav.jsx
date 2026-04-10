import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50 pointer-events-none pb-2">
      {/* Container simulating the shaped cutout background */}
      <div className="mx-2 bg-[#121214]/95 backdrop-blur-xl border border-[#B67F4B]/30 rounded-[30px] flex items-center justify-between h-[80px] px-4 shadow-[0_-5px_15px_rgba(217,160,96,0.05)] pointer-events-auto" style={{ backgroundImage: 'linear-gradient(135deg, rgba(217,160,96,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
        
        {/* COMMUNITY */}
        <NavLink
            to="/events"
            className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-1 min-w-[55px] transition-all ${
                isActive ? 'text-[#EBC188]' : 'text-[#8A5A2B]'
            }`
            }
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="text-[10px] font-medium tracking-tight mt-1">Community</span>
        </NavLink>

        {/* INSIGHTS */}
        <NavLink
            to="/stats"
            className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-1 min-w-[55px] transition-all ${
                isActive ? 'text-[#EBC188]' : 'text-[#8A5A2B]'
            }`
            }
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span className="text-[10px] font-medium tracking-tight mt-1">Insights</span>
        </NavLink>

        {/* ADD PATH (+) */}
        <div className="relative -top-6">
            <button 
                onClick={() => navigate('/learn')}
                className="w-[60px] h-[60px] rounded-[18px] bg-gradient-to-b from-[#111] to-[#050505] flex items-center justify-center shadow-[0_5px_15px_rgba(217,160,96,0.3)] border border-[#EBC188]/80 transition-transform active:scale-95"
            >
                <span className="text-3xl text-[#EBC188] font-light">+</span>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-[66px] text-[10px] font-semibold text-[#D9A060] whitespace-nowrap tracking-wide leading-none">Add Path</span>
        </div>

        {/* MY AWARDS */}
        <NavLink
            to="/opportunities"
            className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-1 min-w-[55px] transition-all ${
                isActive ? 'text-[#EBC188]' : 'text-[#8A5A2B]'
            }`
            }
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap mt-1">My Awards</span>
        </NavLink>

        {/* SUPPORT */}
        <NavLink
            to="/services"
            className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-1 min-w-[55px] transition-all ${
                isActive ? 'text-[#EBC188]' : 'text-[#8A5A2B]'
            }`
            }
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] font-medium tracking-tight mt-1">Support</span>
        </NavLink>

      </div>
    </nav>
  );
};

export default BottomNav;
