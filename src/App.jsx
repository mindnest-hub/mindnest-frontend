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
const Transparency = lazy(() => import('./pages/Transparency'));

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
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home ageGroup={ageGroup} setAgeGroup={setAgeGroup} />} />
              <Route path="/history" element={<History ageGroup={ageGroup} />} />
              <Route path="/finance" element={<Finance ageGroup={ageGroup} />} />
              <Route path="/critical-thinking" element={<CriticalThinking ageGroup={ageGroup} />} />
              <Route path="/agri" element={<Agripreneurship />} />
              <Route path="/tech" element={<Tech />} />
              <Route path="/civics" element={<Civics />} />
              <Route path="/health" element={<Health />} />
              <Route path="/transparency" element={<Transparency />} />
            </Routes>
          </Suspense>
          <Chatbot />
          <DailyBonus />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
