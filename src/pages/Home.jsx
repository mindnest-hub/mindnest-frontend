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
        { id: 1, title: 'True History', icon: '🌍', desc: 'Discover the untold stories of Great African Civilizations.', path: '/history', color: '#B8860B' },
        { id: 2, title: 'Finance & Wealth', icon: '💰', desc: 'Master the principles of wealth building and money management.', path: '/finance', color: '#00A86B' },
        { id: 3, title: 'Critical Thinking', icon: '🧠', desc: 'Sharpen your logic with ancient games and modern puzzles.', path: '/critical-thinking', color: '#CD5C5C' },
        { id: 4, title: 'Agripreneurship', icon: '🌱', desc: 'Bridge agriculture with business for a sustainable future.', path: '/agri', color: '#2E8B57' },
        { id: 5, title: 'Tech & Innovation', icon: '💻', desc: 'Learn the skills needed to build the digital future.', path: '/tech', color: '#4682B4' },
        { id: 6, title: 'Civics & Leadership', icon: '⚖️', desc: 'Understand your roles and lead with integrity.', path: '/civics', color: '#DAA520' },
        { id: 7, title: 'Health & Wellness', icon: '🌿', desc: 'Holistic approaches to a strong body and clear mind.', path: '/health', color: '#DB7093' },
    ];

    return (
        <div className="container" style={{ paddingBottom: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <LiveNotifications />
            <DailyBonus />
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
            {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
            {showAgeModal && <AgeSelector onSelect={handleAgeSelect} />}

            {/* Navigation Header */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 0',
                marginBottom: '2rem',
                borderBottom: '1px solid var(--color-border)',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--color-primary)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}>🛡️</div>
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-heading)',
                        background: 'linear-gradient(to right, #fff, var(--color-primary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>MindNest</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => setShowLeaderboard(true)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                        🏆 Leaderboard
                    </button>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'right', display: 'none' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Welcome,</div>
                                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.username}</div>
                            </div>
                            <button onClick={logout} className="btn-outline" style={{
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)'
                            }}>Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1' }}>
                    Reclaiming our past.<br />
                    <span style={{ color: 'var(--color-primary)' }}>Building our future.</span>
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    maxWidth: '700px',
                    margin: '1.5rem auto 2.5rem'
                }}>
                    {ageGroup === 'adults'
                        ? 'Make a bond with yourself to learn, grow, and never settle for misinformation. Access premium modules for professionals.'
                        : 'Your journey into history, wealth, and technology starts here. Welcome to the Nest of Minds.'}
                </p>

                {ageGroup && (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '100px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Learning as:</span>
                        <span style={{ fontWeight: '600', textTransform: 'capitalize', color: 'var(--color-primary)' }}>{ageGroup}</span>
                        <button onClick={() => setShowAgeModal(true)} style={{ color: 'var(--color-accent)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>Change</button>
                    </div>
                )}
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {pillars.map((pillar) => (
                    <div key={pillar.id} className="card animate-fade" style={{ borderTop: `4px solid ${pillar.color}` }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{pillar.icon}</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>{pillar.title}</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>{pillar.desc}</p>
                        <button
                            className="btn btn-outline"
                            style={{ marginTop: 'auto', width: '100%' }}
                            onClick={() => navigate(pillar.path)}
                        >
                            Start Learning
                        </button>
                    </div>
                ))}
            </div>

            <footer style={{ marginTop: '8rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} MindNest Education. For the people, by the people.
            </footer>
        </div>
    );
};

export default Home;
