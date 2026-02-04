import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useWallet } from '../hooks/useWallet';

const Health = () => {
    const navigate = useNavigate();
    const { addEarnings, deductPenalty, getModuleCap } = useWallet();
    const MODULE_CAP = getModuleCap('health');

    const [activeModule, setActiveModule] = useState(() => {
        return Number(localStorage.getItem('healthActiveModule')) || 0;
    });

    const [completedModules, setCompletedModules] = useState(() => {
        return JSON.parse(localStorage.getItem('healthCompletedModules')) || Array(10).fill(false);
    });

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info', duration = 3000) => {
        setToast({ message, type, duration });
    };

    useEffect(() => {
        localStorage.setItem('healthActiveModule', activeModule);
        localStorage.setItem('healthCompletedModules', JSON.stringify(completedModules));
        window.scrollTo(0, 0);
    }, [activeModule, completedModules]);

    const markComplete = (index) => {
        const newCompleted = [...completedModules];
        if (!newCompleted[index]) {
            newCompleted[index] = true;
            setCompletedModules(newCompleted);
            addEarnings('health', 150); // Reward for completing a module
            showToast("Module Complete! +₦150", 'success');
        }
    };

    const modules = [
        "Intro", "Nutrition", "Fitness", "Mental Health", "Reproductive Health",
        "Sleep & Recovery", "Digital Hygiene", "Mindset", "Community", "Certificate"
    ];

    const renderCurrentModule = () => {
        switch (activeModule) {
            case 0: return <IntroModule onNext={() => { markComplete(0); setActiveModule(1); }} />;
            case 1: return <NutritionModule onNext={() => { markComplete(1); setActiveModule(2); }} showToast={showToast} />;
            // Placeholders for now, will implement sequentially
            case 2: return <FitnessModule onNext={() => { markComplete(2); setActiveModule(3); }} showToast={showToast} />;
            case 3: return <MentalHealthModule onNext={() => { markComplete(3); setActiveModule(4); }} showToast={showToast} />;
            case 4: return <ReproductiveHealthModule onNext={() => { markComplete(4); setActiveModule(5); }} showToast={showToast} />;
            case 5: return <SleepModule onNext={() => { markComplete(5); setActiveModule(6); }} showToast={showToast} />;
            case 6: return <DigitalHygieneModule onNext={() => { markComplete(6); setActiveModule(7); }} showToast={showToast} />;
            case 7: return <MindsetModule onNext={() => { markComplete(7); setActiveModule(8); }} showToast={showToast} />;
            case 8: return <CommunityModule onNext={() => { markComplete(8); setActiveModule(9); }} showToast={showToast} />;
            case 9: return <CertificateModule onNext={() => navigate('/')} />;
            default: return <IntroModule onNext={() => setActiveModule(1)} />;
        }
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast(null)} />}

            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start'
                }}
            >
                ← Back to Hub
            </button>

            {/* PROGRESS BAR */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.8rem' }}>
                    <span>Progress</span>
                    <span>{Math.round((completedModules.filter(Boolean).length / 10) * 100)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${(activeModule / 9) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--color-secondary)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {modules.map((m, i) => (
                        <div
                            key={i}
                            onClick={() => completedModules[i] || i <= activeModule ? setActiveModule(i) : null}
                            style={{
                                minWidth: '30px', height: '30px', borderRadius: '50%',
                                backgroundColor: i === activeModule ? 'var(--color-secondary)' : completedModules[i] ? '#00C851' : '#333',
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', cursor: 'pointer', flexShrink: 0,
                                border: i === activeModule ? '2px solid #fff' : 'none'
                            }}
                            title={m}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {renderCurrentModule()}
            </div>
        </div>
    );
};

const IntroModule = ({ onNext }) => (
    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <h1 style={{ color: 'var(--color-secondary)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Health, Wellness & Mindset 🌿</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#ccc', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Your body, mind, and habits shape your future. Learn to eat well, stay fit, manage your mind, and develop habits that make you strong, disciplined, and productive.
        </p>
        <button onClick={onNext} className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
            Start Journey 🚀
        </button>
    </div>
);

const NutritionModule = ({ onNext, showToast }) => {
    // Meal Tracker
    const [meals, setMeals] = useState(() => JSON.parse(localStorage.getItem('healthMeals')) || { b: false, l: false, d: false });

    // Plate Game
    const [plate, setPlate] = useState({ carbs: 0, protein: 0, veg: 0 });
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        localStorage.setItem('healthMeals', JSON.stringify(meals));
    }, [meals]);

    const toggleMeal = (type) => {
        setMeals(prev => ({ ...prev, [type]: !prev[type] }));
        if (!meals[type]) showToast("Meal logged! 🥗 Keep it up.", 'success');
    };

    const addToPlate = (type) => {
        if (gameWon) return;
        setPlate(prev => {
            const newPlate = { ...prev, [type]: prev[type] + 1 };
            checkWin(newPlate);
            return newPlate;
        });
    };

    const checkWin = (p) => {
        // Win condition: roughly balanced (e.g., 1 carb, 1 protein, 2 veg)
        if (p.carbs >= 1 && p.protein >= 1 && p.veg >= 2) {
            setGameWon(true);
            showToast("Perfect Plate! 🍽️ You know your nutrition.", 'success');
        }
    };

    const resetPlate = () => {
        setPlate({ carbs: 0, protein: 0, veg: 0 });
        setGameWon(false);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', textAlign: 'center' }}>Module 2: Nutrition 🍎</h2>

            <div style={{ backgroundColor: 'rgba(0, 200, 81, 0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', borderLeft: '4px solid #00C851' }}>
                <h4 style={{ color: '#00C851', marginBottom: '0.5rem' }}>✨ African Superfoods</h4>
                <p style={{ fontSize: '0.9rem', margin: 0, color: '#ccc' }}>
                    <strong>Baobab:</strong> High in Vitamin C. | <strong>Moringa:</strong> "The Miracle Tree" for energy. | <strong>Fonio:</strong> A gluten-free ancient grain.
                </p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#222' }}>
                <h3>📅 Daily Meal Tracker</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Log your balanced meals today.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    {['Breakfast', 'Lunch', 'Dinner'].map((m) => {
                        const key = m.charAt(0).toLowerCase();
                        return (
                            <button
                                key={m}
                                onClick={() => toggleMeal(key)}
                                className={meals[key] ? "btn btn-primary" : "btn btn-outline"}
                                style={{ minWidth: '100px' }}
                            >
                                {meals[key] ? `${m} ✅` : m}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h3>🍽️ Build Your Healthy Plate</h3>
                <p>Add items to create a balanced meal (1 Carb, 1 Protein, 2 Veggies).</p>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1rem 0' }}>
                    <button onClick={() => addToPlate('carbs')} className="btn" style={{ backgroundColor: '#FFBB33', color: 'black' }}>Rice/Yam 🍚</button>
                    <button onClick={() => addToPlate('protein')} className="btn" style={{ backgroundColor: '#FF4444', color: 'white' }}>Fish/Beans 🐟</button>
                    <button onClick={() => addToPlate('veg')} className="btn" style={{ backgroundColor: '#00C851', color: 'white' }}>Greens/Okra 🥬</button>
                </div>

                <div style={{
                    width: '200px', height: '200px', borderRadius: '50%', border: '4px solid #fff',
                    margin: '1rem auto', position: 'relative', backgroundColor: '#fff', color: '#000',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}>
                    {plate.carbs > 0 && <span>🍚 x{plate.carbs}</span>}
                    {plate.protein > 0 && <span>🐟 x{plate.protein}</span>}
                    {plate.veg > 0 && <span>🥬 x{plate.veg}</span>}
                    {plate.carbs === 0 && plate.protein === 0 && plate.veg === 0 && <span style={{ color: '#aaa' }}>Empty Plate</span>}

                    {gameWon && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(0,200,81,0.8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>Delicious! 😋</div>}
                </div>

                <button onClick={resetPlate} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>Reset Plate</button>
            </div>

            <button onClick={onNext} className="btn btn-primary" disabled={!gameWon} style={{ width: '100%', opacity: gameWon ? 1 : 0.5 }}>
                {gameWon ? "Complete & Continue →" : "Finish Plate to Continue 🔒"}
            </button>
        </div>
    );
};

const FitnessModule = ({ onNext, showToast }) => {
    const [steps, setSteps] = useState(() => Number(localStorage.getItem('healthSteps')) || 0);
    const GOAL = 5000;

    useEffect(() => {
        localStorage.setItem('healthSteps', steps);
    }, [steps]);

    const addSteps = (amount) => {
        const newTotal = steps + amount;
        setSteps(newTotal);
        if (newTotal >= GOAL && steps < GOAL) {
            showToast("Goal Reached! 🏃💨 You are unstoppable!", 'success');
        }
    };

    return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Module 3: Fitness 🏃</h2>
            <p>Movement is medicine.</p>

            <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
                <h3>👟 Step Challenge</h3>
                <p>Goal: {GOAL.toLocaleString()} steps/day</p>

                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: steps >= GOAL ? '#00C851' : '#fff', margin: '1rem 0' }}>
                    {steps.toLocaleString()}
                </div>

                <div style={{ width: '100%', height: '10px', backgroundColor: '#333', borderRadius: '5px', marginBottom: '1.5rem' }}>
                    <div style={{ width: `${Math.min(100, (steps / GOAL) * 100)}%`, height: '100%', backgroundColor: steps >= GOAL ? '#00C851' : 'var(--color-secondary)', borderRadius: '5px', transition: 'width 0.5s' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => addSteps(100)} className="btn btn-outline">+100 Steps</button>
                    <button onClick={() => addSteps(500)} className="btn btn-outline">+500 Steps</button>
                    <button onClick={() => addSteps(1000)} className="btn btn-outline">+1,000 Steps</button>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>(Log your real-world steps here!)</p>
            </div>

            <button onClick={onNext} className="btn btn-primary" style={{ width: '100%' }}>Complete & Continue →</button>
        </div>
    );
};

const MentalHealthModule = ({ onNext, showToast }) => {
    const [mood, setMood] = useState(localStorage.getItem('healthMood') || '');
    const [journal, setJournal] = useState('');

    const saveEntry = () => {
        if (!mood) {
            showToast("Please select a mood first.", 'error');
            return;
        }
        localStorage.setItem('healthMood', mood);
        // In a real app, save journal to DB or local array
        showToast("Journal saved! 🧠 Feelings acknowledged.", 'success');
        onNext();
    };

    const moods = ['😠', '😢', '😐', '🙂', '🤩'];

    return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Module 4: Mental Health 🧠</h2>
            <p>Your mind matters. How are you feeling today?</p>

            <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
                <h3>Mood Tracker</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '2.5rem', margin: '1.5rem 0' }}>
                    {moods.map(m => (
                        <div
                            key={m}
                            onClick={() => setMood(m)}
                            style={{
                                cursor: 'pointer',
                                transform: mood === m ? 'scale(1.3)' : 'scale(1)',
                                transition: 'transform 0.2s',
                                opacity: mood && mood !== m ? 0.3 : 1
                            }}
                        >
                            {m}
                        </div>
                    ))}
                </div>

                <textarea
                    placeholder="Why do you feel this way? (Optional)"
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    style={{
                        width: '100%', minHeight: '100px', backgroundColor: '#333', color: '#fff',
                        padding: '1rem', borderRadius: '10px', border: 'none', resize: 'vertical'
                    }}
                />
            </div>

            <button onClick={saveEntry} className="btn btn-primary" style={{ width: '100%' }}>Save & Continue →</button>
        </div>
    );
};

const ReproductiveHealthModule = ({ onNext, showToast }) => {
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);

    const questions = [
        { q: "What is consent?", options: ["Saying yes freely", "Being forced", "Silence"], a: 0 },
        { q: "Puberty is...", options: ["Scary", "Normal body changes", "A sickness"], a: 1 },
        { q: "If you feel unsafe, you should...", options: ["Tell a trusted adult", "Hide it", "Ignore it"], a: 0 }
    ];

    const handleAnswer = (idx) => {
        if (idx === questions[qIndex].a) {
            setScore(score + 1);
            showToast("Correct!", 'success');
        } else {
            showToast("Not quite. Safety first!", 'error');
        }

        if (qIndex < questions.length - 1) {
            setQIndex(qIndex + 1);
        } else {
            onNext();
        }
    };

    return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Module 5: Reproductive Health 🏥</h2>
            <p>Respect your body and others.</p>

            <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
                <h3>Scenario Quiz {qIndex + 1}/{questions.length}</h3>
                <p style={{ fontSize: '1.2rem', margin: '1.5rem 0' }}>{questions[qIndex].q}</p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {questions[qIndex].options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="btn btn-outline"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SleepModule = ({ onNext, showToast }) => {
    const [hours, setHours] = useState(7);

    const checkSleep = () => {
        if (hours < 7) {
            showToast("Try to get at least 7-9 hours!", 'warning');
        } else if (hours > 10) {
            showToast("Oversleeping can make you groggy.", 'warning');
        } else {
            showToast("Perfect! Rest is recovery.", 'success');
        }
        onNext();
    };

    return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Module 6: Sleep & Recovery 😴</h2>
            <p>Sleep is when your brain learns.</p>

            <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
                <h3>Sleep Tracker</h3>
                <p>How many hours did you sleep last night?</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
                    <button onClick={() => setHours(Math.max(0, hours - 0.5))} className="btn btn-sm">-</button>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{hours} hrs</div>
                    <button onClick={() => setHours(Math.min(24, hours + 0.5))} className="btn btn-sm">+</button>
                </div>
            </div>

            <button onClick={checkSleep} className="btn btn-primary" style={{ width: '100%' }}>Log Sleep & Continue →</button>
        </div>
    );
};

const DigitalHygieneModule = ({ onNext, showToast }) => {
    const [screenTime, setScreenTime] = useState(0);

    const handleLog = () => {
        if (screenTime > 4) {
            showToast("Whoa! Try to reduce that. 📱❌", 'warning');
        } else {
            showToast("Great balance! 📵✅", 'success');
        }
        onNext();
    };

    return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Module 7: Digital Hygiene 📵</h2>
            <p>Control your device, don't let it control you.</p>

            <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
                <h3>Screen Time Check</h3>
                <p>How many hours of "fun" screen time today?</p>
                <input
                    type="range" min="0" max="12" step="0.5"
                    value={screenTime} onChange={(e) => setScreenTime(Number(e.target.value))}
                    style={{ width: '80%', margin: '2rem 0', accentColor: 'var(--color-primary)' }}
                />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{screenTime} hrs</div>
            </div>

            <button onClick={handleLog} className="btn btn-primary" style={{ width: '100%' }}>Log & Continue →</button>
        </div>
    );
};

const MindsetModule = ({ onNext, showToast }) => {
    const [habits, setHabits] = useState({ bed: false, water: false, read: false });

    const toggle = (h) => setHabits(prev => ({ ...prev, [h]: !prev[h] }));

    return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Module 8: Micro-Discipline 🧱</h2>
            <div style={{ fontStyle: 'italic', color: 'var(--color-accent)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                "He who climbs a good tree is always given a push." — African Proverb
            </div>
            <p>Small habits build big futures.</p>

            <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
                <h3>Daily Win Tracker</h3>
                <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
                    <button onClick={() => toggle('bed')} className={habits.bed ? "btn btn-primary" : "btn btn-outline"}>
                        {habits.bed ? "Made Bed ✅" : "Make Bed 🛏️"}
                    </button>
                    <button onClick={() => toggle('water')} className={habits.water ? "btn btn-primary" : "btn btn-outline"}>
                        {habits.water ? "Drank Water ✅" : "Drink Water 💧"}
                    </button>
                    <button onClick={() => toggle('read')} className={habits.read ? "btn btn-primary" : "btn btn-outline"}>
                        {habits.read ? "Read valid page ✅" : "Read 1 Page 📖"}
                    </button>
                </div>
            </div>

            <button onClick={onNext} className="btn btn-primary" style={{ width: '100%' }}>Complete & Continue →</button>
        </div>
    );
};

const CommunityModule = ({ onNext, showToast }) => {
    return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Module 9: Community 🤝</h2>
            <p>We rise by lifting others.</p>

            <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
                <h3>Today's Challenge</h3>
                <div style={{ fontSize: '3rem', margin: '1rem' }}>🍲</div>
                <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#FFD700' }}>
                    "Cook one healthy meal for your family or friends."
                </p>
                <p style={{ marginTop: '1rem', color: '#aaa' }}>Take a picture and share it with your circle!</p>
            </div>

            <button onClick={onNext} className="btn btn-primary" style={{ width: '100%' }}>I Accept the Challenge! →</button>
        </div>
    );
};

const CertificateModule = ({ onNext }) => {
    return (
        <div style={{ padding: '1rem', textAlign: 'center', animation: 'fadeIn 1s' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>🎉 Congratulations! 🎉</h2>
            <p>You have completed the Health, Wellness & Mindset Course.</p>

            <div style={{
                margin: '2rem auto', padding: '2rem', border: '10px solid #FFD700',
                borderRadius: '10px', backgroundColor: '#fff', color: '#000', maxWidth: '500px'
            }}>
                <h1 style={{ fontFamily: 'serif', color: '#000' }}>Certificate of Completion</h1>
                <p>This certifies that</p>
                <div style={{ borderBottom: '2px solid #000', margin: '1rem 2rem', fontSize: '1.5rem', fontFamily: 'cursive' }}>
                    Future Leader
                </div>
                <p>Has successfully mastered the pillars of</p>
                <h3>Health, Wellness & Mindset</h3>
                <div style={{ fontSize: '3rem', margin: '1rem' }}>🏅</div>
                <p style={{ fontSize: '0.8rem', color: '#555' }}>African Future Academy</p>
            </div>

            <button onClick={onNext} className="btn btn-primary" style={{ width: '100%' }}>Return to Hub →</button>
        </div>
    );
};

export default Health;
