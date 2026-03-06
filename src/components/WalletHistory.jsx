import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const WalletHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await api.getTransactions(token);
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading transaction records...</div>;
    if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4444' }}>Error: {error}</div>;

    const getIcon = (type) => {
        switch (type) {
            case 'REWARD': return '💎';
            case 'WITHDRAWAL': return '🏧';
            case 'UPGRADE': return '⚡';
            case 'WITHDRAWAL_REFUND': return '↩️';
            default: return '💰';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'REWARD': return 'Reward Earned';
            case 'WITHDRAWAL': return 'Withdrawal';
            case 'UPGRADE': return 'Elite Upgrade';
            case 'WITHDRAWAL_REFUND': return 'Refund';
            default: return type;
        }
    };

    return (
        <div className="wallet-history" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#FFD700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Wallet Activity 📜
            </h3>

            {transactions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
                    <p>No transactions yet. Start learning to earn!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.map((tx) => (
                        <div key={tx.id} className="card" style={{
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            animation: 'fadeIn 0.5s'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    fontSize: '1.5rem', background: 'rgba(255,255,255,0.05)',
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {getIcon(tx.type)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{getTypeLabel(tx.type)}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.2rem' }}>{tx.reason}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.4rem' }}>
                                        {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '1.2rem', fontWeight: 'bold',
                                    color: tx.amount > 0 ? '#00C851' : '#ff4444'
                                }}>
                                    {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem', textTransform: 'uppercase',
                                    color: tx.status === 'completed' ? '#00C851' : '#FFA000',
                                    marginTop: '0.4rem', fontWeight: 'bold'
                                }}>
                                    {tx.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WalletHistory;
