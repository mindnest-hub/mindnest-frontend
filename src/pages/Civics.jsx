import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Civics = () => {
    const navigate = useNavigate();

    // --- RPG STATE ---
    const [happiness, setHappiness] = useState(50);
    const [funds, setFunds] = useState(1000);
    const [year, setYear] = useState(1);
    const [activeTab, setActiveTab] = useState('budget');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };
    const [gameOver, setGameOver] = useState(false);
    const [gameMessage, setGameMessage] = useState("Welcome, Chief! Lead your village to prosperity. 🌍");

    const scenarios = [
        {
            id: 1,
            title: "The Broken Bridge 🌉",
            desc: "The bridge to the market has collapsed. Traders cannot travel.",
            options: [
                { text: "Repair immediately (-₦300)", cost: 300, happy: 10, msg: "Trade is flowing again! Villagers are happy." },
                { text: "Ask volunteers to fix it (Free)", cost: 0, happy: -5, msg: "It took a long time. Villagers are annoyed but saved money." }
            ]
        },
        {
            id: 2,
            title: "School Supplies 📚",
            desc: "The village school needs new books and desks.",
            options: [
                { text: "Buy high-quality supplies (-₦200)", cost: 200, happy: 15, msg: "The children are learning well! Future is bright." },
                { text: "Buy basic supplies (-₦50)", cost: 50, happy: 5, msg: "It's better than nothing." }
            ]
        },
        {
            id: 3,
            title: "Harvest Festival 🎉",
            desc: "It's time to celebrate the harvest.",
            options: [
                { text: "Host a grand feast (-₦150)", cost: 150, happy: 20, msg: "What a party! Everyone loves you." },
                { text: "Small gathering (Free)", cost: 0, happy: 0, msg: "A quiet celebration." }
            ]
        },
        {
            id: 4,
            title: "Health Clinic 🏥",
            desc: "A doctor wants to visit but needs a clinic space.",
            options: [
                { text: "Build a new clinic (-₦400)", cost: 400, happy: 25, msg: "Health is wealth! The village is strong." },
                { text: "Use the school hall (Free)", cost: 0, happy: 5, msg: "It works, but it's crowded." }
            ]
        },
        {
            id: 5,
            title: "Drought Warning ☀️",
            desc: "The rains are late this year.",
            options: [
                { text: "Dig a new well (-₦250)", cost: 250, happy: 10, msg: "Water is life. We are safe." },
                { text: "Wait for rain (Risk)", cost: 0, happy: -20, msg: "The crops suffered. People are hungry." }
            ]
        }
    ];

    const [currentScenario, setCurrentScenario] = useState(0);

    const handleDecision = (option) => {
        if (funds < option.cost) {
            showToast("Not enough funds! Choose another option.", 'warning');
            return;
        }

        setFunds(prev => prev - option.cost);
        setHappiness(prev => Math.min(100, Math.max(0, prev + option.happy)));
        setGameMessage(option.msg);

        if (currentScenario < scenarios.length - 1) {
            setTimeout(() => {
                setCurrentScenario(prev => prev + 1);
                setYear(prev => prev + 1);
                setGameMessage("");
            }, 2000);
        } else {
            setTimeout(() => setGameOver(true), 2000);
        }
    };

    const resetGame = () => {
        setHappiness(50);
        setFunds(1000);
        setYear(1);
        setCurrentScenario(0);
        setGameOver(false);
        setGameMessage("Welcome, Chief! Lead your village to prosperity. 🌍");
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
            >
                ← Back to Hub
            </button>

            <header style={{ marginBottom: '2rem', textAlign: 'center', width: '100%', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: '#9C27B0', marginBottom: '0.5rem' }}>Community Leader 👑</h1>
                <p style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    Lead with wisdom. Balance the needs of your people.
                </p>
            </header>

            {/* STATS BAR */}
            <div style={{
                display: 'flex', justifyContent: 'space-around', padding: '1.5rem',
                backgroundColor: '#1E1E1E', borderRadius: '24px', marginBottom: '2rem',
                border: '1px solid #9C27B0', flexWrap: 'wrap', gap: '1.5rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>😊 {happiness}%</div>
                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Happiness</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>💰 ₦{funds}</div>
                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Village Funds</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>📅 Year {year}</div>
                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Timeline</div>
                </div>
            </div>

            {/* GAME AREA */}
            {!gameOver ? (
                <div className="card" style={{ textAlign: 'center', padding: '2rem', borderTop: '4px solid #9C27B0' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{scenarios[currentScenario].title}</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scenarios[currentScenario].desc}</p>

                    {gameMessage && <p style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '2rem', minHeight: '1.5rem' }}>{gameMessage}</p>}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                        {scenarios[currentScenario].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleDecision(opt)}
                                className="btn"
                                style={{
                                    backgroundColor: '#4a148c',
                                    padding: '1.5rem',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    minHeight: '120px', justifyContent: 'center'
                                }}
                            >
                                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{opt.text}</span>
                                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                    {opt.happy >= 0 ? `+${opt.happy} 😊` : `${opt.happy} 😞`}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Term Ended! 🏁</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                        Final Happiness: <strong style={{ color: happiness > 70 ? '#00C851' : '#ff4444' }}>{happiness}%</strong><br />
                        Remaining Funds: <strong>₦{funds}</strong>
                    </p>
                    <p style={{ marginBottom: '2rem', fontStyle: 'italic' }}>
                        {happiness > 80 ? "The people love you! You are a legendary leader! 🌟" :
                            happiness > 50 ? "You did a decent job. The village survived. 👍" :
                                "The people are unhappy. Leadership is hard! 🦁"}
                    </p>
                    <button onClick={resetGame} className="btn btn-primary">Play Again 🔄</button>
                </div>
            )}
        </div>
    );
};

export default Civics;
