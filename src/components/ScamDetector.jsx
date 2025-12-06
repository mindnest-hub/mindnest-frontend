import React, { useState } from 'react';

const ScamDetector = () => {
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState('');

    const scenarios = [
        {
            text: "📩 SMS: 'Hello dear, I mistakenly sent ₦5,000 to your OPay. Please send it back to this number now!'",
            type: "SCAM",
            reason: "Classic Scam! Scammers use fake SMS alerts. Always check your REAL balance in your app first."
        },
        {
            text: "📱 App Alert: 'Your bank requires you to link your BVN to avoid account blockage. Click this link: bit.ly/bank-verify'",
            type: "SCAM",
            reason: "Phishing! Banks NEVER ask you to click random links for BVN. Go to the bank or use the official app."
        },
        {
            text: "🛒 Vendor: 'Send the money to my business account: Tola Fabrics, GTBank.'",
            type: "LEGIT",
            reason: "Safe. Sending to a verified business account is standard. Just keep the receipt!"
        },
        {
            text: "🤑 Instagram DM: 'Invest ₦10k and get ₦20k in 45 minutes! #Binance #Forex'",
            type: "SCAM",
            reason: "Ponzi Scheme! No legit investment doubles money in an hour. If it sounds too good to be true, it is."
        },
        {
            text: "🔒 POS Agent: 'Enter your PIN here, let me help you press it.'",
            type: "SCAM",
            reason: "Never let anyone see or type your PIN! They can swap your card or memorize the code."
        }
    ];

    const handleChoice = (choice) => {
        const isCorrect = choice === scenarios[step].type;
        if (isCorrect) {
            setScore(score + 1);
            setFeedback("✅ Correct! " + scenarios[step].reason);
        } else {
            setFeedback("❌ Wrong! " + scenarios[step].reason);
        }

        setTimeout(() => {
            setFeedback('');
            if (step < scenarios.length - 1) {
                setStep(step + 1);
            } else {
                setShowResult(true);
            }
        }, 4000);
    };

    if (showResult) {
        return (
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
                <h3 style={{ color: score === scenarios.length ? '#00FF7F' : '#FFD700' }}>
                    {score === scenarios.length ? '🛡️ Scam Buster!' : '👮 Keep Learning!'}
                </h3>
                <p style={{ fontSize: '1.1rem', margin: '1rem 0', color: '#ddd' }}>
                    You spotted {score} out of {scenarios.length} scams.
                </p>
                <button
                    onClick={() => { setStep(0); setScore(0); setShowResult(false); }}
                    style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#000', fontWeight: 'bold' }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#2a2a2a', padding: '1.5rem', borderRadius: '10px', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                <span>Scenario {step + 1}/{scenarios.length}</span>
                <span>Score: {score}</span>
            </div>

            <div style={{
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#333',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '1.1rem',
                textAlign: 'center',
                border: '1px solid #444'
            }}>
                {scenarios[step].text}
            </div>

            {feedback ? (
                <div style={{
                    padding: '1rem',
                    backgroundColor: feedback.startsWith('✅') ? 'rgba(0, 255, 127, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                    border: `1px solid ${feedback.startsWith('✅') ? '#00FF7F' : '#ff4444'}`,
                    borderRadius: '5px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {feedback}
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => handleChoice('SCAM')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: '#ff4444',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        🚨 SCAM
                    </button>
                    <button
                        onClick={() => handleChoice('LEGIT')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: '#00FF7F',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#000',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        ✅ LEGIT
                    </button>
                </div>
            )}
        </div>
    );
};

export default ScamDetector;
