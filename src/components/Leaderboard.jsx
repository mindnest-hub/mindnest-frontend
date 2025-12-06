import React, { useEffect, useState } from 'react';

import { useLeaderboard } from '../hooks/useLeaderboard';
import ShareButton from './ShareButton';

const Leaderboard = ({ onClose }) => {
    const { getLeaderboard, getUserRank, getUserProfile, saveUserProfile } = useLeaderboard();
    const [list, setList] = useState([]);
    const [rank, setRank] = useState(null);
    const [username, setUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        setList(getLeaderboard());
        setRank(getUserRank());
        const profile = getUserProfile();
        setUsername(profile.username || 'User' + Math.floor(Math.random() * 1000));
    }, []);

    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState('');

    const handleSaveName = () => {
        const name = newUsername.trim();
        if (!name) return;

        // 1. Local Validation
        if (name.length < 3) {
            setError("Name must be at least 3 characters.");
            return;
        }
        if (name.length > 15) {
            setError("Name must be under 15 characters.");
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(name)) {
            setError("Only letters, numbers, and underscores allowed.");
            return;
        }

        // 2. Simulated Network Check
        setIsValidating(true);
        setError('');

        setTimeout(() => {
            const reserved = ['admin', 'root', 'test', 'system', 'moderator'];
            if (reserved.includes(name.toLowerCase())) {
                setError("This username is reserved.");
                setIsValidating(false);
                return;
            }

            // Success
            const profile = getUserProfile();
            saveUserProfile({ ...profile, username: name });
            setUsername(name);
            setIsEditing(false);
            setIsValidating(false);

            // Update list
            const updatedList = getLeaderboard().map(u =>
                u.username === username ? { ...u, username: name } : u
            );
            localStorage.setItem('leaderboard', JSON.stringify(updatedList));
            setList(updatedList);
        }, 800); // Simulate 800ms network delay
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            color: '#fff',
        }}>
            <div style={{
                background: 'var(--color-surface)',
                padding: '2rem',
                borderRadius: '1rem',
                maxWidth: '500px',
                width: '90%',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>🏆 Leaderboard</h2>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span>Your Name:</span>
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Enter name"
                                        disabled={isValidating}
                                        style={{ padding: '0.25rem', borderRadius: '0.25rem', border: error ? '1px solid red' : 'none' }}
                                    />
                                    <button
                                        onClick={handleSaveName}
                                        disabled={isValidating}
                                        style={{
                                            background: isValidating ? '#666' : 'var(--color-primary)',
                                            border: 'none',
                                            color: '#fff',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '0.25rem',
                                            cursor: isValidating ? 'wait' : 'pointer'
                                        }}
                                    >
                                        {isValidating ? '...' : 'Save'}
                                    </button>
                                </div>
                                {error && <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{error}</span>}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <strong>{username}</strong>
                                <button onClick={() => { setIsEditing(true); setNewUsername(username); }} style={{ fontSize: '0.8rem', background: 'none', border: '1px solid #fff', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Edit</button>
                            </div>
                        )}
                    </div>
                    <p style={{ margin: 0 }}>Your Rank: <strong>{rank ? `#${rank}` : 'Not ranked'}</strong></p>
                    {rank && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <ShareButton
                                title="My MindNest Rank"
                                text={`I'm ranked #${rank} on MindNest with ₦${getUserProfile().totalEarnings?.toLocaleString()} earnings! Can you beat me?`}
                                url="https://mindnest.bond"
                                style={{ background: 'var(--color-accent)', color: '#000', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.9rem' }}
                            />
                        </div>
                    )}
                </div>

                <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>#</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((u, i) => (
                            <tr key={i} style={{
                                background: u.username === username ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>{u.username}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--color-accent)' }}>₦{u.totalEarnings.toLocaleString()}</td>
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                    No records yet. Start learning to earn!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
