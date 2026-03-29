import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useWallet } from '../hooks/useWallet';

const Sidebar = ({ setAgeGroup }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { points, level, rank } = useGamification();
  const { balance } = useWallet();

  const resetAge = () => {
    localStorage.removeItem('ageGroup');
    setAgeGroup(null);
    navigate('/');
  };

  const menuItems = [
    { name: 'New Module', path: '/learn', icon: '🚀', isNew: true },
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Elite Community', path: '/community', icon: '👥' },
    { name: 'My Earnings', path: '/services', icon: '💳' },
    { name: 'Buy Elite', path: '/services', icon: '🛍️' },
    { name: 'Leaderboard', path: '#', icon: '📊' },
    { name: 'My Offers', path: '/opportunities', icon: '🏷️' },
    { name: 'My Stats', path: '#', icon: '📈' },
    { name: 'Certificates', path: '#', icon: '🏅' },
    { name: 'Competitions', path: '/community', icon: '🏆' },
    { name: 'Academy', path: '/learn', icon: '📚' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#0a0a0a] text-white min-h-screen fixed left-0 top-0 border-r border-white/5 z-50">
      {/* BRAND HEADER */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl shadow-white/10">
          <span className="text-2xl">🦁</span>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white leading-none">MINDNEST</h1>
          <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Africa Elite</span>
        </div>
      </div>

      {/* CURRENT ACCOUNT SELECTOR */}
      <div className="px-6 mb-6">
        <div 
          onClick={() => navigate('/profile')}
          className="bg-[#111] border border-white/5 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#161616] transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm">💳</div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Current Balance</p>
              <p className="text-sm font-bold text-white leading-none">₦{balance.toLocaleString()}</p>
            </div>
          </div>
          <span className="text-slate-600 group-hover:text-white transition-colors">▼</span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive && item.path !== '#'
                ? 'bg-white/5 text-yellow-400' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-4">
              <span className={`text-xl transition-transform group-hover:scale-110 ${item.path !== '#' && 'group-[.active]:text-yellow-400'}`}>
                {item.icon}
              </span>
              <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
            </div>
            {item.locked && (
              <span className="text-xs opacity-40">🔒</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM TOOLS */}
      <div className="p-6 border-t border-white/5 bg-[#080808]">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Tools & Settings</p>
        <button 
          onClick={resetAge}
          className="flex items-center gap-4 px-4 py-2 w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"
        >
          <span className="text-lg">⚙️</span>
          <span className="text-xs font-bold">Switch Mode</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
