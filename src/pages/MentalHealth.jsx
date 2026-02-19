import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';
import { mentalHealthData } from '../data/mentalHealthData';

const MentalHealth = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addEarnings } = useWallet();
    const [activeTab, setActiveTab] = useState('learn');
    const [toast, setToast] = useState(null);
    const [completedModules, setCompletedModules] = useState(() =>
        JSON.parse(localStorage.getItem('mentalHealthProgress')) || []
    );

    // Premium Status Check (Mock - replace with real logic if available)
    const isPremium = user?.isPremium || false;
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens' || ageGroup === 'kids' || ageGroup === 'Kids'; // Kids use teen track for now

    const showToast = (message, type = 'info') => setToast({ message, type });

    useEffect(() => {
        localStorage.setItem('mentalHealthProgress', JSON.stringify(completedModules));
    }, [completedModules]);

    const handleModuleComplete = (moduleId) => {
        if (!completedModules.includes(moduleId)) {
            const newCompleted = [...completedModules, moduleId];
            setCompletedModules(newCompleted);
            addEarnings('health', 150);
            showToast("Module Completed! +₦150 🧠", 'success');
        }
    };

    const modules = isTeen ? mentalHealthData.teens : mentalHealthData.adults;

    return (
        <div className="container" style={{ paddingBottom: '5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                <button
                    onClick={() => navigate('/health')}
                    style={{
                        background: 'none', color: 'var(--color-text-muted)', border: 'none',
                        fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1rem'
                    }}
                >
                    ← Back to Wellness
                </button>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Mind (Mental & Emotional Health) 🧠</h1>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    {isTeen ? "Your space to understand feelings, build confidence, and grow strong." : "Tools for emotional resilience, stress management, and finding your path."}
                </p>
                <div style={{ marginTop: '1rem', display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: 'rgba(0, 200, 81, 0.1)', color: '#00C851', fontSize: '0.8rem' }}>
                    {isTeen ? "Teen Track" : "Adult Track"}
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['learn', 'tools', 'premium'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '12px',
                            backgroundColor: activeTab === tab ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: '#fff',
                            border: `1px solid ${activeTab === tab ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {tab === 'learn' && '📚 Learning Modules'}
                        {tab === 'tools' && '🛠️ Interactive Tools'}
                        {tab === 'premium' && '💎 Premium Features'}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-fade">
                {activeTab === 'learn' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {modules.map(mod => (
                            <ModuleCard
                                key={mod.id}
                                module={mod}
                                isCompleted={completedModules.includes(mod.id)}
                                onComplete={() => handleModuleComplete(mod.id)}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'tools' && (
                    <ToolsSection isPremium={isPremium} showToast={showToast} navigate={navigate} />
                )}

                {activeTab === 'premium' && (
                    <PremiumSection isPremium={isPremium} showToast={showToast} />
                )}
            </div>

            {/* Crisis Resources (Always Visible at Bottom) */}
            <div style={{ marginTop: '5rem', padding: '2rem', backgroundColor: '#330000', borderRadius: '15px', border: '1px solid #cc0000' }}>
                <h3 style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem' }}>🆘 Need Immediate Help?</h3>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>If you or someone you know is in danger, please reach out to these free resources.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {mentalHealthData.hotlines.map((hotline, idx) => (
                        <div key={idx} style={{ padding: '1rem', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 68, 68, 0.3)' }}>
                            <div style={{ fontSize: '0.8rem', color: '#ffaaaa' }}>{hotline.country}</div>
                            <div style={{ fontWeight: 'bold' }}>{hotline.name}</div>
                            <div style={{ color: '#fff', fontSize: '1.1rem', marginTop: '0.2rem' }}>📞 {hotline.number}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const ModuleCard = ({ module, isCompleted, onComplete }) => {
    const [expanded, setExpanded] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [quizCompleted, setQuizCompleted] = useState(false);

    const handleAnswer = (optIndex) => {
        setAnswers({ ...answers, [quizIndex]: optIndex });
    };

    const nextQuestion = () => {
        if (quizIndex < module.quiz.length - 1) {
            setQuizIndex(quizIndex + 1);
        } else {
            // Check results
            const allCorrect = module.quiz.every((q, i) => answers[i] === q.correct);
            if (allCorrect) {
                setQuizCompleted(true);
                onComplete();
            } else {
                alert("Some answers were incorrect. Review the content and try again!");
                setQuizIndex(0);
                setAnswers({});
            }
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '15px',
            border: `1px solid ${isCompleted ? '#00C851' : 'var(--color-border)'}`,
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {isCompleted && <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#00C851' }}>✅ Completed</div>}

            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{module.icon}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{module.title}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{module.desc}</p>

            <button
                onClick={() => setExpanded(!expanded)}
                className="btn btn-primary"
                style={{ width: '100%' }}
            >
                {expanded ? "Close Module" : isCompleted ? "Review Content" : "Start Learning"}
            </button>

            {expanded && (
                <div className="animate-fade" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#ddd' }}>{module.content}</div>

                    {!quizCompleted && !isCompleted && (
                        <div style={{ marginTop: '2rem', backgroundColor: '#222', padding: '1.5rem', borderRadius: '10px' }}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Quick Quiz ({quizIndex + 1}/{module.quiz.length})</h4>
                            <p style={{ marginBottom: '1rem' }}>{module.quiz[quizIndex].question}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {module.quiz[quizIndex].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        style={{
                                            padding: '0.8rem', borderRadius: '8px', border: '1px solid #444',
                                            backgroundColor: answers[quizIndex] === idx ? 'var(--color-primary)' : 'transparent',
                                            color: '#fff', textAlign: 'left', cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={nextQuestion}
                                disabled={answers[quizIndex] === undefined}
                                style={{ marginTop: '1rem', width: '100%', padding: '0.8rem', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '8px', cursor: answers[quizIndex] !== undefined ? 'pointer' : 'not-allowed', opacity: answers[quizIndex] !== undefined ? 1 : 0.5 }}
                            >
                                {quizIndex === module.quiz.length - 1 ? "Submit" : "Next Question"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ToolsSection = ({ isPremium, showToast, navigate }) => {
    const [mood, setMood] = useState(null);
    const [breathingActive, setBreathingActive] = useState(false);
    const [stressScore, setStressScore] = useState(null);

    // Mock Mood Tracker
    const saveMood = (m) => {
        if (!isPremium) return; // Should be premium? Plan says Premium-gated tools: Mood, Breathing, etc. Wait, plan says "Interactive Tools (Premium-gated)"
        setMood(m);
        showToast(`Mood logged: ${m}`, 'success');
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Mood Tracker */}
            <div className="card" style={{ position: 'relative' }}>
                {!isPremium && <PremiumLock />}
                <h3>📊 Mood Tracker</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>How are you feeling today?</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem' }}>
                    {['😢', '😕', '😐', '🙂', '😁'].map(m => (
                        <button key={m} onClick={() => saveMood(m)} style={{ background: 'none', border: mood === m ? '2px solid var(--color-primary)' : 'none', borderRadius: '50%', cursor: 'pointer', padding: '5px' }}>{m}</button>
                    ))}
                </div>
            </div>

            {/* Guided Breathing */}
            <div className="card" style={{ position: 'relative' }}>
                {!isPremium && <PremiumLock />}
                <h3>🌬️ Guided Breathing</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>4-7-8 Technique for anxiety relief.</p>
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#222', borderRadius: '10px' }}>
                    {breathingActive ? (
                        <div className="breathing-circle" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }}></div>
                    ) : (
                        <button onClick={() => setBreathingActive(true)} className="btn btn-primary">Start Session</button>
                    )}
                </div>
            </div>

            {/* Stress Test */}
            <div className="card" style={{ position: 'relative' }}>
                {!isPremium && <PremiumLock />}
                <h3>📉 Stress Assessment</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>Take a quick 10-question checkup.</p>
                <button className="btn btn-outline" style={{ widdth: '100%' }}>Start Assessment</button>
            </div>
        </div>
    );
};

const PremiumSection = ({ isPremium, showToast }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <FeatureCard
                title="AI Journaling 📝"
                desc="Reflect on your day with AI-powered prompts and insights."
                isPremium={isPremium}
            />
            <FeatureCard
                title="Goal Setting 🎯"
                desc="Set and track SMART goals for your personal growth."
                isPremium={isPremium}
            />
            <FeatureCard
                title="Habit Builder 📅"
                desc="Build lasting habits with daily streaks and reminders."
                isPremium={isPremium}
            />
            <FeatureCard
                title="Confidence Training 🦁"
                desc="Daily affirmations and confidence-boosting challenges."
                isPremium={isPremium}
            />
        </div>
    );
};

const FeatureCard = ({ title, desc, isPremium }) => (
    <div className="card" style={{ position: 'relative', opacity: isPremium ? 1 : 0.7 }}>
        {!isPremium && <PremiumLock />}
        <h3>{title}</h3>
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{desc}</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={!isPremium}>
            {isPremium ? "Open" : "Upgrade to Unlock"}
        </button>
    </div>
);

const PremiumLock = () => (
    <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 10, borderRadius: '15px'
    }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
        <div style={{ fontWeight: 'bold', color: '#FFD700' }}>Premium Feature</div>
    </div>
);

export default MentalHealth;
