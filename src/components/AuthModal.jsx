import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './KidsMascot.css';

const AuthModal = ({ onClose }) => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [ageGroup, setAgeGroup] = useState('kids');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, ageGroup, username);
            }
            onClose();
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.message || 'Authentication failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const Mascot = () => (
        <div className={`mascot-container ${isPasswordFocused ? 'covering' : ''}`}>
            <div className="lion-mascot">
                <div className="lion-mane"></div>
                <div className="lion-face">
                    <div className="eye eye-l"></div>
                    <div className="eye eye-r"></div>
                    <div className="lion-nose"></div>
                    <div className="lion-mouth"></div>
                </div>
                <div className="paw-l"></div>
                <div className="paw-r"></div>
            </div>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000,
            padding: '1rem', backdropFilter: 'blur(10px)'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '420px',
                position: 'relative', padding: '2.5rem 2rem',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                border: '1px solid var(--color-border)'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--color-text-muted)', fontSize: '1.5rem', transition: 'var(--transition)', zIndex: 100 }}>&times;</button>

                {ageGroup === 'kids' && <Mascot />}

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', color: '#fff' }}>
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {isLogin ? 'Sign in to continue your journey' : 'Create an account to save your progress'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {!isLogin && (
                        <input
                            type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
                            style={{
                                padding: '1rem', borderRadius: '12px', background: '#222', border: '1px solid #333', color: '#fff',
                                fontFamily: 'inherit', fontSize: '1rem'
                            }}
                        />
                    )}
                    <input
                        type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
                        style={{
                            padding: '1rem', borderRadius: '12px', background: '#222', border: '1px solid #333', color: '#fff',
                            fontFamily: 'inherit', fontSize: '1rem'
                        }}
                    />
                    <input
                        type="password" placeholder="Password" value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => ageGroup === 'kids' && setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        required
                        style={{
                            padding: '1rem', borderRadius: '12px', background: '#222', border: '1px solid #333', color: '#fff',
                            fontFamily: 'inherit', fontSize: '1rem'
                        }}
                    />
                    {!isLogin && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>Select Age Group</label>
                            <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{
                                padding: '1rem', borderRadius: '12px', background: '#222', border: '1px solid #333', color: '#fff',
                                fontFamily: 'inherit', fontSize: '1rem'
                            }}>
                                <option value="kids">Kids (5-12)</option>
                                <option value="teens">Teens (13-19)</option>
                                <option value="adults">Adults (20+)</option>
                            </select>
                        </div>
                    )}

                    {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(255,69,0,0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</p>}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem' }}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--color-primary)', fontWeight: '600', marginLeft: '0.25rem', textDecoration: 'underline' }}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
