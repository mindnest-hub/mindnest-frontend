import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../context/AuthContext';

const DailyBonus = () => {
    const { user } = useAuth();
    const { addEarnings } = useWallet();
    const [showBonus, setShowBonus] = useState(false);
    const [reward, setReward] = useState(0);

    useEffect(() => {
        const checkDailyBonus = () => {
            if (!user) return; // Only for logged in users

            const lastLoginDate = localStorage.getItem('lastLoginDate');
            const today = new Date().toDateString();

            if (lastLoginDate !== today) {
                const bonusAmount = 50;
                setReward(bonusAmount);
                setShowBonus(true);
                addEarnings('finance', bonusAmount);
                localStorage.setItem('lastLoginDate', today);
            }
        };

        const timer = setTimeout(checkDailyBonus, 2000);
        return () => clearTimeout(timer);
    }, [user]);

    if (!showBonus) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 20000,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            animation: 'fadeIn 0.5s'
        }}>
            <div style={{ fontSize: '5rem', animation: 'bounce 1s infinite' }}>🎁</div>
            <h1 style={{ color: '#FFD700', fontSize: '2.5rem', textAlign: 'center' }}>Daily Sign-In Bonus!</h1>
            <p style={{ color: '#fff', fontSize: '1.2rem', marginTop: '1rem' }}>Welcome back, Future Leader!</p>

            <div style={{
                margin: '2rem', padding: '2rem', backgroundColor: '#333', borderRadius: '20px',
                border: '2px solid #00C851', display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <span style={{ fontSize: '3rem', color: '#00C851', fontWeight: 'bold' }}>+₦50</span>
                <span style={{ color: '#aaa' }}>Added to Global Wallet</span>
            </div>

            <button
                onClick={() => setShowBonus(false)}
                className="btn"
                style={{
                    backgroundColor: '#00C851', transform: 'scale(1.2)',
                    padding: '1rem 3rem', fontSize: '1.5rem', borderRadius: '50px'
                }}
            >
                Claim Reward 💰
            </button>

            <style>{`
                @keyframes bounce { 
                    0%, 100% { transform: translateY(0); } 
                    50% { transform: translateY(-20px); } 
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default DailyBonus;
