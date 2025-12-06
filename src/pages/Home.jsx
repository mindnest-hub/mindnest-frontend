import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgeSelector from '../components/AgeSelector';
import DailyBonus from '../components/DailyBonus';
import Leaderboard from '../components/Leaderboard';
import LiveNotifications from '../components/LiveNotifications';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

const Home = ({ ageGroup, setAgeGroup }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showAgeModal, setShowAgeModal] = useState(!ageGroup);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleAgeSelect = (group) => {
        setAgeGroup(group);
        setShowAgeModal(false);
    };

    const pillars = [
        { id: 1, title: 'True History', icon: '🌍', desc: 'The Untold Stories', path: '/history', color: 'var(--color-primary)' },
        { id: 2, title: 'Financial Literacy', icon: '💰', desc: 'Wealth Builder', path: '/finance', color: '#00FF7F' },
        { id: 3, title: 'Critical Thinking', icon: '🧠', desc: 'Mancala Logic', path: '/critical-thinking', color: '#FF4500' },
        { id: 4, title: 'Agripreneurship', icon: '🌱', desc: 'Smart Farm', path: '/agri', color: '#32CD32' },
        { id: 5, title: 'Tech & Digital', icon: '💻', desc: 'Code the Future', path: '/tech', color: '#00BFFF' },
        { id: 6, title: 'Civics & Leadership', icon: '⚖️', desc: 'Rights & Duties', path: '/civics', color: '#FFD700' },
        { id: 7, title: 'Health & Wellness', icon: '🌿', desc: 'Body & Mind', path: '/health', color: '#FF69B4' },
    ];

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <LiveNotifications />
            <DailyBonus />
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
            {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
            {showAgeModal && <AgeSelector onSelect={handleAgeSelect} />}

            <header style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--color-accent)' }}>Hi, {user.username}</span>
                            <button onClick={logout} style={{ background: 'none', border: '1px solid var(--color-text-muted)', color: 'var(--color-text-muted)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)} style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Login / Sign Up</button>
                    )}
                </div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    MindNest
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    {ageGroup === 'adults'
                        ? 'Make a bond with yourself to learn, grow, and never settle for misinformation'
                        : 'Your bond with knowledge starts here. Welcome to MindNest'}
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--color-primary)', marginTop: '1rem', fontStyle: 'italic' }}>
                    Reclaiming our past. Building our future.
                </p>
                {ageGroup && (
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                            Mode: {ageGroup}
                            <button
                                onClick={() => setShowAgeModal(true)}
                                style={{
                                    marginLeft: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-accent)',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '0.9rem'
                                }}
                            >
                                (Change)
                            </button>
                        </div>
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-accent)',
                                color: 'var(--color-accent)',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            🏆 Leaderboard
                        </button>
                    </div>
                )}
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {pillars.map((pillar) => (
                    <div key={pillar.id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: `4px solid ${pillar.color}` }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{pillar.icon}</div>
                        <h2 style={{ marginBottom: '0.5rem', color: pillar.color }}>{pillar.title}</h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>{pillar.desc}</p>
                        <button
                            className="btn"
                            style={{ marginTop: 'auto', width: '100%', backgroundColor: '#333', color: '#fff', border: `1px solid ${pillar.color}` }}
                            onClick={() => navigate(pillar.path)}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = pillar.color; e.currentTarget.style.color = '#000'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#333'; e.currentTarget.style.color = '#fff'; }}
                        >
                            Explore
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
