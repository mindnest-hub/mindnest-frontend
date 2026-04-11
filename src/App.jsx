import React, { useState, lazy, Suspense, useEffect } from 'react';
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
import LegalDocs from './pages/LegalDocs';

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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  React.useEffect(() => {
    if (ageGroup) localStorage.setItem('ageGroup', ageGroup);
  }, [ageGroup]);

  useEffect(() => {
    // Offline/Online detection
    const goOffline = () => setIsOffline(true);
    const goOnline  = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    // PWA Install Prompt
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = localStorage.getItem('pwaInstallDismissed');
      if (!dismissed) setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') localStorage.setItem('pwaInstalled', 'true');
    setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  const handleDismissInstall = () => {
    localStorage.setItem('pwaInstallDismissed', 'true');
    setShowInstallBanner(false);
  };

  return (
    <AuthProvider>
      <GamificationProvider>
        <Router>
          <div className="app-container bg-slate-950 min-h-screen">
            {/* OFFLINE INDICATOR */}
            {isOffline && (
              <div className="offline-badge">📡 Offline — Syncing when reconnected</div>
            )}
            {/* PWA INSTALL BANNER */}
            {showInstallBanner && (
              <div id="pwa-install-banner">
                <span>🦁 Add to Home Screen</span>
                <button onClick={handleInstall} style={{ background: '#C5A019', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Install</button>
                <button onClick={handleDismissInstall} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '16px' }}>×</button>
              </div>
            )}
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
                  <Route path="/legal" element={<LegalDocs />} />
                  
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
