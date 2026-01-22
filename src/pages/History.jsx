import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import ResourceList from '../components/ResourceList';
import { useWallet } from '../hooks/useWallet';
import { africanResources } from '../data/africanResources';

const History = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { balance, moduleEarnings, addEarnings, deductPenalty, getModuleCap } = useWallet();
    const MODULE_CAP = getModuleCap('history');

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const isAdult = !isKid && !isTeen;

    const [expandedEvent, setExpandedEvent] = useState(null);

    // --- RESOURCE GAME STATE ---
    const [gameScore, setGameScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };
    const [wrongAttempts, setWrongAttempts] = useState(0);

    // Game Logic State
    const [showGame, setShowGame] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // --- TTS STATE ---
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    const speakText = (text) => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            return;
        }
        setIsReading(true);
        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a Nigerian voice, fallback to British, then default
        const voices = window.speechSynthesis.getVoices();
        const nigerianVoice = voices.find(v => v.lang.includes('NG') || v.name.includes('Nigeria'));
        const britishVoice = voices.find(v => v.lang.includes('en-GB'));

        if (nigerianVoice) {
            utterance.voice = nigerianVoice;
        } else if (britishVoice) {
            utterance.voice = britishVoice;
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
            showToast(`Correct! 🎉\n\nDid you know? ${currentQuestion.fact}\n\n(+₦100)`, 'success');
        } else {
            const newAttempts = wrongAttempts + 1;
            setWrongAttempts(newAttempts);

            if (newAttempts >= 3) {
                deductPenalty('history', 100);
                setWrongAttempts(0);
                showToast(`⚠️ 3 Wrong Attempts! A penalty of ₦100 has been deducted from your History wallet.\n\nCorrect Answer: ${currentQuestion.correct}\nFact: ${currentQuestion.fact}`, 'error');
            } else {
                showToast(`Oops! ${currentQuestion.resource} is found in ${currentQuestion.correct}.\nFact: ${currentQuestion.fact}\n(Warning: ${newAttempts}/3 wrong attempts)`, 'warning');
            }
        }

        // Move to next question
        const nextIndex = currentIndex + 1;

        if (nextIndex < shuffledQuestions.length) {
            setCurrentIndex(nextIndex);
            generateQuestion(shuffledQuestions[nextIndex]);
        } else {
            showToast(`Game Over! You've toured all of Africa! 🌍\nFinal Score: ${gameScore + (isCorrect ? 1 : 0)}/${shuffledQuestions.length}`, 'success');
            setShowGame(false);
            setShuffledQuestions([]); // Reset for next time
        }
    };

    const events = [
        {
            year: "3000 BC",
            title: "The Pyramids of Giza",
            desc: "Ancient Egyptians built the pyramids using advanced math and engineering.",
            details: "The Great Pyramid was the tallest man-made structure for over 3,800 years. It shows the incredible genius of African ancestors."
        },
        {
            year: "1324 AD",
            title: "Mansa Musa's Pilgrimage",
            desc: "The Emperor of Mali, the richest man in history, traveled to Mecca.",
            details: "He brought so much gold that he changed the economy of every city he visited. Timbuktu became a global center of learning."
        },
        {
            year: "1884",
            title: "The Berlin Conference",
            desc: "European powers met to divide Africa among themselves, creating artificial borders.",
            details: "They drew lines on a map without asking the people. This separated families and tribes, creating problems that still exist today. This was the 'Scramble for Africa'."
        },
        {
            year: "1896",
            title: "Battle of Adwa ⚔️",
            desc: "Ethiopia defeated Italy and remained independent.",
            details: "Emperor Menelik II and Empress Taytu Betul united their people to defend their land. It is a symbol of African strength and resistance.",
            speeches: [
                { speaker: "Emperor Menelik II", text: "Enemies have come who would ruin our country and change our religion. They have passed the sea... I have no intention of being indifferent when my country is attacked. Up to now I have ruled by the grace of God... if you are strong, lend me your strength. If you are weak, help me with your prayer." },
                { speaker: "Empress Taytu Betul", text: "I am a woman. I do not like war. But I would rather die than accept your deal." }
            ],
            modernContext: "Today, Ethiopia continues this legacy of self-reliance with the Grand Ethiopian Renaissance Dam (GERD), a massive hydroelectric project fully funded by the Ethiopian people."
        },
        {
            year: "1957",
            title: "Ghana's Independence 🇬🇭",
            desc: "Kwame Nkrumah led Ghana to become the first Sub-Saharan nation to gain independence.",
            details: "On March 6, 1957, the Gold Coast became Ghana. Nkrumah's vision was for a United States of Africa.",
            speeches: [
                { speaker: "Kwame Nkrumah", text: "At long last, the battle has ended! And thus, Ghana, your beloved country is free forever!" },
                { speaker: "Kwame Nkrumah", text: "Our independence is meaningless unless it is linked up with the total liberation of the African continent." }
            ],
            keyPlayers: ["Kwame Nkrumah", "The Big Six"]
        },
        {
            year: "1960",
            title: "The Year of Africa",
            desc: "17 African nations gained independence in a single year!",
            details: "A wave of freedom swept across the continent, ending colonial rule in many places."
        },
        {
            year: "1994",
            title: "Nelson Mandela becomes President 🇿🇦",
            desc: "Apartheid ended in South Africa.",
            details: "After 27 years in prison, Mandela forgave his captors and united the 'Rainbow Nation'.",
            timeline: [
                { year: "1918", event: "Born in Mvezo, South Africa." },
                { year: "1964", event: "Sentenced to life in prison at the Rivonia Trial." },
                { year: "1990", event: "Released from Victor Verster Prison." },
                { year: "1994", event: "Inaugurated as the first black President of South Africa." }
            ],
            speeches: [
                { speaker: "Nelson Mandela (1964)", text: "I have cherished the ideal of a democratic and free society... It is an ideal which I hope to live for and to achieve. But if needs be, it is an ideal for which I am prepared to die." },
                { speaker: "Nelson Mandela (1994)", text: "Never, never and never again shall it be that this beautiful land will again experience the oppression of one by another." }
            ]
        },
        {
            year: "2002",
            title: "The African Union (AU)",
            desc: "African leaders united to promote peace, unity, and economic growth.",
            details: "Replacing the OAU, the AU focuses on 'African Solutions to African Problems'. It represents the reversing of the division caused by the Berlin Conference."
        }
    ];

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

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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
                                    <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                                        {currentQuestion.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleGameAnswer(opt)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.75rem' }}
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
