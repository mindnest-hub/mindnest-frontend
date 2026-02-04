import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useWallet } from '../hooks/useWallet';

const Health = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { addEarnings, getModuleCap } = useWallet();
    const MODULE_CAP = getModuleCap('health');

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';

    const [activeModule, setActiveModule] = useState(() => {
        return Number(localStorage.getItem('healthActiveStep')) || 0;
    });

    const [completedModules, setCompletedModules] = useState(() => {
        return JSON.parse(localStorage.getItem('healthCompletedSteps')) || Array(4).fill(false);
    });

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info', duration = 3000) => {
        setToast({ message, type, duration });
    };

    useEffect(() => {
        localStorage.setItem('healthActiveStep', activeModule);
        localStorage.setItem('healthCompletedSteps', JSON.stringify(completedModules));
        window.scrollTo(0, 0);
    }, [activeModule, completedModules]);

    const markComplete = (index) => {
        const newCompleted = [...completedModules];
        if (!newCompleted[index]) {
            newCompleted[index] = true;
            setCompletedModules(newCompleted);
            addEarnings('health', 500); // Larger reward for consolidated modules
            showToast("Pillar Mastered! +₦500 🏆", 'success');
        }
    };

    const modules = ["Intro", "Nutrition", "Vitality", "Harmony", "Certificate"];

    const renderCurrentModule = () => {
        switch (activeModule) {
            case 0: return <IntroModule onNext={() => { markComplete(0); setActiveModule(1); }} />;
            case 1: return <NutritionPillar onNext={() => { markComplete(1); setActiveModule(2); }} showToast={showToast} isKid={isKid} />;
            case 2: return <VitalityPillar onNext={() => { markComplete(2); setActiveModule(3); }} showToast={showToast} isKid={isKid} />;
            case 3: return <HarmonyPillar onNext={() => { markComplete(3); setActiveModule(4); }} showToast={showToast} isKid={isKid} />;
            case 4: return <CertificateModule onNext={() => navigate('/')} />;
            default: return <IntroModule onNext={() => setActiveModule(1)} />;
        }
    };

    const progressPercent = Math.round((completedModules.filter(Boolean).length / 4) * 100);

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh' }}>
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast(null)} />}

            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1.5rem auto'
                    }}
                >
                    ← Hub
                </button>
                <h1 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Wellness & Mindset</h1>
                <p style={{ color: '#aaa' }}>Build a Strong Body & A Focused Mind</p>
            </header>

            {/* PROGRESS BAR */}
            <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#fff', fontWeight: 'bold' }}>
                    <span>Module Journey</span>
                    <span>{progressPercent}% Complete</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: '#222', borderRadius: '20px', overflow: 'hidden', border: '1px solid #333' }}>
                    <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: 'var(--color-secondary)',
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px var(--color-secondary)'
                    }}></div>
                </div>
            </div>

            <div className="card" style={{ maxWidth: '900px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
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

const NutritionPillar = ({ onNext, showToast, isKid }) => {
    // Stage management: 1. Explore, 2. Game, 3. Log
    const [step, setStep] = useState(0);

    // Pillar 1 Game: Kids (Sorting) vs Teens (Macros)
    const [kidsScore, setKidsScore] = useState(0);
    const [teensPlate, setTeensPlate] = useState({ protein: 0, carbs: 0, veg: 0, fats: 0 });

    const foodClasses = [
        { name: "Yam/Rice", class: "Carbohydrate", icon: "🍚", fact: "Energy for your brain and body!" },
        { name: "Beans/Fish", class: "Protein", icon: "🐟", fact: "Builds and repairs your muscles." },
        { name: "Spinach/Okra", class: "Vitamin", icon: "🥬", fact: "Protects you from getting sick." },
        { name: "Groundnut/Oil", class: "Fat", icon: "🥜", fact: "Helps your brain work better!" },
        { name: "Water/Salt", class: "Mineral", icon: "💧", fact: "Essential for healthy blood and bones." }
    ];

    const kidsQuest = [
        { q: "Which one gives you energy for school?", a: "Carbohydrate", options: foodClasses },
        { q: "Which one helps you grow big and strong?", a: "Protein", options: foodClasses },
        { q: "Which one keeps you safe from the flu?", a: "Vitamin", options: foodClasses }
    ];

    const [questIdx, setQuestIdx] = useState(0);

    const handleKidChoice = (choice) => {
        if (choice === kidsQuest[questIdx].a) {
            showToast("Correct! 🌟", 'success');
            if (questIdx < kidsQuest.length - 1) {
                setQuestIdx(prev => prev + 1);
            } else {
                setKidsScore(3);
                showToast("Nutrition Hero! 🎖️", 'success');
            }
        } else {
            showToast("Try again! Check the icons.", 'warning');
        }
    };

    const handleTeenPlate = (type) => {
        setTeensPlate(prev => ({ ...prev, [type]: Math.min(prev[type] + 1, 5) }));
    };

    const isTeenPlateBalanced = teensPlate.veg >= 2 && teensPlate.protein >= 1 && teensPlate.carbs >= 1;

    return (
        <div style={{ padding: '1.5rem', animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: 'var(--color-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                Pillar 1: Nutrition & Fuel 🥗
            </h2>

            {step === 0 && (
                <div style={{ textAlign: 'center' }}>
                    <h3>{isKid ? "Learn Your Food Classes" : "Macro & Micro Mastery"}</h3>
                    <p style={{ marginBottom: '2rem' }}>
                        {isKid ? "Every food has a job. Let's find out what they do!" : "Fueling your body requires more than just calories. It's about balance."}
                    </p>
                    <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        {foodClasses.map(f => (
                            <div key={f.name} className="card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
                                <strong style={{ color: 'var(--color-primary)' }}>{f.class}</strong>
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{f.fact}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setStep(1)} className="btn btn-primary" style={{ marginTop: '2.5rem', width: '100%' }}>
                        Start Challenge 🚀
                    </button>
                </div>
            )}

            {step === 1 && isKid && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                        Quest {questIdx + 1}/3
                    </div>
                    <h3 style={{ marginBottom: '2rem' }}>{kidsQuest[questIdx].q}</h3>
                    <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                        {foodClasses.map(f => (
                            <button
                                key={f.class}
                                onClick={() => handleKidChoice(f.class)}
                                className="btn btn-outline"
                                style={{ height: 'auto', padding: '1.5rem', flexDirection: 'column', gap: '0.5rem' }}
                            >
                                <span style={{ fontSize: '2rem' }}>{f.icon}</span>
                                <span>{f.class}</span>
                            </button>
                        ))}
                    </div>
                    {kidsScore === 3 && (
                        <button onClick={() => setStep(2)} className="btn btn-primary" style={{ marginTop: '2.5rem', width: '100%' }}>
                            Complete Pillar →
                        </button>
                    )}
                </div>
            )}

            {step === 1 && !isKid && (
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Design a High-Performance Plate</h3>
                    <p style={{ color: '#aaa', marginBottom: '2rem' }}>A balanced meal needs Fiber, Protein, and complex Carbs.</p>

                    <div className="grid-cols" style={{ marginBottom: '2rem' }}>
                        <div className="card" style={{ padding: '1.5rem', border: isTeenPlateBalanced ? '2px solid #00C851' : '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '2rem', flexWrap: 'wrap', minHeight: '60px' }}>
                                {[...Array(teensPlate.carbs)].map((_, i) => <span key={i}>🍚</span>)}
                                {[...Array(teensPlate.protein)].map((_, i) => <span key={i}>🐟</span>)}
                                {[...Array(teensPlate.veg)].map((_, i) => <span key={i}>🥬</span>)}
                                {[...Array(teensPlate.fats)].map((_, i) => <span key={i}>🥜</span>)}
                            </div>
                            {isTeenPlateBalanced ? (
                                <div style={{ color: '#00C851', marginTop: '1rem', fontWeight: 'bold' }}>✅ Optimized Balance!</div>
                            ) : (
                                <div style={{ color: '#aaa', marginTop: '1rem', fontSize: '0.9rem' }}>Aim for: 2x Veg, 1x Protein, 1x Carbs</div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <button onClick={() => handleTeenPlate('carbs')} className="btn btn-outline">Add Carbs 🍚</button>
                        <button onClick={() => handleTeenPlate('protein')} className="btn btn-outline">Add Protein 🐟</button>
                        <button onClick={() => handleTeenPlate('veg')} className="btn btn-outline">Add Veggies 🥬</button>
                        <button onClick={() => handleTeenPlate('fats')} className="btn btn-outline">Add Fats 🥜</button>
                        <button onClick={() => setTeensPlate({ protein: 0, carbs: 0, veg: 0, fats: 0 })} className="btn btn-sm" style={{ gridColumn: 'span 2', opacity: 0.6 }}>Reset Plate</button>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        className="btn btn-primary"
                        disabled={!isTeenPlateBalanced}
                        style={{ marginTop: '2.5rem', width: '100%', opacity: isTeenPlateBalanced ? 1 : 0.5 }}
                    >
                        Save & Continue →
                    </button>
                </div>
            )}

            {step === 2 && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏅</div>
                    <h3>Pillar 1 Complete!</h3>
                    <div style={{ backgroundColor: 'rgba(0, 200, 81, 0.1)', padding: '1.5rem', borderRadius: '15px', margin: '1.5rem 0', textAlign: 'left', borderLeft: '4px solid #00C851' }}>
                        <h4 style={{ color: '#00C851', marginBottom: '0.5rem' }}>🌱 African Superfood Fact</h4>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>
                            Did you know? <strong>Baobab</strong> fruit has 6 times more Vitamin C than oranges! It keeps your immune system ready for anything.
                        </p>
                    </div>
                    <button onClick={onNext} className="btn btn-primary" style={{ width: '100%' }}>
                        Go to Pillar 2 ⚡
                    </button>
                </div>
            )}
        </div>
    );
};

const VitalityPillar = ({ onNext, showToast, isKid }) => {
    const [step, setStep] = useState(0);
    const [habits, setHabits] = useState({ water: false, brush: false, sleep: false });
    const [stats, setStats] = useState({ steps: 2000, sleep: 7, screen: 2 });

    const toggleHabit = (h) => setHabits(prev => ({ ...prev, [h]: !prev[h] }));
    const habitsDone = habits.water && habits.brush && habits.sleep;

    return (
        <div style={{ padding: '1.5rem', animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: 'var(--color-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                Pillar 2: Vitality & Energy ⚡
            </h2>

            {step === 0 && (
                <div style={{ textAlign: 'center' }}>
                    <h3>{isKid ? "Daily Power-Up Tasks" : "The Human Recovery Loop"}</h3>
                    <p style={{ marginBottom: '2rem' }}>
                        {isKid ? "Being a hero starts with small wins. Can you finish your daily mission?" : "Optimize your performance by balancing activity, rest, and digital load."}
                    </p>

                    {isKid ? (
                        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                            <button onClick={() => toggleHabit('water')} className={habits.water ? "btn btn-primary" : "btn btn-outline"}>
                                {habits.water ? "Drank Water ✅" : "Drink 5 Waters 💧"}
                            </button>
                            <button onClick={() => toggleHabit('brush')} className={habits.brush ? "btn btn-primary" : "btn btn-outline"}>
                                {habits.brush ? "Brushed Teeth ✅" : "Brush Teeth 2x 🪥"}
                            </button>
                            <button onClick={() => toggleHabit('sleep')} className={habits.sleep ? "btn btn-primary" : "btn btn-outline"}>
                                {habits.sleep ? "Slept 9 Hours ✅" : "Sleep 9 Hours 😴"}
                            </button>
                        </div>
                    ) : (
                        <div className="grid-cols">
                            <div className="card" style={{ padding: '1rem' }}>
                                <strong>Steps</strong>
                                <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>👟 {stats.steps}</div>
                                <input type="range" min="0" max="10000" step="500" value={stats.steps} onChange={e => setStats({ ...stats, steps: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div className="card" style={{ padding: '1rem' }}>
                                <strong>Sleep</strong>
                                <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>😴 {stats.sleep}h</div>
                                <input type="range" min="0" max="12" step="0.5" value={stats.sleep} onChange={e => setStats({ ...stats, sleep: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div className="card" style={{ padding: '1rem' }}>
                                <strong>Screen Time</strong>
                                <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>📵 {stats.screen}h</div>
                                <input type="range" min="0" max="12" step="0.5" value={stats.screen} onChange={e => setStats({ ...stats, screen: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setStep(1)}
                        className="btn btn-primary"
                        disabled={isKid && !habitsDone}
                        style={{ marginTop: '2.5rem', width: '100%', opacity: (isKid && !habitsDone) ? 0.5 : 1 }}
                    >
                        {isKid && !habitsDone ? "Complete Tasks to Continue 🔒" : "Save & Continue →"}
                    </button>
                </div>
            )}

            {step === 1 && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚡</div>
                    <h3>System Optimized!</h3>
                    <p>Consistency is the secret to greatness.</p>
                    <button onClick={onNext} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                        Go to Pillar 3 🧘
                    </button>
                </div>
            )}
        </div>
    );
};

const HarmonyPillar = ({ onNext, showToast, isKid }) => {
    const [step, setStep] = useState(0);
    const [journal, setJournal] = useState("");

    const scenarios = [
        { q: "A friend is sad because they lost a game. What do you do?", a: "Cheer them up", options: ["Cheer them up", "Laugh at them", "Ignore them"] },
        { q: "You found ₦20 that isn't yours. What is the hero choice?", a: "Find the owner", options: ["Keep it", "Find the owner", "Hide it"] }
    ];
    const [scenIdx, setScenIdx] = useState(0);

    const handleScenChoice = (choice) => {
        if (choice === scenarios[scenIdx].a) {
            showToast("Kind Heart! ❤️", "success");
            if (scenIdx < scenarios.length - 1) setScenIdx(prev => prev + 1);
            else setStep(2);
        } else {
            showToast("Heroes are kind and honest. Try again!", "warning");
        }
    };

    return (
        <div style={{ padding: '1.5rem', animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: 'var(--color-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                Pillar 3: Harmony & Mindset 🧘
            </h2>

            {step === 0 && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontStyle: 'italic', color: 'var(--color-accent)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                        "He who climbs a good tree is always given a push." — African Proverb
                    </div>
                    {isKid ? (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem' }}>The Kindness Quest</h3>
                            <p style={{ marginBottom: '2rem' }}>{scenarios[scenIdx].q}</p>
                            <div className="grid-cols" style={{ gridTemplateColumns: '1fr' }}>
                                {scenarios[scenIdx].options.map(opt => (
                                    <button key={opt} onClick={() => handleScenChoice(opt)} className="btn btn-outline" style={{ padding: '1rem' }}>{opt}</button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3>Reflective Wisdom</h3>
                            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>True health includes the state of your mind. Record one thing you are grateful for today.</p>
                            <textarea
                                value={journal}
                                onChange={e => setJournal(e.target.value)}
                                placeholder="Write your thoughts..."
                                style={{ width: '100%', minHeight: '150px', padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '15px' }}
                            />
                            <button
                                onClick={() => setStep(2)}
                                className="btn btn-primary"
                                disabled={journal.length < 5}
                                style={{ width: '100%', marginTop: '2rem', opacity: journal.length < 5 ? 0.5 : 1 }}
                            >
                                Submit Journal →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛡️</div>
                    <h3>Mindset of a Leader</h3>
                    <p style={{ marginBottom: '2rem' }}>Your spirit is now aligned for greatness.</p>
                    <button onClick={onNext} className="btn btn-primary" style={{ width: '100%' }}>
                        Claim Certificate 📜
                    </button>
                </div>
            )}
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
