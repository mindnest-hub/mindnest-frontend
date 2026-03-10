import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';

// 7 games in sequence — all must be completed to unlock rewards
const GAMES = [
    {
        id: 1,
        type: 'intro',
        emoji: '🏫',
        title: 'Welcome, Future Captain!',
        subtitle: 'Complete all 7 challenges to win your Civic Badge and rewards!',
    },
    {
        id: 2,
        type: 'vote',
        emoji: '🗳️',
        title: 'Game 1: Cast Your Vote',
        instruction: 'Election day! Read each candidate\'s promise carefully and choose the BEST captain for your class.',
        candidates: [
            { name: 'Emeka', promise: 'I will make sure everyone shares their lunch resources.', icon: '🥪', isBest: false, reason: 'Sharing resources sounds good, but resources aren\'t always equal!' },
            { name: 'Amina', promise: 'I will listen to everyone\'s ideas and keep the class fair.', icon: '👂', isBest: true, reason: 'A captain who LISTENS and keeps things FAIR is exactly what a community needs!' },
            { name: 'Olu', promise: 'I will make all the decisions so the class doesn\'t argue.', icon: '👊', isBest: false, reason: 'Making all decisions alone isn\'t leadership — it\'s bossiness!' }
        ]
    },
    {
        id: 3,
        type: 'fairness',
        emoji: '⚖️',
        title: 'Game 2: The Fairness Test',
        instruction: 'Judge each situation — Is it FAIR or UNFAIR?',
        scenarios: [
            { text: 'Only the tallest kids get to play on the swings.', fair: false },
            { text: 'Everyone takes turns cleaning the classroom.', fair: true },
            { text: 'The captain gives extra marks to their best friends.', fair: false },
        ]
    },
    {
        id: 4,
        type: 'rulemaker',
        emoji: '📋',
        title: 'Game 3: Rule Maker',
        instruction: 'Your class needs a new rule. Pick the BEST one!',
        question: 'Which rule makes your class the strongest community?',
        options: [
            { text: '🙋 Everyone has the right to be heard in class discussions.', correct: true, reason: 'This protects everyone\'s voice — that\'s a great rule!' },
            { text: '😎 Only the coolest students can sit at the front.', correct: false, reason: 'That\'s unfair! Seating should never be based on popularity.' },
            { text: '🤫 Nobody is allowed to ask questions.', correct: false, reason: 'Questions are how we learn! That rule would hurt everyone.' }
        ]
    },
    {
        id: 5,
        type: 'leader_quiz',
        emoji: '🦁',
        title: 'Game 4: Leader vs. Bully',
        instruction: 'Can you tell the difference between a LEADER and a BULLY?',
        scenarios: [
            { text: 'A student speaks up for a kid who is being teased.', isLeader: true },
            { text: 'Someone takes the last chair and doesn\'t let others sit.', isLeader: false },
            { text: 'The captain shares chores equally between all team members.', isLeader: true },
            { text: 'A student threatens others to make them do their homework.', isLeader: false },
        ]
    },
    {
        id: 6,
        type: 'community_choice',
        emoji: '🌍',
        title: 'Game 5: Community Builder',
        instruction: 'You are the class captain! A new student joins and looks lonely. What do you do?',
        options: [
            { text: '😬 Ignore them — your friend group is already full.', correct: false, reason: 'A leader never leaves someone out.' },
            { text: '👋 Welcome them, show them around, and introduce them to others.', correct: true, reason: 'That\'s EXACTLY what a community builder does!' },
            { text: '😂 Joke about them to make the class laugh.', correct: false, reason: 'This is bullying, not leadership.' }
        ]
    },
    {
        id: 7,
        type: 'debate',
        emoji: '🎤',
        title: 'Game 6: The Class Debate',
        instruction: 'Two students disagree on where to go for a class trip. As captain, what do you do?',
        options: [
            { text: '😤 Choose your favourite option and ignore everyone else.', correct: false, reason: 'Ignoring others creates conflict.' },
            { text: '🗳️ Hold a class vote so everyone has a say.', correct: true, reason: 'Democracy in action! Let the majority decide.' },
            { text: '🤷 Say "I don\'t care" and walk away.', correct: false, reason: 'Leaders can\'t avoid responsibility.' }
        ]
    },
    {
        id: 8,
        type: 'oath',
        emoji: '🏆',
        title: 'Game 7: Take the Captain\'s Oath',
        instruction: 'A true captain makes a promise to their community. Read this oath out loud!',
        oath: [
            '🗳️ I will always listen before I speak.',
            '⚖️ I will treat everyone fairly, no matter who they are.',
            '🤝 I will help my classmates and stand up for what is right.',
            '📢 I will use my voice to help, not to hurt.',
            '🌱 I will make my community a better place — starting today.'
        ]
    }
];

const ProgressBar = ({ current, total }) => (
    <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
            <span>Progress</span>
            <span>{current} / {total} Games</span>
        </div>
        <div style={{ height: '8px', backgroundColor: '#222', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
                width: `${(current / total) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2196F3, #9C27B0)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
            }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {GAMES.slice(1).map((g, i) => (
                <span key={g.id} style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                    backgroundColor: i < current ? '#2196F3' : '#222',
                    border: i < current ? 'none' : '1px solid #333',
                    transition: 'all 0.3s'
                }}>
                    {i < current ? '✅' : g.emoji}
                </span>
            ))}
        </div>
    </div>
);

// ---- Sub-game Components ----

const VoteGame = ({ game, onNext }) => {
    const [selected, setSelected] = useState(null);
    const pick = (c) => { if (!selected) setSelected(c); };
    return (
        <div>
            <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>{game.instruction}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {game.candidates.map(c => {
                    const isSelected = selected?.name === c.name;
                    const showResult = !!selected;
                    let border = '#333';
                    if (showResult && c.isBest) border = '#00C851';
                    else if (showResult && isSelected && !c.isBest) border = '#FF4444';
                    return (
                        <button key={c.name} onClick={() => pick(c)} disabled={!!selected}
                            style={{
                                backgroundColor: '#1a1a1a', border: `2px solid ${border}`,
                                borderRadius: '12px', padding: '1rem', textAlign: 'left',
                                cursor: selected ? 'default' : 'pointer', color: '#fff', fontFamily: 'inherit',
                                transition: 'all 0.2s'
                            }}>
                            <span style={{ fontSize: '1.4rem', marginRight: '0.75rem' }}>{c.icon}</span>
                            <strong>{c.name}</strong>
                            <p style={{ color: '#aaa', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>"{c.promise}"</p>
                        </button>
                    );
                })}
            </div>
            {selected && (
                <div style={{
                    backgroundColor: selected.isBest ? 'rgba(0,200,81,0.1)' : 'rgba(255,68,68,0.1)',
                    border: `1px solid ${selected.isBest ? '#00C851' : '#FF4444'}`,
                    borderRadius: '12px', padding: '1rem', marginBottom: '1rem', animation: 'popIn 0.3s ease'
                }}>
                    <strong style={{ color: selected.isBest ? '#00C851' : '#FF9800' }}>
                        {selected.isBest ? '🎉 Great Choice!' : '🤔 Not the best pick—'}
                    </strong>
                    <p style={{ color: '#ccc', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>{selected.reason}</p>
                </div>
            )}
            {selected && <button onClick={onNext} className="btn" style={{ width: '100%', backgroundColor: '#2196F3', color: 'white' }}>Next Challenge ➡️</button>}
        </div>
    );
};

const FairnessGame = ({ game, onNext }) => {
    const [answers, setAnswers] = useState({});
    const allDone = Object.keys(answers).length === game.scenarios.length;
    const handleAnswer = (idx, choice) => {
        if (answers[idx] !== undefined) return;
        setAnswers(prev => ({ ...prev, [idx]: choice }));
    };
    return (
        <div>
            <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>{game.instruction}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {game.scenarios.map((s, i) => {
                    const ans = answers[i];
                    const answered = ans !== undefined;
                    const correct = answered && ans === s.fair;
                    return (
                        <div key={i} style={{
                            backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1rem',
                            border: `1px solid ${answered ? (correct ? '#00C851' : '#FF4444') : '#333'}`
                        }}>
                            <p style={{ color: '#fff', margin: '0 0 1rem' }}>{s.text}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {[true, false].map(val => (
                                    <button key={String(val)} onClick={() => handleAnswer(i, val)} disabled={answered}
                                        style={{
                                            backgroundColor: answered && val === s.fair ? 'rgba(0,200,81,0.2)' : answered && answers[i] === val && !correct ? 'rgba(255,68,68,0.2)' : '#111',
                                            border: `1px solid ${answered && val === s.fair ? '#00C851' : '#333'}`,
                                            borderRadius: '8px', padding: '0.6rem',
                                            color: '#fff', cursor: answered ? 'default' : 'pointer', fontFamily: 'inherit', fontWeight: 'bold'
                                        }}>
                                        {val ? '✅ Fair' : '❌ Unfair'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {allDone && <button onClick={onNext} className="btn" style={{ width: '100%', backgroundColor: '#2196F3', color: 'white' }}>Next Challenge ➡️</button>}
        </div>
    );
};

const ChoiceGame = ({ game, onNext }) => {
    const [selected, setSelected] = useState(null);
    return (
        <div>
            <p style={{ color: '#ccc', marginBottom: '0.75rem' }}>{game.instruction}</p>
            {game.question && <p style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '1.5rem' }}>{game.question}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {game.options.map((opt, i) => {
                    const isSelected = selected === i;
                    let border = '#333';
                    if (selected !== null) {
                        if (opt.correct) border = '#00C851';
                        else if (isSelected) border = '#FF4444';
                    }
                    return (
                        <button key={i} onClick={() => { if (selected === null) setSelected(i); }} disabled={selected !== null}
                            style={{
                                backgroundColor: '#1a1a1a', border: `2px solid ${border}`,
                                borderRadius: '12px', padding: '1rem', textAlign: 'left',
                                cursor: selected !== null ? 'default' : 'pointer', color: '#fff', fontFamily: 'inherit',
                                transition: 'all 0.2s'
                            }}>
                            {opt.text}
                        </button>
                    );
                })}
            </div>
            {selected !== null && (
                <div style={{
                    backgroundColor: game.options[selected].correct ? 'rgba(0,200,81,0.1)' : 'rgba(255,68,68,0.1)',
                    border: `1px solid ${game.options[selected].correct ? '#00C851' : '#FF4444'}`,
                    borderRadius: '12px', padding: '1rem', marginBottom: '1rem', animation: 'popIn 0.3s ease'
                }}>
                    <strong style={{ color: game.options[selected].correct ? '#00C851' : '#FF9800' }}>
                        {game.options[selected].correct ? '🎉 Correct!' : '🤔 Not ideal—'}
                    </strong>
                    <p style={{ color: '#ccc', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>{game.options[selected].reason}</p>
                </div>
            )}
            {selected !== null && <button onClick={onNext} className="btn" style={{ width: '100%', backgroundColor: '#2196F3', color: 'white' }}>Next Challenge ➡️</button>}
        </div>
    );
};

const LeaderBullyGame = ({ game, onNext }) => {
    const [answers, setAnswers] = useState({});
    const allDone = Object.keys(answers).length === game.scenarios.length;
    const handleAnswer = (idx, choice) => {
        if (answers[idx] !== undefined) return;
        setAnswers(prev => ({ ...prev, [idx]: choice }));
    };
    return (
        <div>
            <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>{game.instruction}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {game.scenarios.map((s, i) => {
                    const ans = answers[i];
                    const answered = ans !== undefined;
                    const correct = answered && ans === s.isLeader;
                    return (
                        <div key={i} style={{
                            backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1rem',
                            border: `1px solid ${answered ? (correct ? '#00C851' : '#FF4444') : '#333'}`
                        }}>
                            <p style={{ color: '#fff', margin: '0 0 1rem' }}>{s.text}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {[true, false].map(val => (
                                    <button key={String(val)} onClick={() => handleAnswer(i, val)} disabled={answered}
                                        style={{
                                            backgroundColor: answered && val === s.isLeader ? 'rgba(0,200,81,0.2)' : answered && answers[i] === val && !correct ? 'rgba(255,68,68,0.2)' : '#111',
                                            border: `1px solid ${answered && val === s.isLeader ? '#00C851' : '#333'}`,
                                            borderRadius: '8px', padding: '0.6rem',
                                            color: '#fff', cursor: answered ? 'default' : 'pointer', fontFamily: 'inherit', fontWeight: 'bold'
                                        }}>
                                        {val ? '🦁 Leader' : '😤 Bully'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {allDone && <button onClick={onNext} className="btn" style={{ width: '100%', backgroundColor: '#2196F3', color: 'white' }}>Next Challenge ➡️</button>}
        </div>
    );
};

const OathGame = ({ onNext }) => {
    const [checked, setChecked] = useState({});
    const oathLines = GAMES[7].oath;
    const allChecked = Object.keys(checked).length === oathLines.length;
    return (
        <div>
            <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>Tap each promise once you've read it out loud! 🗣️</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {oathLines.map((line, i) => (
                    <button key={i} onClick={() => setChecked(prev => ({ ...prev, [i]: true }))}
                        style={{
                            backgroundColor: checked[i] ? 'rgba(0,200,81,0.15)' : '#1a1a1a',
                            border: `2px solid ${checked[i] ? '#00C851' : '#333'}`,
                            borderRadius: '12px', padding: '1rem', textAlign: 'left',
                            cursor: 'pointer', color: checked[i] ? '#00C851' : '#ddd',
                            fontFamily: 'inherit', fontSize: '1rem', fontWeight: checked[i] ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}>
                        {checked[i] ? '✅ ' : ''}{line}
                    </button>
                ))}
            </div>
            {allChecked && (
                <button onClick={onNext} className="btn" style={{ width: '100%', backgroundColor: '#00C851', color: 'white', fontSize: '1.1rem' }}>
                    🎓 Claim My Badge & Rewards!
                </button>
            )}
        </div>
    );
};

// ---- Main Component ----
const ClassCaptainSimulator = ({ onComplete }) => {
    const { addEarnings } = useWallet();
    const { addPoints } = useGamification();
    const [step, setStep] = useState(0); // 0 = intro, 1-6 = games, 7 = oath, 8 = complete
    const [showConfetti, setShowConfetti] = useState(false);

    const advance = () => setStep(s => s + 1);

    const handleClaim = () => {
        addEarnings('civics', 300);
        addPoints(100);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setStep(8);
        onComplete();
    };

    const currentGame = GAMES[step] || null;
    const gamesCompleted = Math.max(0, step - 1); // step 0 = intro, step 1 = game 1 done, etc.

    return (
        <div className="card" style={{ borderTop: '4px solid #2196F3', maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
            {showConfetti && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    pointerEvents: 'none', zIndex: 99999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '5rem', gap: '1rem', animation: 'bounce 0.5s'
                }}>🎊 🏆 🎉</div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem' }}>{currentGame?.emoji || '🏆'}</span>
                <div>
                    <h2 style={{ color: '#2196F3', margin: 0, fontSize: '1.3rem' }}>
                        {step === 8 ? '🎓 Civic Badge Earned!' : currentGame?.title}
                    </h2>
                    {step > 0 && step < 8 && (
                        <span style={{ color: '#888', fontSize: '0.8rem' }}>Complete all 7 to unlock rewards 🔒</span>
                    )}
                </div>
            </div>

            {/* Progress (after intro) */}
            {step > 0 && step < 8 && (
                <ProgressBar current={gamesCompleted} total={GAMES.length - 1} />
            )}

            {/* === INTRO === */}
            {step === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem 0', animation: 'popIn 0.4s ease' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏫</div>
                    <h3 style={{ color: '#FFD700', marginBottom: '0.75rem' }}>Welcome, Future Class Captain!</h3>
                    <p style={{ color: '#ccc', marginBottom: '1rem' }}>
                        You must complete <strong style={{ color: '#2196F3' }}>all 7 civic challenges</strong> to earn your Captain's Badge and rewards.
                    </p>
                    <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', border: '1px solid #333' }}>
                        <p style={{ color: '#FFD700', fontWeight: 'bold', margin: '0 0 0.75rem' }}>🔒 Rewards Locked Until You Finish All 7 Games:</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem' }}>💰</div>
                                <div style={{ color: '#00C851', fontWeight: 'bold' }}>+₦300</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem' }}>⭐</div>
                                <div style={{ color: '#FFD700', fontWeight: 'bold' }}>+100 XP</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem' }}>🏅</div>
                                <div style={{ color: '#2196F3', fontWeight: 'bold' }}>Civic Badge</div>
                            </div>
                        </div>
                    </div>
                    <button onClick={advance} className="btn" style={{ backgroundColor: '#2196F3', color: 'white', fontSize: '1.1rem', padding: '1rem 3rem' }}>
                        Start Challenge 🚀
                    </button>
                </div>
            )}

            {/* === GAMES 1–6 === */}
            {step === 1 && <VoteGame game={GAMES[1]} onNext={advance} />}
            {step === 2 && <FairnessGame game={GAMES[2]} onNext={advance} />}
            {step === 3 && <ChoiceGame game={GAMES[3]} onNext={advance} />}
            {step === 4 && <LeaderBullyGame game={GAMES[4]} onNext={advance} />}
            {step === 5 && <ChoiceGame game={GAMES[5]} onNext={advance} />}
            {step === 6 && <ChoiceGame game={GAMES[6]} onNext={advance} />}

            {/* === GAME 7: OATH === */}
            {step === 7 && (
                <div style={{ animation: 'popIn 0.4s ease' }}>
                    <ProgressBar current={6} total={GAMES.length - 1} />
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '3rem' }}>🎤</div>
                        <h3 style={{ color: '#FFD700' }}>Game 7: Take the Captain's Oath</h3>
                    </div>
                    <OathGame onNext={handleClaim} />
                </div>
            )}

            {/* === COMPLETE === */}
            {step === 8 && (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'popIn 0.5s ease' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
                    <h2 style={{ color: '#FFD700', marginBottom: '0.5rem' }}>Civic Champion!</h2>
                    <p style={{ color: '#ccc', marginBottom: '2rem' }}>
                        You completed all 7 challenges. Your rewards have been unlocked!
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,200,81,0.1)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #00C851' }}>
                            <div style={{ fontSize: '2rem' }}>💰</div>
                            <div style={{ color: '#00C851', fontWeight: 'bold', fontSize: '1.3rem' }}>+₦300</div>
                        </div>
                        <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,213,0,0.1)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #FFD700' }}>
                            <div style={{ fontSize: '2rem' }}>⭐</div>
                            <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.3rem' }}>+100 XP</div>
                        </div>
                        <div style={{ textAlign: 'center', backgroundColor: 'rgba(33,150,243,0.1)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #2196F3' }}>
                            <div style={{ fontSize: '2rem' }}>🏅</div>
                            <div style={{ color: '#2196F3', fontWeight: 'bold', fontSize: '1.3rem' }}>Civic Badge</div>
                        </div>
                    </div>
                    <button onClick={() => setStep(0)} className="btn btn-outline" style={{ color: '#2196F3', borderColor: '#2196F3' }}>
                        🔄 Play Again
                    </button>
                </div>
            )}

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    80% { transform: scale(1.02); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
};

export default ClassCaptainSimulator;
