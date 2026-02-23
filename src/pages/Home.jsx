import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgeSelector from '../components/AgeSelector';
import DailyBonus from '../components/DailyBonus';
import Leaderboard from '../components/Leaderboard';
import LiveNotifications from '../components/LiveNotifications';
import AuthModal from '../components/AuthModal';
import PaymentPortal from '../components/PaymentPortal';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useWallet } from '../hooks/useWallet';

const Home = ({ ageGroup, setAgeGroup }) => {
    const navigate = useNavigate();
    const { user, logout, upgradeToElite } = useAuth();
    const { points, level, streak, getRankInfo, getNextRankInfo } = useGamification();
    const { balance, refreshBalance } = useWallet();
    const [showAgeModal, setShowAgeModal] = useState(!ageGroup);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showPaymentPortal, setShowPaymentPortal] = useState(false);
    const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false);
    const [upgrading, setUpgrading] = useState(false);
    const [toast, setToast] = useState(null);

    const rank = getRankInfo();
    const nextRank = getNextRankInfo();
    const progressToNext = nextRank ? (points / nextRank.min) * 100 : 100;

    const handleAgeSelect = (group) => {
        setAgeGroup(group);
        setShowAgeModal(false);
        if (!user && !hasShownAuthPrompt) {
            setTimeout(() => {
                setShowAuthModal(true);
                setHasShownAuthPrompt(true);
            }, 500);
        }
    };

    const handleUpgradeElite = async () => {
        if (!window.confirm('Upgrade to Elite Membership for ₦5,000?')) return;

        setUpgrading(true);
        try {
            await upgradeToElite();
            setToast({ message: 'Welcome to the Elite, MindNest Champion! 💎', type: 'success' });
        } catch (error) {
            setToast({ message: error.message || 'Upgrade failed. Check balance.', type: 'error' });
        } finally {
            setUpgrading(false);
        }
    };

    const pillars = [
        { id: 1, title: 'History & Identity', icon: '🌍', desc: ageGroup === 'adults' ? 'Strategic lessons from African roots and global systems.' : 'Discover your roots and stories of African innovation.', path: '/history', color: '#B8860B' },
        { id: 2, title: 'Financial Literacy', icon: '💰', desc: ageGroup === 'adults' ? 'Wealth building, investments, and risk management.' : 'Master saving habits and a healthy money mindset.', path: '/finance', color: '#00A86B' },
        { id: 3, title: 'Critical Thinking', icon: '🧠', desc: ageGroup === 'adults' ? 'Risk analysis and strategic decision frameworks.' : 'Logic puzzles and bias awareness training.', path: '/critical-thinking', color: '#CD5C5C' },
        { id: 4, title: 'Agripreneurship', icon: '🌱', desc: ageGroup === 'adults' ? 'Farming business, supply chains, and agri-finance.' : 'Sustainable food systems and farming awareness.', path: '/agri', color: '#2E8B57' },
        { id: 5, title: 'Tech & AI', icon: '💻', desc: ageGroup === 'adults' ? 'AI productivity, automation, and digital income.' : 'AI awareness, digital skills, and cyber safety.', path: '/tech', color: '#4682B4' },
        { id: 6, title: 'Health & Wellness', icon: '🌿', desc: ageGroup === 'adults' ? 'Integrated physical health and mental stability.' : 'Building healthy habits for body and mind.', path: '/health', color: '#DB7093' },
        { id: 7, title: 'Civics & Ethics', icon: '⚖️', desc: ageGroup === 'adults' ? 'Governance, social responsibility, and leadership.' : 'Responsibility, ethics, and community awareness.', path: '/civics', color: '#DAA520' },
    ];

    return (
        <div className="container" style={{ paddingBottom: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <LiveNotifications />
            <DailyBonus />
            {showAuthModal && <AuthModal ageGroup={ageGroup} onClose={() => setShowAuthModal(false)} />}
            {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
            {showAgeModal && <AgeSelector onSelect={handleAgeSelect} />}
            {showPaymentPortal && <PaymentPortal onClose={() => setShowPaymentPortal(false)} onBalanceUpdate={refreshBalance} />}

            {/* Navigation Header */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 0',
                marginBottom: '1rem',
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
                        color: '#fff'
                    }}>MindNest</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', marginRight: '1rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowPaymentPortal(true)}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Wallet</div>
                            <div style={{ fontWeight: '700', color: user ? '#00C851' : 'var(--color-text-muted)' }}>
                                ₦{balance.toLocaleString()}
                                {!user && <span style={{ fontSize: '0.6rem', display: 'block', color: '#ffa500' }}>Guest Mode</span>}
                            </div>
                        </div>
                        <div style={{ height: '20px', width: '1px', background: 'var(--color-border)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Points</div>
                            <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{points.toLocaleString()}</div>
                        </div>
                        <div style={{ height: '20px', width: '1px', background: 'var(--color-border)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Streak</div>
                            <div style={{ fontWeight: '700', color: '#FF4500' }}>🔥 {streak}</div>
                        </div>
                    </div>
                    <button onClick={() => setShowPaymentPortal(true)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', backgroundColor: '#00C851', borderColor: '#00C851' }}>
                        + Fund
                    </button>
                    <button onClick={() => setShowLeaderboard(true)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                        🏆 Ranking
                    </button>
                    {user?.isAdmin && (
                        <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderColor: '#FFD700', color: '#FFD700' }}>
                            ⚙️ Admin
                        </button>
                    )}
                    {user ? (
                        <button onClick={logout} className="btn-outline" style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)'
                        }}>Logout</button>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            {/* Gamification Dashboard Header */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), #B8860B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                }}>
                    {rank.icon}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Current Rank</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)' }}>{level}</h2>
                                {user?.isElite && (
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '20px',
                                        background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                        color: '#000',
                                        fontSize: '0.6rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>Elite</span>
                                )}
                            </div>
                        </div>
                        {nextRank && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                {points} / {nextRank.min} to {nextRank.name}
                            </span>
                        )}
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(progressToNext, 100)}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="badge-item" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: points > 100 ? 'none' : 'grayscale(1)' }}>🥇</div>
                    <div className="badge-item" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: points > 1000 ? 'none' : 'grayscale(1)' }}>💎</div>
                    <div className="badge-item" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: points > 5000 ? 'none' : 'grayscale(1)' }}>🏛️</div>
                </div>
            </div>

            {/* Elite Upgrade Section */}
            {user && !user.isElite && (
                <div className="card animate-fade" style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.05) 100%)',
                    border: '2px solid rgba(255,215,0,0.3)',
                    marginBottom: '3rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2rem'
                }}>
                    <div>
                        <h2 style={{ color: '#FFD700', marginBottom: '0.5rem' }}>Unlock Mastery & AI Mentor 🔓</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {user?.hasUsedEarningsForElite
                                ? "Mastery renewal requires a funded balance from a real deposit. One-time earnings allowance used."
                                : "Get personalized guidance from your AI Mentor and unlock Mastery levels in every pillar."}
                        </p>
                    </div>
                    <button
                        disabled={upgrading}
                        onClick={handleUpgradeElite}
                        className="btn btn-primary"
                        style={{
                            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                            border: 'none',
                            color: '#000',
                            fontWeight: 'bold',
                            padding: '1rem 2rem'
                        }}
                    >
                        {upgrading ? 'Upgrading...' : 'Upgrade for ₦9,000 / year'}
                    </button>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {pillars.map((pillar) => (
                    <div key={pillar.id} className="card animate-fade" style={{ borderTop: `4px solid ${pillar.color}`, display: 'flex', flexDirection: 'column' }}>
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
                &copy; {new Date().getFullYear()} MindNest Africa. For the people, by the people.
            </footer>
        </div>
    );
};

export default Home;
