import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from './Toast';

const PaymentPortal = ({ onClose, onBalanceUpdate }) => {
    const [aiDuration, setAiDuration] = useState('monthly');
    const [eliteDuration, setEliteDuration] = useState('monthly');

    const handlePayment = async (selectedAmount = amount) => {
        if (!selectedAmount || isNaN(selectedAmount) || selectedAmount < 100) {
            setToast({ message: 'Please enter a valid amount (Min: ₦100)', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await api.initializePayment(token, user.email, selectedAmount);

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error('Failed to get payment URL');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            setToast({ message: error.message || 'Payment initialization failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 11000, padding: '1rem'
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="card" style={{ maxWidth: '450px', width: '100%', position: 'relative', animation: 'fadeIn 0.3s' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    &times;
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #333', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <button
                        onClick={() => setTab('deposit')}
                        style={{
                            flex: 1, padding: '0.8rem', background: 'none', border: 'none',
                            color: tab === 'deposit' ? 'var(--color-primary)' : '#666',
                            borderBottom: tab === 'deposit' ? '2px solid var(--color-primary)' : 'none',
                            cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                        }}
                    >
                        💰 Deposit
                    </button>
                    <button
                        onClick={() => setTab('ai')}
                        style={{
                            flex: 1, padding: '0.8rem', background: 'none', border: 'none',
                            color: tab === 'ai' ? '#4dabf7' : '#666',
                            borderBottom: tab === 'ai' ? '2px solid #4dabf7' : 'none',
                            cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                        }}
                    >
                        ✨ AI Only
                    </button>
                    <button
                        onClick={() => setTab('elite')}
                        style={{
                            flex: 1, padding: '0.8rem', background: 'none', border: 'none',
                            color: tab === 'elite' ? '#fcc419' : '#666',
                            borderBottom: tab === 'elite' ? '2px solid #fcc419' : 'none',
                            cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                        }}
                    >
                        💎 Full Elite
                    </button>
                </div>

                {tab === 'deposit' ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
                            <h2 style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>Top Up Wallet</h2>
                            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Fund your account to unlock premium access.</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                {presetAmounts.map(preset => (
                                    <button
                                        key={preset}
                                        onClick={() => setAmount(preset)}
                                        className="btn btn-outline btn-sm"
                                        style={{
                                            borderColor: amount === preset ? 'var(--color-primary)' : '#444',
                                            backgroundColor: amount === preset ? 'rgba(0, 200, 81, 0.1)' : 'transparent',
                                            color: amount === preset ? 'var(--color-primary)' : '#fff',
                                            padding: '0.5rem'
                                        }}
                                    >
                                        ₦{preset.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Custom amount (e.g. 1500)"
                                style={{
                                    width: '100%', padding: '0.8rem', borderRadius: '12px',
                                    backgroundColor: '#222', border: '1px solid #444', color: '#fff',
                                    fontSize: '1rem', marginBottom: '1rem'
                                }}
                            />
                        </div>

                        <button
                            disabled={loading || !amount}
                            onClick={() => handlePayment()}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: 'bold' }}
                        >
                            {loading ? 'Initializing...' : 'Proceed to Secure Payment 🔒'}
                        </button>
                    </>
                ) : tab === 'ai' ? (
                    <div style={{ animation: 'popIn 0.3s ease' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                            <h2 style={{ color: '#4dabf7', fontSize: '1.25rem' }}>AI Oracle Unlimited</h2>
                            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Unlimited wisdom from the African Oracle.</p>
                        </div>

                        <div style={{ display: 'flex', background: '#222', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setAiDuration('monthly')}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px',
                                    background: aiDuration === 'monthly' ? '#4dabf7' : 'transparent',
                                    color: aiDuration === 'monthly' ? '#000' : '#888', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >Monthly</button>
                            <button
                                onClick={() => setAiDuration('yearly')}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px',
                                    background: aiDuration === 'yearly' ? '#4dabf7' : 'transparent',
                                    color: aiDuration === 'yearly' ? '#000' : '#888', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >Yearly (Save 25%)</button>
                        </div>

                        <div style={{ backgroundColor: '#111', borderRadius: '12px', padding: '1.25rem', border: '1px solid #4dabf7', marginBottom: '1.5rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
                                    ₦{aiDuration === 'monthly' ? '1,000' : '9,000'}
                                    <span style={{ fontSize: '0.9rem', opacity: 0.6 }}> / {aiDuration === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: '#ddd' }}>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Unlimited AI Chat Sessions</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Context-Aware Cultural Wisdom</li>
                                <li>✅ Priority Server Access</li>
                            </ul>
                        </div>

                        {user?.fundedBalance >= (aiDuration === 'monthly' ? 1000 : 9000) ? (
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        await purchaseAiUnlimited(aiDuration);
                                        setToast({ message: `AI Unlimited (${aiDuration}) Activated! ✨`, type: 'success' });
                                        setTimeout(onClose, 2000);
                                    } catch (e) {
                                        setToast({ message: e.message || 'Purchase failed', type: 'error' });
                                    }
                                    setLoading(false);
                                }}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#4dabf7', border: 'none' }}
                            >
                                {loading ? 'Processing...' : `Purchase Now (₦${aiDuration === 'monthly' ? '1,000' : '9,000'})`}
                            </button>
                        ) : (
                            <button
                                onClick={() => { setTab('deposit'); setAmount(aiDuration === 'monthly' ? 1000 : 9000); }}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#4dabf7', border: 'none' }}
                            >
                                Deposit ₦{aiDuration === 'monthly' ? '1,000' : '9,000'} to Purchase
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ animation: 'popIn 0.3s ease' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
                            <h2 style={{ color: '#fcc419', fontSize: '1.25rem' }}>Full Elite Mastery</h2>
                            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>The ultimate membership for African Excellence.</p>
                        </div>

                        <div style={{ display: 'flex', background: '#222', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setEliteDuration('monthly')}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px',
                                    background: eliteDuration === 'monthly' ? '#fcc419' : 'transparent',
                                    color: eliteDuration === 'monthly' ? '#000' : '#888', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >Monthly</button>
                            <button
                                onClick={() => setEliteDuration('yearly')}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px',
                                    background: eliteDuration === 'yearly' ? '#fcc419' : 'transparent',
                                    color: eliteDuration === 'yearly' ? '#000' : '#888', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >Yearly (Save 25%)</button>
                        </div>

                        <div style={{ backgroundColor: '#111', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fcc419', marginBottom: '1.5rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
                                    ₦{eliteDuration === 'monthly' ? '2,000' : '18,000'}
                                    <span style={{ fontSize: '0.9rem', opacity: 0.6 }}> / {eliteDuration === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: '#ddd' }}>
                                <li style={{ marginBottom: '0.5rem' }}>✅ EVERYTHING Included (AI + Apps)</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Unlimited African Oracle Guidance</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Unlock Watermelon & Premium Crops</li>
                                <li>✅ 2x XP & Reputation Multiplier</li>
                            </ul>
                        </div>

                        <button
                            disabled={loading}
                            onClick={async () => {
                                const cost = eliteDuration === 'monthly' ? 2000 : 18000;
                                if (user?.walletBalance >= cost || user?.fundedBalance >= cost) {
                                    setLoading(true);
                                    try {
                                        await upgradeToElite(eliteDuration);
                                        setToast({ message: `Elite Mastery (${eliteDuration}) Activated! 💎`, type: 'success' });
                                        setTimeout(onClose, 2000);
                                    } catch (e) {
                                        setToast({ message: e.message || 'Upgrade failed', type: 'error' });
                                    }
                                    setLoading(false);
                                } else {
                                    setTab('deposit');
                                    setAmount(cost);
                                }
                            }}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#fcc419', border: 'none', color: '#000' }}
                        >
                            {loading ? 'Processing...' : (user?.walletBalance >= (eliteDuration === 'monthly' ? 2000 : 18000) ? `Unlock Now (₦${eliteDuration === 'monthly' ? '2,000' : '18,000'})` : `Deposit ₦${eliteDuration === 'monthly' ? '2,000' : '18,000'} to Unlock`)}
                        </button>
                    </div>
                )}



                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>
                        By clicking proceed, you will be redirected to Paystack to complete your transaction safely.
                    </p>
                    <div style={{ marginTop: '0.5rem', opacity: 0.5, fontSize: '0.7rem' }}>
                        Secure Payment Powered by <strong>Paystack</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPortal;
