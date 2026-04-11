import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';

// ─── MODULE DEFINITIONS ─────────────────────────────────────────────────────
const ALL_MODULES = [
  { id: 1, key: 'history',         name: 'History',           route: '/history',          emoji: '🌾' },
  { id: 2, key: 'finance',         name: 'Financial Literacy', route: '/finance',          emoji: '💰' },
  { id: 3, key: 'criticalThinking',name: 'Critical Thinking',  route: '/critical-thinking',emoji: '🧠' },
  { id: 4, key: 'civics',          name: 'Civics',             route: '/civics',           emoji: '⚖️' },
  { id: 5, key: 'health',          name: 'Health and Wellness',route: '/health',           emoji: '❤️' },
  { id: 6, key: 'agri',            name: 'Agripreneurship',    route: '/agri',             emoji: '🌱' },
  { id: 7, key: 'tech',            name: 'Tech',               route: '/tech',             emoji: '💻' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const Home = ({ ageGroup, setAgeGroup }) => {
  const navigate   = useNavigate();
  const { user, logout } = useAuth();
  const { moduleEarnings, balance } = useWallet();
  const { points, level } = useGamification();
  const [showMenu, setShowMenu] = useState(false);

  const username = user?.username || user?.user_metadata?.username || 'Victor Chuku';

  // ── derive progress from real wallet data ──────────────────────────────────
  const moduleProgress = useMemo(() => {
    return ALL_MODULES.map(m => {
      const cap = 2000; // MODULE_CAP per module
      const earned = moduleEarnings?.[m.key] || 0;
      const pct = Math.min(100, Math.round((earned / cap) * 100));
      return { ...m, earned, pct };
    });
  }, [moduleEarnings]);

  const completedModules = moduleProgress.filter(m => m.pct >= 80);
  const inProgressModules = moduleProgress.filter(m => m.pct > 0 && m.pct < 80);
  const totalPct = Math.round(moduleProgress.reduce((a, m) => a + m.pct, 0) / ALL_MODULES.length);

  // ── styles ─────────────────────────────────────────────────────────────────
  const S = {
    page: {
      minHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden',
      backgroundColor: '#0A0A08',
      color: '#fff',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      paddingBottom: '90px',
      display: 'flex',
      flexDirection: 'column',
    },
    card: {
      background: 'linear-gradient(145deg, #1C1810 0%, #110F08 100%)',
      border: '1px solid rgba(180,130,50,0.35)',
      borderRadius: '16px',
      padding: '12px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 0,
    },
    tribal: {
      backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-scales.png")',
      backgroundSize: '60px',
      opacity: 0.06,
      position: 'absolute', inset: 0,
      borderRadius: '16px',
      pointerEvents: 'none',
    },
    sectionTitle: {
      fontSize: '11px', fontWeight: '800', color: '#E8C96E',
      marginBottom: '8px', letterSpacing: '0.5px', position: 'relative'
    },
    connectBtn: {
      background: 'linear-gradient(135deg, #C5A019, #8A5A2B)',
      border: 'none', borderRadius: '12px',
      color: '#000', fontSize: '9px', fontWeight: '800',
      padding: '5px 9px', cursor: 'pointer', flexShrink: 0
    },
  };

  // ── menu items ─────────────────────────────────────────────────────────────
  const menuItems = [
    { icon: '🚀', label: 'New Module',      route: '/learn' },
    { icon: '🏠', label: 'Home',            route: '/' },
    { icon: '👥', label: 'Elite Community', route: '/community' },
    { icon: '💳', label: 'My Earnings',     route: '/services' },
    { icon: '📊', label: 'Leaderboard',     route: '/stats' },
    { icon: '🏷️', label: 'My Offers',       route: '/opportunities' },
    { icon: '🥇', label: 'Certificates',    route: '/docs' },
    { icon: '🏆', label: 'Competitions',    route: '/events' },
    { icon: '📚', label: 'Academy',         route: '/learn' },
    { icon: '🌾', label: 'History',         route: '/history' },
    { icon: '💰', label: 'Finance',         route: '/finance' },
    { icon: '🧠', label: 'Critical Thinking',route: '/critical-thinking' },
    { icon: '⚖️', label: 'Civics',          route: '/civics' },
    { icon: '❤️', label: 'Health',          route: '/health' },
    { icon: '🌱', label: 'Agripreneurship', route: '/agri' },
    { icon: '💻', label: 'Tech',            route: '/tech' },
    { icon: '🤖', label: 'AI Chatbot',      route: '/ai' },
  ];

  const aiTopics = [
    { label: 'Law & Rights Breakdown',       route: '/civics' },
    { label: 'Govt. Regulations Simplified', route: '/civics' },
    { label: 'Real African History Q&A',     route: '/history' },
    { label: 'Financial Literacy Check',     route: '/finance' },
    { label: 'Pocket Lawyer consultation',   route: '/ai' },
  ];

  return (
    <div style={S.page}>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '16px 16px 8px', flexShrink: 0,
      }}>
        {/* Menu button */}
        <button onClick={() => setShowMenu(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: '24px', height: '2px', background: '#C5A019', borderRadius: '2px' }} />)}
          </div>
          <span style={{ fontSize: '8px', color: '#B67F4B', letterSpacing: '2px', fontWeight: '600' }}>MENU</span>
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="32" height="30" viewBox="0 0 40 40" fill="none">
            <path d="M20 32 C15 32 10 34 5 37 V34 C10 31 15 29 20 29 C25 29 30 31 35 34 V37 C30 34 25 32 20 32 Z" fill="#C5A019"/>
            <path d="M19 30 L19 14 C14 14 10 18 8 22 C10 20 14 19 19 19 M21 30 L21 14 C26 14 30 18 32 22 C30 20 26 19 21 19 M17 12 C17 17 23 17 23 12 C23 7 17 7 17 12 Z" fill="#E8C96E"/>
            <path d="M11 16 C8 16 6 18 6 20 C8 17 11 17 11 16" fill="#B67F4B"/>
            <path d="M29 16 C32 16 34 18 34 20 C32 17 29 17 29 16" fill="#B67F4B"/>
          </svg>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#E8C96E' }}>MINDNEST</div>
            <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#E8C96E' }}>AFRICA</div>
          </div>
        </div>

        {/* Profile */}
        <button onClick={() => setShowMenu(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1A1208', border: '1.5px solid #C5A019', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#C5A019"><path d="M12 12c2.7 0 5-2.3 5-5S14.7 2 12 2 7 4.3 7 7s2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
          </div>
          <span style={{ fontSize: '7px', color: '#B67F4B', letterSpacing: '1px', fontWeight: '600' }}>MY PROFILE</span>
        </button>
      </header>

      {/* ── WELCOME ─────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '2px 16px 12px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 3px' }}>
          Welcome Back, {username}!
        </h1>
        <p style={{ fontSize: '12px', color: '#B0B0B0', margin: 0 }}>Let's explore MindNest Africa</p>
      </div>

      {/* ── 2×2 GRID ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        padding: '0 8px',
        flex: 1,
        minHeight: 0,
      }}>

        {/* ─ CARD 1: LEARNING PATH ──────────────────────────────────────── */}
        <div style={S.card}>
          <div style={S.tribal} />
          <p style={S.sectionTitle}>Your Learning Path</p>

          {/* Ring */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 8px', position: 'relative' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '80px', height: '80px', transform: 'rotate(-90deg)' }}>
                <defs>
                  <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6A3A0B"/>
                    <stop offset="100%" stopColor="#E8C96E"/>
                  </linearGradient>
                </defs>
                <path stroke="#1F1C10" strokeWidth="4.5" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path stroke="url(#ring)" strokeWidth="4.5" fill="none" strokeLinecap="round"
                  strokeDasharray={`${totalPct}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(197,160,25,0.7))' }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '300', color: '#fff' }}>{totalPct}%</span>
              </div>
            </div>
          </div>

          {/* Completed */}
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#E8C96E', marginBottom: '5px', position: 'relative' }}>Completed Modules</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', position: 'relative' }}>
            {completedModules.length === 0 ? (
              <p style={{ fontSize: '9px', color: '#666', fontStyle: 'italic' }}>No completed modules yet</p>
            ) : completedModules.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
                <span style={{ color: '#C0C0C0' }}>{i + 1}. {m.name}</span>
                <span style={{ color: '#4ADE80', fontWeight: '700' }}>{m.pct}% ✓</span>
              </div>
            ))}
            {/* If no real data yet, show demo completed */}
            {completedModules.length === 0 && (
              <>
                {[{ name:'History'},{name:'Financial Literacy'},{name:'Critical Thinking'},{name:'Civics'}].map((m,i)=>(
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
                    <span style={{ color: '#C0C0C0' }}>{i+1}. {m.name}</span>
                    <span style={{ color: '#4ADE80', fontWeight: '700' }}>100% ✓</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ─ CARD 2: AI COMPANION ───────────────────────────────────────── */}
        <div style={S.card}>
          <div style={S.tribal} />
          {/* Online badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginBottom: '3px', position: 'relative' }}>
            <div style={{ width: '6px', height: '6px', background: '#4ADE80', borderRadius: '50%', boxShadow: '0 0 6px #4ADE80' }} />
            <span style={{ fontSize: '8px', color: '#4ADE80', fontWeight: '600' }}>MindNest AI Online</span>
          </div>
          <p style={{ ...S.sectionTitle, marginBottom: '6px' }}>My MindNest AI Companion</p>

          {/* Robot */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 8px', position: 'relative' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
              border: '2px solid #C5A019',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px rgba(197,160,25,0.4)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
                  <div style={{ width: '7px', height: '7px', background: '#111', borderRadius: '50%' }} />
                  <div style={{ width: '7px', height: '7px', background: '#111', borderRadius: '50%' }} />
                </div>
                <div style={{ width: '16px', height: '4px', borderBottom: '3px solid #111', borderRadius: '0 0 6px 6px' }} />
              </div>
            </div>
          </div>

          {/* Topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
            {aiTopics.map((t, i) => (
              <button key={i} onClick={() => navigate(t.route)} style={{
                background: 'rgba(197,160,25,0.07)',
                border: '1px solid rgba(197,160,25,0.25)',
                borderRadius: '7px', color: '#D4B87A',
                fontSize: '9px', fontWeight: '500',
                padding: '6px 7px', textAlign: 'left', cursor: 'pointer',
                lineHeight: 1.3,
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─ CARD 3: MY MINDNEST (Mentors + In Progress) ────────────────── */}
        <div style={S.card}>
          <div style={S.tribal} />
          <p style={S.sectionTitle}>My MindNest</p>

          {/* Mentors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '10px', position: 'relative' }}>
            {[
              { name: 'Dr. Musa',  img: 'https://i.pravatar.cc/100?img=11' },
              { name: 'Aisha K.', img: 'https://i.pravatar.cc/100?img=9' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={m.img} alt={m.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #C5A019', objectFit: 'cover' }} />
                  <div style={{ width: '7px', height: '7px', background: '#4ADE80', border: '1px solid #000', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '10px', fontWeight: '700', color: '#fff', margin: 0 }}>{m.name}</p>
                  <p style={{ fontSize: '8px', color: '#4ADE80', margin: 0 }}>Online</p>
                </div>
                <button style={S.connectBtn}>Connect</button>
              </div>
            ))}
          </div>

          {/* In Progress — from real user data */}
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#E8C96E', marginBottom: '7px' }}>In Progress</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {(inProgressModules.length > 0 ? inProgressModules : [
                { id:5, name:'Health and Wellness', pct:40, route:'/health' },
                { id:6, name:'Agripreneurship',     pct:42, route:'/agri' },
                { id:7, name:'Tech',                pct:27, route:'/tech' },
              ]).slice(0, 3).map((m, i) => (
                <div key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(m.route)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '9px', color: '#C0C0C0' }}>{m.id || (i + 5)}. {m.name}</span>
                    <span style={{ fontSize: '9px', color: '#C5A019', fontWeight: '700' }}>{m.pct}%</span>
                  </div>
                  <div style={{ height: '3px', background: '#1F1C10', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${m.pct}%`,
                      background: 'linear-gradient(90deg, #8A5A2B, #E8C96E)',
                      borderRadius: '3px', boxShadow: '0 0 4px rgba(197,160,25,0.5)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─ CARD 4: COMMUNITY ──────────────────────────────────────────── */}
        <div style={{ ...S.card, paddingBottom: '48px' }}>
          <div style={S.tribal} />
          <p style={S.sectionTitle}>My MindNest Community</p>

          {/* Mentor row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '9px', position: 'relative' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src="https://i.pravatar.cc/100?img=11" alt="Dr. Musa" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #C5A019', objectFit: 'cover' }} />
              <div style={{ width: '7px', height: '7px', background: '#4ADE80', border: '1px solid #000', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#fff', margin: 0 }}>Dr. Musa</p>
              <p style={{ fontSize: '8px', color: '#4ADE80', margin: 0 }}>Online</p>
            </div>
            <button style={S.connectBtn}>Connect</button>
          </div>

          {/* Forums */}
          <div style={{ marginBottom: '8px', position: 'relative' }}>
            <p style={{ fontSize: '9px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Discussion Forums</p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {['#AfripreneurTips', '#CivicsHub'].map((f, i) => (
                <span key={i} style={{ background: 'rgba(197,160,25,0.1)', border: '1px solid rgba(197,160,25,0.3)', borderRadius: '6px', padding: '2px 6px', fontSize: '8px', color: '#E8C96E' }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div style={{ marginBottom: '8px', position: 'relative' }}>
            <p style={{ fontSize: '9px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Latest Activity</p>
            {['User92: Ask me about historical sources', 'User92: Ask me about historical'].map((a, i) => (
              <p key={i} style={{ fontSize: '8px', color: '#888', margin: '0 0 2px', paddingLeft: '6px', borderLeft: '2px solid #C5A019' }}>• {a}</p>
            ))}
          </div>

          {/* Sessions */}
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: '9px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Upcoming Live Sessions</p>
            {['May 19: Agripreneurship Work...', 'May 19: Agripreneurship Worksh...'].map((s, i) => (
              <p key={i} style={{ fontSize: '8px', color: '#B0B0B0', margin: '0 0 2px' }}>{s}</p>
            ))}
          </div>

          {/* AI bubble inside card */}
          <button onClick={() => navigate('/ai')} style={{
            position: 'absolute', bottom: '10px', right: '10px',
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
            border: '2px solid #C5A019',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(197,160,25,0.6)', cursor: 'pointer', zIndex: 10,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '2px' }}>
                <div style={{ width: '5px', height: '5px', background: '#111', borderRadius: '50%' }} />
                <div style={{ width: '5px', height: '5px', background: '#111', borderRadius: '50%' }} />
              </div>
              <div style={{ width: '12px', height: '3px', borderBottom: '2px solid #111', borderRadius: '0 0 4px 4px' }} />
            </div>
          </button>
        </div>
      </div>

      {/* ── MENU DRAWER ─────────────────────────────────────────────────── */}
      {showMenu && (
        <>
          <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9998, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: '290px',
            background: '#050505', zIndex: 9999, overflowY: 'auto',
            borderRight: '1px solid rgba(197,160,25,0.2)',
            boxShadow: '20px 0 60px rgba(0,0,0,0.9)',
            padding: '20px 18px 40px',
          }}>
            <button onClick={() => setShowMenu(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#fff', fontSize: '26px', cursor: 'pointer' }}>×</button>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#00BFFF', marginBottom: '24px', marginTop: '4px', letterSpacing: '2px' }}>Menu</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {menuItems.map((item, i) => (
                <button key={i} onClick={() => { navigate(item.route); setShowMenu(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: '#00BFFF', fontSize: '15px', fontWeight: '500', textAlign: 'left', padding: '9px 10px', borderRadius: '10px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>

            {/* Level/Points from real data */}
            <div style={{ margin: '16px 0', padding: '12px', background: 'rgba(197,160,25,0.08)', border: '1px solid rgba(197,160,25,0.2)', borderRadius: '12px' }}>
              <p style={{ fontSize: '10px', color: '#C5A019', fontWeight: '700', margin: '0 0 4px', letterSpacing: '2px' }}>YOUR STATS</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Level</p><p style={{ fontSize: '16px', fontWeight: '800', color: '#E8C96E', margin: 0 }}>{level || 1}</p></div>
                <div><p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Points</p><p style={{ fontSize: '16px', fontWeight: '800', color: '#E8C96E', margin: 0 }}>{points || 0}</p></div>
                <div><p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Balance</p><p style={{ fontSize: '16px', fontWeight: '800', color: '#E8C96E', margin: 0 }}>₦{balance?.toLocaleString() || 0}</p></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => { navigate('/legal'); setShowMenu(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: '#C5A019', fontSize: '15px', fontWeight: '500', textAlign: 'left', padding: '9px 10px', borderRadius: '10px', cursor: 'pointer' }}>
                <span>⚖️</span> Legal & Privacy
              </button>
              <button onClick={logout}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: '#EF4444', fontSize: '15px', fontWeight: '500', textAlign: 'left', padding: '9px 10px', borderRadius: '10px', cursor: 'pointer' }}>
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
