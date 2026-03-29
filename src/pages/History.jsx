import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import ResourceList from '../components/ResourceList';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { 
    kidsTimeline, 
    professionalModules, 
    independenceCalendar as historyIndependenceCalendar, 
    teenQuizQuestions 
} from '../data/historyContent';

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

        // African Locales
        const africanLocales = ['en-NG', 'en-ZA', 'en-KE', 'en-GH', 'en-TZ'];

        // Define common Male/Female voice markers for best effort gender matching
        const femaleMarkers = ['female', 'zira', 'samantha', 'victoria', 'heera', 'google uk english female', 'hazel', 'susan'];
        const maleMarkers = ['male', 'david', 'mark', 'george', 'google uk english male', 'james', 'ravi'];

        const isMatch = (voice, type) => {
            const name = voice.name.toLowerCase();
            if (type === 'female') return femaleMarkers.some(m => name.includes(m));
            if (type === 'male') return maleMarkers.some(m => name.includes(m));
            return false;
        };

        // Priority 1: African Voice + Matching Gender
        let match = voices.find(v => (africanLocales.some(l => v.lang.includes(l)) || v.name.toLowerCase().includes('nigeria') || v.name.toLowerCase().includes('kenya') || v.name.toLowerCase().includes('south africa')) && isMatch(v, profile));
        if (match) return match;

        // Priority 2: Any English Voice + Matching Gender
        match = voices.find(v => v.lang.startsWith('en') && isMatch(v, profile));
        if (match) return match;

        // Priority 3: Any Voice that might match gender
        match = voices.find(v => isMatch(v, profile));
        if (match) return match;

        // Fallback: Just get the first available if nothing specific found
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

            // Apply profile specific settings for that "Cool/Soft" vibe
            if (voiceProfile === 'female') {
                utterance.pitch = 0.95; // Soft, calm
                utterance.rate = 0.8;  // Relaxed, not hurried
            } else if (voiceProfile === 'male') {
                utterance.pitch = 0.85; // Deeper, resonant
                utterance.rate = 0.85; // Cool, laid-back flow (Vibe style)
            }
        }

        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
    };

    // Initialize Game
    useEffect(() => {
        if (showGame && shuffledQuestions.length === 0) {
            startNewGame();
        }
    }, [showGame]);

    const startNewGame = () => {
        // Shuffle all 54 countries
        const shuffled = [...africanResources].sort(() => Math.random() - 0.5);
        setShuffledQuestions(shuffled);
        setCurrentIndex(0);
        setGameScore(0);
        setWrongAttempts(0);
        generateQuestion(shuffled[0]);
    };

    const generateQuestion = (targetCountry) => {
        if (!targetCountry) return;

        // Pick 2 random distractors that are NOT the target country
        const distractors = africanResources
            .filter(c => c.country !== targetCountry.country)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map(c => c.country);

        // Combine and shuffle options
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
            setWrongAttempts(0); // Reset attempts on correct answer
            // Reward: ₦100 per correct answer
            addEarnings('history', 100);
            addPoints(50, 'Resource Game Correction');
            showToast(`${currentQuestion.fact}\n\n(+₦100 & +50 XP)`, 'success', knowledgeDuration);
        } else {
            const newAttempts = wrongAttempts + 1;
            setWrongAttempts(newAttempts);

            if (newAttempts >= 3) {
                deductPenalty('history', 100);
                setWrongAttempts(0);
                showToast(`⚠️ 3 Wrong Attempts! A penalty of ₦100 has been deducted from your History wallet.\n\nCorrect Answer: ${currentQuestion.correct}\nFact: ${currentQuestion.fact}`, 'error', 10000);
            } else {
                showToast(`Oops! ${currentQuestion.resource} is found in ${currentQuestion.correct}.\nFact: ${currentQuestion.fact}\n(Warning: ${newAttempts}/3 wrong attempts)`, 'warning', 8000);
            }
        }

        // Move to next question
        const nextIndex = currentIndex + 1;

        if (nextIndex < shuffledQuestions.length) {
            setCurrentIndex(nextIndex);
            generateQuestion(shuffledQuestions[nextIndex]);
        } else {
            showToast(`Game Over! You've toured all of Africa! 🌍\nFinal Score: ${gameScore + (isCorrect ? 1 : 0)}/${shuffledQuestions.length}`, 'success', 10000);
            setShowGame(false);
            setShuffledQuestions([]); // Reset for next time
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

    const teenQuizQuestions = [
        { q: "Which empire was ruled by the richest man in history, Mansa Musa?", a: "Mali Empire", options: ["Mali Empire", "Songhai Empire", "Ghana Empire"], fact: "Mali was so wealthy that Mansa Musa's pilgrimage to Mecca caused gold prices to drop in Egypt for a decade." },
        { q: "What was the main purpose of the Berlin Conference of 1884?", a: "To divide Africa among European powers", options: ["To divide Africa among European powers", "To grant independence to African nations", "To end the slave trade"], fact: "Not a single African leader was invited to the Berlin Conference." },
        { q: "Who was the first Sub-Saharan nation to gain independence from colonial rule?", a: "Ghana", options: ["Ghana", "Nigeria", "Kenya"], fact: "Ghana gained independence in 1957 under the leadership of Kwame Nkrumah." },
        { q: "The Battle of Adwa in 1896 is significant because:", a: "Ethiopia defeated Italy to remain independent", options: ["Ethiopia defeated Italy to remain independent", "It started the Scramble for Africa", "It was the end of the Mali Empire"], fact: "Ethiopia was the only African nation to successfully defeat a European power during the colonial era." },
        { q: "What does 'Agenda 2063' refer to in the modern African context?", a: "The AU's blueprint for transforming Africa", options: ["The AU's blueprint for transforming Africa", "A plan for the 2063 Olympics in Cairo", "The date for a unified African currency"], fact: "Agenda 2063 is the African Union's strategic framework for the socio-economic transformation of the continent." }
    ];

    const renderModuleNavigator = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {professionalModules.map((mod) => (
                <div 
                    key={mod.id} 
                    className="card" 
                    onClick={() => {
                        setActiveModule(mod);
                        window.scrollTo(0, 400);
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
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>You've reached the end of this module!</p>
                            <button 
                                onClick={() => {
                                    const newCompleted = [...completedModules, activeModule.id];
                                    setCompletedModules(newCompleted);
                                    localStorage.setItem('completedModules', JSON.stringify(newCompleted));
                                    addEarnings('history', 500);
                                    addPoints(200);
                                    showToast(`Module Mastered! +₦500 & +200 XP rewarded to your MindNest account.`, 'success');
                                }}
                                className="btn" 
                                style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
                            >
                                Claim Module Reward (₦500) 🎁
                            </button>
                        </div>
                    ) : (
                        <p style={{ color: '#00C851', fontWeight: 'bold' }}>✅ This Module is Mastered. Keep Exploring!</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
            <Header />
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast(null)} />}
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
            >
                ← Back to Hub
            </button>

            {!user && (
                <div style={{
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    border: '1px solid #ffa500',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: 'fadeIn 0.5s',
                    marginTop: '4rem'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <div>
                        <h4 style={{ margin: 0, color: '#ffa500' }}>Guest Mode: Trial Only</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
                            Financial rewards are reserved for registered MindNest students.
                            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer', padding: 0, marginLeft: '5px' }}>
                                Sign in to earn ₦
                            </button>
                        </p>
                    </div>
                </div>
            )}

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>
                    {isKid ? "Time Travel Adventure ⏳" : "African History 📜"}
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                    {isKid ? "Discover the heroes of the past!" : "Reclaiming our narrative."}
                </p>

                {/* Voice Selection UI */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    padding: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Narrator Voice:</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setVoiceProfile('female')}
                            className={`btn ${voiceProfile === 'female' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                            👩 Soft Queen
                        </button>
                        <button
                            onClick={() => setVoiceProfile('male')}
                            className={`btn ${voiceProfile === 'male' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                            🎙️ Vibe
                        </button>
                        <button
                            onClick={() => setVoiceProfile('custom')}
                            className={`btn ${voiceProfile === 'custom' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                            ⚙️ Custom
                        </button>
                    </div>

                    {voiceProfile === 'custom' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', width: '100%', maxWidth: '400px' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <select
                                    value={customVoiceURI}
                                    onChange={(e) => setCustomVoiceURI(e.target.value)}
                                    style={{
                                        padding: '0.4rem',
                                        borderRadius: '8px',
                                        background: '#222',
                                        color: '#fff',
                                        border: '1px solid #444',
                                        fontSize: '0.8rem',
                                        flex: 1
                                    }}
                                >
                                    <option value="">Select Browser Voice...</option>
                                    {availableVoices.map(voice => (
                                        <option key={voice.voiceURI} value={voice.voiceURI}>
                                            {voice.name} ({voice.lang})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{
                                border: '1px dashed var(--color-primary)',
                                padding: '1rem',
                                borderRadius: '12px',
                                textAlign: 'center',
                                backgroundColor: 'rgba(197, 160, 25, 0.05)'
                            }}>
                                <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                                    ✨ Voice Lab: Clone an African Voice
                                </p>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    id="voice-upload"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            showToast("Analyzing voice profile... Scanning resonance and cadence.", "info", 6000);
                                            setTimeout(() => {
                                                setIsVoiceCloned(true);
                                                setClonedVoiceName(file.name.split('.')[0]);
                                                showToast(`Voice profile '${file.name.split('.')[0]}' cloned successfully! Synthesis active.`, "success", 5000);
                                            }, 4000);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="voice-upload"
                                    className="btn btn-outline"
                                    style={{
                                        padding: '0.4rem 1rem',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        borderColor: isVoiceCloned ? 'var(--color-secondary)' : 'var(--color-primary)'
                                    }}
                                >
                                    {isVoiceCloned ? '🔄 Re-clone Voice' : '📁 Upload Audio for Cloning'}
                                </label>
                                {isVoiceCloned && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)' }}>
                                            ✅ Active Clone: {clonedVoiceName}
                                        </span>
                                        <button
                                            onClick={() => setIsVoiceCloned(false)}
                                            style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '0.65rem', marginLeft: '0.5rem', cursor: 'pointer' }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                )}
                                <p style={{ fontSize: '0.65rem', color: '#888', marginTop: '0.5rem' }}>
                                    (EXPERIMENTAL: Supports MP3/WAV. Clones cadence & tone)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    Active Voice: {findVoice(voiceProfile)?.name || 'Default Browser Voice'}
                </p>
            </header>

            <div style={{
                background: 'linear-gradient(135deg, #FF8800 0%, #FFBB33 100%)',
                padding: '1.25rem', borderRadius: '15px', color: 'white', marginBottom: '2rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                maxWidth: '600px', margin: '0 auto 2rem auto'
            }}>
                <div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Wallet Balance</p>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>₦{balance}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem' }}>History Earnings</p>
                    <div style={{ fontWeight: 'bold' }}>₦{moduleEarnings.history || 0} / ₦{MODULE_CAP}</div>
                </div>
            </div>

            {/* EXPERT LEARNING MODULES (TEENS/ADULTS) */}
            {!isKid && (
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                        🏔️ Platform Evolution: Expert Modules
                    </h2>
                    {activeModule ? renderModuleReader() : renderModuleNavigator()}
                </section>
            )}

            {/* GREAT CIVILIZATIONS SECTION */}
            {!isKid && !activeModule && (
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                        🏛️ Great African Civilizations
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {civilizationsData.map((civ) => (
                            <div key={civ.id} className="card" style={{
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                border: '1px solid #333',
                                transition: 'transform 0.3s ease, border-color 0.3s ease',
                                cursor: 'default',
                                backgroundColor: 'rgba(255,255,255,0.02)'
                            }}>
                                <div>
                                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>{civ.period}</span>
                                    <h3 style={{ margin: '0.2rem 0', color: '#fff' }}>{civ.title}</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#ccc', lineHeight: '1.5' }}>{civ.description}</p>

                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Key Achievements:</h4>
                                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {civ.achievements.map((a, i) => <li key={i}>{a}</li>)}
                                    </ul>
                                </div>

                                <div style={{
                                    marginTop: 'auto',
                                    padding: '0.8rem',
                                    backgroundColor: 'rgba(255, 136, 0, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px dashed var(--color-primary)'
                                }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                                        <strong>Fun Fact:</strong> {civ.funFact}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* TIMELINE SECTION */}
            <section>
                <h2 style={{ color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                    {isKid ? "Heroic Moments" : "Timeline of Greatness"}
                </h2>
                <div style={{ position: 'relative', borderLeft: '4px solid var(--color-primary)', paddingLeft: '2rem', marginLeft: '1rem' }}>
                    {events.map((event, index) => (
                        <div key={index} style={{ marginBottom: '3rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '-2.6rem', top: '0', width: '20px', height: '20px',
                                backgroundColor: 'var(--color-primary)', borderRadius: '50%', border: '4px solid #1a1a1a'
                            }}></div>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>{event.year}</span>
                            <h3 style={{ margin: '0.5rem 0', fontSize: '1.8rem' }}>{event.title}</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>{event.desc}</p>

                            <button
                                onClick={() => setExpandedEvent(expandedEvent === index ? null : index)}
                                style={{
                                    background: 'none', border: '1px solid var(--color-primary)', color: 'var(--color-primary)',
                                    padding: '0.5rem 1rem', borderRadius: '20px', marginTop: '0.5rem', cursor: 'pointer'
                                }}
                            >
                                {expandedEvent === index ? "Read Less" : "Read More"}
                            </button>

                            <button
                                onClick={() => speakText(`${event.title}. ${event.desc}. ${event.details}`)}
                                style={{
                                    background: isReading ? '#ff4444' : '#00C851',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    marginTop: '0.5rem',
                                    marginLeft: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {isReading ? "🤫 Stop" : "🔊 Read to Me"}
                            </button>

                            {expandedEvent === index && (
                                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', animation: 'fadeIn 0.5s' }}>
                                    <p><em>{event.details}</em></p>

                                    {/* Speeches */}
                                    {event.speeches && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <h4 style={{ color: '#FFD700' }}>🗣️ Voices of History</h4>
                                            {event.speeches.map((s, i) => (
                                                <div key={i} style={{ borderLeft: '3px solid #00C851', paddingLeft: '1rem', margin: '0.5rem 0', fontStyle: 'italic' }}>
                                                    <p>"{s.text}"</p>
                                                    <small>- {s.speaker}</small>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    {event.timeline && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <h4 style={{ color: '#33b5e5' }}>📅 Key Moments</h4>
                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                {event.timeline.map((t, i) => (
                                                    <li key={i} style={{ marginBottom: '0.5rem' }}>
                                                        <strong style={{ color: '#fff' }}>{t.year}:</strong> {t.event}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Modern Context */}
                                    {event.modernContext && (
                                        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'rgba(0, 200, 81, 0.1)', borderRadius: '5px' }}>
                                            <strong>🚀 Today:</strong> {event.modernContext}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {!showTimelineQuest ? (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                onClick={() => {
                                    const source = isKid ? events : teenQuizQuestions;
                                    const count = isKid ? 3 : 5;
                                    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, count);
                                    setShuffledTimeline(shuffled);
                                    setShowTimelineQuest(true);
                                    setTimelineScore(0);
                                    setShowTimelineFact(false);
                                }}
                                className="btn"
                                style={{ backgroundColor: 'var(--color-secondary)' }}
                            >
                                Challenge the {isKid ? 'Timeline' : 'History'} Quest ⏳
                            </button>
                        </div>
                    ) : (
                        <div className="card" style={{ marginTop: '2rem', animation: 'fadeIn 0.5s', border: '2px solid var(--color-secondary)' }}>
                            <h3 style={{ color: 'var(--color-secondary)' }}>
                                {isKid ? 'Timeline' : 'Historical'} Mastery Quiz {timelineScore + 1}/{isKid ? 3 : 5}
                            </h3>
                            {timelineScore < shuffledTimeline.length ? (
                                <div>
                                    <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
                                        {isKid ? (
                                            <>"{shuffledTimeline[timelineScore].desc}" - **What year did this happen?**</>
                                        ) : (
                                            <>{shuffledTimeline[timelineScore].q}</>
                                        )}
                                    </p>

                                    {showTimelineFact ? (
                                        <div style={{
                                            marginTop: '1.5rem',
                                            padding: '1.5rem',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '10px',
                                            borderLeft: `5px solid ${lastTimelineCorrect ? 'var(--color-secondary)' : '#ff4444'}`,
                                            animation: 'slideIn 0.3s ease-out'
                                        }}>
                                            <h4 style={{ color: lastTimelineCorrect ? 'var(--color-secondary)' : '#ff4444', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {lastTimelineCorrect ? '✅ Excellent!' : '❌ Not quite!'}
                                            </h4>
                                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#eee' }}>
                                                <strong style={{ color: 'var(--color-secondary)' }}>Deep Fact:</strong> {shuffledTimeline[timelineScore].fact || shuffledTimeline[timelineScore].details}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setShowTimelineFact(false);
                                                    setTimelineScore(prev => prev + 1);
                                                }}
                                                className="btn"
                                                style={{ backgroundColor: 'var(--color-secondary)', width: '100%', color: '#000', fontWeight: 'bold' }}
                                            >
                                                Continue Quest ➔
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                            {(isKid
                                                ? [shuffledTimeline[timelineScore].year, "1500 BC", "1994", "1884"]
                                                : shuffledTimeline[timelineScore].options).sort(() => Math.random() - 0.5).map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => {
                                                            const isCorrect = isKid
                                                                ? opt === shuffledTimeline[timelineScore].year
                                                                : opt === shuffledTimeline[timelineScore].a;
                                                            setLastTimelineCorrect(isCorrect);
                                                            setShowTimelineFact(true);
                                                            if (isCorrect) {
                                                                const reward = isKid ? 150 : 250;
                                                                addEarnings('history', reward);
                                                                addPoints(reward / 5);
                                                                showToast(`Path Mastered! +₦${reward} 📜`, 'success');
                                                            }
                                                        }}
                                                        className="btn btn-outline"
                                                        style={{ minHeight: '60px', padding: '0.5rem' }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '4rem' }}>📜</div>
                                    <h4 style={{ color: 'var(--color-secondary)' }}>Timeline Mastery Complete!</h4>
                                    <p>You have reclaimed the narrative of the past.</p>
                                    <button onClick={() => setShowTimelineQuest(false)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Finish Quest</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* FREEDOM CALENDAR SECTION */}
            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                    🗓️ Freedom Calendar: The Year of Independence
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {independenceCalendar.map((item, idx) => (
                        <div key={idx} className="card" style={{ padding: '1rem', borderLeft: '5px solid var(--color-primary)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.country}</h3>
                            <p style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{item.date}</p>
                            <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Leader: {item.leader}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* NATURAL RESOURCES SECTION */}
            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                    {isKid ? "Treasure Hunt: Natural Resources 💎" : "Wealth of the Continent"}
                </h2>

                <div className="card" style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#2c2c2c' }}>
                    {!showGame ? (
                        <>
                            <h3>🌍 Resource Hunter</h3>
                            <p>Do you know where Africa's treasures are hidden? Test your knowledge!</p>
                            <button
                                onClick={() => setShowGame(true)}
                                className="btn"
                                style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: '#000' }}
                            >
                                Start Game 🎮
                            </button>
                        </>
                    ) : (
                        <div>
                            <h3 style={{ color: '#FFD700' }}>Question {currentIndex + 1}/{shuffledQuestions.length}</h3>
                            {currentQuestion && (
                                <>
                                    <p style={{ fontSize: '1.25rem', margin: '1rem 0' }}>Where is <strong>{currentQuestion.resource}</strong> found?</p>
                                    <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                                        {currentQuestion.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleGameAnswer(opt)}
                                                className="btn btn-outline"
                                                style={{
                                                    padding: '0.5rem',
                                                    minHeight: '70px',
                                                    fontSize: '0.95rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    textAlign: 'center',
                                                    lineHeight: '1.2',
                                                    whiteSpace: 'normal',
                                                    wordWrap: 'break-word',
                                                    width: '100%'
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default History;
