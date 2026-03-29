import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const MainLayout = ({ children, setAgeGroup }) => {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar for Desktop */}
      <Sidebar setAgeGroup={setAgeGroup} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 mb-20 lg:mb-0 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNav setAgeGroup={setAgeGroup} />
    </div>
  );
};

export default MainLayout;
