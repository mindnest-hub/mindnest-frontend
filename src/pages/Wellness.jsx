import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';
import KidsWellnessHub from '../components/KidsWellnessHub';
import { bodyHealthData } from '../data/bodyHealthData';
import { mentalHealthData } from '../data/mentalHealthData';

const Wellness = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addEarnings } = useWallet();
    const [toast, setToast] = useState(null);

    // Age Group Logic
    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';

    // Tabs for Teens/Adults: 'body', 'mind', 'tools'
    const [activeTab, setActiveTab] = useState('body');

    // --- KIDS RENDER (PRESERVED EXACTLY AS IS) ---
    if (isKid) {
        return (
            <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh' }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>← Hub</button>
                    <h1 style={{ color: '#FFD700' }}>Wellness World 🌍</h1>
                    <p style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontStyle: 'italic' }}>Your mind and body are your first investments.</p>
                </header>
                <KidsWellnessHub />
            </div>
        );
    }

    // --- TEENS & ADULTS RENDER (MERGED BODY & MIND) ---
    const showToast = (message, type = 'info', duration = 3000) => setToast({ message, type, duration });

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
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
                    style={{ minWidth: '120px' }}
                >
                    🏃 Body
                </button>
                <button
                    onClick={() => setActiveTab('mind')}
                    className={`btn ${activeTab === 'mind' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '120px' }}
                >
                    🧠 Mind
                </button>
                <button
                    onClick={() => setActiveTab('tools')}
                    className={`btn ${activeTab === 'tools' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '120px' }}
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
                {activeTab === 'tools' && (
                    <ToolsSection isTeen={isTeen} showToast={showToast} />
                )}
            </div>
        </div>
    );
};

// --- SUB-SECTIONS (Extracted from previous Health.jsx and MentalHealth.jsx) ---

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
            // Pad if needed
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

    // Store as array of IDs for mental health
    const [completedModules, setCompletedModules] = useState(() =>
        JSON.parse(localStorage.getItem(progressKey)) || []
    );

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
                <MentalModuleCard
                    key={mod.id}
                    module={mod}
                    isCompleted={completedModules.includes(mod.id)}
                    onComplete={() => handleComplete(mod.id)}
                />
            ))}
        </div>
    );
};

// Reusing the MentalModuleCard logic (inline for simplicity in this merged file)
const MentalModuleCard = ({ module, isCompleted, onComplete }) => {
    const [expanded, setExpanded] = useState(false);
    const [quizIdx, setQuizIdx] = useState(0);
    const [answers, setAnswers] = useState({});

    // Adapt legacy quiz format if needed (Mental data uses 'correct' index, Body uses 'a' index... need to be careful)
    // mentalHealthData uses: { question, options, correct }
    // bodyHealthData uses: { q, o, a }
    // Wait, I updated mentalHealthData to match body format? 
    // Let's check mentalHealthData structure from previous steps... 
    // I rewrote mentalHealthData in Step 5084. I used { q, o, a } format there! Good.
    // So both use { q, o, a }.

    const handleAnswer = (idx) => {
        const correct = idx === module.quiz[quizIdx].a;
        if (correct) {
            alert("Correct!");
            if (quizIdx < module.quiz.length - 1) {
                setQuizIdx(quizIdx + 1);
            } else {
                onComplete();
                setExpanded(false);
            }
        } else {
            alert("Incorrect, try again.");
        }
    };

    return (
        <div className="card" style={{ border: isCompleted ? '2px solid #00C851' : '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{module.icon}</div>
            <h3>{module.title}</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>{module.desc}</p>
            <button onClick={() => setExpanded(!expanded)} className="btn btn-primary" style={{ width: '100%' }}>
                {expanded ? "Close" : isCompleted ? "Review" : "Start"}
            </button>

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
    // Ported from MentalHealth.jsx ToolsSection
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
            {/* Crisis Resources */}
            <div className="card" style={{ borderColor: '#ff4444' }}>
                <h3 style={{ color: '#ff4444' }}>🆘 Crisis Resources</h3>
                <p style={{ fontSize: '0.9rem' }}>Emergency contacts available.</p>
            </div>
        </div>
    );
};

const ModuleViewer = ({ module, onClose, onComplete }) => {
    // Generic viewer for Body modules (popup style)
    const [quizIdx, setQuizIdx] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleAnswer = (idx) => {
        if (idx === module.quiz[quizIdx].a) {
            alert("Correct!");
            if (quizIdx < module.quiz.length - 1) setQuizIdx(quizIdx + 1);
            else onComplete();
        } else {
            alert("Try again.");
        }
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
