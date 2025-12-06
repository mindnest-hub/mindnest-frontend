import React, { useEffect, useState } from 'react';
import { useDailyBonus } from '../hooks/useDailyBonus';
import { useWallet } from '../hooks/useWallet';
import ShareButton from './ShareButton';

const DailyBonus = () => {
    const { canClaim, claimBonus, getState } = useDailyBonus();
    const { addEarnings } = useWallet();
    const [show, setShow] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [rewardInfo, setRewardInfo] = useState(null);

    useEffect(() => {
        if (canClaim()) {
            setShow(true);
        }
    }, []);

    const handleClaim = () => {
        const { reward, streak } = claimBonus();
        addEarnings(reward);
        setRewardInfo({ reward, streak });
        setClaimed(true);
        // Don't close immediately so they can see the share button
        // setShow(false); 
    };

    if (!show) return null;

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
                textAlign: 'center',
                maxWidth: '400px',
                position: 'relative'
            }}>
                <button
                    onClick={() => setShow(false)}
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <h2>Daily Bonus</h2>

                {!claimed ? (
                    <>
                        <p>You've logged in today! Claim your reward.</p>
                        <button
                            onClick={handleClaim}
                            style={{
                                background: 'var(--color-primary)',
                                color: '#fff',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                marginTop: '1rem',
                                width: '100%'
                            }}
                        >
                            Claim Bonus
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: '3rem', margin: '1rem 0' }}>🎉</div>
                        <p>You earned <strong>₦{rewardInfo?.reward}</strong>!</p>
                        <p>Current Streak: {rewardInfo?.streak} days 🔥</p>

                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <ShareButton
                                title="MindNest Streak"
                                text={`I'm on a ${rewardInfo?.streak}-day learning streak on MindNest! 🚀`}
                                url="https://mindnest.bond"
                                style={{
                                    background: 'var(--color-accent)',
                                    color: '#000',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    justifyContent: 'center',
                                    width: '100%'
                                }}
                                label="Share Streak"
                            />
                            <button
                                onClick={() => setShow(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DailyBonus;
