import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import ResourceList from '../components/ResourceList';
import Header from '../components/Header';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { 
    kidsTimeline, 
    professionalModules, 
    independenceCalendar as historyIndependenceCalendar, 
    teenQuizQuestions 
} from '../data/historyContent';
import { africanResources } from '../data/africanResources';

const History = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { balance, moduleEarnings, addEarnings, deductPenalty, getModuleCap } = useWallet();
    const { addPoints } = useGamification();
    const MODULE_CAP = getModuleCap('history');

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const isAdult = !isKid && !isTeen;

    const knowledgeDuration = isKid ? 5000 : isTeen ? 3500 : 3000;

    const [expandedEvent, setExpandedEvent] = useState(null);

    // --- RESOURCE GAME STATE ---
    const [gameScore, setGameScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info', duration = 5000) => {
        setToast({ message, type, duration });
    };

    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [showGame, setShowGame] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // --- TIMELINE QUIZ STATE ---
    const [showTimelineQuest, setShowTimelineQuest] = useState(false);
    const [timelineScore, setTimelineScore] = useState(0);
    const [shuffledTimeline, setShuffledTimeline] = useState([]);
    const [showTimelineFact, setShowTimelineFact] = useState(false);
    const [lastTimelineCorrect, setLastTimelineCorrect] = useState(null);

    // --- TTS STATE ---
    const [isReading, setIsReading] = useState(false);
    const [voiceProfile, setVoiceProfile] = useState(localStorage.getItem('voiceProfile') || 'female');
    const [customVoiceURI, setCustomVoiceURI] = useState(localStorage.getItem('customVoiceURI') || '');
    const [isVoiceCloned, setIsVoiceCloned] = useState(localStorage.getItem('isVoiceCloned') === 'true');
    const [clonedVoiceName, setClonedVoiceName] = useState(localStorage.getItem('clonedVoiceName') || '');
    const [availableVoices, setAvailableVoices] = useState([]);

    // --- MODULE NAVIGATION STATE ---
    const [activeModule, setActiveModule] = useState(null);
    const [completedModules, setCompletedModules] = useState(JSON.parse(localStorage.getItem('completedModules') || '[]'));

    // Persist voice settings
    useEffect(() => {
        localStorage.setItem('voiceProfile', voiceProfile);
        localStorage.setItem('customVoiceURI', customVoiceURI);
        localStorage.setItem('isVoiceCloned', isVoiceCloned);
        localStorage.setItem('clonedVoiceName', clonedVoiceName);
    }, [voiceProfile, customVoiceURI, isVoiceCloned, clonedVoiceName]);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            setAvailableVoices(voices);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => window.speechSynthesis.cancel();
    }, []);

    const findVoice = (profile) => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return null;

        if (profile === 'custom' && customVoiceURI) {
            return voices.find(v => v.voiceURI === customVoiceURI) || voices[0];
        }

        const africanLocales = ['en-NG', 'en-ZA', 'en-KE', 'en-GH', 'en-TZ'];
        const femaleMarkers = ['female', 'zira', 'samantha', 'victoria', 'heera', 'google uk english female', 'hazel', 'susan'];
        const maleMarkers = ['male', 'david', 'mark', 'george', 'google uk english male', 'james', 'ravi'];

        const isMatch = (voice, type) => {
            const name = voice.name.toLowerCase();
            if (type === 'female') return femaleMarkers.some(m => name.includes(m));
            if (type === 'male') return maleMarkers.some(m => name.includes(m));
            return false;
        };

        let match = voices.find(v => (africanLocales.some(l => v.lang.includes(l)) || v.name.toLowerCase().includes('nigeria') || v.name.toLowerCase().includes('kenya') || v.name.toLowerCase().includes('south africa')) && isMatch(v, profile));
        if (match) return match;

        match = voices.find(v => v.lang.startsWith('en') && isMatch(v, profile));
        if (match) return match;

        match = voices.find(v => isMatch(v, profile));
        if (match) return match;

        return voices[0];
    };

    const speakText = (text) => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            return;
        }
        setIsReading(true);
        const utterance = new SpeechSynthesisUtterance(text);

        const selectedVoice = findVoice(voiceProfile);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            if (voiceProfile === 'female') {
                utterance.pitch = 0.95;
                utterance.rate = 0.8;
            } else if (voiceProfile === 'male') {
                utterance.pitch = 0.85;
                utterance.rate = 0.85;
            }
        }

        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (showGame && shuffledQuestions.length === 0) {
            startNewGame();
        }
    }, [showGame]);

    const startNewGame = () => {
        const shuffled = [...africanResources].sort(() => Math.random() - 0.5);
        setShuffledQuestions(shuffled);
        setCurrentIndex(0);
        setGameScore(0);
        setWrongAttempts(0);
        generateQuestion(shuffled[0]);
    };

    const generateQuestion = (targetCountry) => {
        if (!targetCountry) return;
        const distractors = africanResources
            .filter(c => c.country !== targetCountry.country)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map(c => c.country);
        const options = [targetCountry.country, ...distractors].sort(() => Math.random() - 0.5);
        setCurrentQuestion({
            resource: targetCountry.resource,
            correct: targetCountry.country,
            fact: targetCountry.fact,
            options: options
        });
    };

    const handleGameAnswer = (selected) => {
        if (!currentQuestion) return;
        let isCorrect = selected === currentQuestion.correct;
        if (isCorrect) {
            setGameScore(prev => prev + 1);
            setWrongAttempts(0);
            addEarnings('history', 100);
            addPoints(50);
            showToast(`${currentQuestion.fact}\n\n(+₦100 & +50 XP)`, 'success', knowledgeDuration);
        } else {
            const newAttempts = wrongAttempts + 1;
            setWrongAttempts(newAttempts);
            if (newAttempts >= 3) {
                deductPenalty('history', 100);
                setWrongAttempts(0);
                showToast(`⚠️ 3 Wrong Attempts! A penalty of ₦100 has been deducted.`, 'error', 10000);
            } else {
                showToast(`Warning: ${newAttempts}/3 wrong attempts`, 'warning', 8000);
            }
        }
        const nextIndex = currentIndex + 1;
        if (nextIndex < shuffledQuestions.length) {
            setCurrentIndex(nextIndex);
            generateQuestion(shuffledQuestions[nextIndex]);
        } else {
            setShowGame(false);
            setShuffledQuestions([]);
        }
    };

    const events = (isKid ? kidsTimeline : kidsTimeline).filter(e => {
        if (e.targetGroup === 'all') return true;
        if (isKid && e.targetGroup === 'kids') return true;
        if (isTeen && e.targetGroup === 'teens') return true;
        if (isAdult && e.targetGroup === 'adults') return true;
        return false;
    });

    const independenceCalendar = historyIndependenceCalendar;

    const renderModuleNavigator = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {professionalModules.map((mod) => (
                <div 
                    key={mod.id} 
                    className="card" 
                    onClick={() => {
                        setActiveModule(mod);
                        window.scrollTo(0, 0);
                    }}
                    style={{
                        padding: '2rem',
                        cursor: 'pointer',
                        border: activeModule?.id === mod.id ? '2px solid var(--color-primary)' : '1px solid #333',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        backgroundColor: completedModules.includes(mod.id) ? 'rgba(0, 200, 81, 0.05)' : 'rgba(255,255,255,0.02)'
                    }}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{mod.icon}</div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{mod.title}</h3>
                    {completedModules.includes(mod.id) && (
                        <span style={{ 
                            position: 'absolute', top: '10px', right: '10px', 
                            backgroundColor: '#00C851', color: 'black', 
                            padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' 
                        }}>
                            MASTERED ✅
                        </span>
                    )}
                    <button className="btn btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                        {completedModules.includes(mod.id) ? 'Review Module' : 'Start Journey'}
                    </button>
                </div>
            ))}
        </div>
    );

    const renderModuleReader = () => {
        if (!activeModule) return null;
        return (
            <div style={{ 
                animation: 'fadeIn 0.5s', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '1px solid #444',
                marginBottom: '4rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>{activeModule.title}</h2>
                    <button 
                        onClick={() => setActiveModule(null)}
                        style={{ background: 'none', border: '1px solid #666', color: '#888', padding: '0.4rem 1rem', borderRadius: '10px', cursor: 'pointer' }}
                    >
                        Close Module
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {activeModule.episodes.map((ep, i) => (
                        <div key={i} style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>{ep.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {ep.content.map((line, li) => (
                                    <p key={li} style={{ fontSize: '1.1rem', color: '#bbb', lineHeight: '1.6', margin: 0 }}>
                                        {line.startsWith('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
                                    </p>
                                ))}
                            </div>
                            <div style={{ 
                                marginTop: '1.5rem', 
                                padding: '1rem', 
                                backgroundColor: 'rgba(255, 136, 0, 0.1)', 
                                borderRadius: '12px',
                                border: '1px dashed var(--color-primary)'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                                    <strong>Deep Fact:</strong> {ep.fact}
                                </p>
                            </div>
                            <button
                                onClick={() => speakText(`${ep.title}. ${ep.content.join('. ')}. Fact: ${ep.fact}`)}
                                className="btn btn-outline"
                                style={{ marginTop: '1rem', fontSize: '0.8rem' }}
                            >
                                {isReading ? "🤫 Stop Narration" : "🔊 Listen to Episode"}
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', borderTop: '1px solid #333' }}>
                    {!completedModules.includes(activeModule.id) ? (
                        <div>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>End of module!</p>
                            <button 
                                onClick={() => {
                                    const newCompleted = [...completedModules, activeModule.id];
                                    setCompletedModules(newCompleted);
                                    localStorage.setItem('completedModules', JSON.stringify(newCompleted));
                                    addEarnings('history', 500);
                                    addPoints(200);
                                    showToast(`Module Mastered! +₦500 & +200 XP.`, 'success');
                                }}
                                className="btn" 
                                style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
                            >
                                Claim Reward (₦500) 🎁
                            </button>
                        </div>
                    ) : (
                        <p style={{ color: '#00C851', fontWeight: 'bold' }}>✅ Mastered!</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
            <Header />
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast(null)} />}
            <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>← Back</button>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>{isKid ? "Time Travel ⏳" : "African History 📜"}</h1>
            </header>

            <div style={{ background: 'linear-gradient(135deg, #FF8800 0%, #FFBB33 100%)', padding: '1.25rem', borderRadius: '15px', color: 'white', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                <div><p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Wallet Balance</p><h2 style={{ fontSize: '2rem', margin: 0 }}>₦{balance}</h2></div>
                <div style={{ textAlign: 'right' }}><p style={{ fontSize: '0.8rem' }}>History Earnings</p><div style={{ fontWeight: 'bold' }}>₦{moduleEarnings.history || 0} / ₦{MODULE_CAP}</div></div>
            </div>

            {!isKid && (
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>🏔️ Expert Modules</h2>
                    {activeModule ? renderModuleReader() : renderModuleNavigator()}
                </section>
            )}

            <section>
                <h2 style={{ color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>{isKid ? "Heroic Moments" : "Timeline"}</h2>
                <div style={{ position: 'relative', borderLeft: '4px solid var(--color-primary)', paddingLeft: '2rem', marginLeft: '1rem' }}>
                    {events.map((event, index) => (
                        <div key={index} style={{ marginBottom: '3rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-2.6rem', top: '0', width: '20px', height: '20px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', border: '4px solid #1a1a1a' }}></div>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>{event.year}</span>
                            <h3 style={{ margin: '0.5rem 0', fontSize: '1.8rem' }}>{event.title}</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>{event.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>🗓️ Independence</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {independenceCalendar.map((item, idx) => (
                        <div key={idx} className="card" style={{ padding: '1rem', borderLeft: '5px solid var(--color-primary)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.country}</h3>
                            <p style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{item.date}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>{isKid ? "Resource Hunt 💎" : "Wealth"}</h2>
                <div className="card" style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#2c2c2c' }}>
                    {!showGame ? (<><button onClick={() => setShowGame(true)} className="btn">Start Game 🎮</button></>) : (
                        <div>
                            <h3 style={{ color: '#FFD700' }}>Question {currentIndex + 1}/{shuffledQuestions.length}</h3>
                            {currentQuestion && (<><p>Where is <strong>{currentQuestion.resource}</strong> found?</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                                {currentQuestion.options.map((opt, i) => (<button key={i} onClick={() => handleGameAnswer(opt)} className="btn btn-outline">{opt}</button>))}
                            </div></>)}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default History;
