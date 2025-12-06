import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Health = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('mind'); // mind, body, move

    // --- MIND STATE ---
    const [breathing, setBreathing] = useState('Inhale');
    const [circleSize, setCircleSize] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setBreathing(prev => prev === 'Inhale' ? 'Exhale' : 'Inhale');
            setCircleSize(prev => prev === 100 ? 200 : 100);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // --- BODY STATE (Superfoods) ---
    const superfoods = [
        { name: "Moringa 🌿", desc: "The Miracle Tree. Packed with Vitamin C and Iron.", benefit: "Boosts immunity!" },
        { name: "Baobab 🌳", desc: "The Tree of Life. High in fiber and antioxidants.", benefit: "Great for energy!" },
        { name: "Teff 🌾", desc: "Ancient grain from Ethiopia. Gluten-free and protein-rich.", benefit: "Strong bones!" },
        { name: "Hibiscus (Zobo) 🌺", desc: "Refreshing drink. Lowers blood pressure.", benefit: "Heart health!" }
    ];

    // --- MOVE STATE (Daily Move) ---
    const [moveStep, setMoveStep] = useState(0);
    const moves = [
        { name: "Jumping Jacks 🏃‍♂️", duration: "30s", emoji: "🏃‍♂️" },
        { name: "High Knees 🦵", duration: "30s", emoji: "🦵" },
        { name: "Dance Party 💃", duration: "1 min", emoji: "💃" }
    ];

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
            >
                ← Back to Hub
            </button>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: '#00FF7F' }}>Health & Wellness 🌿</h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                    A healthy body fuels a brilliant mind.
                </p>
            </header>

            {/* TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setActiveTab('mind')} className="btn" style={{ backgroundColor: activeTab === 'mind' ? '#00FF7F' : '#333', color: activeTab === 'mind' ? '#000' : '#fff' }}>Mind 🧘‍♂️</button>
                <button onClick={() => setActiveTab('body')} className="btn" style={{ backgroundColor: activeTab === 'body' ? '#00FF7F' : '#333', color: activeTab === 'body' ? '#000' : '#fff' }}>Body 🥗</button>
                <button onClick={() => setActiveTab('move')} className="btn" style={{ backgroundColor: activeTab === 'move' ? '#00FF7F' : '#333', color: activeTab === 'move' ? '#000' : '#fff' }}>Move 🏃‍♂️</button>
            </div>

            {/* CONTENT */}
            <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* MIND SECTION */}
                {activeTab === 'mind' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Breathe & Focus</h2>
                        <div style={{
                            width: `${circleSize}px`, height: `${circleSize}px`,
                            borderRadius: '50%', backgroundColor: '#00FF7F',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto', transition: 'all 4s ease-in-out',
                            boxShadow: '0 0 20px #00FF7F'
                        }}>
                            <span style={{ color: '#000', fontWeight: 'bold', fontSize: '1.2rem' }}>{breathing}</span>
                        </div>
                        <p style={{ marginTop: '2rem', color: '#aaa' }}>Sync your breathing with the circle.</p>
                    </div>
                )}

                {/* BODY SECTION */}
                {activeTab === 'body' && (
                    <div style={{ width: '100%' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>African Superfoods 🌍</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {superfoods.map((food, idx) => (
                                <div key={idx} style={{ backgroundColor: '#333', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                                    <h3 style={{ color: '#00FF7F' }}>{food.name}</h3>
                                    <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>{food.desc}</p>
                                    <div style={{ backgroundColor: '#004d40', padding: '0.5rem', borderRadius: '5px', fontSize: '0.8rem', color: '#fff' }}>
                                        ✨ {food.benefit}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MOVE SECTION */}
                {activeTab === 'move' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Daily Move Challenge ⚡</h2>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                            {moves[moveStep].emoji}
                        </div>
                        <h3>{moves[moveStep].name}</h3>
                        <p style={{ fontSize: '1.5rem', color: '#00FF7F', marginBottom: '2rem' }}>{moves[moveStep].duration}</p>

                        <button
                            onClick={() => setMoveStep((prev) => (prev + 1) % moves.length)}
                            className="btn btn-primary"
                        >
                            Next Exercise ⏭️
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Health;
