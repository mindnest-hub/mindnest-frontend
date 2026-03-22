import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';

// 5 levels with different crops. Level 5 is a rotation challenge.
const CROPS = {
    maize: {
        id: 'maize',
        level: 1,
        name: 'Maize (Corn)',
        emoji: '🌽',
        color: '#FFD700',
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
        level: 2,
        name: 'Tomato',
        emoji: '🍅',
        color: '#FF4444',
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
        level: 3,
        name: 'Cassava',
        emoji: '🍠',
        color: '#8B4513',
        harvestValue: 600,
        seedCost: 80,
        funFact: 'Cassava feeds more than 500 million people in Africa! Its roots are rich in carbohydrates.',
        stages: [
            { name: 'Soil Ready', emoji: '🟫', desc: 'Sandy loam soil prepared on raised mounds. Cassava loves good drainage!', day: 0 },
            { name: 'Stem Cutting Planted', emoji: '🌱', desc: 'Cassava doesn\'t grow from seeds — you plant stem cuttings! (Month 1)', day: 1 },
            { name: 'Sprouting', emoji: '🌿', desc: 'Buds appear on the stem! Roots begin forming underground. (Week 2)', day: 2 },
            { name: 'Early Growth', emoji: '🪴', desc: 'Young leaves unfurl and reach for sunlight. Roots are thickening below. (Month 2)', day: 3 },
            { name: 'Rapid Growth', emoji: '🌿🌿🌿', desc: 'Tall, leafy canopy forming! The plant is storing starch in its roots. (Month 4–6)', day: 4 },
            { name: 'Root Enlargement', emoji: '🟤', desc: 'Underground roots swell dramatically with starch. Minimal watering now. (Month 7–8)', day: 5 },
            { name: 'Maturation', emoji: '🍠', desc: 'Leaves start yellowing — nearly ready! (Month 10–11)', day: 6 },
            { name: 'Ready to Harvest! 🏆', emoji: '🍠✨', desc: 'Tubers are thick and starchy at 12 months.', day: 7 }
        ]
    },
    watermelon: {
        id: 'watermelon',
        level: 4,
        name: 'Watermelon',
        emoji: '🍉',
        color: '#00C851',
        harvestValue: 800,
        seedCost: 200,
        funFact: 'Watermelons are 92% water! They need lots of room for their vines to sprawl across the farm.',
        stages: [
            { name: 'Soil Ready', emoji: '🟫', desc: 'Rich soil mounded up. Watermelons need lots of nutrients!', day: 0 },
            { name: 'Seeds Sown', emoji: '🌱', desc: 'Start in small pots or mounded soil. Keep warm!', day: 1 },
            { name: 'Germination', emoji: '🌿', desc: 'Fast growth! The first two leaves appear in just a few days.', day: 2 },
            { name: 'Vining Stage', emoji: '🌿🌿', desc: 'The plant starts to sprawl. Clear space around it!', day: 3 },
            { name: 'Flowering', emoji: '🌼', desc: 'Beautiful yellow flowers! Male flowers appear first.', day: 4 },
            { name: 'Fruit Set', emoji: '🟢', desc: 'Little green balls appear. They will grow very fast now!', day: 5 },
            { name: 'Growth Peak', emoji: '🍉', desc: 'The melon gets heavy. Dont move it or the vine might break!', day: 6 },
            { name: 'Ready to Harvest! 🏆', emoji: '🍉✨', desc: 'When the bottom turns yellow and the stem bents, it is ripe!', day: 7 }
        ]
    },
    rotation: {
        id: 'rotation',
        level: 5,
        name: 'Crop Rotation Challenge',
        emoji: '♻️',
        color: '#9C27B0',
        harvestValue: 1500,
        seedCost: 0,
        funFact: 'Crop rotation keeps soil healthy! Planting different things in order stops pests and adds natural nutrients.',
        isRotation: true,
        sequence: ['maize', 'tomato', 'watermelon'],
        stages: [
            { name: 'Soil Health Check', emoji: '🧪', desc: 'Preparing to rotate crops to keep your farm soil powerful!', day: 0 },
            { name: 'Planting Maize', emoji: '🌽', desc: 'Step 1: Maize adds structure and clears certain pests.', day: 1 },
            { name: 'Nurturing Maize', emoji: '🌿', desc: 'Keeping the first rotation strong...', day: 2 },
            { name: 'Planting Tomato', emoji: '🍅', desc: 'Step 2: Tomatoes help break the cycle of maize-specific beetles.', day: 3 },
            { name: 'Nurturing Tomato', emoji: '🌿', desc: 'Keeping the second rotation healthy...', day: 4 },
            { name: 'Planting Watermelon', emoji: '🍉', desc: 'Step 3: Melons provide ground cover and finalize the rotation pulse.', day: 5 },
            { name: 'Rotation Success', emoji: '♻️', desc: 'Your soil is now more nutrient-rich than when you started!', day: 6 },
            { name: 'Golden Harvest! 🏆', emoji: '💰✨', desc: 'The farm is booming! Your rotation plan worked perfectly.', day: 7 }
        ]
    }
};

// 180s / 6 transitions = 30s per stage. Reducing to 5s for fast testing/progression
const STAGE_DURATION = 5000;

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

    const [currentLevel, setCurrentLevel] = useState(() => parseInt(localStorage.getItem('kidsFarmLevel')) || 1);
    const [phase, setPhase] = useState('pick'); // 'pick' | 'growing' | 'harvested'
    const [chosenCrop, setChosenCrop] = useState(null);
    const [stage, setStage] = useState(0);
    const [soilMoisture, setSoilMoisture] = useState(100);
    const [weedLevel, setWeedLevel] = useState(0);
    const [waterCount, setWaterCount] = useState(0);
    const [weedCount, setWeedCount] = useState(0);
    const [growing, setGrowing] = useState(false);
    const [showFact, setShowFact] = useState(false);
    const [celebrateHarvest, setCelebrateHarvest] = useState(false);
    const intervalRef = useRef(null);

    const crop = chosenCrop ? CROPS[chosenCrop] : null;
    const isLastStage = crop && stage === crop.stages.length - 1;
    const canGrow = soilMoisture >= 40;

    // Persist Level
    useEffect(() => {
        localStorage.setItem('kidsFarmLevel', currentLevel);
    }, [currentLevel]);

    // Moisture drains over time: critical (40%) in ~40 seconds
    useEffect(() => {
        if (phase !== 'growing') return;
        const drain = setInterval(() => {
            // Drop 4% every 2.5s = 1.6% per sec. 60% drop (to 40%) in 37.5s.
            // If weeds > 50%, moisture drains 1.5x faster.
            const weedMultiplier = weedLevel > 50 ? 1.5 : 1;
            const mLoss = 4 * weedMultiplier;
            setSoilMoisture(prev => Math.max(0, prev - mLoss));

            // Weeds grow faster if moisture is high
            if (soilMoisture > 40) {
                setWeedLevel(prev => Math.min(100, prev + 5));
            }
        }, 2500);
        return () => clearInterval(drain);
    }, [phase, weedLevel, soilMoisture]);

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
    }, [phase, growing, stage, canGrow, isLastStage, crop]);

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
        addPoints(100);
        setCelebrateHarvest(true);
        setPhase('harvested');

        // Advance level if it matches current
        if (crop.level === currentLevel && currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
        }

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Farm Status 🌱</h2>
                        <div style={{ backgroundColor: '#FFD700', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            Level {currentLevel} Mastery
                        </div>
                    </div>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
                        Plant your way to becoming a Master Agripreneur! Unlock new crops by completing each level.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.values(CROPS).map(c => {
                            const isLocked = c.level > currentLevel;
                            const isCurrent = c.level === currentLevel;

                            return (
                                <button
                                    key={c.id}
                                    onClick={() => !isLocked && handleChooseCrop(c.id)}
                                    disabled={isLocked}
                                    style={{
                                        backgroundColor: isLocked ? '#0d0d0d' : '#1a1a1a',
                                        border: `2px solid ${isLocked ? '#222' : isCurrent ? 'var(--color-primary)' : c.color}`,
                                        borderRadius: '15px',
                                        padding: '1.25rem',
                                        textAlign: 'left',
                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                        color: isLocked ? '#444' : '#fff',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        opacity: isLocked ? 0.6 : 1,
                                        position: 'relative',
                                        filter: isLocked ? 'grayscale(0.8)' : 'none'
                                    }}
                                >
                                    <span style={{ fontSize: '3rem', flexShrink: 0 }}>{isLocked ? '🔒' : c.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isLocked ? '#444' : c.color, marginBottom: '0.25rem' }}>
                                                {c.name}
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: isCurrent ? 'var(--color-primary)' : '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                Lvl {c.level}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: isLocked ? '#333' : '#aaa' }}>
                                            {isLocked ? `Complete Level ${c.level - 1} to unlock this!` : c.funFact.substring(0, 60) + '...'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: isLocked ? '#333' : '#00C851', marginTop: '0.2rem', fontWeight: 'bold' }}>
                                            {!isLocked && `💰 Harvest Value: ${currency}${c.harvestValue}`}
                                        </div>
                                    </div>
                                    {!isLocked && (
                                        <div style={{
                                            backgroundColor: isCurrent ? 'var(--color-primary)' : c.color,
                                            color: isCurrent ? '#fff' : '#000',
                                            borderRadius: '20px',
                                            padding: '0.4rem 0.9rem', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap'
                                        }}>
                                            {isCurrent ? 'Play Now ▶' : 'Replay'}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        {!isLastStage && (
                            <>
                                <button
                                    onClick={handleWater}
                                    className="btn"
                                    style={{ backgroundColor: '#00BFFF', color: '#000', fontWeight: 'bold' }}
                                >
                                    💧 Water Crops
                                </button>
                                <button
                                    onClick={handleWeeding}
                                    className="btn"
                                    style={{ backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold' }}
                                >
                                    🌿 Pull Weeds
                                </button>
                            </>
                        )}
                        {isLastStage && (
                            <button
                                onClick={handleHarvest}
                                className="btn"
                                style={{ backgroundColor: crop.color, color: '#000', fontWeight: 'bold', fontSize: '1.1rem' }}
                            >
                                🧺 Harvest! +{currency}{crop.harvestValue}
                            </button>
                        )}
                        <button
                            onClick={() => setShowFact(f => !f)}
                            className="btn btn-outline"
                            style={{ color: crop.color, borderColor: crop.color }}
                        >
                            💡 Weed Facts
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
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Weeds Pulled</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#4CAF50' }}>🌿 {weedCount}</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid #222' }}>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Crop Type</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: crop.color }}>{crop.emoji} {crop.name}</div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Harvest Value</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00C851' }}>{currency}{crop.harvestValue}</div>
                    </div>
                </div>
            )}

            {/* HARVESTED SCREEN */}
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
                        Your {crop.name} is harvested. You earned <strong style={{ color: '#00C851' }}>{currency}{crop.harvestValue}</strong> + 100 XP!
                    </p>
                    <div style={{
                        backgroundColor: '#1a1a1a', borderRadius: '15px', padding: '1.25rem', marginBottom: '2rem',
                        border: `2px solid ${crop.color}`, textAlign: 'left'
                    }}>
                        <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.5rem', fontWeight: 'bold' }}>
                            🌍 {crop.isRotation ? 'Mastery Insight' : 'Real-World Learning'}
                        </p>
                        <div style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                            {crop.funFact}
                            <br /><br />
                            {crop.isRotation ? (
                                <strong>You have successfully completed the Crop Rotation! Your soil is now at peak health.</strong>
                            ) : (
                                <>In real life, this crop takes months of care. You watered your crops <strong style={{ color: '#00BFFF' }}>{waterCount} times</strong> — great job!</>
                            )}
                            <br /><br />
                            <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', borderLeft: '4px solid #4CAF50', padding: '0.75rem', borderRadius: '4px', marginTop: '1rem' }}>
                                <p style={{ color: '#ccc', margin: 0, fontSize: '0.85rem' }}>
                                    💡 <strong>Agri-Master Fact:</strong> Pulled weeds shouldn't be thrown away! You can use them for <strong>mulching</strong> (to keep soil moist) or as <strong>compost green matter</strong> to feed your next crop.
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleReset} className="btn" style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                        {crop.level < 5 ? (crop.level === currentLevel - 1 ? '🌱 Unlock Next Level!' : '🌱 Plant Again') : '🌱 Master Another Rotation'}
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
