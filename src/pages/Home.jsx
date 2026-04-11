import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = ({ ageGroup, setAgeGroup }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    /* ── helpers ── */
    const username = user?.username || user?.user_metadata?.username || 'Victor Chuku';

    /* ── data ── */
    const completedModules = [
        { name: 'History', pct: 100 },
        { name: 'Financial Literacy', pct: 100 },
        { name: 'Critical Thinking', pct: 100 },
        { name: 'Civics', pct: 100 },
    ];

    const inProgressModules = [
        { num: 5, name: 'Health and Wellness', pct: 40, route: '/health' },
        { num: 6, name: 'Agripreneurship', pct: 42, route: '/agri' },
        { num: 7, name: 'Tech', pct: 27, route: '/tech' },
    ];

    const aiTopics = [
        'Law & Rights Breakdown',
        'Govt. Regulations Simplified',
        'Real African History Q&A',
        'Financial Literacy Check',
        'Pocket Lawyer consultation',
    ];

    const mentors = [
        { name: 'Dr. Musa', status: 'Online', img: 'https://i.pravatar.cc/100?img=11' },
        { name: 'Aisha K.', status: 'Online', img: 'https://i.pravatar.cc/100?img=9' },
    ];

    const forums = ['#AfripreneurTips', '#CivicsHub'];

    const activityFeed = [
        'User92: Ask me about historical sources',
        'User92: Ask me about historical',
    ];

    const liveSessions = [
        'May 19: Agripreneurship Work...',
        'May 19: Agripreneurship Worksh...',
    ];

    /* ── card style ── */
    const card = {
        background: 'linear-gradient(145deg, #1A1610 0%, #111008 100%)',
        border: '1px solid rgba(180,130,50,0.35)',
        borderRadius: '18px',
        padding: '14px',
        position: 'relative',
        overflow: 'hidden',
    };

    const tribalOverlay = {
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-scales.png")',
        backgroundSize: '80px',
        opacity: 0.08,
        position: 'absolute', inset: 0,
        borderRadius: '18px',
        pointerEvents: 'none',
    };

    /* ── menu items ── */
    const menuItems = [
        { icon: '🚀', label: 'New Module', route: '/learn' },
        { icon: '🏠', label: 'Home', route: '/' },
        { icon: '👥', label: 'Elite Community', route: '/community' },
        { icon: '💳', label: 'My Earnings', route: '/services' },
        { icon: '📊', label: 'Leaderboard', route: '/stats' },
        { icon: '🏷️', label: 'My Offers', route: '/opportunities' },
        { icon: '📈', label: 'My Stats', route: '/stats' },
        { icon: '🥇', label: 'Certificates', route: '/docs' },
        { icon: '🏆', label: 'Competitions', route: '/events' },
        { icon: '📚', label: 'Academy', route: '/learn' },
        { icon: '🌾', label: 'History', route: '/history' },
        { icon: '💰', label: 'Finance', route: '/finance' },
        { icon: '🧠', label: 'Critical Thinking', route: '/critical-thinking' },
        { icon: '⚖️', label: 'Civics', route: '/civics' },
        { icon: '🤖', label: 'AI Chatbot', route: '/ai' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0A0A08',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-scales.png")',
            backgroundSize: '100px',
            color: '#fff',
            fontFamily: "'Inter','Segoe UI',sans-serif",
            paddingBottom: '100px',
            overflowX: 'hidden',
        }}>

            {/* ─── TOP NAV ─────────────────────────────────────────────────── */}
            <header style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                padding: '18px 18px 10px',
            }}>
                {/* Menu */}
                <button
                    onClick={() => setShowMenu(true)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: '26px', height: '2px', background: '#C5A019', borderRadius: '2px' }} />)}
                    </div>
                    <span style={{ fontSize: '9px', color: '#B67F4B', letterSpacing: '2px', fontWeight: '600', marginTop: '2px' }}>MENU</span>
                </button>

                {/* Logo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Baobab SVG */}
                        <svg width="36" height="34" viewBox="0 0 40 40" fill="none">
                            <path d="M20 32 C15 32 10 34 5 37 V34 C10 31 15 29 20 29 C25 29 30 31 35 34 V37 C30 34 25 32 20 32 Z" fill="#C5A019"/>
                            <path d="M19 30 L19 14 C14 14 10 18 8 22 C10 20 14 19 19 19 M21 30 L21 14 C26 14 30 18 32 22 C30 20 26 19 21 19 M17 12 C17 17 23 17 23 12 C23 7 17 7 17 12 Z" fill="#E8C96E"/>
                            <path d="M11 16 C8 16 6 18 6 20 C8 17 11 17 11 16" fill="#B67F4B"/>
                            <path d="M29 16 C32 16 34 18 34 20 C32 17 29 17 29 16" fill="#B67F4B"/>
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
                            <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '3px', color: '#E8C96E' }}>MINDNEST</span>
                            <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '3px', color: '#E8C96E' }}>AFRICA</span>
                        </div>
                    </div>
                </div>

                {/* Profile */}
                <button
                    onClick={() => setShowMenu(true)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2A2015, #111)',
                        border: '1.5px solid #C5A019',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#C5A019" stroke="none"><path d="M12 12c2.7 0 5-2.3 5-5S14.7 2 12 2 7 4.3 7 7s2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
                    </div>
                    <span style={{ fontSize: '8px', color: '#B67F4B', letterSpacing: '1px', fontWeight: '600' }}>MY PROFILE</span>
                </button>
            </header>

            {/* ─── WELCOME ──────────────────────────────────────────────────── */}
            <div style={{ textAlign: 'center', padding: '4px 20px 16px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                    Welcome Back, {username}!
                </h1>
                <p style={{ fontSize: '13px', color: '#B8B8B8', margin: 0 }}>Let's explore MindNest Africa</p>
            </div>

            {/* ─── 2×2 GRID ────────────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '0 10px',
            }}>

                {/* ── CARD 1: YOUR LEARNING PATH ─────────────────────────── */}
                <div style={card}>
                    <div style={tribalOverlay} />
                    <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#E8C96E', marginBottom: '10px', textAlign: 'center', position: 'relative' }}>
                        Your Learning Path
                    </h3>

                    {/* Circle progress */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', position: 'relative' }}>
                        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                            <svg viewBox="0 0 36 36" style={{ width: '90px', height: '90px', transform: 'rotate(-90deg)' }}>
                                <defs>
                                    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8A5A2B"/>
                                        <stop offset="100%" stopColor="#E8C96E"/>
                                    </linearGradient>
                                </defs>
                                <path stroke="#1F1C10" strokeWidth="4" fill="none" strokeLinecap="round"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path stroke="url(#ring)" strokeWidth="4" fill="none" strokeLinecap="round"
                                    strokeDasharray="40, 100"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(197,160,25,0.7))' }}/>
                            </svg>
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                            }}>
                                <span style={{ fontSize: '18px', fontWeight: '300', color: '#fff', lineHeight: 1 }}>40%</span>
                            </div>
                        </div>
                    </div>

                    {/* Completed modules */}
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#E8C96E', marginBottom: '6px', position: 'relative' }}>Completed Modules</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                        {completedModules.map((m, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                                <span style={{ color: '#C0C0C0' }}>{i + 1}. {m.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <span style={{ color: '#4ADE80', fontWeight: '700' }}>100%</span>
                                    <span style={{ color: '#4ADE80', fontSize: '10px' }}>✓</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CARD 2: MY MINDNEST AI COMPANION ──────────────────── */}
                <div style={card}>
                    <div style={tribalOverlay} />
                    <div style={{ position: 'relative' }}>
                        {/* Online badge */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            justifyContent: 'flex-end', marginBottom: '4px'
                        }}>
                            <span style={{ width: '6px', height: '6px', background: '#4ADE80', borderRadius: '50%', boxShadow: '0 0 6px #4ADE80' }} />
                            <span style={{ fontSize: '9px', color: '#4ADE80', fontWeight: '600' }}>MindNest AI Online</span>
                        </div>
                        <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#E8C96E', marginBottom: '10px', lineHeight: 1.3 }}>
                            My MindNest AI Companion
                        </h3>

                        {/* Robot icon */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                                border: '2px solid #C5A019',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 16px rgba(197,160,25,0.4)'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '7px', marginBottom: '4px' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#111', borderRadius: '50%' }} />
                                        <div style={{ width: '8px', height: '8px', background: '#111', borderRadius: '50%' }} />
                                    </div>
                                    <div style={{ width: '20px', height: '5px', borderBottom: '3px solid #111', borderRadius: '0 0 8px 8px' }} />
                                </div>
                            </div>
                        </div>

                        {/* Topic buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {aiTopics.map((topic, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate('/ai')}
                                    style={{
                                        background: 'rgba(197,160,25,0.08)',
                                        border: '1px solid rgba(197,160,25,0.3)',
                                        borderRadius: '8px',
                                        color: '#D4B87A',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                        padding: '7px 8px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CARD 3: MY MINDNEST (Mentors + In Progress) ─────────── */}
                <div style={card}>
                    <div style={tribalOverlay} />
                    <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#E8C96E', marginBottom: '10px', position: 'relative' }}>My MindNest</h3>

                    {/* Mentors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', position: 'relative' }}>
                        {mentors.map((m, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <img src={m.img} alt={m.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #C5A019', objectFit: 'cover' }} />
                                    <div style={{ width: '8px', height: '8px', background: '#4ADE80', border: '1px solid #000', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0, boxShadow: '0 0 4px #4ADE80' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#fff', margin: 0 }}>{m.name}</p>
                                    <p style={{ fontSize: '9px', color: '#4ADE80', margin: 0 }}>Online</p>
                                </div>
                                <button style={{
                                    background: 'linear-gradient(135deg, #C5A019, #8A5A2B)',
                                    border: 'none', borderRadius: '12px',
                                    color: '#000', fontSize: '9px', fontWeight: '800',
                                    padding: '5px 10px', cursor: 'pointer',
                                }}>Connect</button>
                            </div>
                        ))}
                    </div>

                    {/* In Progress */}
                    <div style={{ position: 'relative' }}>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#E8C96E', marginBottom: '8px' }}>In Progress</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {inProgressModules.map((m, i) => (
                                <div key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(m.route)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ fontSize: '10px', color: '#C0C0C0' }}>{m.num}. {m.name}</span>
                                        <span style={{ fontSize: '10px', color: '#C5A019', fontWeight: '700' }}>{m.pct}%</span>
                                    </div>
                                    <div style={{ height: '4px', background: '#1F1C10', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', width: `${m.pct}%`,
                                            background: 'linear-gradient(90deg, #8A5A2B, #E8C96E)',
                                            borderRadius: '4px', boxShadow: '0 0 6px rgba(197,160,25,0.5)'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CARD 4: MY MINDNEST COMMUNITY ─────────────────────── */}
                <div style={{ ...card, position: 'relative' }}>
                    <div style={tribalOverlay} />
                    <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#E8C96E', marginBottom: '10px', position: 'relative' }}>My MindNest Community</h3>

                    {/* Dr. Musa row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', position: 'relative' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <img src="https://i.pravatar.cc/100?img=11" alt="Dr. Musa" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #C5A019', objectFit: 'cover' }} />
                            <div style={{ width: '8px', height: '8px', background: '#4ADE80', border: '1px solid #000', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0, boxShadow: '0 0 4px #4ADE80' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: '#fff', margin: 0 }}>Dr. Musa</p>
                            <p style={{ fontSize: '9px', color: '#4ADE80', margin: 0 }}>Online</p>
                        </div>
                        <button style={{
                            background: 'linear-gradient(135deg, #C5A019, #8A5A2B)',
                            border: 'none', borderRadius: '12px',
                            color: '#000', fontSize: '9px', fontWeight: '800',
                            padding: '5px 10px', cursor: 'pointer',
                        }}>Connect</button>
                    </div>

                    {/* Discussion Forums */}
                    <div style={{ marginBottom: '8px', position: 'relative' }}>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>Discussion Forums</p>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {forums.map((f, i) => (
                                <span key={i} style={{
                                    background: 'rgba(197,160,25,0.1)',
                                    border: '1px solid rgba(197,160,25,0.3)',
                                    borderRadius: '8px', padding: '3px 7px',
                                    fontSize: '9px', color: '#E8C96E'
                                }}>{f}</span>
                            ))}
                        </div>
                    </div>

                    {/* Latest Activity */}
                    <div style={{ marginBottom: '8px', position: 'relative' }}>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>Latest Activity</p>
                        {activityFeed.map((a, i) => (
                            <p key={i} style={{ fontSize: '9px', color: '#999', margin: '0 0 3px', paddingLeft: '8px', borderLeft: '2px solid #C5A019' }}>• {a}</p>
                        ))}
                    </div>

                    {/* Upcoming Live Sessions */}
                    <div style={{ position: 'relative' }}>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>Upcoming Live Sessions</p>
                        {liveSessions.map((s, i) => (
                            <p key={i} style={{ fontSize: '9px', color: '#B8B8B8', margin: '0 0 3px' }}>{s}</p>
                        ))}
                    </div>

                    {/* Floating AI bubble inside this card */}
                    <button
                        onClick={() => navigate('/ai')}
                        style={{
                            position: 'absolute', bottom: '12px', right: '12px',
                            width: '42px', height: '42px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                            border: '2px solid #C5A019',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 14px rgba(197,160,25,0.6)', cursor: 'pointer',
                            zIndex: 10,
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '3px' }}>
                                <div style={{ width: '6px', height: '6px', background: '#111', borderRadius: '50%' }} />
                                <div style={{ width: '6px', height: '6px', background: '#111', borderRadius: '50%' }} />
                            </div>
                            <div style={{ width: '14px', height: '3px', borderBottom: '3px solid #111', borderRadius: '0 0 6px 6px' }} />
                        </div>
                    </button>
                </div>
            </div>

            {/* ─── SLIDE-IN MENU DRAWER ────────────────────────────────────── */}
            {showMenu && (
                <>
                    <div
                        onClick={() => setShowMenu(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9998, backdropFilter: 'blur(4px)' }}
                    />
                    <div style={{
                        position: 'fixed', top: 0, left: 0, bottom: 0, width: '300px',
                        background: '#050505', zIndex: 9999, overflowY: 'auto',
                        borderRight: '1px solid rgba(197,160,25,0.2)',
                        boxShadow: '20px 0 60px rgba(0,0,0,0.9)',
                        padding: '24px 20px',
                        display: 'flex', flexDirection: 'column',
                    }}>
                        <button
                            onClick={() => setShowMenu(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}
                        >×</button>

                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#00BFFF', marginBottom: '28px', marginTop: '8px', letterSpacing: '2px' }}>Menu</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                            {menuItems.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => { navigate(item.route); setShowMenu(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        background: 'none', border: 'none', color: '#00BFFF',
                                        fontSize: '17px', fontWeight: '500', textAlign: 'left',
                                        padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,190,255,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Legal + Logout */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <button
                                onClick={() => { navigate('/legal'); setShowMenu(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    background: 'none', border: 'none', color: '#C5A019',
                                    fontSize: '17px', fontWeight: '500', textAlign: 'left',
                                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>⚖️</span> Legal & Privacy
                            </button>
                            <button
                                onClick={logout}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    background: 'none', border: 'none', color: '#EF4444',
                                    fontSize: '17px', fontWeight: '500', textAlign: 'left',
                                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>🚪</span> Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
