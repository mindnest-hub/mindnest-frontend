import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import MainLayout from './components/MainLayout';

// PAGES & SECTIONS
import Home from './pages/Home';
import LearningCenter from './pages/LearningCenter';
import Community from './pages/Community';
import Opportunities from './pages/Opportunities';
import Services from './pages/Services';
import { 
  PartnersPage, 
  MemberProfile 
} from './pages/MindNestSections';

// LEARNING MODULES
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
import ResetPassword from './pages/ResetPassword';

// COMPONENTS
import Chatbot from './components/Chatbot';
import DailyBonus from './components/DailyBonus';
import WordOriginManager from './components/WordOriginManager';
import ProtectedRoute from './components/ProtectedRoute';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const LoadingScreen = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#020617', color: '#fbbf24',
    fontSize: '1.5rem', fontWeight: 'bold'
  }}>
    <div className="flex flex-col items-center gap-4">
      <span className="text-4xl animate-bounce">🦁</span>
      <span>MindNest is loading...</span>
    </div>
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
          <div className="app-container bg-slate-950 min-h-screen">
            <WordOriginManager ageGroup={ageGroup} />
            <Suspense fallback={<LoadingScreen />}>
              <MainLayout setAgeGroup={setAgeGroup}>
                <Routes>
                  {/* MAIN DASHBOARD */}
                  <Route path="/" element={<Home ageGroup={ageGroup} setAgeGroup={setAgeGroup} />} />
                  
                  {/* NEW NAV SECTIONS */}
                  <Route path="/learn" element={<LearningCenter />} />
                  <Route path="/ai" element={<Chatbot />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/partners" element={<PartnersPage />} />
                  <Route path="/profile" element={<MemberProfile />} />

                  {/* LEARNING MODULES (Existing) */}
                  <Route path="/history" element={<History ageGroup={ageGroup} />} />
                  <Route path="/finance" element={<Finance ageGroup={ageGroup} />} />
                  <Route path="/critical-thinking" element={<CriticalThinking ageGroup={ageGroup} />} />
                  <Route path="/agri" element={<Agripreneurship ageGroup={ageGroup} />} />
                  <Route path="/tech" element={<Tech ageGroup={ageGroup} />} />
                  <Route path="/civics" element={<Civics ageGroup={ageGroup} />} />

                  {/* LEGACY ROUTES */}
                  <Route path="/health" element={<Health ageGroup={ageGroup} />} />
                  <Route path="/wellness" element={<Wellness ageGroup={ageGroup} />} />
                  <Route path="/habits" element={<Habits ageGroup={ageGroup} />} />
                  <Route path="/relationships" element={<Relationships ageGroup={ageGroup} />} />
                  <Route path="/purpose" element={<Purpose ageGroup={ageGroup} />} />
                  <Route path="/transparency" element={<Transparency />} />
                  
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </MainLayout>
            </Suspense>
            <DailyBonus />
          </div>
        </Router>
      </GamificationProvider>
    </AuthProvider>
  );
}


export default App;
