import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import Chatbot from './components/Chatbot';
// ... existing imports ...

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
