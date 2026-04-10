import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0A0A0C] border-t border-white/5 py-2 px-4 z-50 flex items-center justify-between h-[85px] pb-5">
      
      {/* LEARNING */}
      <NavLink
        to="/"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#F5C55A]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl mt-1">📖</span>
        <span className="text-[10px] font-medium tracking-tight mt-1">Learning</span>
      </NavLink>

      {/* MY PROGRESS */}
      <NavLink
        to="/stats"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#F5C55A]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl mt-1">📊</span>
        <span className="text-[10px] font-medium tracking-tight whitespace-nowrap mt-1">My Progress</span>
      </NavLink>

      {/* NEW COURSE (+) */}
      <div className="relative -top-4">
        <button 
          onClick={() => navigate('/learn')}
          className="w-[64px] h-[64px] bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.5)] border-[5px] border-[#0A0A0C] transition-transform active:scale-95"
        >
          <span className="text-3xl text-black font-semibold">+</span>
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-[68px] text-[10px] font-medium text-slate-300 whitespace-nowrap tracking-wide">New Course</span>
      </div>

      {/* CERTIFICATES */}
      <NavLink
        to="/services"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#F5C55A]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl mt-1">💳</span>
        <span className="text-[10px] font-medium tracking-tight whitespace-nowrap mt-1">Certificates</span>
      </NavLink>

      {/* PROFILE */}
      <NavLink
        to="/profile"
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all ${
            isActive ? 'text-[#F5C55A]' : 'text-slate-600'
          }`
        }
      >
        <span className="text-2xl mt-1">👤</span>
        <span className="text-[10px] font-medium tracking-tight whitespace-nowrap mt-1">Profile</span>
      </NavLink>

    </nav>
  );
};

export default BottomNav;
