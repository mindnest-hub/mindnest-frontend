import React, { useState } from 'react';

const ClassCaptainSimulator = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [votes, setVotes] = useState({ Emeka: 0, Amina: 0, Olu: 0 });
    const [hasVoted, setHasVoted] = useState(false);

    const candidates = [
        { name: "Emeka", promise: "I will make sure everyone shares their snacks!", icon: "🥪" },
        { name: "Amina", promise: "I will organize fun games during break time!", icon: "⚽" },
        { name: "Olu", promise: "I will help the teacher keep the class quiet and neat.", icon: "📚" }
    ];

    const handleVote = (name) => {
        setVotes(prev => ({ ...prev, [name]: prev[name] + 1 }));
        setHasVoted(true);
        setTimeout(() => setStep(1), 1500);
    };

    return (
        <div className="card" style={{ borderTop: `4px solid #2196F3`, maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#2196F3', textAlign: 'center', marginBottom: '1rem' }}>🗳️ Class Captain Election</h2>

            {step === 0 && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#ccc' }}>
                        It's election day in Primary 4! Read the promises and cast your vote.
                    </p>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {candidates.map(c => (
                            <button
                                key={c.name}
                                disabled={hasVoted}
                                onClick={() => handleVote(c.name)}
                                className="btn btn-outline"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '1.5rem', textAlign: 'left', opacity: hasVoted ? 0.5 : 1
                                }}
                            >
                                <div>
                                    <strong style={{ fontSize: '1.2rem', color: '#fff', display: 'block' }}>{c.name}</strong>
                                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>"{c.promise}"</span>
                                </div>
                                <span style={{ fontSize: '2rem' }}>{c.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 1 && (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                    <h3 style={{ color: '#00C851', marginBottom: '1rem' }}>The Votes are In!</h3>
                    <p style={{ marginBottom: '2rem' }}>Every vote matters. In a democracy, whoever gets the most votes becomes the leader.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                        {candidates.map(c => (
                            <div key={c.name} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem' }}>{c.icon}</div>
                                <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                                <div style={{ color: '#2196F3', fontSize: '1.5rem' }}>{votes[c.name] + Math.floor(Math.random() * 10)} votes</div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setStep(2);
                            onComplete();
                        }}
                        className="btn"
                        style={{ backgroundColor: '#2196F3', color: 'white', width: '100%' }}
                    >
                        Accept Results ⚖️
                    </button>
                </div>
            )}

            {step === 2 && (
                <div style={{ textAlign: 'center', color: '#00C851', padding: '2rem 0' }}>
                    <h3>Election Complete! ✅</h3>
                    <p>You have learned how majority voting works.</p>
                </div>
            )}
        </div>
    );
};

export default ClassCaptainSimulator;
