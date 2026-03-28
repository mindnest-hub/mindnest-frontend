import React from 'react';

const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
    <h1 className="text-4xl font-bold mb-4 text-yellow-400">{title}</h1>
    <p className="text-slate-400 text-lg">This section is coming soon! 🦁✨</p>
  </div>
);

export const Dashboard = () => <PlaceholderPage title="Dashboard" />;
export const ServicesHub = () => <PlaceholderPage title="Professional Services" />;
export const PartnersPage = () => <PlaceholderPage title="Partners Section" />;
export const MemberProfile = () => <PlaceholderPage title="My Profile" />;
