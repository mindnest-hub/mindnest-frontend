import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from './Toast';

const PaymentPortal = ({ onClose, onBalanceUpdate }) => {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const presetAmounts = [500, 1000, 2500, 5000, 10000];

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
                // Redirect user to Paystack payment page
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

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                    <h2 style={{ color: 'var(--color-primary)' }}>Top Up Wallet</h2>
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Fast, secure, and reliable payments via Paystack.</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', color: '#eee' }}>Select or enter amount (₦)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {presetAmounts.map(preset => (
                            <button
                                key={preset}
                                onClick={() => setAmount(preset)}
                                className="btn btn-outline btn-sm"
                                style={{
                                    borderColor: amount === preset ? 'var(--color-primary)' : '#444',
                                    backgroundColor: amount === preset ? 'rgba(0, 200, 81, 0.1)' : 'transparent',
                                    color: amount === preset ? 'var(--color-primary)' : '#fff'
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
                            width: '100%', padding: '1rem', borderRadius: '12px',
                            backgroundColor: '#222', border: '1px solid #444', color: '#fff',
                            fontSize: '1.1rem', marginBottom: '1rem'
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
