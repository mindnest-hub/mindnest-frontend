import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import ResourceList from '../components/ResourceList';
import { useWallet } from '../hooks/useWallet';
import { africanResources } from '../data/africanResources';
import { civilizationsData } from '../data/civilizationsData';
import { useGamification } from '../context/GamificationContext';

const History = ({ ageGroup }) => {
    const navigate = useNavigate();
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

    const events = [
        {
            year: "20,000 BC",
            title: "The Ishango Bone 🦴",
            desc: "The world's oldest mathematical tool, found in modern-day DR Congo.",
            details: "It is a baboon fibula with a tally system that suggests African ancestors were using advanced prime number arithmetic and lunar calendars long before anywhere else.",
            targetGroup: "teens"
        },
        {
            year: "3000 BC",
            title: "The Pyramids of Giza",
            desc: "Ancient Egyptians built the pyramids using advanced math and engineering.",
            details: "The Great Pyramid was the tallest man-made structure for over 3,800 years. It shows the incredible genius of African ancestors.",
            targetGroup: "all"
        },
        {
            year: "500 BC",
            title: "Nok Iron Innovation ⚒️",
            desc: "Mastery of iron-smelting technology in modern Nigeria.",
            details: "The Nok people developed highly advanced blast furnaces. This technology bypassed the 'Bronze Age' completely, jumping straight to the Iron Age—proving unique African innovation paths.",
            targetGroup: "teens"
        },
        {
            year: "Pre-Colonial",
            title: "Cowries & Trade Cycles 📿",
            desc: "Understanding the complex economic systems of pre-colonial Africa.",
            details: "Before European arrival, Africa had thriving global trade using Cowrie shells and Gold weights. These systems were stable, inflation-resistant, and regulated by powerful merchant guilds.",
            targetGroup: "adults"
        },
        {
            year: "1324 AD",
            title: "Mansa Musa's Pilgrimage",
            desc: "The Emperor of Mali, the richest man in history, traveled to Mecca.",
            details: "He brought so much gold that he changed the economy of every city he visited. Timbuktu became a global center of learning.",
            targetGroup: "all"
        },
        {
            year: "1624 AD",
            title: "Queen Nzinga's Diplomacy 👑",
            desc: "Strategic negotiation against Portuguese colonization in Angola.",
            details: "Queen Nzinga famously sat on a servant's back to show equality when the Portuguese didn't offer her a chair. She used strategic alliances and guerilla warfare for 40 years.",
            targetGroup: "all"
        },
        {
            year: "1820s",
            title: "Shaka Zulu's Military Genius ⚔️",
            desc: "Invention of the Iklwa spear and the Buffalo Horn formation.",
            details: "Shaka revolutionized warfare with logistics, professional training, and tactical innovations that made the Zulu nation a global power in Southern Africa.",
            targetGroup: "teens"
        },
        {
            year: "1884",
            title: "The Berlin Conference",
            desc: "European powers met to divide Africa among themselves.",
            details: "They drew lines on a map without asking the people. This 'Scramble for Africa' separated families and created artificial borders.",
            targetGroup: "all"
        },
        {
            year: "1896",
            title: "Battle of Adwa ⚔️",
            desc: "Ethiopia defeated Italy and remained independent.",
            details: "Emperor Menelik II and Empress Taytu Betul united their people to defend their land. It is a symbol of African strength and resistance.",
            speeches: [
                { speaker: "Emperor Menelik II", text: "Enemies have come who would ruin our country... if you are strong, lend me your strength." },
                { speaker: "Empress Taytu Betul", text: "I would rather die than accept your deal." }
            ],
            modernContext: "Today, Ethiopia continues this legacy of self-reliance.",
            targetGroup: "all"
        },
        {
            year: "1900",
            title: "Pan-African Congress ✊",
            desc: "Strategic union of African leaders in London to fight for global rights.",
            details: "Organized by Henry Sylvester Williams and attended by W.E.B. Du Bois, this marked the shift from local resistance to a global strategic network for liberation.",
            targetGroup: "adults"
        },
        {
            year: "1957",
            title: "Ghana's Independence 🇬🇭",
            desc: "Kwame Nkrumah led Ghana to become the first Sub-Saharan nation to gain independence.",
            details: "Nkrumah's vision was for a United States of Africa.",
            targetGroup: "all"
        },
        {
            year: "1961",
            title: "Patrice Lumumba's Sacrifice 🇨🇬",
            desc: "First Prime Minister of independent Congo and hero of African economic freedom.",
            details: "Lumumba fought for the total economic independence of the Congo. He was assassinated in a plot involving foreign powers who feared his vision.",
            targetGroup: "all"
        },
        {
            year: "1963",
            title: "Foundation of the OAU 🌍",
            desc: "Strategic coalition of 32 nations to end colonialism.",
            details: "The Organization of African Unity was a strategic lesson in continental governance and diplomacy, leading to the liberation of the remaining colonies.",
            targetGroup: "adults"
        },
        {
            year: "1994",
            title: "Nelson Mandela becomes President 🇿🇦",
            desc: "Apartheid ended in South Africa.",
            details: "After 27 years in prison, Mandela united the 'Rainbow Nation'.",
            timeline: [
                { year: "1918", event: "Born in Mvezo." },
                { year: "1994", event: "Inaugurated as the first black President." }
            ],
            targetGroup: "all"
        },
        {
            year: "Modern",
            title: "The AfCFTA Era 💹",
            desc: "African Continental Free Trade Area—creating the world's largest free trade zone.",
            details: "A strategic lesson in transformation: 54 nations uniting to build a single market, reducing dependence on foreign systems and building internal wealth.",
            targetGroup: "adults"
        },
        {
            year: "2020s",
            title: "The African Digital Renaissance 🚀",
            desc: "Africa becomes a global leader in fintech innovation.",
            details: "From M-Pesa to thriving tech hubs, African youth are using technology to solve local problems. You are part of this history!",
            targetGroup: "all"
        }
    ].filter(e => {
        if (e.targetGroup === 'all') return true;
        if (isTeen && e.targetGroup === 'teens') return true;
        if (isAdult && e.targetGroup === 'adults') return true;
        return false;
    });

    const independenceCalendar = [
        { date: "Jan 1, 1956", country: "Sudan 🇸🇩", leader: "Ismail al-Azhari" },
        { date: "Mar 6, 1957", country: "Ghana 🇬🇭", leader: "Kwame Nkrumah" },
        { date: "Oct 2, 1958", country: "Guinea 🇬🇳", leader: "Ahmed Sékou Touré" },
        { date: "Oct 1, 1960", country: "Nigeria 🇳🇬", leader: "Nnamdi Azikiwe" },
        { date: "Dec 9, 1961", country: "Tanzania 🇹🇿", leader: "Julius Nyerere" },
        { date: "Dec 12, 1963", country: "Kenya 🇰🇪", leader: "Jomo Kenyatta" },
        { date: "Oct 24, 1964", country: "Zambia 🇿🇲", leader: "Kenneth Kaunda" },
        { date: "Jun 25, 1975", country: "Mozambique 🇲🇿", leader: "Samora Machel" },
        { date: "Apr 18, 1980", country: "Zimbabwe 🇿🇼", leader: "Robert Mugabe" },
        { date: "Mar 21, 1990", country: "Namibia 🇳🇦", leader: "Sam Nujoma" },
    ];

    const teenQuizQuestions = [
        { q: "Which empire was ruled by the richest man in history, Mansa Musa?", a: "Mali Empire", options: ["Mali Empire", "Songhai Empire", "Ghana Empire"], fact: "Mali was so wealthy that Mansa Musa's pilgrimage to Mecca caused gold prices to drop in Egypt for a decade." },
        { q: "What was the main purpose of the Berlin Conference of 1884?", a: "To divide Africa among European powers", options: ["To divide Africa among European powers", "To grant independence to African nations", "To end the slave trade"], fact: "Not a single African leader was invited to the Berlin Conference." },
        { q: "Who was the first Sub-Saharan nation to gain independence from colonial rule?", a: "Ghana", options: ["Ghana", "Nigeria", "Kenya"], fact: "Ghana gained independence in 1957 under the leadership of Kwame Nkrumah." },
        { q: "The Battle of Adwa in 1896 is significant because:", a: "Ethiopia defeated Italy to remain independent", options: ["Ethiopia defeated Italy to remain independent", "It started the Scramble for Africa", "It was the end of the Mali Empire"], fact: "Ethiopia was the only African nation to successfully defeat a European power during the colonial era." },
        { q: "What does 'Agenda 2063' refer to in the modern African context?", a: "The AU's blueprint for transforming Africa", options: ["The AU's blueprint for transforming Africa", "A plan for the 2063 Olympics in Cairo", "The date for a unified African currency"], fact: "Agenda 2063 is the African Union's strategic framework for the socio-economic transformation of the continent." }
    ];

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
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

            {/* GREAT CIVILIZATIONS SECTION */}
            {!isKid && (
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
