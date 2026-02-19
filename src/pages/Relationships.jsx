import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';
import { relationshipsData, scenarios } from '../data/relationshipsData';

const Relationships = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { addEarnings } = useWallet();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('learn'); // 'learn' or 'scenarios'
    const [activeModule, setActiveModule] = useState(null);
    const [toast, setToast] = useState(null);

    // Progress
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens' || ageGroup === 'kids' || ageGroup === 'Kids';
    const modules = isTeen ? relationshipsData.teens : relationshipsData.adults;
    const progressKey = `relProgress_${isTeen ? 'teen' : 'adult'}`;

    const [completedModules, setCompletedModules] = useState(() =>
        JSON.parse(localStorage.getItem(progressKey)) || []
    );

    useEffect(() => {
        localStorage.setItem(progressKey, JSON.stringify(completedModules));
    }, [completedModules, progressKey]);

    const showToast = (message, type = 'info') => setToast({ message, type });

    const handleModuleComplete = (moduleId) => {
        if (!completedModules.includes(moduleId)) {
            setCompletedModules(prev => [...prev, moduleId]);
            addEarnings('relationships', 150); // reward
            showToast("Module Completed! +₦150 🤝", 'success');
        }
        setActiveModule(null);
    };

    return (
        <div className="container" style={{ paddingBottom: '5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* HEADER */}
            <header style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'none', color: 'var(--color-text-muted)', border: 'none',
                        fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1rem'
                    }}
                >
                    ← Back to Hub
                </button>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Relationships (Connection) 🤝</h1>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    {isTeen ? "Navigate friendships, family, and digital life with confidence." : "Build your network, deepen bonds, and lead with empathy."}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <div className="badge" style={{ backgroundColor: 'rgba(51, 181, 229, 0.1)', color: '#33b5e5' }}>
                        {isTeen ? "Teen Track" : "Adult Track"}
                    </div>
                    <div className="badge" style={{ backgroundColor: 'rgba(0, 200, 81, 0.1)', color: '#00C851' }}>
                        {completedModules.length} / {modules.length} Completed
                    </div>
                </div>
            </header>

            {/* TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('learn')}
                    className={`btn ${activeTab === 'learn' ? 'btn-primary' : 'btn-outline'}`}
                >
                    📚 Learning Modules
                </button>
                <button
                    onClick={() => setActiveTab('scenarios')}
                    className={`btn ${activeTab === 'scenarios' ? 'btn-primary' : 'btn-outline'}`}
                >
                    🎭 Scenario Solver
                </button>
            </div>

            {/* CONTENT */}
            <div className="animate-fade">
                {activeTab === 'learn' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {modules.map((mod, idx) => {
                            const isLocked = idx > 0 && !completedModules.includes(modules[idx - 1].id);
                            const isDone = completedModules.includes(mod.id);

                            return (
                                <div key={mod.id} className="card" style={{ opacity: isLocked ? 0.6 : 1, border: isDone ? '2px solid #00C851' : '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{isLocked ? '🔒' : mod.icon}</div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{mod.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{mod.desc}</p>

                                    {isLocked ? (
                                        <button disabled className="btn btn-outline" style={{ width: '100%', opacity: 0.5 }}>Locked</button>
                                    ) : (
                                        <button
                                            onClick={() => setActiveModule(mod)}
                                            className={`btn ${isDone ? 'btn-outline' : 'btn-primary'}`}
                                            style={{ width: '100%' }}
                                        >
                                            {isDone ? 'Review' : 'Start'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'scenarios' && <ScenarioSolver showToast={showToast} />}
            </div>

            {/* MODULE MODAL */}
            {activeModule && (
                <ModuleViewer
                    module={activeModule}
                    onClose={() => setActiveModule(null)}
                    onComplete={() => handleModuleComplete(activeModule.id)}
                    alreadyCompleted={completedModules.includes(activeModule.id)}
                />
            )}

        </div>
    );
};

// --- SUBCOMPONENTS ---

const ModuleViewer = ({ module, onClose, onComplete }) => {
    const [quizIdx, setQuizIdx] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleAnswer = (optionIndex) => {
        const correct = optionIndex === module.quiz[quizIdx].a;
        if (correct) {
            alert("Correct! 🎉");
            if (quizIdx < module.quiz.length - 1) {
                setQuizIdx(quizIdx + 1);
            } else {
                onComplete();
            }
        } else {
            alert("Incorrect. Try again!");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 2000,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
        }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem', background: 'none', color: '#fff' }}>&times;</button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '4rem' }}>{module.icon}</div>
                    <h2>{module.title}</h2>
                </div>

                {!showQuiz ? (
                    <div>
                        <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '2rem', color: '#ddd' }}>
                            {module.content}
                        </div>
                        <button onClick={() => setShowQuiz(true)} className="btn btn-primary" style={{ width: '100%' }}>
                            Take Quiz to Complete 📝
                        </button>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>Question {quizIdx + 1}/{module.quiz.length}</h3>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{module.quiz[quizIdx].q}</p>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {module.quiz[quizIdx].o.map((opt, idx) => (
                                <button key={idx} onClick={() => handleAnswer(idx)} className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem' }}>{opt}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ScenarioSolver = ({ showToast }) => {
    const [currentScenario, setCurrentScenario] = useState(null);

    const handleOption = (option) => {
        alert(option.result);
        if (option.score > 0) {
            showToast(`+${option.score} Social Points!`, 'success');
            setCurrentScenario(null);
        }
    };

    if (currentScenario) {
        return (
            <div className="card animate-fade">
                <button onClick={() => setCurrentScenario(null)} style={{ marginBottom: '1rem', background: 'none', color: '#aaa', border: 'none', cursor: 'pointer' }}>← Back to List</button>
                <h2>{currentScenario.title}</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#ddd' }}>{currentScenario.desc}</p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {currentScenario.options.map((opt, idx) => (
                        <button key={idx} onClick={() => handleOption(opt)} className="btn btn-outline" style={{ textAlign: 'left', padding: '1rem' }}>
                            {opt.text}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {scenarios.map(s => (
                <div key={s.id} className="card">
                    <h3>{s.title}</h3>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>{s.desc}</p>
                    <button onClick={() => setCurrentScenario(s)} className="btn btn-primary" style={{ width: '100%' }}>Solve 🎭</button>
                </div>
            ))}
        </div>
    );
};

export default Relationships;
