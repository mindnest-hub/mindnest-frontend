import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const MainLayout = ({ children, setAgeGroup }) => {
  const location = useLocation();
  // Home page gets full-bleed layout (no padding, no sidebar offset)
  const isHome = location.pathname === '/';

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar — desktop only, never on home */}
      {!isHome && <Sidebar setAgeGroup={setAgeGroup} />}

      {/* Main Content Area */}
      <main
        className={
          isHome
            ? 'flex-1 mb-20 lg:mb-0'                        // home: no padding, no offset
            : 'flex-1 lg:ml-64 mb-20 lg:mb-0 p-4 lg:p-8'  // other pages: normal layout
        }
      >
        {isHome ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto">{children}</div>
        )}
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNav setAgeGroup={setAgeGroup} />
    </div>
  );
};

export default MainLayout;
