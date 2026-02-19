import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';
import { purposeData } from '../data/purposeData';

const Purpose = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { addEarnings } = useWallet();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('learn'); // 'learn' or 'ikigai'
    const [activeModule, setActiveModule] = useState(null);
    const [toast, setToast] = useState(null);

    // Progress
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens' || ageGroup === 'kids' || ageGroup === 'Kids';
    const modules = isTeen ? purposeData.teens : purposeData.adults;
    const progressKey = `purposeProgress_${isTeen ? 'teen' : 'adult'}`;

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
            addEarnings('purpose', 150);
            showToast("Module Completed! +₦150 🌟", 'success');
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
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Purpose (Meaning & Direction) 🌟</h1>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    {isTeen ? "Discover your strengths, passions, and the path to your future." : "Align your career, legacy, and life with what truly matters."}
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
                    onClick={() => setActiveTab('ikigai')}
                    className={`btn ${activeTab === 'ikigai' ? 'btn-primary' : 'btn-outline'}`}
                >
                    🌸 Ikigai Builder
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

                {activeTab === 'ikigai' && <IkigaiBuilder showToast={showToast} />}
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

const IkigaiBuilder = ({ showToast }) => {
    // A simplified text-based builder to find the intersection
    const [inputs, setInputs] = useState({
        love: '',
        goodAt: '',
        paidFor: '',
        needs: ''
    });
    const [result, setResult] = useState(null);

    const handleSubmit = () => {
        if (!inputs.love || !inputs.goodAt || !inputs.paidFor || !inputs.needs) {
            alert("Please fill in all 4 sections to find your Ikigai.");
            return;
        }
        setResult(true);
        showToast("Ikigai Map Created! 🌸", "success");
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem' }}>What is your Ikigai?</h2>
                <p style={{ color: '#aaa' }}>Fill in the circles to find your reason for being.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card" style={{ borderColor: '#FF4444' }}>
                    <h3 style={{ color: '#FF4444' }}>❤️ What you LOVE</h3>
                    <textarea
                        className="input-field"
                        placeholder="e.g. Writing, Coding, Gardening..."
                        value={inputs.love}
                        onChange={e => setInputs({ ...inputs, love: e.target.value })}
                        style={{ width: '100%', height: '100px', background: '#222', color: '#fff', border: 'none', padding: '1rem', marginTop: '1rem' }}
                    />
                </div>
                <div className="card" style={{ borderColor: '#33b5e5' }}>
                    <h3 style={{ color: '#33b5e5' }}>🧠 What you are GOOD AT</h3>
                    <textarea
                        className="input-field"
                        placeholder="e.g. Math, Listening, organizing..."
                        value={inputs.goodAt}
                        onChange={e => setInputs({ ...inputs, goodAt: e.target.value })}
                        style={{ width: '100%', height: '100px', background: '#222', color: '#fff', border: 'none', padding: '1rem', marginTop: '1rem' }}
                    />
                </div>
                <div className="card" style={{ borderColor: '#00C851' }}>
                    <h3 style={{ color: '#00C851' }}>💰 What you can be PAID FOR</h3>
                    <textarea
                        className="input-field"
                        placeholder="e.g. Software Engineer, Teacher, Chef..."
                        value={inputs.paidFor}
                        onChange={e => setInputs({ ...inputs, paidFor: e.target.value })}
                        style={{ width: '100%', height: '100px', background: '#222', color: '#fff', border: 'none', padding: '1rem', marginTop: '1rem' }}
                    />
                </div>
                <div className="card" style={{ borderColor: '#FFBB33' }}>
                    <h3 style={{ color: '#FFBB33' }}>🌍 What the world NEEDS</h3>
                    <textarea
                        className="input-field"
                        placeholder="e.g. Clean water, better education, kindness..."
                        value={inputs.needs}
                        onChange={e => setInputs({ ...inputs, needs: e.target.value })}
                        style={{ width: '100%', height: '100px', background: '#222', color: '#fff', border: 'none', padding: '1rem', marginTop: '1rem' }}
                    />
                </div>
            </div>

            <div style={{ textAlign: 'center' }}>
                <button onClick={handleSubmit} className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
                    Reveal My Ikigai 🌸
                </button>
            </div>

            {result && (
                <div className="card animate-fade" style={{ marginTop: '3rem', textAlign: 'center', border: '2px solid gold', background: 'rgba(255, 215, 0, 0.1)' }}>
                    <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>✨ Your Purpose Snapshot ✨</h2>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                        Your sweet spot lies where your love for <strong>{inputs.love}</strong> meets your skill in <strong>{inputs.goodAt}</strong>.
                        <br />
                        By using this to solve <strong>{inputs.needs}</strong>, you can build a career as a <strong>{inputs.paidFor}</strong>!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Purpose;
