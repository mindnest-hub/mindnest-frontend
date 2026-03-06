import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from './Toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [pendingKyc, setPendingKyc] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'kyc', 'withdrawals'
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [statsData, kycData, withdrawalData] = await Promise.all([
                    api.getAdminStats(token),
                    api.getAdminKycPending(token),
                    api.getAdminWithdrawals(token)
                ]);
                setStats(statsData);
                setPendingKyc(kycData);
                setWithdrawals(withdrawalData);
            } catch (error) {
                setToast({ message: error.message || 'Failed to fetch admin data', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleKycAction = async (userId, verified) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.updateAdminKycStatus(token, userId, verified);
            setToast({ message: `User KYC ${verified ? 'Approved' : 'Rejected'}`, type: 'success' });
            setPendingKyc(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleWithdrawalAction = async (requestId, status) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.updateAdminWithdrawalStatus(token, requestId, status);
            setToast({ message: `Withdrawal ${status.toUpperCase()} successfully`, type: 'success' });
            setWithdrawals(prev => prev.map(w => w.id === requestId ? { ...w, status } : w));
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

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

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('stats')}
                    style={{
                        background: 'none', border: 'none', color: activeTab === 'stats' ? '#FFD700' : '#888',
                        fontWeight: activeTab === 'stats' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem'
                    }}
                >
                    Statistics
                </button>
                <button
                    onClick={() => setActiveTab('kyc')}
                    style={{
                        background: 'none', border: 'none', color: activeTab === 'kyc' ? '#FFD700' : '#888',
                        fontWeight: activeTab === 'kyc' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    KYC Queue {pendingKyc.length > 0 && <span style={{ background: '#ff4444', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>{pendingKyc.length}</span>}
                </button>
                <button
                    onClick={() => setActiveTab('withdrawals')}
                    style={{
                        background: 'none', border: 'none', color: activeTab === 'withdrawals' ? '#FFD700' : '#888',
                        fontWeight: activeTab === 'withdrawals' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    Withdrawals {withdrawals.filter(w => w.status === 'pending').length > 0 && <span style={{ background: '#ff4444', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>{withdrawals.filter(w => w.status === 'pending').length}</span>}
                </button>
            </div>

            {activeTab === 'stats' && (
                <>
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
                </>
            )}

            {activeTab === 'kyc' && (
                <div className="card">
                    <h3>Pending KYC Verifications 📋</h3>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem' }}>Review identity documents before approving financial access.</p>
                    {pendingKyc.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                            <p>All KYC requests have been processed!</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #333' }}>
                                        <th style={{ padding: '1rem' }}>User</th>
                                        <th style={{ padding: '1rem' }}>ID Type</th>
                                        <th style={{ padding: '1rem' }}>Details</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingKyc.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #222' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{u.username}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{u.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}><span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{u.kycType}</span></td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.85rem' }}>{u.kycData.fullName}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#00C851' }}>{u.kycData.idNumber}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleKycAction(u.id, true)}
                                                        className="btn"
                                                        style={{ backgroundColor: '#00C851', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleKycAction(u.id, false)}
                                                        className="btn"
                                                        style={{ backgroundColor: '#ff4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'withdrawals' && (
                <div className="card">
                    <h3>Withdrawal Requests 🏧</h3>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem' }}>Process payments to verified Nigerian bank accounts.</p>
                    {withdrawals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <p>No withdrawal requests yet.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #333' }}>
                                        <th style={{ padding: '1rem' }}>User</th>
                                        <th style={{ padding: '1rem' }}>Amount</th>
                                        <th style={{ padding: '1rem' }}>Bank Details</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawals.map(w => (
                                        <tr key={w.id} style={{ borderBottom: '1px solid #222' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{w.user.username}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{w.user.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: 'bold', color: '#FFD700' }}>₦{w.amount.toLocaleString()}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.85rem' }}>{w.bankDetails.bankName}</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{w.bankDetails.accountNumber}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{w.bankDetails.accountName}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold',
                                                    background: w.status === 'pending' ? '#FFA000' : w.status === 'paid' ? '#00C851' : '#ff4444',
                                                    color: 'white'
                                                }}>
                                                    {w.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {w.status === 'pending' && (
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button
                                                            disabled={actionLoading}
                                                            onClick={() => handleWithdrawalAction(w.id, 'paid')}
                                                            className="btn"
                                                            style={{ backgroundColor: '#00C851', padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                                        >
                                                            Mark Paid
                                                        </button>
                                                        <button
                                                            disabled={actionLoading}
                                                            onClick={() => handleWithdrawalAction(w.id, 'rejected')}
                                                            className="btn"
                                                            style={{ backgroundColor: '#ff4444', padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
