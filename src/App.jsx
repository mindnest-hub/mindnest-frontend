import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import History from './pages/History';
import Finance from './pages/Finance';
import CriticalThinking from './pages/CriticalThinking';
import Agripreneurship from './pages/Agripreneurship';
import Tech from './pages/Tech';
import Civics from './pages/Civics';
import Health from './pages/Health';
import Transparency from './pages/Transparency';
import Chatbot from './components/Chatbot';
import './index.css';

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
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
