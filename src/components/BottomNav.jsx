import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 py-2 px-4 z-50 flex items-center justify-between h-[85px]">
      
      {/* HOME */}
      <NavLink
        to="/"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#C5A019]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl">🏠</span>
        <span className="text-[10px] font-bold tracking-tight">Home</span>
      </NavLink>

      {/* MY STATS */}
      <NavLink
        to="/stats"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#C5A019]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl">📊</span>
        <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">My Stats</span>
      </NavLink>

      {/* NEW CHALLENGE (+) */}
      <div className="relative -top-3">
        <button 
          onClick={() => navigate('/learn')}
          className="w-[68px] h-[68px] bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-[6px] border-[#0a0a0a] transition-transform active:scale-90"
        >
          <span className="text-4xl text-black font-light">+</span>
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-[72px] text-[10px] font-bold text-white whitespace-nowrap uppercase tracking-tighter">New Challenge</span>
      </div>

      {/* MY EARNINGS */}
      <NavLink
        to="/services"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#C5A019]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl">💼</span>
        <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">My Earnings</span>
      </NavLink>

      {/* MY OFFERS */}
      <NavLink
        to="/opportunities"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#C5A019]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl">🎁</span>
        <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">My Offers</span>
      </NavLink>

    </nav>
  );
};

export default BottomNav;
