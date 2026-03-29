import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Learn', path: '/learn', icon: '📚' },
    { name: 'AI Expert', path: '/ai', icon: '🤖' },
    { name: 'Community', path: '/community', icon: '👥' },
    { name: 'Opportunities', path: '/opportunities', icon: '💼' },
    { name: 'Services', path: '/services', icon: '🏢' },
    { name: 'Partners', path: '/partners', icon: '🤝' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 border-r border-slate-800 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🦁</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-yellow-400">MindNest</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20' 
                : 'hover:bg-slate-800 text-slate-300'
              }`
            }
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <NavLink 
          to="/settings" 
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-all"
        >
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
