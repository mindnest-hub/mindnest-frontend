import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Learn', path: '/learn', icon: '📚' },
    { name: 'AI Expert', path: '/ai', icon: '🤖' },
    { name: 'Community', path: '/community', icon: '👥' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-slate-900 border-t border-slate-800 px-2 py-3 z-50 flex items-center justify-around translate-y-0">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-colors duration-200 ${
              isActive ? 'text-yellow-400' : 'text-slate-400'
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-medium tracking-wide uppercase">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
