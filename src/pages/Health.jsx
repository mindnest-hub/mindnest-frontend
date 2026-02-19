import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useWallet } from '../hooks/useWallet';
import { bodyHealthData } from '../data/bodyHealthData';

// --- KIDS WELLNESS COMPONENTS (10 SEQUENTIAL GAMES) ---

const KidsWellnessHub = ({ onComplete }) => {
    // Progress Key: { 'gameId': currentLevel (0=Locked, 1=Lvl1, 2=Lvl2, 3=Lvl3, 4=Done) }
    const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem('kidsHealthProgress')) || {});
    const [activeGame, setActiveGame] = useState(null);
    const { addEarnings, balance } = useWallet();

    const games = [
        { id: 'food_sort', name: 'Food Sorter', icon: '🍎', color: '#FF4444' },
        { id: 'super_plate', name: 'Super Plate', icon: '🍽️', color: '#FFBB33' },
        { id: 'sparkle_teeth', name: 'Sparkle Teeth', icon: '🦷', color: '#33b5e5' },
        { id: 'hand_wash', name: 'Hand Wash', icon: '🧼', color: '#00C851' },
        { id: 'move_groove', name: 'African Dance', icon: '💃', color: '#FF8800' },
        { id: 'sleep_catch', name: 'Sleep Catcher', icon: '😴', color: '#AA66CC' },
        { id: 'mood_detect', name: 'Mood Detective', icon: '😊', color: '#FFD700' },
        { id: 'safe_shield', name: 'Safety Shield', icon: '🛡️', color: '#CC0000' },
        { id: 'kind_connect', name: 'Ubuntu Spirit', icon: '🤝', color: '#2BBBAD' },
        { id: 'mind_cloud', name: 'Baobab Reflection', icon: '🌳', color: '#9933CC' },
    ];

    useEffect(() => {
        localStorage.setItem('kidsHealthProgress', JSON.stringify(progress));
    }, [progress]);

    const handleLevelComplete = (gameId, level) => {
        const reward = level === 1 ? 20 : level === 2 ? 30 : 50; // Total 100 per game
        addEarnings('health', reward);

        setProgress(prev => {
            const current = prev[gameId] || 0;
            if (current < level) {
                return { ...prev, [gameId]: level };
            }
            return prev;
        });

        if (level === 3) {
            setTimeout(() => setActiveGame(null), 1500);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            {/* Header with Balance for Kids */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '15px', marginBottom: '2rem',
                border: '2px solid #FFD700', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)'
            }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#FFD700' }}>
                    My Wallet: ₦{balance?.toLocaleString()}
                </div>
                <div style={{ fontSize: '1.2rem' }}>
                    Total Stars: {Object.values(progress).reduce((a, b) => a + b, 0)}/30 🌟
                </div>
            </div>

            {activeGame ? (
                <WellnessGameModal
                    key={`${activeGame}-${(progress[activeGame] || 0) + 1}`} // FORCE RESET ON LEVEL CHANGE
                    game={games.find(g => g.id === activeGame)}
                    currentLevel={(progress[activeGame] || 0) + 1}
                    onClose={() => setActiveGame(null)}
                    onComplete={(lvl) => handleLevelComplete(activeGame, lvl)}
                />
            ) : (
                <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                    {games.map((g, index) => {
                        const level = progress[g.id] || 0;
                        // Unlocking Logic: Game 0 is always unlocked. Game N unlocks if Game N-1 has level >= 1.
                        const isLocked = index > 0 && (progress[games[index - 1].id] || 0) < 1;
                        const stars = level >= 3 ? "⭐⭐⭐" : level >= 2 ? "⭐⭐" : level >= 1 ? "⭐" : "";

                        return (
                            <div key={g.id}
                                onClick={() => !isLocked && setActiveGame(g.id)}
                                className="card"
                                style={{
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    textAlign: 'center',
                                    backgroundColor: level >= 3 ? 'rgba(0,200,81,0.2)' : 'var(--color-surface)',
                                    border: level >= 3 ? '2px solid #00C851' : '1px solid #333',
                                    opacity: isLocked ? 0.5 : 1,
                                    position: 'relative',
                                    transform: isLocked ? 'none' : 'scale(1)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => !isLocked && (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => !isLocked && (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {isLocked && (
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem' }}>🔒</div>
                                )}
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem', filter: isLocked ? 'grayscale(100%)' : 'none' }}>{g.icon}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{g.name}</div>
                                <div style={{ color: '#FFD700', fontSize: '0.8rem', height: '1.2rem' }}>{stars}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// MINI GAMES WRAPPER & LOGIC
const WellnessGameModal = ({ game, currentLevel, onClose, onComplete }) => {
    const [showIntro, setShowIntro] = useState(game.id === 'food_sort' && currentLevel === 1);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameScore, setGameScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, won, lost

    useEffect(() => {
        if (showIntro || gameState !== 'playing') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    const handleTimeUp = () => {
        // Simple generic win condition for kids
        const target = currentLevel * 5;
        let success = false;
        if (['food_sort', 'sleep_catch', 'sparkle_teeth', 'hand_wash', 'move_groove'].includes(game.id)) {
            success = gameScore >= (currentLevel * 3);
        } else if (['super_plate'].includes(game.id)) {
            success = gameScore >= 1;
        } else if (['mood_detect'].includes(game.id)) {
            success = gameScore >= 2;
        } else if (['safe_shield'].includes(game.id)) {
            success = gameScore >= 1;
        } else if (['kind_connect', 'mind_cloud'].includes(game.id)) {
            success = gameScore >= (currentLevel * 2);
        } else {
            success = true; // Fallback
        }

        if (success) {
            setGameState('won');
        } else {
            setGameState('lost');
        }
    };

    const handleScoreUpdate = (newScore) => {
        if (gameState === 'playing' && !showIntro) setGameScore(newScore);
    };

    if (showIntro) {
        return (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s', padding: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍎🥦</div>
                <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Eat Healthy to be Strong!</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6', color: '#fff' }}>
                    Eating good food like yams, fruits, and veggies gives you energy to play, run, and learn!
                    <br /><br />
                    Avoid too much sugar so your teeth stay shiny and your brain stays sharp!
                </p>
                <button onClick={() => setShowIntro(false)} className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                    I'm Ready! 🚀
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onClose} className="btn btn-sm">❌ Exit</button>
                <div style={{ fontWeight: 'bold' }}>Level {currentLevel}</div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', backgroundColor: timeLeft < 5 ? '#ff4444' : '#333', color: '#fff' }}>
                    ⏱️ {timeLeft}s
                </div>
            </div>

            <div style={{ marginBottom: '1rem', width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px' }}>
                <div style={{ width: `${(timeLeft / 15) * 100}%`, height: '100%', backgroundColor: game.color, transition: 'width 1s linear' }}></div>
            </div>

            {gameState === 'playing' ? (
                <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem' }}>{game.name}</h3>
                    <RenderGame gameId={game.id} level={currentLevel} onScore={handleScoreUpdate} />
                </div>
            ) : gameState === 'won' ? (
                <div style={{ padding: '2rem' }}>
                    <div style={{ fontSize: '4rem' }}>🌟</div>
                    <h3>Level Complete!</h3>
                    <p>Score: {gameScore}</p>
                    <button onClick={() => onComplete(currentLevel)} className="btn btn-primary">Collect Reward 💰</button>
                </div>
            ) : (
                <div style={{ padding: '2rem' }}>
                    <div style={{ fontSize: '4rem' }}>⏰</div>
                    <h3>Time's Up!</h3>
                    <p>You didn't reach the target. Try again!</p>
                    <button onClick={() => { setTimeLeft(15); setGameScore(0); setGameState('playing'); }} className="btn btn-outline">Try Again 🔄</button>
                </div>
            )}
        </div>
    );
};

// MINI GAME COMPONENT RENDERER (Keep existing kids games)
const RenderGame = ({ gameId, level, onScore }) => {
    switch (gameId) {
        case 'food_sort': return <GameFoodSorter level={level} updateScore={onScore} />;
        case 'super_plate': return <GameSuperPlate level={level} updateScore={onScore} />;
        case 'sparkle_teeth': return <GameSparkleTeeth level={level} updateScore={onScore} />;
        case 'hand_wash': return <GameHandWash level={level} updateScore={onScore} />;
        case 'move_groove': return <GameMoveGroove level={level} updateScore={onScore} />;
        case 'sleep_catch': return <GameSleepCatch level={level} updateScore={onScore} />;
        case 'mood_detect': return <GameMoodDetect level={level} updateScore={onScore} />;
        case 'safe_shield': return <GameSafeShield level={level} updateScore={onScore} />;
        case 'kind_connect': return <GameKindConnect level={level} updateScore={onScore} />;
        case 'mind_cloud': return <GameMindCloud level={level} updateScore={onScore} />;
        default: return <div>Game Loading...</div>;
    }
};

// ... Include all existing game components (GameFoodSorter, GameSuperPlate, etc.) here ...
// To save space and avoid redundancy error, I'll copy the kids game components exactly as they were.
// However, since I'm overwriting, I MUST include them.

const GameFoodSorter = ({ level, updateScore }) => {
    const [score, setScore] = useState(0);
    const items = level === 1 ? [{ n: '🍠', t: 'good' }, { n: '🍔', t: 'bad' }] :
        level === 2 ? [{ n: '🥭', t: 'good' }, { n: '🍬', t: 'bad' }] :
            [{ n: '🐟', t: 'protein' }, { n: '🍞', t: 'carb' }];

    const handleTap = (type) => {
        if (type === 'good' || type === 'protein') {
            const newScore = score + 1;
            setScore(newScore);
            updateScore(newScore);
        }
    };

    return (
        <div>
            <h4>Tap the Healthy Food!</h4>
            <div style={{ fontSize: '2rem', margin: '1rem' }}>Score: {score}</div>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <button onClick={() => handleTap(items[0].t)} className="btn" style={{ fontSize: '3rem' }}>{items[0].n}</button>
                <button onClick={() => handleTap(items[1].t)} className="btn" style={{ fontSize: '3rem' }}>{items[1].n}</button>
            </div>
        </div>
    );
};

const GameSuperPlate = ({ level, updateScore }) => {
    const [plate, setPlate] = useState({ protein: 0, carbs: 0, veg: 0 });
    const targetCount = level === 1 ? 3 : level === 2 ? 5 : 7;
    const foods = {
        carbs: ['🍠', '🍚', '🥖', '🍝', '🌽'],
        protein: ['🐟', '🍗', '🥚', '🥩', '🥜'],
        veg: ['🥬', '🥕', '🥦', '🍅', '🧅']
    };

    const addToPlate = (type) => {
        const total = plate.protein + plate.carbs + plate.veg;
        if (total < targetCount) {
            const newPlate = { ...plate, [type]: plate[type] + 1 };
            setPlate(newPlate);
            checkWin(newPlate);
        }
    };

    const checkWin = (currentPlate) => {
        const total = currentPlate.protein + currentPlate.carbs + currentPlate.veg;
        if (total >= targetCount) {
            let win = false;
            if (level === 1) win = true;
            else if (level === 2) win = currentPlate.protein >= 1;
            else if (level === 3) win = currentPlate.protein >= 1 && currentPlate.veg >= 1;
            if (win) updateScore(1);
        }
    };

    const resetPlate = () => {
        setPlate({ protein: 0, carbs: 0, veg: 0 });
        updateScore(0);
    };

    const Instructions = () => {
        if (level === 1) return "Add any 3 tasty items!";
        if (level === 2) return "Add 5 items (Include Protein 🐟)!";
        return "Add 7 items (Protein 🐟 + Veggies 🥬)!";
    };

    return (
        <div style={{ padding: '0 1rem' }}>
            <h4 style={{ color: '#FFD700' }}>{Instructions()}</h4>
            <div style={{
                width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#fff',
                margin: '1rem auto', position: 'relative', border: '8px solid #ddd',
                display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', maxWidth: '80%' }}>
                    {[...Array(plate.carbs)].map((_, i) => <span key={`c${i}`}>🍚</span>)}
                    {[...Array(plate.protein)].map((_, i) => <span key={`p${i}`}>🐟</span>)}
                    {[...Array(plate.veg)].map((_, i) => <span key={`v${i}`}>🥬</span>)}
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Carbs</div>
                    {foods.carbs.slice(0, 3).map(f => (
                        <button key={f} onClick={() => addToPlate('carbs')} className="btn btn-sm btn-outline" style={{ margin: '2px', fontSize: '1.2rem' }}>{f}</button>
                    ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Protein</div>
                    {foods.protein.slice(0, 3).map(f => (
                        <button key={f} onClick={() => addToPlate('protein')} className="btn btn-sm btn-outline" style={{ margin: '2px', fontSize: '1.2rem' }}>{f}</button>
                    ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Veggies</div>
                    {foods.veg.slice(0, 3).map(f => (
                        <button key={f} onClick={() => addToPlate('veg')} className="btn btn-sm btn-outline" style={{ margin: '2px', fontSize: '1.2rem' }}>{f}</button>
                    ))}
                </div>
            </div>
            <button onClick={resetPlate} className="btn btn-sm" style={{ opacity: 0.7 }}>Reset Plate 🔄</button>
        </div>
    );
};

const GameSparkleTeeth = ({ level, updateScore }) => {
    const [clicks, setClicks] = useState(0);
    const brush = () => {
        const newC = clicks + 1;
        setClicks(newC);
        updateScore(newC);
    };
    return (
        <div>
            <h4>Brush Fast!</h4>
            <div style={{ fontSize: '4rem', margin: '1rem', cursor: 'pointer' }} onClick={brush}>
                {clicks % 2 === 0 ? '🦷' : '✨'}
            </div>
            <p>Score: {clicks}</p>
        </div>
    );
};

const GameHandWash = ({ level, updateScore }) => {
    const [progress, setProgress] = useState(0);
    const scrub = () => {
        const p = progress + 1;
        setProgress(p);
        updateScore(p);
    };
    return (
        <div>
            <h4>Scrub those hands! 🧼</h4>
            <div style={{ fontSize: '4rem', margin: '1rem', cursor: 'pointer' }} onClick={scrub}>
                {progress % 2 === 0 ? '👐' : '🫧'}
            </div>
            <p>Scrubs: {progress}</p>
        </div>
    );
};

const GameMoveGroove = ({ level, updateScore }) => {
    const target = ['💃', '🙌', '👏'][level - 1] || '💃';
    const [score, setScore] = useState(0);
    return (
        <div>
            <h4>Do the move: {target}</h4>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
                {['💃', '🙌', '👏'].map(p => (
                    <button key={p} onClick={() => { if (p === target) { const s = score + 1; setScore(s); updateScore(s); } }} className="btn" style={{ fontSize: '3rem' }}>{p}</button>
                ))}
            </div>
            <p>Moves: {score}</p>
        </div>
    );
};

const GameSleepCatch = ({ level, updateScore }) => {
    const [caught, setCaught] = useState(0);
    return (
        <div>
            <h4>Tap the Zzz's!</h4>
            <div style={{ height: '200px', width: '300px', position: 'relative', overflow: 'hidden', border: '1px solid #555', margin: '0 auto' }}>
                <button
                    onClick={() => {
                        const next = caught + 1;
                        setCaught(next);
                        updateScore(next);
                    }}
                    style={{
                        position: 'absolute',
                        top: `${Math.random() * 80}%`,
                        left: `${Math.random() * 80}%`,
                        fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    💤
                </button>
            </div>
            <p>caught: {caught}</p>
        </div>
    );
};

const GameMoodDetect = ({ level, updateScore }) => {
    const moods = level === 1 ? [{ e: '😢', n: 'Sad' }, { e: '😊', n: 'Happy' }] : [{ e: '😠', n: 'Angry' }, { e: '😨', n: 'Scared' }];
    const [q, setQ] = useState(0);
    const [score, setScore] = useState(0);
    const target = moods[q % moods.length];
    const guess = (name) => {
        if (name === target.n) {
            const s = score + 1;
            setScore(s);
            updateScore(s);
            setQ(q + 1);
        }
    };
    return (
        <div>
            <h4>Find: "{target.n}"</h4>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
                {moods.map(m => (
                    <button key={m.n} onClick={() => guess(m.n)} className="btn" style={{ fontSize: '4rem' }}>{m.e}</button>
                ))}
            </div>
            <p>Score: {score}</p>
        </div>
    );
};

const GameSafeShield = ({ level, updateScore }) => {
    const opts = ["Run Away", "Tell Adult", "Say No"];
    const [score, setScore] = useState(0);
    return (
        <div>
            <h4>Safety: Tap correct choice!</h4>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                {opts.map(o => (
                    <button key={o} onClick={() => { const s = score + 1; setScore(s); updateScore(s); }} className="btn btn-outline">{o}</button>
                ))}
            </div>
            <p>Choices made: {score}</p>
        </div>
    );
};

const GameKindConnect = ({ level, updateScore }) => {
    const [score, setScore] = useState(0);
    return (
        <div>
            <h4>Share fruit with neighbors!</h4>
            <button onClick={() => { const s = score + 1; setScore(s); updateScore(s); }} className="btn btn-primary" style={{ marginTop: '2rem', fontSize: '1.5rem' }}>🥭 Give Fruit</button>
            <p>Shared: {score}</p>
        </div>
    );
};

const GameMindCloud = ({ level, updateScore }) => {
    const [breaths, setBreaths] = useState(0);
    return (
        <div>
            <h4>Deep Breaths...</h4>
            <div style={{ fontSize: '4rem', margin: '2rem', animation: 'pulse 2s infinite' }}>🌬️</div>
            <button onClick={() => {
                const b = breaths + 1;
                setBreaths(b);
                updateScore(b);
            }} className="btn btn-outline">Breathe In... Out ({breaths})</button>
        </div>
    );
};

// --- MAIN HEALTH COMPONENT ---

const Health = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { addEarnings } = useWallet();
    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';

    // --- KIDS RENDER ---
    if (isKid) {
        return (
            <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh' }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>← Hub</button>
                    <h1 style={{ color: '#FFD700' }}>Wellness World 🌍</h1>
                    <p style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', fontStyle: 'italic' }}>Your mind and body are your first investments.</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Play 10 Games • Earn Stars 🌟</p>
                </header>
                <KidsWellnessHub />
            </div>
        );
    }

    // --- TEEN & ADULT RENDER (NEW BODY PILLAR) ---
    const modules = isTeen ? bodyHealthData.teens : bodyHealthData.adults;
    const TOTAL_LEVELS = modules.length;

    const [activeLevel, setActiveLevel] = useState(null); // Index of module being viewed
    const [completedLevels, setCompletedLevels] = useState(() => {
        const saved = JSON.parse(localStorage.getItem(`bodyHealth_${isTeen ? 'teen' : 'adult'}`));
        // Ensure saved array is boolean array of correct length
        if (Array.isArray(saved) && saved.length > 0) return saved;
        return Array(TOTAL_LEVELS).fill(false);
    });

    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'info', duration = 3000) => setToast({ message, type, duration });

    useEffect(() => {
        localStorage.setItem(`bodyHealth_${isTeen ? 'teen' : 'adult'}`, JSON.stringify(completedLevels));
    }, [completedLevels, isTeen]);

    const handleComplete = (index) => {
        if (!completedLevels[index]) {
            const newCompleted = [...completedLevels];
            newCompleted[index] = true;
            // Pad if length mismatch
            while (newCompleted.length < TOTAL_LEVELS) newCompleted.push(false);

            setCompletedLevels(newCompleted);
            addEarnings('health', 150);
            showToast(`Level ${index + 1} Complete! +₦150 🏆`, 'success');
        }
    };

    const progressPercent = Math.round((completedLevels.filter(Boolean).length / TOTAL_LEVELS) * 100);

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh' }}>
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast(null)} />}

            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1.5rem auto' }}>← Hub</button>
                <h1 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Body & Physical Health 🏃</h1>
                <p style={{ color: '#aaa' }}>{isTeen ? "Learning Who I Am" : "Responsibility & Long-term Health"}</p>
            </header>

            {/* Mental Health Link */}
            <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto' }}>
                <button
                    onClick={() => navigate('/mental-health')}
                    className="animate-pulse"
                    style={{
                        width: '100%', padding: '1rem', marginBottom: '1.5rem',
                        background: 'linear-gradient(135deg, #00C851 0%, #007E33 100%)',
                        color: '#fff', border: 'none', borderRadius: '12px',
                        fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0, 200, 81, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                >
                    <span>🧠💚</span> Enter Mental Health Center
                </button>
            </div>

            {/* Progress Bar */}
            <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#fff', fontWeight: 'bold' }}>
                    <span>Pillar Progress</span>
                    <span>{progressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: '#222', borderRadius: '20px', overflow: 'hidden', border: '1px solid #333' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--color-secondary)', transition: 'width 0.5s' }}></div>
                </div>
            </div>

            {/* Modules Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
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
                                <button
                                    onClick={() => setActiveLevel(idx)}
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

            {/* Module Modal/View */}
            {activeLevel !== null && modules[activeLevel] && (
                <ModuleViewer
                    module={modules[activeLevel]}
                    isDone={completedLevels[activeLevel]}
                    onClose={() => setActiveLevel(null)}
                    onComplete={() => {
                        handleComplete(activeLevel);
                        setActiveLevel(null);
                    }}
                />
            )}
        </div>
    );
};

const ModuleViewer = ({ module, isDone, onClose, onComplete }) => {
    const [quizIdx, setQuizIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    if (!module) return null;

    const handleAnswer = (optionIndex) => {
        const correct = optionIndex === module.quiz[quizIdx].a;
        if (correct) {
            const newScore = score + 1;
            setScore(newScore);
            alert("Correct! 🎉"); // Simple feedback
        } else {
            alert("Incorrect. Keep trying!");
        }

        // Move to next or finish
        if (quizIdx < module.quiz.length - 1) {
            setQuizIdx(quizIdx + 1);
        } else {
            // Done
            if (score + (correct ? 1 : 0) >= module.quiz.length - 1) {
                setTimeout(() => {
                    alert("Module Complete! Well done.");
                    onComplete();
                }, 500);
            } else {
                setTimeout(() => {
                    alert("Good effort! Module Complete.");
                    onComplete();
                }, 500);
            }
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
                            Take Quiz 📝
                        </button>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>Question {quizIdx + 1} / {module.quiz.length}</h3>
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

export default Health;
