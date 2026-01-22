import React, { useState } from 'react';

const InvestPitch = ({ onDeal }) => {
    const [step, setStep] = useState('intro'); // intro, pitch, negotiation, deal, fail
    const [valuation, setValuation] = useState(1000000); // 1 Million Naira
    const [equity, setEquity] = useState(10); // 10%
    const [investorMood, setInvestorMood] = useState(50); // 0-100
    const [feedback, setFeedback] = useState("");

    const questions = [
        {
            q: "Investor: 'Your valuation is ₦1 Million. Do you have the sales to back that up?'",
            options: [
                { txt: "Yes, we have ₦200k monthly revenue with 40% margin.", impact: 20, resp: "Impressive numbers." },
                { txt: "Not yet, but our idea is really good!", impact: -20, resp: "Ideas are cheap. Execution matters." },
                { txt: "We project ₦5M next year.", impact: 5, resp: "Projections are risky, but ambitious." }
            ]
        },
        {
            q: "Investor: 'How do you handle post-harvest losses? That's a major risk in Africa.'",
            options: [
                { txt: "We sell immediately at any price.", impact: -10, resp: "Desperation lowers your margins." },
                { txt: "We have a solar-drying facility and storage.", impact: 25, resp: "Excellent. Value addition is key." },
                { txt: "We pray for good buyers.", impact: -30, resp: "Hope is not a strategy." }
            ]
        },
        {
            q: "Investor: 'I'll offer ₦2 Million, but I want 40% equity. Take it or leave it.'",
            options: [
                { txt: "Deal! I need the money.", impact: -5, resp: "You gave away too much company, but you got the cash.", outcome: 'deal_bad' },
                { txt: "40% is too high. How about 25% for ₦2M?", impact: 15, resp: "You negotiate hard. I respect that. 30% and it's a deal.", outcome: 'deal_good' },
                { txt: "No way. My company is worth more.", impact: 0, resp: "Fair enough. Walk away.", outcome: 'fail' }
            ]
        }
    ];

    const [qIndex, setQIndex] = useState(0);

    const handleAnswer = (option) => {
        setInvestorMood(prev => prev + option.impact);
        setFeedback(option.resp);

        if (option.outcome) {
            setTimeout(() => {
                if (option.outcome === 'fail') setStep('fail');
                else {
                    setStep('deal');
                    if (onDeal) onDeal(option.outcome === 'deal_good' ? 2000000 : 1000000);
                }
            }, 1000);
        } else {
            setTimeout(() => {
                setFeedback("");
                if (qIndex < questions.length - 1) setQIndex(prev => prev + 1);
            }, 1500);
        }
    };

    return (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
            {step === 'intro' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>🦈</div>
                    <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>The Pitch Room</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>You have 3 minutes to convince the "Agri-Sharks" to invest in your farm. Know your numbers!</p>
                    <button onClick={() => setStep('pitch')} className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1.25rem 2.5rem' }}>Enter Room</button>
                </div>
            )}

            {step === 'pitch' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Investor Interest:</span>
                        <div style={{ width: '100px', height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${investorMood}%`, height: '100%', backgroundColor: investorMood > 50 ? '#00C851' : '#ff4444', transition: 'width 0.5s' }}></div>
                        </div>
                        <span style={{ fontWeight: '700', color: investorMood > 50 ? '#00C851' : '#ff4444' }}>{investorMood}%</span>
                    </div>

                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.03)', padding: '1.75rem', borderRadius: '15px',
                        marginBottom: '2rem', borderLeft: '5px solid var(--color-primary)', textAlign: 'left'
                    }}>
                        <p style={{ fontSize: '1.25rem', fontStyle: 'italic', lineHeight: '1.5' }}>"{questions[qIndex].q}"</p>
                    </div>

                    {feedback ? (
                        <div style={{
                            color: 'var(--color-accent)', fontSize: '1.2rem', padding: '1rem',
                            backgroundColor: 'rgba(0,191,255,0.05)', borderRadius: '10px', animation: 'fadeIn 0.3s'
                        }}>
                            {feedback}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {questions[qIndex].options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    style={{
                                        padding: '1.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--color-border)',
                                        background: 'rgba(255,255,255,0.02)',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '1rem',
                                        transition: 'var(--transition)'
                                    }}
                                    className="hover-card"
                                >
                                    {opt.txt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {step === 'deal' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🤝</div>
                    <h2 style={{ color: '#00C851', fontSize: '2.5rem', marginBottom: '1rem' }}>DEAL SECURED!</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Congratulations! The investors are on board. Additional capital has been added to your global wallet.</p>
                    <button onClick={() => setStep('intro')} className="btn btn-primary">Continue Growing</button>
                </div>
            )}

            {step === 'fail' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🚪</div>
                    <h2 style={{ color: 'var(--color-danger)', fontSize: '2.5rem', marginBottom: '1rem' }}>Pitch Failed</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You walked away or lost their interest. Refine your business plan and return later.</p>
                    <button onClick={() => setStep('intro')} className="btn btn-outline" style={{ padding: '1rem 2rem' }}>Try Again</button>
                </div>
            )}
        </div>
    );
};

export default InvestPitch;
