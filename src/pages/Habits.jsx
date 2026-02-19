import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';
import { habitsData } from '../data/habitsData';

const Habits = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addEarnings } = useWallet();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('learn'); // 'learn' or 'tracker'
    const [activeModule, setActiveModule] = useState(null); // module object if open
    const [toast, setToast] = useState(null);

    // Progress
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens' || ageGroup === 'kids' || ageGroup === 'Kids';
    const modules = isTeen ? habitsData.teens : habitsData.adults;
    const progressKey = `habitsProgress_${isTeen ? 'teen' : 'adult'}`;

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
            addEarnings('health', 150); // Using 'health' wallet category for Wellness pillars
            showToast("Module Completed! +₦150 📅", 'success');
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
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Habits (Consistency & Discipline) 📅</h1>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    {isTeen ? "Master your routine, master your life. Build the real you." : "The science of behavior change. Design your life for success."}
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
                    onClick={() => setActiveTab('tracker')}
                    className={`btn ${activeTab === 'tracker' ? 'btn-primary' : 'btn-outline'}`}
                >
                    ✅ Habit Tracker tool
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

                {activeTab === 'tracker' && <SimpleHabitTracker showToast={showToast} />}
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

const ModuleViewer = ({ module, onClose, onComplete, alreadyCompleted }) => {
    const [quizIdx, setQuizIdx] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleAnswer = (optionIndex) => {
        const correct = optionIndex === module.quiz[quizIdx].a;
        if (correct) {
            alert("Correct! 🎉");
        } else {
            alert("Incorrect. Try again!");
            return;
        }

        if (quizIdx < module.quiz.length - 1) {
            setQuizIdx(quizIdx + 1);
        } else {
            onComplete();
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
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className="btn btn-outline"
                                    style={{ textAlign: 'left', padding: '1rem' }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SimpleHabitTracker = ({ showToast }) => {
    // Simple local-only tracker
    const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('myHabits')) || []);
    const [newHabit, setNewHabit] = useState('');

    useEffect(() => {
        localStorage.setItem('myHabits', JSON.stringify(habits));
    }, [habits]);

    const addHabit = () => {
        if (!newHabit.trim()) return;
        setHabits([...habits, { id: Date.now(), title: newHabit, streak: 0, lastCheck: null }]);
        setNewHabit('');
        showToast('Habit added!', 'success');
    };

    const checkIn = (id) => {
        const today = new Date().toDateString();
        setHabits(habits.map(h => {
            if (h.id === id) {
                if (h.lastCheck === today) return h; // Already checked
                return { ...h, streak: h.streak + 1, lastCheck: today };
            }
            return h;
        }));
        showToast('Checked in! Keep the streak alive! 🔥', 'success');
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>➕ Add New Habit</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="e.g. Read 5 pages..."
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff' }}
                    />
                    <button onClick={addHabit} className="btn btn-primary">Add</button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {habits.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No habits tracked yet. Start today!</p>}

                {habits.map(h => {
                    const isCheckedToday = h.lastCheck === new Date().toDateString();
                    return (
                        <div key={h.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{h.title}</div>
                                <div style={{ color: '#aaa', fontSize: '0.9rem' }}>🔥 Streak: {h.streak} days</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button
                                    onClick={() => checkIn(h.id)}
                                    disabled={isCheckedToday}
                                    className={`btn ${isCheckedToday ? 'btn-success' : 'btn-outline'}`}
                                    style={{ minWidth: '100px', opacity: isCheckedToday ? 0.7 : 1 }}
                                >
                                    {isCheckedToday ? 'Done ✅' : 'Check In'}
                                </button>
                                <button onClick={() => deleteHabit(h.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>🗑️</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Habits;
