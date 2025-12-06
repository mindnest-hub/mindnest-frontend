import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ onClose }) => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [ageGroup, setAgeGroup] = useState('kids');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            setError('Authentication failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
            <div style={{
                background: 'var(--color-surface)', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '400px',
                position: 'relative', color: '#fff'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>

                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                    {isLogin ? 'Welcome Back!' : 'Join MindNest'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!isLogin && (
                        <input
                            type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
                            style={{ padding: '0.8rem', borderRadius: '0.5rem', border: 'none' }}
                        />
                    )}
                    <input
                        type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
                        style={{ padding: '0.8rem', borderRadius: '0.5rem', border: 'none' }}
                    />
                    <input
                        type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                        style={{ padding: '0.8rem', borderRadius: '0.5rem', border: 'none' }}
                    />
                    {!isLogin && (
                        <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{ padding: '0.8rem', borderRadius: '0.5rem', border: 'none' }}>
                            <option value="kids">Kids (Under 13)</option>
                            <option value="teens">Teens (13-18)</option>
                            <option value="adults">Adults (18+)</option>
                        </select>
                    )}

                    {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" disabled={loading} style={{
                        background: 'var(--color-primary)', color: '#fff', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
