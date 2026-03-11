import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';
import KidsWellnessHub from '../components/KidsWellnessHub';
import { bodyHealthData } from '../data/bodyHealthData';
import { mentalHealthData } from '../data/mentalHealthData';
import { fruitData } from '../data/fruitData';
import Header from '../components/Header';

const Wellness = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addEarnings } = useWallet();
    const [toast, setToast] = useState(null);

    // Age Group Logic
    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const isElite = user?.isElite && (!user?.eliteExpires || new Date(user.eliteExpires) > new Date());

    // Tabs for Teens/Adults
    const [activeTab, setActiveTab] = useState('body');

    // --- KIDS RENDER ---
    if (isKid) {
        return (
            <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem', minHeight: '100vh' }}>
                <Header />
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>← Hub</button>
                    <h1 style={{ color: '#FFD700' }}>Wellness World 🌍</h1>
                    <p style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontStyle: 'italic' }}>Your mind and body are your first investments.</p>
                </header>
                <KidsWellnessHub />
            </div>
        );
    }

    const showToast = (message, type = 'info', duration = 3000) => setToast({ message, type, duration });

    return (
        <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
            <Header />
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast(null)} />}

            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1.5rem auto' }}>← Hub</button>
                <h1 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Total Wellness 🌿</h1>
                <p style={{ color: '#aaa' }}>{isTeen ? "Strong Body, Clear Mind." : "Holistic Health for a Balanced Life."}</p>
            </header>

            {/* TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('body')}
                    className={`btn ${activeTab === 'body' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '100px' }}
                >
                    🏃 Body
                </button>
                <button
                    onClick={() => setActiveTab('mind')}
                    className={`btn ${activeTab === 'mind' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '100px' }}
                >
                    🧠 Mind
                </button>
                <button
                    onClick={() => setActiveTab('apothecary')}
                    className={`btn ${activeTab === 'apothecary' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '100px', border: activeTab !== 'apothecary' && !isElite ? '1px solid gold' : '' }}
                >
                    🍎 {isElite ? 'Apothecary' : 'Elite Apothecary'} {!isElite && '🔒'}
                </button>
                <button
                    onClick={() => setActiveTab('tools')}
                    className={`btn ${activeTab === 'tools' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '100px' }}
                >
                    🛠️ Tools
                </button>
            </div>

            <div className="animate-fade">
                {activeTab === 'body' && (
                    <BodySection isTeen={isTeen} addEarnings={addEarnings} showToast={showToast} />
                )}
                {activeTab === 'mind' && (
                    <MindSection isTeen={isTeen} addEarnings={addEarnings} showToast={showToast} />
                )}
                {activeTab === 'apothecary' && (
                    <ApothecarySection isElite={isElite} />
                )}
                {activeTab === 'tools' && (
                    <ToolsSection isTeen={isTeen} showToast={showToast} />
                )}
            </div>
        </div>
    );
};

// --- SUB-SECTIONS ---

const ApothecarySection = ({ isElite }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    if (!isElite) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px solid gold', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a10 100%)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔒 🍎 🧪</div>
                <h2 style={{ color: 'gold', marginBottom: '1rem' }}>Elite Apothecary Access</h2>
                <p style={{ color: '#ccc', maxWidth: '500px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
                    Discover the secrets of the earth. Get nutritional deep-dives, "Waste to Wealth" reuse tips, and planting guides for powerful fruits and spices.
                </p>
                <button onClick={() => window.location.hash = "#finance"} className="btn btn-primary" style={{ backgroundColor: 'gold', color: '#000', fontWeight: 'bold' }}>
                    Join Elite Mastery 💎
                </button>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {fruitData.map(item => (
                    <div key={item.id} className="card" style={{ border: '1px solid #333', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setSelectedItem(item)} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>{item.emoji}</div>
                        <h3 style={{ color: item.color, textAlign: 'center', marginBottom: '0.5rem' }}>{item.name}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                            {item.nutrition.slice(0, 3).map(n => (
                                <span key={n} style={{ fontSize: '0.7rem', background: '#222', padding: '2px 8px', borderRadius: '10px', color: '#aaa' }}>{n}</span>
                            ))}
                        </div>
                        <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem', borderColor: `${item.color}44`, color: item.color }}>Study Benefits →</button>
                    </div>
                ))}
            </div>

            {selectedItem && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.92)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                    <div className="card" style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: `2px solid ${selectedItem.color}`, position: 'relative' }}>
                        <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '2rem', background: 'none', color: 'white', cursor: 'pointer', zIndex: 10 }}>&times;</button>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '5rem' }}>{selectedItem.emoji}</div>
                            <h2 style={{ color: selectedItem.color, fontSize: '2rem' }}>{selectedItem.name} Apothecary</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: '#111', padding: '1rem', borderRadius: '12px' }}>
                                <h4 style={{ color: selectedItem.color, marginBottom: '0.8rem' }}>🧬 Essential Nutrition</h4>
                                <ul style={{ fontSize: '0.9rem', color: '#ccc', paddingLeft: '1.2rem' }}>
                                    {selectedItem.nutrition.map(n => <li key={n} style={{ marginBottom: '0.4rem' }}>{n}</li>)}
                                </ul>
                            </div>
                            <div style={{ background: '#111', padding: '1rem', borderRadius: '12px' }}>
                                <h4 style={{ color: '#00C851', marginBottom: '0.8rem' }}>🏥 Bodily Benefits</h4>
                                {selectedItem.benefits.map(b => (
                                    <div key={b.title} style={{ marginBottom: '0.8rem' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>{b.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{b.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(45deg, #1a1a1a, #0d0d0d)', padding: '1.5rem', borderRadius: '15px', border: '1px solid #333' }}>
                            <h3 style={{ color: 'gold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💰 Waste to Wealth</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem', marginBottom: '0.3rem' }}>♻️ Reuse Insights</div>
                                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{selectedItem.wasteToWealth.reuse}</p>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold', color: '#4CAF50', fontSize: '1rem', marginBottom: '0.3rem' }}>🌱 Planting Guide</div>
                                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{selectedItem.wasteToWealth.plant}</p>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#888', borderTop: '1px solid #333', paddingTop: '0.8rem' }}>
                                💡 Elite Tip: {selectedItem.wasteToWealth.tip}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const BodySection = ({ isTeen, addEarnings, showToast }) => {
    const modules = isTeen ? bodyHealthData.teens : bodyHealthData.adults;
    const [activeLevel, setActiveLevel] = useState(null);
    const progressKey = `bodyHealth_${isTeen ? 'teen' : 'adult'}`;

    const [completedLevels, setCompletedLevels] = useState(() => {
        const saved = JSON.parse(localStorage.getItem(progressKey));
        if (Array.isArray(saved) && saved.length > 0) return saved;
        return Array(modules.length).fill(false);
    });

    useEffect(() => {
        localStorage.setItem(progressKey, JSON.stringify(completedLevels));
    }, [completedLevels, progressKey]);

    const handleComplete = (index) => {
        if (!completedLevels[index]) {
            const newCompleted = [...completedLevels];
            newCompleted[index] = true;
            while (newCompleted.length < modules.length) newCompleted.push(false);
            setCompletedLevels(newCompleted);
            addEarnings('health', 150);
            showToast(`Level ${index + 1} Complete! +₦150 🏆`, 'success');
        }
        setActiveLevel(null);
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {modules.map((mod, idx) => {
                    const isLocked = idx > 0 && !completedLevels[idx - 1];
                    const isDone = completedLevels[idx];
                    return (
                        <div key={mod.id} className="card" style={{ opacity: isLocked ? 0.6 : 1, border: isDone ? '2px solid #00C851' : '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{isLocked ? '🔒' : mod.icon}</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{mod.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{mod.desc}</p>
                            {isLocked ? (
                                <button disabled className="btn btn-outline" style={{ width: '100%', opacity: 0.5 }}>Locked</button>
                            ) : (
                                <button onClick={() => setActiveLevel(idx)} className={`btn ${isDone ? 'btn-outline' : 'btn-primary'}`} style={{ width: '100%' }}>
                                    {isDone ? 'Review' : 'Start'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {activeLevel !== null && modules[activeLevel] && (
                <ModuleViewer module={modules[activeLevel]} onClose={() => setActiveLevel(null)} onComplete={() => handleComplete(activeLevel)} />
            )}
        </div>
    );
};

const MindSection = ({ isTeen, addEarnings, showToast }) => {
    const modules = isTeen ? mentalHealthData.teens : mentalHealthData.adults;
    const progressKey = `mentalHealthProgress_${isTeen ? 'teen' : 'adult'}`;
    const [completedModules, setCompletedModules] = useState(() => JSON.parse(localStorage.getItem(progressKey)) || []);

    useEffect(() => {
        localStorage.setItem(progressKey, JSON.stringify(completedModules));
    }, [completedModules, progressKey]);

    const handleComplete = (moduleId) => {
        if (!completedModules.includes(moduleId)) {
            setCompletedModules([...completedModules, moduleId]);
            addEarnings('health', 150);
            showToast("Module Completed! +₦150 🧠", 'success');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {modules.map(mod => (
                <MentalModuleCard key={mod.id} module={mod} isCompleted={completedModules.includes(mod.id)} onComplete={() => handleComplete(mod.id)} />
            ))}
        </div>
    );
};

const MentalModuleCard = ({ module, isCompleted, onComplete }) => {
    const [expanded, setExpanded] = useState(false);
    const [quizIdx, setQuizIdx] = useState(0);

    const handleAnswer = (idx) => {
        if (idx === module.quiz[quizIdx].a) {
            alert("Correct!");
            if (quizIdx < module.quiz.length - 1) setQuizIdx(quizIdx + 1);
            else { onComplete(); setExpanded(false); }
        } else alert("Try again.");
    };

    return (
        <div className="card" style={{ border: isCompleted ? '2px solid #00C851' : '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{module.icon}</div>
            <h3>{module.title}</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>{module.desc}</p>
            <button onClick={() => setExpanded(!expanded)} className="btn btn-primary" style={{ width: '100%' }}>{expanded ? "Close" : isCompleted ? "Review" : "Start"}</button>
            {expanded && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem', color: '#ddd' }}>{module.content}</div>
                    <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                        <h4>Quiz Q{quizIdx + 1}</h4>
                        <p>{module.quiz[quizIdx].q}</p>
                        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {module.quiz[quizIdx].o.map((opt, i) => (
                                <button key={i} onClick={() => handleAnswer(i)} className="btn btn-outline" style={{ textAlign: 'left' }}>{opt}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ToolsSection = ({ isTeen, showToast }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
                <h3>📊 Mood Tracker</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '2rem', marginTop: '1rem' }}>
                    {['😢', '😐', '🙂', '😁'].map(m => (
                        <button key={m} onClick={() => showToast(`Mood logged: ${m}`, 'success')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{m}</button>
                    ))}
                </div>
            </div>
            <div className="card">
                <h3>🌬️ Guided Breathing</h3>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => alert("Imagine a breathing circle animation here...")}>Start Session</button>
            </div>
            <div className="card" style={{ borderColor: '#ff4444' }}>
                <h3 style={{ color: '#ff4444' }}>🆘 Crisis Resources</h3>
                <p style={{ fontSize: '0.9rem' }}>Emergency contacts available.</p>
            </div>
        </div>
    );
};

const ModuleViewer = ({ module, onClose, onComplete }) => {
    const [quizIdx, setQuizIdx] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleAnswer = (idx) => {
        if (idx === module.quiz[quizIdx].a) {
            alert("Correct!");
            if (quizIdx < module.quiz.length - 1) setQuizIdx(quizIdx + 1);
            else onComplete();
        } else alert("Try again.");
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', background: 'none', color: 'white' }}>&times;</button>
                <div style={{ textAlign: 'center' }}><h1>{module.icon}</h1><h2>{module.title}</h2></div>
                {!showQuiz ? (
                    <>
                        <div style={{ whiteSpace: 'pre-wrap', margin: '2rem 0' }}>{module.content}</div>
                        <button onClick={() => setShowQuiz(true)} className="btn btn-primary" style={{ width: '100%' }}>Take Quiz</button>
                    </>
                ) : (
                    <div>
                        <h3>Question {quizIdx + 1}</h3>
                        <p>{module.quiz[quizIdx].q}</p>
                        {module.quiz[quizIdx].o.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(i)} className="btn btn-outline" style={{ display: 'block', width: '100%', margin: '0.5rem 0' }}>{opt}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wellness;
