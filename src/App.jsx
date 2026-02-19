import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Chatbot from './components/Chatbot';
import DailyBonus from './components/DailyBonus';
import './index.css';

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const History = lazy(() => import('./pages/History'));
const Finance = lazy(() => import('./pages/Finance'));
const CriticalThinking = lazy(() => import('./pages/CriticalThinking'));
const Agripreneurship = lazy(() => import('./pages/Agripreneurship'));
const Tech = lazy(() => import('./pages/Tech'));
const Civics = lazy(() => import('./pages/Civics'));
const Health = lazy(() => import('./pages/Health'));
const Wellness = lazy(() => import('./pages/Wellness'));
const Habits = lazy(() => import('./pages/Habits'));
const Relationships = lazy(() => import('./pages/Relationships'));
const Purpose = lazy(() => import('./pages/Purpose'));
const Transparency = lazy(() => import('./pages/Transparency'));

import WordOriginManager from './components/WordOriginManager';

// Loading fallback component
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#FFD700',
    fontSize: '1.5rem',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #333',
      borderTop: '5px solid #FFD700',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p>Loading...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  const [ageGroup, setAgeGroup] = useState(localStorage.getItem('ageGroup') || null);

  React.useEffect(() => {
    if (ageGroup) {
      localStorage.setItem('ageGroup', ageGroup);
    }
  }, [ageGroup]);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <WordOriginManager ageGroup={ageGroup} />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home ageGroup={ageGroup} setAgeGroup={setAgeGroup} />} />
              <Route path="/history" element={<History ageGroup={ageGroup} />} />
              <Route path="/finance" element={<Finance ageGroup={ageGroup} />} />
              <Route path="/critical-thinking" element={<CriticalThinking ageGroup={ageGroup} />} />
              <Route path="/agri" element={<Agripreneurship ageGroup={ageGroup} />} />
              <Route path="/tech" element={<Tech ageGroup={ageGroup} />} />
              <Route path="/civics" element={<Civics ageGroup={ageGroup} />} />
              <Route path="/health" element={<Health ageGroup={ageGroup} />} />
              <Route path="/wellness" element={<Wellness ageGroup={ageGroup} />} />
              <Route path="/habits" element={<Habits ageGroup={ageGroup} />} />
              <Route path="/relationships" element={<Relationships ageGroup={ageGroup} />} />
              <Route path="/purpose" element={<Purpose ageGroup={ageGroup} />} />
              <Route path="/transparency" element={<Transparency />} />
            </Routes>
            {/* Redirect legacy routes if needed, or just let them 404 if not linked */}
          </Suspense>
          <Chatbot />
          <DailyBonus />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
