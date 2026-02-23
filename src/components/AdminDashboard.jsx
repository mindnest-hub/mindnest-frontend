import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from './Toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await api.getAdminStats(token);
                setStats(data);
            } catch (error) {
                setToast({ message: error.message || 'Failed to fetch stats', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    if (loading) return <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}><h2>Loading Admin Intelligence... ⚙️</h2></div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ color: '#FFD700' }}>Admin Dashboard ⚙️</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Real-time platform metrics and user intelligence.</p>
                </div>
                <button onClick={() => navigate('/')} className="btn btn-outline">Back to Home</button>
            </header>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Users</div>
                        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{stats.totalUsers}</h2>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💎</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Elite Members</div>
                        <h2 style={{ fontSize: '2rem', color: '#FFD700' }}>{stats.eliteUsers}</h2>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total XP Earned</div>
                        <h2 style={{ fontSize: '2rem', color: '#00C851' }}>{stats.totalXp.toLocaleString()}</h2>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Wallet Value</div>
                        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>₦{stats.totalWalletValue.toLocaleString()}</h2>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <h3>Age Group Distribution</h3>
                    <div style={{ marginTop: '2rem' }}>
                        {stats?.ageGroups.map(group => (
                            <div key={group.ageGroup} style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{group.ageGroup}</span>
                                    <span>{group._count._all} users</span>
                                </div>
                                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(group._count._all / stats.totalUsers) * 100}%`,
                                        height: '100%',
                                        background: 'var(--color-primary)'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <h3>Platform Health</h3>
                    <div style={{ fontSize: '5rem', margin: '1rem 0' }}>✅</div>
                    <p style={{ color: '#00C851', fontWeight: 'bold' }}>All Systems Operational</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Backend Sync: Active</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
