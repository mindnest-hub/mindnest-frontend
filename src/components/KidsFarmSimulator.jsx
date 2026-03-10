import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';

// 3 Real crops with accurate growth stages and real-world timelines
const CROPS = {
    maize: {
        id: 'maize',
        name: 'Maize (Corn)',
        emoji: '🌽',
        seedEmoji: '🌾',
        icon: '🌽',
        color: '#FFD700',
        daysToGerminate: '5–10 days',
        totalDays: '90–120 days',
        harvestValue: 400,
        seedCost: 100,
        funFact: 'Maize is Nigeria\'s most widely grown crop! It needs full sunlight and regular watering.',
        stages: [
            { name: 'Soil Ready', emoji: '🟫', desc: 'Your soil is prepared and ready for planting!', day: 0 },
            { name: 'Seed in Ground', emoji: '🌱', desc: 'The seed is in the ground. Water it so it can germinate!', day: 1 },
            { name: 'Germination', emoji: '🌿', desc: 'The seed has cracked open underground and a root is forming! (Day 5–10)', day: 2 },
            { name: 'Seedling', emoji: '🪴', desc: 'The seedling is above ground! It needs sunlight and water. (Week 2)', day: 3 },
            { name: 'Vegetative Stage', emoji: '🌿🌿', desc: 'Leaves are growing fast! This is the most water-hungry stage. (Week 4–8)', day: 4 },
            { name: 'Tasseling & Silking', emoji: '🌾', desc: 'Flowers appear at the top (tassel) and silks emerge. Pollination begins! (Week 9)', day: 5 },
            { name: 'Grain Fill', emoji: '🌽', desc: 'Corn cobs are filling with grain. Almost ready! (Week 12–14)', day: 6 },
            { name: 'Ready to Harvest! 🏆', emoji: '🌽✨', desc: 'Your maize is golden and dry — time to harvest for maximum profit!', day: 7 }
        ]
    },
    tomato: {
        id: 'tomato',
        name: 'Tomato',
        emoji: '🍅',
        seedEmoji: '🔴',
        icon: '🍅',
        color: '#FF4444',
        daysToGerminate: '5–10 days',
        totalDays: '70–85 days',
        harvestValue: 500,
        seedCost: 150,
        funFact: 'Tomatoes are one of Africa\'s most valuable vegetables! They need staking as they grow tall.',
        stages: [
            { name: 'Soil Ready', emoji: '🟫', desc: 'Rich, well-drained soil prepared for tomato seeds!', day: 0 },
            { name: 'Seed Planted', emoji: '🌱', desc: 'Tiny tomato seeds are in the soil. Keep them moist but not flooded!', day: 1 },
            { name: 'Germination', emoji: '🌿', desc: 'The seed sprouts! Tiny white roots reach downward. (Day 5–10)', day: 2 },
            { name: 'Seedling', emoji: '🪴', desc: 'First true leaves appear. Thin to the strongest seedlings. (Week 2–3)', day: 3 },
            { name: 'Transplant & Grow', emoji: '🌱🌱', desc: 'Moved to final plot! Roots dig deeper. Add a stake to support growth. (Week 4–5)', day: 4 },
            { name: 'Flowering', emoji: '🌼', desc: 'Yellow flowers appear — these will become tomatoes! Bees help with pollination. (Week 6)', day: 5 },
            { name: 'Fruit Set', emoji: '🟢', desc: 'Green tomatoes forming after flowers fall. Keep watering steadily! (Week 8)', day: 6 },
            { name: 'Ready to Harvest! 🏆', emoji: '🍅✨', desc: 'Deep red, firm tomatoes ready! Pick them before overripe for best market price.', day: 7 }
        ]
    },
    cassava: {
        id: 'cassava',
        name: 'Cassava',
        emoji: '🍠',
        seedEmoji: '🪵',
        icon: '🍠',
        color: '#8B4513',
        daysToGerminate: '7–14 days (stems)',
        totalDays: '270–365 days',
        harvestValue: 600,
        seedCost: 80,
        funFact: 'Cassava feeds more than 500 million people in Africa! Its roots are rich in carbohydrates and very drought-tolerant.',
        stages: [
            { name: 'Soil Ready', emoji: '🟫', desc: 'Sandy loam soil prepared on raised mounds. Cassava loves good drainage!', day: 0 },
            { name: 'Stem Cutting Planted', emoji: '🌱', desc: 'Cassava doesn\'t grow from seeds — you plant stem cuttings! (Month 1)', day: 1 },
            { name: 'Sprouting', emoji: '🌿', desc: 'Buds appear on the stem! Roots begin forming underground. (Week 2)', day: 2 },
            { name: 'Early Growth', emoji: '🪴', desc: 'Young leaves unfurl and reach for sunlight. Roots are thickening below. (Month 2)', day: 3 },
            { name: 'Rapid Growth', emoji: '🌿🌿🌿', desc: 'Tall, leafy canopy forming! The plant is storing starch in its roots. (Month 4–6)', day: 4 },
            { name: 'Root Enlargement', emoji: '🟤', desc: 'Underground roots swell dramatically with starch. Minimal watering now. (Month 7–8)', day: 5 },
            { name: 'Maturation', emoji: '🍠', desc: 'Leaves start yellowing — the plant is directing energy to roots. Nearly ready! (Month 10–11)', day: 6 },
            { name: 'Ready to Harvest! 🏆', emoji: '🍠✨', desc: 'Tubers are thick and starchy at 12 months. Dig carefully to avoid breaking them!', day: 7 }
        ]
    }
};

const STAGE_DURATION = 4000; // 4s per stage in real-time for the game

const StageTimeline = ({ stages, currentStage }) => (
    <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', minWidth: 'max-content', padding: '0.5rem 0' }}>
            {stages.map((s, i) => (
                <React.Fragment key={i}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                        opacity: i > currentStage ? 0.3 : 1, transition: 'opacity 0.3s'
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: i < currentStage ? '#00C851' : i === currentStage ? '#FFD700' : '#333',
                            border: i === currentStage ? '3px solid white' : '2px solid #444',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', transition: 'all 0.3s',
                            boxShadow: i === currentStage ? '0 0 12px rgba(255,213,0,0.6)' : 'none'
                        }}>
                            {i < currentStage ? '✅' : s.emoji.split(' ')[0]}
                        </div>
                        <span style={{ fontSize: '0.6rem', color: i === currentStage ? '#FFD700' : '#888', maxWidth: '48px', textAlign: 'center', lineHeight: 1.2 }}>
                            {s.name.split('!')[0]}
                        </span>
                    </div>
                    {i < stages.length - 1 && (
                        <div style={{
                            width: '24px', height: '2px', marginBottom: '16px',
                            backgroundColor: i < currentStage ? '#00C851' : '#333',
                            transition: 'background-color 0.3s'
                        }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);

const KidsFarmSimulator = ({ onHarvest, currency = '₦' }) => {
    const { addEarnings } = useWallet();
    const { addPoints } = useGamification();

    const [phase, setPhase] = useState('pick'); // 'pick' | 'growing' | 'harvested'
    const [chosenCrop, setChosenCrop] = useState(null);
    const [stage, setStage] = useState(0);
    const [soilMoisture, setSoilMoisture] = useState(100);
    const [waterCount, setWaterCount] = useState(0);
    const [growing, setGrowing] = useState(false);
    const [showFact, setShowFact] = useState(false);
    const [celebrateHarvest, setCelebrateHarvest] = useState(false);
    const intervalRef = useRef(null);

    const crop = chosenCrop ? CROPS[chosenCrop] : null;
    const isLastStage = crop && stage === crop.stages.length - 1;
    const canGrow = soilMoisture >= 40;

    // Moisture drains over time
    useEffect(() => {
        if (phase !== 'growing') return;
        const drain = setInterval(() => {
            setSoilMoisture(prev => Math.max(0, prev - 6));
        }, 2500);
        return () => clearInterval(drain);
    }, [phase]);

    // Auto-advance stages when moisture is fine
    useEffect(() => {
        if (phase !== 'growing' || !growing || !canGrow) return;
        if (isLastStage) { setGrowing(false); return; }
        intervalRef.current = setTimeout(() => {
            setStage(prev => {
                const next = prev + 1;
                if (next === crop.stages.length - 1) setGrowing(false);
                return next;
            });
        }, STAGE_DURATION);
        return () => clearTimeout(intervalRef.current);
    }, [phase, growing, stage, canGrow, isLastStage]);

    const handleChooseCrop = (id) => {
        setChosenCrop(id);
        setPhase('growing');
        setStage(1);
        setSoilMoisture(100);
        setGrowing(true);
    };

    const handleWater = () => {
        setSoilMoisture(100);
        setWaterCount(w => w + 1);
        if (!growing && !isLastStage && canGrow) setGrowing(true);
    };

    const handleHarvest = () => {
        const value = crop.harvestValue;
        addEarnings('agri', value);
        addPoints(80);
        setCelebrateHarvest(true);
        setPhase('harvested');
        onHarvest && onHarvest(value);
        setTimeout(() => setCelebrateHarvest(false), 3000);
    };

    const handleReset = () => {
        setPhase('pick');
        setChosenCrop(null);
        setStage(0);
        setSoilMoisture(100);
        setWaterCount(0);
        setGrowing(false);
    };

    const currentStageData = crop ? crop.stages[stage] : null;

    return (
        <div>
            {/* CROP PICKER */}
            {phase === 'pick' && (
                <div style={{ animation: 'popIn 0.4s ease' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Farm Status 🌱</h2>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
                        Choose what you want to plant on your farm. Each crop teaches you something different about real farming!
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.values(CROPS).map(c => (
                            <button
                                key={c.id}
                                onClick={() => handleChooseCrop(c.id)}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    border: `2px solid ${c.color}`,
                                    borderRadius: '15px',
                                    padding: '1.25rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <span style={{ fontSize: '3rem' }}>{c.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: c.color, marginBottom: '0.25rem' }}>
                                        {c.name}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#aaa', flexWrap: 'wrap' }}>
                                        <span>🌱 Germinates in {c.daysToGerminate}</span>
                                        <span>📅 Full growth: {c.totalDays}</span>
                                        <span>💰 Harvest: {currency}{c.harvestValue}</span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '0.4rem' }}>
                                        Seed cost: {currency}{c.seedCost}
                                    </div>
                                </div>
                                <div style={{
                                    backgroundColor: c.color, color: '#000', borderRadius: '20px',
                                    padding: '0.4rem 0.9rem', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap'
                                }}>
                                    Plant This ▶
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* GROWING PHASE */}
            {phase === 'growing' && crop && currentStageData && (
                <div style={{ animation: 'popIn 0.4s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h2 style={{ color: crop.color, margin: 0 }}>
                            {crop.emoji} Growing {crop.name}
                        </h2>
                        <button onClick={handleReset} style={{ background: 'none', border: '1px solid #444', borderRadius: '6px', color: '#888', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                            🔄 Start Over
                        </button>
                    </div>

                    {/* Stage Timeline */}
                    <StageTimeline stages={crop.stages} currentStage={stage} />

                    {/* Main Stage Display */}
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 1rem',
                        backgroundColor: '#111',
                        borderRadius: '20px',
                        border: `2px solid ${crop.color}`,
                        marginBottom: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            fontSize: '5rem', marginBottom: '0.5rem',
                            animation: growing ? 'pulse 1.5s infinite' : 'none'
                        }}>
                            {currentStageData.emoji}
                        </div>
                        <h3 style={{ color: crop.color, marginBottom: '0.5rem' }}>{currentStageData.name}</h3>
                        <p style={{ color: '#ccc', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
                            {currentStageData.desc}
                        </p>
                        <div style={{
                            display: 'inline-block', marginTop: '0.75rem',
                            backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                            padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#888'
                        }}>
                            Stage {stage} of {crop.stages.length - 1}
                        </div>
                    </div>

                    {/* Soil Moisture */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            <span style={{ color: '#aaa' }}>💧 Soil Moisture</span>
                            <span style={{ color: soilMoisture < 30 ? '#FF4444' : soilMoisture < 60 ? '#FF9800' : '#00C851', fontWeight: 'bold' }}>
                                {soilMoisture}% {soilMoisture < 30 ? '— Dry! Water now!' : soilMoisture < 60 ? '— Getting dry...' : '— Good! ✅'}
                            </span>
                        </div>
                        <div style={{ height: '10px', backgroundColor: '#222', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${soilMoisture}%`, height: '100%',
                                backgroundColor: soilMoisture < 30 ? '#FF4444' : soilMoisture < 60 ? '#FF9800' : '#00BFFF',
                                borderRadius: '5px', transition: 'width 0.5s, background-color 0.3s'
                            }} />
                        </div>
                    </div>

                    {/* Stop growing warning */}
                    {!canGrow && !isLastStage && (
                        <div style={{
                            backgroundColor: 'rgba(255,68,68,0.1)', border: '1px solid #FF4444',
                            borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center'
                        }}>
                            ⚠️ Growth paused! Soil too dry — water your crops!
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {!isLastStage && (
                            <button
                                onClick={handleWater}
                                className="btn"
                                style={{ flex: 1, backgroundColor: '#00BFFF', color: '#000', fontWeight: 'bold' }}
                            >
                                💧 Water Crops
                            </button>
                        )}
                        {isLastStage && (
                            <button
                                onClick={handleHarvest}
                                className="btn"
                                style={{ flex: 1, backgroundColor: crop.color, color: '#000', fontWeight: 'bold', fontSize: '1.1rem' }}
                            >
                                🌾 Harvest Now! +{currency}{crop.harvestValue}
                            </button>
                        )}
                        <button
                            onClick={() => setShowFact(f => !f)}
                            className="btn btn-outline"
                            style={{ color: crop.color, borderColor: crop.color }}
                        >
                            💡 Crop Fact
                        </button>
                    </div>

                    {/* Fun Fact */}
                    {showFact && (
                        <div style={{
                            marginTop: '1rem', backgroundColor: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${crop.color}44`, borderRadius: '12px', padding: '1rem',
                            animation: 'popIn 0.3s ease'
                        }}>
                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                                <strong style={{ color: crop.color }}>🌍 Did you know? </strong>
                                {crop.funFact}
                            </p>
                        </div>
                    )}

                    {/* Stats */}
                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid #222' }}>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Times Watered</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00BFFF' }}>💧 {waterCount}</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid #222' }}>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Crop</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: crop.color }}>{crop.emoji} {crop.id}</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid #222' }}>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Harvest Value</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00C851' }}>{currency}{crop.harvestValue}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* HARVESTED */}
            {phase === 'harvested' && crop && (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'popIn 0.5s ease' }}>
                    {celebrateHarvest && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem', gap: '2rem' }}>
                            🎉 🌾 💰
                        </div>
                    )}
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{crop.emoji}</div>
                    <h2 style={{ color: '#00C851', marginBottom: '0.5rem' }}>Harvest Complete! 🏆</h2>
                    <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
                        Your {crop.name} is harvested. You earned <strong style={{ color: '#00C851' }}>{currency}{crop.harvestValue}</strong> + 80 XP!
                    </p>
                    <div style={{
                        backgroundColor: '#1a1a1a', borderRadius: '15px', padding: '1.25rem', marginBottom: '2rem',
                        border: `1px solid ${crop.color}`, textAlign: 'left'
                    }}>
                        <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.5rem', fontWeight: 'bold' }}>
                            🌍 Real World Learning
                        </p>
                        <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                            {crop.funFact} In real life, {crop.name.toLowerCase()} takes <strong>{crop.totalDays}</strong> from planting to harvest.
                            You watered your crops <strong style={{ color: '#00BFFF' }}>{waterCount} times</strong> — great job!
                        </p>
                    </div>
                    <button onClick={handleReset} className="btn" style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                        🌱 Plant Again (Choose a New Crop)
                    </button>
                </div>
            )}

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    80% { transform: scale(1.02); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
};

export default KidsFarmSimulator;
