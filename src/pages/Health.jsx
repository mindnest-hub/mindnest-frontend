import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Health = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('mind'); // mind, body, move

    // --- MIND STATE ---
    const [breathing, setBreathing] = useState('Inhale');
    const [circleSize, setCircleSize] = useState(100);
    const [showMindQuiz, setShowMindQuiz] = useState(false);
    const [mindScore, setMindScore] = useState(0);

    const mindQuizzes = [
        { q: "What is the primary benefit of deep abdominal breathing?", options: ["Growing taller", "Calming the nervous system", "Changing eye color"], a: 1 },
        { q: "How long should a standard focus breath last?", options: ["1 second", "4-7 seconds", "30 minutes"], a: 1 }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setBreathing(prev => prev === 'Inhale' ? 'Exhale' : 'Inhale');
            setCircleSize(prev => prev === 100 ? 200 : 100);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // --- BODY STATE (Superfoods) ---
    const [showBodyQuiz, setShowBodyQuiz] = useState(false);
    const [bodyScore, setBodyScore] = useState(0);
    const superfoods = [
        { name: "Moringa 🌿", desc: "The Miracle Tree. Packed with Vitamin C and Iron.", benefit: "Boosts immunity!" },
        { name: "Baobab 🌳", desc: "The Tree of Life. High in fiber and antioxidants.", benefit: "Great for energy!" },
        { name: "Teff 🌾", desc: "Ancient grain from Ethiopia. Gluten-free and protein-rich.", benefit: "Strong bones!" },
        { name: "Hibiscus (Zobo) 🌺", desc: "Refreshing drink. Lowers blood pressure.", benefit: "Heart health!" }
    ];

    const bodyQuizzes = [
        { q: "Which 'Miracle Tree' is famous for its high Iron and Vitamin C?", options: ["Moringa", "Palm Tree", "Oak"], a: 0 },
        { q: "Which grain from Ethiopia is a powerhouse for strong bones?", options: ["Rice", "Teff", "Wheat"], a: 1 }
    ];

    // --- MOVE STATE (Daily Move) ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [toast, setToast] = useState(null);
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

            <header style={{ marginBottom: '2rem', textAlign: 'center', width: '100%', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: '#00FF7F', marginBottom: '0.5rem' }}>Health & Wellness 🌿</h1>
                <p style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    A healthy body fuels a brilliant mind.
                </p>
            </header>

            {/* TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('mind')} className="btn" style={{ flex: '1 1 100px', backgroundColor: activeTab === 'mind' ? '#00FF7F' : '#1E1E1E', color: activeTab === 'mind' ? '#000' : '#fff', border: '1px solid #00FF7F' }}>Mind 🧘‍♂️</button>
                <button onClick={() => setActiveTab('body')} className="btn" style={{ flex: '1 1 100px', backgroundColor: activeTab === 'body' ? '#00FF7F' : '#1E1E1E', color: activeTab === 'body' ? '#000' : '#fff', border: '1px solid #00FF7F' }}>Body 🥗</button>
                <button onClick={() => setActiveTab('move')} className="btn" style={{ flex: '1 1 100px', backgroundColor: activeTab === 'move' ? '#00FF7F' : '#1E1E1E', color: activeTab === 'move' ? '#000' : '#fff', border: '1px solid #00FF7F' }}>Move 🏃‍♂️</button>
            </div>

            {/* CONTENT */}
            <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* MIND SECTION */}
                {activeTab === 'mind' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Breathe & Focus</h2>
                        {!showMindQuiz ? (
                            <>
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
                                <button onClick={() => setShowMindQuiz(true)} className="btn btn-outline" style={{ marginTop: '2rem', borderColor: '#00FF7F' }}>Take Focus Quiz 🧠</button>
                            </>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.5s', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                                <h3>Focus Quiz</h3>
                                <p style={{ marginBottom: '1.5rem' }}>{mindQuizzes[mindScore]?.q || "Mind Mastered!"}</p>
                                {mindScore < mindQuizzes.length ? (
                                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                                        {mindQuizzes[mindScore].options.map((opt, i) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    if (i === mindQuizzes[mindScore].a) {
                                                        showToast("Mindful! ✅", 'success');
                                                        setMindScore(prev => prev + 1);
                                                    } else {
                                                        showToast("Incorrect, try to focus!", 'error');
                                                    }
                                                }}
                                                className="btn btn-outline"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧘‍♂️</div>
                                        <p style={{ color: '#00FF7F', fontWeight: 'bold' }}>Mind Focus Complete!</p>
                                        <button onClick={() => { setShowMindQuiz(false); setMindScore(0); }} className="btn btn-sm" style={{ marginTop: '1rem' }}>Breathe Again 🔄</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* BODY SECTION */}
                {activeTab === 'body' && (
                    <div style={{ width: '100%', padding: '0 0.5rem' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>African Superfoods 🌍</h2>
                        {!showBodyQuiz ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
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
                                <button onClick={() => setShowBodyQuiz(true)} className="btn" style={{ width: '100%', marginTop: '2rem', backgroundColor: '#00FF7F', color: '#000' }}>Take Superfood Quiz 🥗</button>
                            </>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.5s', width: '100%', maxWidth: '400px' }}>
                                <h3 style={{ textAlign: 'center' }}>Superfood Quiz</h3>
                                <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{bodyQuizzes[bodyScore] ? bodyQuizzes[bodyScore].q : "Body Mastered!"}</p>
                                {bodyScore < bodyQuizzes.length ? (
                                    <div style={{ display: 'grid', gap: '0.8rem', margin: '0 auto', maxWidth: '400px' }}>
                                        {bodyQuizzes[bodyScore].options.map((opt, i) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    if (i === bodyQuizzes[bodyScore].a) {
                                                        showToast("Nutritious Choice! ✅", 'success');
                                                        setBodyScore(prev => prev + 1);
                                                    } else {
                                                        showToast("Read the descriptions carefully!", 'error');
                                                    }
                                                }}
                                                className="btn btn-outline"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
                                        <p style={{ color: '#00FF7F', fontWeight: 'bold' }}>Nutrition Mastery Achieved!</p>
                                        <button onClick={() => { setShowBodyQuiz(false); setBodyScore(0); }} className="btn btn-sm" style={{ marginTop: '1rem' }}>Study Foods Again 🔄</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* MOVE SECTION */}
                {activeTab === 'move' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Daily Move Challenge ⚡</h2>

                        {moveStep < moves.length ? (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                                    {moves[moveStep].emoji}
                                </div>
                                <h3>{moves[moveStep].name}</h3>
                                <p style={{ fontSize: '1.5rem', color: '#00FF7F', marginBottom: '2rem' }}>{moves[moveStep].duration}</p>

                                <button
                                    onClick={() => setMoveStep((prev) => prev + 1)}
                                    className="btn btn-primary"
                                >
                                    Next Exercise ⏭️
                                </button>
                            </div>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.5s', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏃‍♂️</div>
                                <h3>Workout Reflection</h3>
                                <p style={{ marginBottom: '1.5rem' }}>Why is a 10-minute daily move better than just sitting?</p>
                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                    <button onClick={() => showToast("Correct! Consistency is key. 🏆", 'success')} className="btn btn-outline">It keeps my heart and brain fit</button>
                                    <button onClick={() => showToast("Actually, sitting too long is the risk! 🦵", 'warning')} className="btn btn-outline">Sitting is more exercise</button>
                                </div>
                                <button onClick={() => setMoveStep(0)} className="btn btn-sm" style={{ marginTop: '2rem' }}>Restart Workout 🔄</button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Health;
