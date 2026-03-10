import React, { useState } from 'react';
import { api } from '../services/api';

const PoliticalTrickSimulator = ({ ageGroup, onComplete }) => {
    const [step, setStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [decisions, setDecisions] = useState([]);

    const scenarios = [
        {
            scenario: "A politician mounts the stage and says: 'The economy is bad completely because of those foreigners from the North. If you ban them, you will all be rich!'",
            options: [
                { text: "He is protecting us.", trick: "None", isTrick: false },
                { text: "This is the Scapegoat trick (Us vs Them).", trick: "Scapegoating", isTrick: true }
            ],
            explanation: "Blaming a visible minority group for complex economic problems is a classic distraction technique."
        },
        {
            scenario: "Two weeks before the election, the ruling party suddenly distributes bags of rice and ₦2,000 to everyone in your ward.",
            options: [
                { text: "They finally remembered us. Good leaders!", trick: "None", isTrick: false },
                { text: "This is Vote Buying / Tokenism.", trick: "Vote Buying", isTrick: true }
            ],
            explanation: "Giving cheap immediate gifts to secure 4 years of power is a terrible trade for the citizen."
        },
        {
            scenario: "A huge corruption scandal breaks out about the Governor. The next morning, a highly controversial religious bill is suddenly introduced in the assembly.",
            options: [
                { text: "This is the 'Dead Cat' Distraction trick.", trick: "Distraction", isTrick: true },
                { text: "The assembly is just doing normal work.", trick: "None", isTrick: false }
            ],
            explanation: "Throwing an explosive, emotional issue into the media to hide a damaging scandal."
        }
    ];

    const handleChoice = async (option) => {
        const newDecisions = [...decisions, { scenario: scenarios[step].scenario, choice: option.text, identifiedTrick: option.trick, correct: option.isTrick }];
        setDecisions(newDecisions);

        if (step < scenarios.length - 1) {
            setStep(prev => prev + 1);
        } else {
            // Reached the end, submit research data
            setIsSaving(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await api.submitResearchData(token, {
                        ageGroup,
                        simulatorType: 'POLITICAL_TRICKS',
                        decisionData: { log: newDecisions }
                    });
                }
            } catch (err) {
                console.error("Failed to save research data:", err);
            } finally {
                setIsSaving(false);
                setStep(prev => prev + 1);
                onComplete();
            }
        }
    };

    return (
        <div className="card" style={{ borderTop: `4px solid #FF4444`, maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ color: '#FF4444', textAlign: 'center', marginBottom: '1rem' }}>🕵️ Spot The Political Trick</h2>

            {step < scenarios.length ? (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                        <span>Scenario {step + 1} of {scenarios.length}</span>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '15px', borderLeft: '4px solid #FF4444', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>"{scenarios[step].scenario}"</p>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {scenarios[step].options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleChoice(opt)}
                                disabled={isSaving}
                                className="btn btn-outline"
                                style={{ textAlign: 'left', padding: '1rem' }}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'fadeIn 0.5s' }}>
                    <h3 style={{ color: '#00C851', marginBottom: '1rem' }}>Sharp Eye! 👁️</h3>
                    <p style={{ color: '#ccc', marginBottom: '2rem' }}>You have successfully identified the psychological manipulation tactics used against voters. You are now immune to these tricks!</p>
                    <button className="btn" onClick={() => setStep(0)} style={{ backgroundColor: '#FF4444', color: 'white' }}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default PoliticalTrickSimulator;
