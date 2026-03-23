import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
    const { updatePassword, user } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setError('');
        setLoading(true);
        try {
            await updatePassword(newPassword);
            alert('Password updated successfully! You can now sign in with your new password.');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            padding: '2rem'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                border: '1px solid #333'
            }}>
                <h2 style={{ textAlign: 'center', color: '#FFD700', marginBottom: '1.5rem' }}>Set New Password</h2>
                <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    Enter your new password below to secure your account.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#aaa', fontSize: '0.85rem' }}>New Password</label>
                        <input
                            type="password"
                            placeholder="Min. 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{
                                padding: '1rem', borderRadius: '12px', background: '#222', border: '1px solid #333', color: '#fff'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="Repeat new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                padding: '1rem', borderRadius: '12px', background: '#222', border: '1px solid #333', color: '#fff'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: '#ff4b2b', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ padding: '1rem', marginTop: '1rem' }}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none', border: 'none', color: '#666',
                            textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
