import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import WordOriginManager from './components/WordOriginManager';
import DailyBonus from './components/DailyBonus';

// Pages
import Home from './pages/Home';
import History from './pages/History';
import Finance from './pages/Finance';
import CriticalThinking from './pages/CriticalThinking';
import Agripreneurship from './pages/Agripreneurship';
import Tech from './pages/Tech';
import Civics from './pages/Civics';
import Health from './pages/Health';
import Wellness from './pages/Wellness';
import Habits from './pages/Habits';
import Relationships from './pages/Relationships';
import Purpose from './pages/Purpose';
import Transparency from './pages/Transparency';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const LoadingScreen = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#1a1a1a', color: '#FFD700',
    fontSize: '1.5rem', fontWeight: 'bold'
  }}>
    MindNest is loading... 🦁
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
      <GamificationProvider>
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

                {/* Legacy/Other Routes */}
                <Route path="/health" element={<Health ageGroup={ageGroup} />} />
                <Route path="/wellness" element={<Wellness ageGroup={ageGroup} />} />
                <Route path="/habits" element={<Habits ageGroup={ageGroup} />} />
                <Route path="/relationships" element={<Relationships ageGroup={ageGroup} />} />
                <Route path="/purpose" element={<Purpose ageGroup={ageGroup} />} />
                <Route path="/transparency" element={<Transparency />} />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
            <Chatbot />
            <DailyBonus />
          </div>
        </Router>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
