import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';
import { civicsKidsGames } from '../data/civicsKidsGames';

const GAME_REWARD = 50;   // ₦ per game
const GAME_XP = 20;       // XP per game

const ResultBanner = ({ correct, explanation, onNext }) => (
    <div style={{
        backgroundColor: correct ? 'rgba(0, 200, 81, 0.15)' : 'rgba(255, 68, 68, 0.15)',
        border: `2px solid ${correct ? '#00C851' : '#FF4444'}`,
        borderRadius: '15px',
        padding: '1.5rem',
        marginTop: '1.5rem',
        textAlign: 'center',
        animation: 'popIn 0.4s ease'
    }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {correct ? '🎉' : '🤔'}
        </div>
        <h3 style={{ color: correct ? '#00C851' : '#FF4444', marginBottom: '0.5rem' }}>
            {correct ? 'Correct! Amazing!' : 'Not quite!'}
        </h3>
        <p style={{ color: '#ddd', fontSize: '1rem', marginBottom: '1.5rem' }}>
            {explanation}
        </p>
        <button
            onClick={onNext}
            className="btn"
            style={{ backgroundColor: correct ? '#00C851' : '#2196F3', color: 'white', padding: '0.8rem 2rem' }}
        >
            {correct ? 'Keep Going! ➡️' : 'Next Game ➡️'}
        </button>
    </div>
);

const QuizGame = ({ game, onResult }) => {
    const [selected, setSelected] = useState(null);

    const handleSelect = (option) => {
        if (selected !== null) return;
        setSelected(option);
        onResult(option.correct);
    };

    return (
        <div>
            <p style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '2rem', lineHeight: 1.6 }}>
                {game.question}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {game.options.map((opt, i) => {
                    let bg = '#222';
                    let border = '#444';
                    if (selected !== null) {
                        if (opt.correct) { bg = 'rgba(0,200,81,0.2)'; border = '#00C851'; }
                        else if (selected === opt && !opt.correct) { bg = 'rgba(255,68,68,0.2)'; border = '#FF4444'; }
                    }
                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            disabled={selected !== null}
                            style={{
                                backgroundColor: bg,
                                border: `2px solid ${border}`,
                                borderRadius: '12px',
                                padding: '1rem 1.5rem',
                                color: '#fff',
                                fontSize: '1rem',
                                cursor: selected !== null ? 'default' : 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit'
                            }}
                        >
                            {opt.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const TrueFalseGame = ({ game, onResult }) => {
    const [selected, setSelected] = useState(null);

    const handleAnswer = (answer) => {
        if (selected !== null) return;
        setSelected(answer);
        onResult(answer === game.answer);
    };

    return (
        <div>
            <div style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '15px',
                padding: '2rem',
                border: '1px solid #333',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '1.4rem', color: '#fff', margin: 0, lineHeight: 1.6 }}>
                    "{game.question}"
                </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[true, false].map(val => {
                    let bg = val ? '#1a4a2e' : '#4a1a1a';
                    let border = val ? '#2e7d32' : '#c62828';
                    let emoji = val ? '✅' : '❌';
                    if (selected !== null) {
                        const isCorrect = val === game.answer;
                        bg = isCorrect ? 'rgba(0,200,81,0.2)' : 'rgba(255,68,68,0.1)';
                        border = isCorrect ? '#00C851' : '#555';
                    }
                    return (
                        <button
                            key={String(val)}
                            onClick={() => handleAnswer(val)}
                            disabled={selected !== null}
                            style={{
                                backgroundColor: bg,
                                border: `3px solid ${border}`,
                                borderRadius: '20px',
                                padding: '2rem 1rem',
                                cursor: selected !== null ? 'default' : 'pointer',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit'
                            }}
                        >
                            <span style={{ fontSize: '3rem' }}>{emoji}</span>
                            {val ? 'TRUE' : 'FALSE'}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const ScenarioGame = ({ game, onResult }) => {
    const [selected, setSelected] = useState(null);

    const handleSelect = (option) => {
        if (selected !== null) return;
        setSelected(option);
        onResult(option.correct);
    };

    return (
        <div>
            <div style={{
                backgroundColor: 'rgba(255, 213, 0, 0.1)',
                border: '2px solid rgba(255, 213, 0, 0.3)',
                borderRadius: '15px',
                padding: '1.5rem',
                marginBottom: '2rem'
            }}>
                <p style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    📖 THE SITUATION
                </p>
                <p style={{ color: '#ddd', fontSize: '1.1rem', margin: 0, lineHeight: 1.6 }}>
                    {game.situation}
                </p>
            </div>
            <p style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                {game.question}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {game.options.map((opt, i) => {
                    let bg = '#222';
                    let border = '#444';
                    if (selected !== null) {
                        if (opt.correct) { bg = 'rgba(0,200,81,0.2)'; border = '#00C851'; }
                        else if (selected === opt && !opt.correct) { bg = 'rgba(255,68,68,0.2)'; border = '#FF4444'; }
                    }
                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            disabled={selected !== null}
                            style={{
                                backgroundColor: bg,
                                border: `2px solid ${border}`,
                                borderRadius: '12px',
                                padding: '1rem 1.5rem',
                                color: '#fff',
                                fontSize: '1rem',
                                cursor: selected !== null ? 'default' : 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit'
                            }}
                        >
                            {opt.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const KidsCivicsGame = ({ moduleId, onClose }) => {
    const { addEarnings } = useWallet();
    const { addPoints } = useGamification();

    const games = civicsKidsGames[moduleId] || [];
    const [currentGame, setCurrentGame] = useState(0);
    const [answered, setAnswered] = useState(null); // null | bool
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const game = games[currentGame];

    const handleResult = (correct) => {
        setAnswered(correct);
        if (correct) {
            setScore(prev => prev + 1);
            addEarnings('civics', GAME_REWARD);
            addPoints(GAME_XP);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        }
    };

    const handleNext = () => {
        setAnswered(null);
        if (currentGame < games.length - 1) {
            setCurrentGame(prev => prev + 1);
        } else {
            setDone(true);
        }
    };

    const gameTypeBadgeColor = {
        quiz: '#9C27B0',
        truefalse: '#2196F3',
        scenario: '#FF9800'
    };

    if (!games.length) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                <p>No games available for this module yet!</p>
                <button onClick={onClose} className="btn">Close</button>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.95)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 20000, padding: '1rem',
            overflowY: 'auto'
        }}>
            {showConfetti && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    pointerEvents: 'none', zIndex: 20001,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '5rem', gap: '2rem', animation: 'bounce 0.5s'
                }}>
                    🎉 ⭐ 🎊
                </div>
            )}

            <div style={{
                backgroundColor: '#111',
                border: '2px solid #9C27B0',
                borderRadius: '25px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                position: 'relative',
                animation: 'popIn 0.4s ease'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <span style={{
                            backgroundColor: gameTypeBadgeColor[game.type],
                            color: 'white',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            marginRight: '0.5rem'
                        }}>
                            {game.type === 'truefalse' ? 'True/False' : game.type}
                        </span>
                        <span style={{ color: '#666', fontSize: '0.85rem' }}>
                            Game {currentGame + 1} of {games.length}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', backgroundColor: '#222', borderRadius: '3px', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: `${((currentGame) / games.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#9C27B0',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                {done ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'popIn 0.4s ease' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                            {score === games.length ? '🏆' : score >= 2 ? '🌟' : '💪'}
                        </div>
                        <h2 style={{ color: '#FFD700', marginBottom: '0.5rem' }}>
                            {score === games.length ? 'Perfect Score!' : score >= 2 ? 'Well Done!' : 'Keep Practising!'}
                        </h2>
                        <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                            You got <strong style={{ color: '#00C851', fontSize: '1.5rem' }}>{score}</strong> out of <strong>{games.length}</strong> correct!
                        </p>
                        <p style={{ color: '#FFD700', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            +₦{score * GAME_REWARD} earned · +{score * GAME_XP} XP
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                onClick={() => { setCurrentGame(0); setScore(0); setAnswered(null); setDone(false); }}
                                className="btn btn-outline"
                                style={{ color: '#9C27B0', borderColor: '#9C27B0' }}
                            >
                                🔄 Play Again
                            </button>
                            <button
                                onClick={onClose}
                                className="btn"
                                style={{ backgroundColor: '#9C27B0', color: 'white' }}
                            >
                                ✅ Done!
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Game title */}
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{game.emoji}</div>
                            <h3 style={{ color: '#9C27B0', margin: 0 }}>{game.title}</h3>
                        </div>

                        {/* Game component */}
                        {game.type === 'quiz' && <QuizGame game={game} onResult={handleResult} key={currentGame} />}
                        {game.type === 'truefalse' && <TrueFalseGame game={game} onResult={handleResult} key={currentGame} />}
                        {game.type === 'scenario' && <ScenarioGame game={game} onResult={handleResult} key={currentGame} />}

                        {/* Result banner */}
                        {answered !== null && (
                            <ResultBanner
                                correct={answered}
                                explanation={game.explanation}
                                onNext={handleNext}
                            />
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    80% { transform: scale(1.03); }
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

export default KidsCivicsGame;
