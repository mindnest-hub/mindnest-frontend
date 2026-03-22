import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';

// ─── CROP CATALOGUE ────────────────────────────────────────────────────────────
// Each crop has a difficulty tier.
// Easy = water only
// Normal = water + fertilize
// Hard = water + fertilize + pest control + pruning

const CROP_CATALOGUE = [
    // ── LEVEL 1: EASY ─────────────────────────────────────────────────────────
    {
        id: 'sweet_potato',
        level: 1,
        name: 'Sweet Potato',
        emoji: '🍠',
        color: '#FF9800',
        difficulty: 'easy',
        seedCost: 150,
        harvestValue: 500,
        mechanics: ['water'],
        funFact: 'Sweet potato is one of the most drought-tolerant crops. Vines can be planted without seeds!',
        businessNote: 'Profit margin: ~240% ROI. Very low input, steady local demand.',
        stages: [
            { name: 'Soil Prep', emoji: '🟫', desc: 'Ridge or mound the soil for drainage.' },
            { name: 'Vine Cutting Planted', emoji: '🌱', desc: 'Plant vine cuttings (not seeds) horizontally.' },
            { name: 'Sprouting', emoji: '🌿', desc: 'Shoots emerge within 7–10 days.' },
            { name: 'Vine Spread', emoji: '🌿🌿', desc: 'Vines sprawl across the ground.' },
            { name: 'Root Swelling', emoji: '🟤', desc: 'Underground tubers begin to swell.' },
            { name: 'Maturation', emoji: '🍠', desc: 'Leaves start yellowing — nearly ready!' },
            { name: 'Ready to Harvest! 🏆', emoji: '🍠✨', desc: 'Lift tubers carefully. Cure in the sun before selling.' }
        ]
    },
    // ── LEVEL 2: NORMAL ────────────────────────────────────────────────────────
    {
        id: 'pepper',
        level: 2,
        name: 'Scotch Bonnet Pepper',
        emoji: '🌶️',
        color: '#FF4444',
        difficulty: 'normal',
        seedCost: 250,
        harvestValue: 900,
        mechanics: ['water', 'fertilize'],
        funFact: 'Nigeria is one of the largest pepper producers in the world.',
        businessNote: 'Profit margin: ~260% ROI. Multiple harvest windows per season boost income.',
        stages: [
            { name: 'Nursery Prep', emoji: '🟫', desc: 'Loamy compost mix with 25–30°C temperature.' },
            { name: 'Seed Sowing', emoji: '🌱', desc: 'Sow 1cm deep. Keep moist but never waterlogged.' },
            { name: 'Germination', emoji: '🌿', desc: 'Seeds crack open (Day 10–21).' },
            { name: 'Transplanting', emoji: '🪴', desc: 'At 6 weeks, transplant seedlings at 50cm spacing.' },
            { name: 'Vegetative Growth', emoji: '🌿🌿', desc: 'Apply nitrogen-rich fertilizer now.' },
            { name: 'Flowering & Fruit', emoji: '🌼', desc: 'Peppers form. Maintain consistent moisture.' },
            { name: 'Ready to Harvest! 🏆', emoji: '🌶️✨', desc: 'Pick once fully coloured (red/orange).' }
        ]
    },
    // ── LEVEL 3: HARD ──────────────────────────────────────────────────────────
    {
        id: 'watermelon',
        level: 3,
        name: 'Watermelon',
        emoji: '🍉',
        color: '#00C851',
        difficulty: 'hard',
        seedCost: 400,
        harvestValue: 1500,
        mechanics: ['water', 'fertilize', 'pestcontrol'],
        funFact: 'Watermelons are 91% water. Nigeria produces over 700,000 tonnes annually.',
        businessNote: 'Profit margin: ~275% ROI. High risk but premium market pricing.',
        stages: [
            { name: 'Deep Soil Prep', emoji: '🟫', desc: 'Till 30–40cm deep for expansive root systems.' },
            { name: 'Direct Sowing', emoji: '🌱', desc: 'Plant 3 seeds per hill, 2m apart.' },
            { name: 'Germination', emoji: '🌿', desc: 'Seedlings emerge in 3–10 days.' },
            { name: 'Vine Establishment', emoji: '🌿🌿', desc: 'Vines begin to sprawl rapidly.' },
            { name: 'Flowering & Bees', emoji: '🌺', desc: 'Bees must transfer pollen between flowers!' },
            { name: 'Fruit Swelling', emoji: '🟢', desc: 'Apply potassium-rich fertilizer now.' },
            { name: 'Ready to Harvest! 🏆', emoji: '🍉✨', desc: 'Cut with a sharp knife leaving a 5cm stem.' }
        ]
    },
    // ── LEVEL 4: ADVANCED ──────────────────────────────────────────────────────
    {
        id: 'cocoa',
        level: 4,
        name: 'Cocoa (The Gold Standard)',
        emoji: '🍫',
        color: '#795548',
        difficulty: 'hard',
        seedCost: 1000,
        harvestValue: 4500,
        mechanics: ['water', 'fertilize', 'pestcontrol'],
        funFact: 'Nigeria is a top global cocoa producer. A cocoa tree can live for 100 years!',
        businessNote: 'Long-term investment. High initial cost, massive lifetime returns.',
        stages: [
            { name: 'Shade Setup', emoji: '🌂', desc: 'Young cocoa needs shade from plantain or palm trees.' },
            { name: 'Nursery Sprouting', emoji: '🌱', desc: 'Careful monitoring of humidity.' },
            { name: 'Main Field Prep', emoji: '🟫', desc: 'Lining and pegging for optimal tree spacing.' },
            { name: 'Tree Maturity', emoji: '🌳', desc: 'Pruning is essential to maximize pods.' },
            { name: 'Pod Formation', emoji: '🍈', desc: 'Pods grow directly on the trunk (cauliflory).' },
            { name: 'Fermentation Prep', emoji: '📦', desc: 'Pods are turning yellow/orange. Harvest is near.' },
            { name: 'Ready to Harvest! 🏆', emoji: '🍫✨', desc: 'The beans are ready for the market!' }
        ]
    },
    // ── LEVEL 5: MASTER ────────────────────────────────────────────────────────
    {
        id: 'rotation_master',
        level: 5,
        name: 'Strategic Crop Rotation',
        emoji: '♻️',
        color: '#9C27B0',
        difficulty: 'hard',
        seedCost: 0,
        harvestValue: 8000,
        mechanics: ['water', 'fertilize', 'pestcontrol'],
        isRotation: true,
        funFact: 'Mastering rotation is the peak of modern sustainable agriculture.',
        businessNote: 'Reduces dependency on chemical fertilizers by 40%.',
        stages: [
            { name: 'System Analysis', emoji: '📊', desc: 'Mapping soil nutrient depletion from past seasons.' },
            { name: 'Legume Phase', emoji: '🥜', desc: 'Planting groundnuts to fix nitrogen back into soil.' },
            { name: 'Cereal Cycle', emoji: '🌽', desc: 'Maize uses the fixed nitrogen for rapid growth.' },
            { name: 'Vegetable Flush', emoji: '🍅', desc: 'Tomatoes clear pathogens.' },
            { name: 'Cover Crop Lock', emoji: '🍀', desc: 'Cover crops protect the soil from erosion.' },
            { name: 'Soil Restoration', emoji: '✨', desc: 'Soil health is fully restored and optimized.' },
            { name: 'Master Harvest! 🏆', emoji: '💰✨', desc: 'Maximum yield across the entire rotation cycle!' }
        ]
    }
];

const DIFFICULTY_CONFIG = {
    easy: { color: '#00C851', label: 'EASY', waterThreshold: 35, fertThreshold: null, pestChance: 0, description: 'Water management only.' },
    normal: { color: '#FF9800', label: 'NORMAL', waterThreshold: 40, fertThreshold: 50, pestChance: 0.1, description: 'Water + Fertilize.' },
    hard: { color: '#FF4444', label: 'HARD', waterThreshold: 45, fertThreshold: 55, pestChance: 0.22, description: 'Full management.' }
};

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

const DifficultyBadge = ({ diff }) => {
    const d = DIFFICULTY_CONFIG[diff];
    return (
        <span style={{
            backgroundColor: `${d.color}22`, border: `1px solid ${d.color}`,
            color: d.color, borderRadius: '20px', padding: '3px 10px',
            fontSize: '0.75rem', fontWeight: 'bold'
        }}>
            {diff === 'easy' ? '🟢' : diff === 'normal' ? '🟡' : '🔴'} {d.label}
        </span>
    );
};

const StatBar = ({ label, value, max = 100, color, icon }) => (
    <div style={{ marginBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>{icon} {label}</span>
            <span style={{ color: value < 35 ? '#FF4444' : value < 65 ? '#FF9800' : color, fontWeight: 'bold' }}>
                {value}%{value < 35 ? ' — Critical!' : value < 60 ? ' — Low' : ' ✅'}
            </span>
        </div>
        <div style={{ height: '8px', backgroundColor: '#222', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
                width: `${value}%`, height: '100%', borderRadius: '4px',
                backgroundColor: value < 35 ? '#FF4444' : value < 60 ? '#FF9800' : color,
                transition: 'width 0.5s, background-color 0.3s'
            }} />
        </div>
    </div>
);

const StageTimeline = ({ stages, currentStage, color }) => (
    <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', padding: '0.5rem 0' }}>
            {stages.map((s, i) => (
                <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: i > currentStage ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: i < currentStage ? '#00C851' : i === currentStage ? color : '#222',
                            border: i === currentStage ? `3px solid white` : '1px solid #333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                            boxShadow: i === currentStage ? `0 0 14px ${color}88` : 'none', transition: 'all 0.3s'
                        }}>
                            {i < currentStage ? '✅' : s.emoji.split(' ')[0]}
                        </div>
                        <span style={{ fontSize: '0.55rem', color: i === currentStage ? color : '#666', maxWidth: '42px', textAlign: 'center', lineHeight: 1.2 }}>
                            {s.name.split('!')[0].substring(0, 16)}
                        </span>
                    </div>
                    {i < stages.length - 1 && (
                        <div style={{ width: '20px', height: '2px', marginBottom: '14px', backgroundColor: i < currentStage ? '#00C851' : '#2a2a2a', transition: 'background-color 0.3s' }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);

const TeenAdultFarmSimulator = ({ ageGroup = 'teens', currency = '₦' }) => {
    const { user } = useAuth();
    const { addEarnings } = useWallet();
    const { addPoints } = useGamification();
    const isAdult = ageGroup === 'adults' || ageGroup === 'Adults';
    const isElite = user?.isElite && (!user?.eliteExpires || new Date(user.eliteExpires) > new Date());

    // Growth Duration Calculation
    // Teens: 300s / 5 transitions = 60s per stage -> Reduced to 8s
    // Adults: 600s / 5 transitions = 120s per stage -> Reduced to 15s
    const STAGE_DURATION = isAdult ? 15000 : 8000;

    const [currentLevel, setCurrentLevel] = useState(() => parseInt(localStorage.getItem(isAdult ? 'adultFarmLevel' : 'teenFarmLevel')) || 1);
    const [phase, setPhase] = useState('pick'); // 'pick' | 'growing' | 'done'
    const [chosenId, setChosenId] = useState(null);
    const [stage, setStage] = useState(0);
    const [moisture, setMoisture] = useState(100);
    const [fertility, setFertility] = useState(80);
    const [pestLevel, setPestLevel] = useState(0);
    const [weedLevel, setWeedLevel] = useState(0);
    const [growing, setGrowing] = useState(false);
    const [waterCount, setWaterCount] = useState(0);
    const [fertCount, setFertCount] = useState(0);
    const [pestCount, setPestCount] = useState(0);
    const [weedCount, setWeedCount] = useState(0);
    const [pestAlert, setPestAlert] = useState(false);
    const [showBiz, setShowBiz] = useState(false);
    const [showFact, setShowFact] = useState(false);
    const [celebrateHarvest, setCelebrateHarvest] = useState(false);
    const timerRef = useRef(null);

    const crop = chosenId ? CROP_CATALOGUE.find(c => c.id === chosenId) : null;
    const config = crop ? DIFFICULTY_CONFIG[crop.difficulty] : null;
    const isLastStage = crop && stage === crop.stages.length - 1;

    const canGrow = crop && moisture >= (config?.waterThreshold || 35) &&
        (crop.difficulty === 'easy' || fertility >= (config?.fertThreshold || 40)) &&
        pestLevel < 70;

    // resource drain is handled by the useEffect below


    // Persist Level
    useEffect(() => {
        localStorage.setItem(isAdult ? 'adultFarmLevel' : 'teenFarmLevel', currentLevel);
    }, [currentLevel, isAdult]);

    // Resource Drain logic: Moisture hits critical (~35%) every 40-50s
    useEffect(() => {
        if (phase !== 'growing' || !crop) return;
        const drain = setInterval(() => {
            // Drop 4% every 2.5s = 1.6% per sec. 65% drop in 40.6s.
            // Weed Competition: >50% weeds = 1.5x moisture loss & 2x fertility loss
            const weedMultiplierM = weedLevel > 50 ? 1.5 : 1;
            const weedMultiplierF = weedLevel > 50 ? 2.0 : 1;

            const mLoss = 4 * weedMultiplierM;
            const fLoss = (crop.difficulty !== 'easy' ? 3 : 0) * weedMultiplierF;

            setMoisture(prev => Math.max(0, prev - mLoss));
            if (crop.difficulty !== 'easy') setFertility(prev => Math.max(0, prev - fLoss));

            // Weed Growth: faster if moisture is high
            if (moisture > 30) {
                setWeedLevel(prev => Math.min(100, prev + (isAdult ? 7 : 5)));
            }

            // Pest chance
            if (crop.difficulty !== 'easy' && Math.random() < (config?.pestChance || 0)) {
                setPestLevel(prev => {
                    const next = Math.min(100, prev + 25);
                    if (next >= 40) setPestAlert(true);
                    return next;
                });
            }
        }, 2500);
        return () => clearInterval(drain);
    }, [phase, crop, config, weedLevel, moisture, fertility, isAdult]);

    // Auto-grow when conditions met
    useEffect(() => {
        if (phase !== 'growing' || !growing || !canGrow || isLastStage) return;
        timerRef.current = setTimeout(() => {
            setStage(prev => {
                const next = prev + 1;
                if (next >= (crop?.stages.length || 1) - 1) setGrowing(false);
                return next;
            });
        }, STAGE_DURATION);
        return () => clearTimeout(timerRef.current);
    }, [phase, growing, stage, canGrow, isLastStage, STAGE_DURATION, crop]);

    // Stop growing if conditions fail
    useEffect(() => {
        if (!canGrow) { setGrowing(false); clearTimeout(timerRef.current); }
        else if (phase === 'growing' && !isLastStage && !growing) setGrowing(true);
    }, [canGrow, phase, isLastStage]);

    const handleChoose = (id) => {
        setChosenId(id);
        setPhase('growing');
        setStage(1);
        setMoisture(100);
        setFertility(80);
        setPestLevel(0);
        setWeedLevel(0);
        setGrowing(true);
        setWaterCount(0); setFertCount(0); setPestCount(0); setWeedCount(0);
        setPestAlert(false);
    };

    const handleWater = () => { setMoisture(100); setWaterCount(w => w + 1); };
    const handleFertilize = () => { setFertility(100); setFertCount(f => f + 1); };
    const handleSpray = () => { setPestLevel(0); setPestAlert(false); setPestCount(p => p + 1); };
    const handleWeed = () => { setWeedLevel(0); setWeedCount(w => w + 1); };

    const computeBonus = () => {
        // Efficiency bonus: fewer inputs = higher efficiency
        const inputScore = waterCount + fertCount * 0.8 + pestCount * 0.5;
        if (inputScore <= 5) return 1.3;
        if (inputScore <= 10) return 1.15;
        return 1.0;
    };

    const handleHarvest = () => {
        const bonus = computeBonus();
        const earned = Math.floor((crop?.harvestValue || 0) * bonus);
        addEarnings('agri', earned);
        addPoints(isAdult ? 120 : 90);
        setCelebrateHarvest(true);
        setTimeout(() => setCelebrateHarvest(false), 4000);
        setPhase('done');
    };

    const resetAll = () => {
        setPhase('pick'); setChosenId(null); setStage(0);
        setMoisture(100); setFertility(80); setPestLevel(0); setWeedLevel(0);
        setGrowing(false); setWaterCount(0); setFertCount(0); setPestCount(0); setWeedCount(0);
        setPestAlert(false); setShowBiz(false); setShowFact(false);
    };

    const earned = phase === 'done' && crop ? Math.floor(crop.harvestValue * computeBonus()) : 0;

    return (
        <div>
            {/* ── CROP PICKER ─────────────────────────────────────────── */}
            {phase === 'pick' && (
                <div style={{ animation: 'popIn 0.4s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Farm Status 🌱</h2>
                        <div style={{ backgroundColor: '#FFD700', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            Level {currentLevel} Mastery
                        </div>
                    </div>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        {isAdult
                            ? 'Select your crop. Manage water, nutrients, and pests to maximise your profit margin.'
                            : 'Pick a crop and run your farm. Harder crops need more care but earn more!'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {CROP_CATALOGUE.map(c => {
                            const isLvlLocked = c.level > currentLevel;
                            const isEliteLocked = (c.id === 'watermelon' || c.id === 'cocoa' || c.level >= 3) && !isElite;
                            const isLocked = isLvlLocked || isEliteLocked;
                            const isCurrent = c.level === currentLevel;

                            return (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        if (isLvlLocked) {
                                            alert(`Complete Level ${c.level - 1} to unlock ${c.name}!`);
                                        } else if (isEliteLocked) {
                                            if (window.confirm(`🔴 ${c.name} is for ELITE members only. Join the Elite Mastery tier to unlock advanced farming. Upgrade now?`)) {
                                                window.location.hash = "#finance";
                                            }
                                        } else {
                                            handleChoose(c.id);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        border: `2px solid ${isLocked ? '#333' : isCurrent ? 'var(--color-primary)' : c.color}`,
                                        borderRadius: '15px', padding: '1.25rem', textAlign: 'left',
                                        cursor: isLocked ? 'not-allowed' : 'pointer', color: '#fff', fontFamily: 'inherit', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        opacity: isLocked ? 0.6 : 1,
                                        position: 'relative',
                                        filter: isLvlLocked ? 'grayscale(1)' : 'none'
                                    }}>
                                    <span style={{ fontSize: '2.8rem', flexShrink: 0 }}>{isLvlLocked ? '🔒' : isEliteLocked ? '💎' : c.emoji}</span>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: isLocked ? '#666' : c.color }}>{c.name}</span>
                                            <DifficultyBadge diff={c.difficulty} />
                                            <span style={{ fontSize: '0.7rem', color: isCurrent ? 'var(--color-primary)' : '#666', fontWeight: 'bold' }}>Lvl {c.level}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: '#666', flexWrap: 'wrap' }}>
                                            <span>💰 Harvest: {currency}{c.harvestValue}</span>
                                            <span>🌾 Seed: {currency}{c.seedCost}</span>
                                        </div>

                                        <div style={{ fontSize: '0.75rem', color: isEliteLocked ? 'var(--color-primary)' : '#555', marginTop: '4px', fontWeight: isEliteLocked ? 'bold' : 'normal' }}>
                                            {isLvlLocked ? `Unlocks at Level ${c.level}` : isEliteLocked ? '💎 ELITE MASTERY REQUIRED' : `🔧 Manage: ${c.mechanics.join(' + ')}`}
                                        </div>
                                    </div>
                                    {!isLocked && (
                                        <div style={{
                                            backgroundColor: isCurrent ? 'var(--color-primary)' : c.color,
                                            color: isCurrent ? '#fff' : '#000',
                                            borderRadius: '20px', padding: '0.35rem 0.8rem', fontSize: '0.78rem', fontWeight: 'bold', whiteSpace: 'nowrap'
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

            {/* ── GROWING PHASE ────────────────────────────────────────── */}
            {phase === 'growing' && crop && (
                <div style={{ animation: 'popIn 0.4s ease' }}>
                    {celebrateHarvest && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem', gap: '1.5rem' }}>
                            🎊 💰 🌾
                        </div>
                    )}

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.8rem' }}>{crop.emoji}</span>
                            <div>
                                <h2 style={{ color: crop.color, margin: 0, fontSize: '1.15rem' }}>{crop.name}</h2>
                                <DifficultyBadge diff={crop.difficulty} />
                            </div>
                        </div>
                        <button onClick={resetAll} style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#666', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}>🔄 New Crop</button>
                    </div>

                    {/* Stage Timeline */}
                    <StageTimeline stages={crop.stages} currentStage={stage} color={crop.color} />

                    {/* Current Stage Card */}
                    <div style={{
                        textAlign: 'center', padding: '1.75rem 1rem', backgroundColor: '#111',
                        borderRadius: '18px', border: `2px solid ${crop.color}44`, marginBottom: '1.25rem'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem', animation: growing ? 'pulse 1.5s infinite' : 'none' }}>
                            {crop.stages[stage]?.emoji}
                        </div>
                        <h3 style={{ color: crop.color, margin: '0 0 0.5rem' }}>{crop.stages[stage]?.name}</h3>
                        <p style={{ color: '#ccc', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                            {crop.stages[stage]?.desc}
                        </p>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#555' }}>
                            Stage {stage} / {crop.stages.length - 1}
                        </div>
                    </div>

                    {/* ── RESOURCE BARS ── */}
                    <div style={{ backgroundColor: '#111', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', border: '1px solid #222' }}>
                        <StatBar label="Soil Moisture" value={moisture} color="#00BFFF" icon="💧" />
                        {crop.difficulty !== 'easy' && <StatBar label="Soil Fertility" value={fertility} color="#FFD700" icon="✨" />}
                        <StatBar label="Weed Pressure" value={weedLevel} color="#4CAF50" icon="🌿" />
                        {crop.difficulty === 'hard' && (
                            <div style={{ marginTop: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                                    <span style={{ color: '#aaa' }}>🐛 Pest Pressure</span>
                                    <span style={{ color: pestLevel > 60 ? '#FF4444' : pestLevel > 30 ? '#FF9800' : '#00C851', fontWeight: 'bold' }}>
                                        {pestLevel}% {pestLevel > 60 ? '— Critical! Spray now!' : pestLevel > 30 ? '— Watch out' : '— Under control ✅'}
                                    </span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: '#222', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pestLevel}%`, height: '100%', borderRadius: '4px', backgroundColor: pestLevel > 60 ? '#FF4444' : pestLevel > 30 ? '#FF9800' : '#666', transition: 'width 0.5s' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pest Alert */}
                    {pestAlert && crop.difficulty === 'hard' && (
                        <div style={{ backgroundColor: 'rgba(255,68,68,0.12)', border: '1px solid #FF4444', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#FF4444', fontSize: '0.9rem' }}>🐛 Pest infestation detected! Spray before crop dies.</span>
                            <button onClick={handleSpray} className="btn" style={{ backgroundColor: '#FF4444', color: 'white', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>🧪 Spray Now</button>
                        </div>
                    )}

                    {/* Growth pause warning */}
                    {!canGrow && !isLastStage && (
                        <div style={{ backgroundColor: 'rgba(255,68,68,0.08)', border: '1px solid #FF444466', borderRadius: '10px', padding: '0.7rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#FF4444' }}>
                            ⚠️ Growth paused — fix resource levels below!
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${crop.mechanics.length + 1 + (isLastStage ? 1 : 0)}, 1fr)`, gap: '0.75rem', marginBottom: '1rem' }}>
                        {!isLastStage && (
                            <>
                                <button onClick={handleWater} className="btn" style={{ backgroundColor: '#00BFFF', color: '#000', fontWeight: 'bold', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '0.75rem' }}>
                                    💧<span style={{ fontSize: '0.75rem' }}>Water</span>
                                </button>
                                <button onClick={handleWeed} className="btn" style={{ backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '0.75rem' }}>
                                    🧹<span style={{ fontSize: '0.75rem' }}>Weed</span>
                                </button>
                            </>
                        )}
                        {crop.difficulty !== 'easy' && !isLastStage && (
                            <button onClick={handleFertilize} className="btn" style={{ backgroundColor: '#FFD700', color: '#000', fontWeight: 'bold', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '0.75rem' }}>
                                ✨<span style={{ fontSize: '0.75rem' }}>Fertilize</span>
                            </button>
                        )}
                        {crop.difficulty === 'hard' && !isLastStage && (
                            <button onClick={handleSpray} className="btn" style={{ backgroundColor: '#9C27B0', color: '#fff', fontWeight: 'bold', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '0.75rem' }}>
                                🧪<span style={{ fontSize: '0.75rem' }}>Spray</span>
                            </button>
                        )}
                        {isLastStage && (
                            <button onClick={handleHarvest} className="btn" style={{ backgroundColor: crop.color, color: '#000', fontWeight: 'bold', fontSize: '1rem', padding: '0.9rem', gridColumn: '1 / -1' }}>
                                🌾 Harvest Now! Earn {currency}{Math.floor(crop.harvestValue * computeBonus())}
                            </button>
                        )}
                    </div>

                    {/* Info Toggles */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button onClick={() => setShowFact(f => !f)} className="btn btn-outline" style={{ flex: 1, color: crop.color, borderColor: `${crop.color}66`, fontSize: '0.85rem' }}>
                            💡 {showFact ? 'Hide' : 'Crop Fact'}
                        </button>
                        {isAdult && (
                            <button onClick={() => setShowBiz(b => !b)} className="btn btn-outline" style={{ flex: 1, color: '#FFD700', borderColor: '#FFD70066', fontSize: '0.85rem' }}>
                                📊 {showBiz ? 'Hide' : 'Business Intel'}
                            </button>
                        )}
                    </div>

                    {showFact && (
                        <div style={{ marginTop: '0.75rem', backgroundColor: '#111', border: `1px solid ${crop.color}33`, borderRadius: '12px', padding: '1rem', animation: 'popIn 0.3s ease' }}>
                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>
                                <strong style={{ color: crop.color }}>🌍 Did you know? </strong>{crop.funFact}
                            </p>
                        </div>
                    )}

                    {showBiz && isAdult && (
                        <div style={{ marginTop: '0.75rem', backgroundColor: '#111', border: '1px solid #FFD70044', borderRadius: '12px', padding: '1rem', animation: 'popIn 0.3s ease' }}>
                            <p style={{ color: '#FFD700', fontWeight: 'bold', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>📈 Business Intelligence</p>
                            <p style={{ color: '#ccc', margin: '0 0 0.5rem', fontSize: '0.88rem' }}>{crop.businessNote}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                                {[['Seed Cost', `${currency}${crop.seedCost}`, '#FF4444'], ['Gross Revenue', `${currency}${crop.harvestValue}`, '#00C851'], ['Gross Profit', `${currency}${crop.harvestValue - crop.seedCost}`, '#FFD700']].map(([l, v, c]) => (
                                    <div key={l} style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '0.6rem' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#666' }}>{l}</div>
                                        <div style={{ color: c, fontWeight: 'bold', fontSize: '1rem' }}>{v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── HARVEST DONE ─────────────────────────────────────────── */}
            {phase === 'done' && crop && (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'popIn 0.5s ease' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '0.75rem' }}>{crop.emoji}</div>
                    <h2 style={{ color: '#00C851', marginBottom: '0.5rem' }}>Harvest Complete! 🏆</h2>
                    <DifficultyBadge diff={crop.difficulty} />

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
                        {[
                            ['💰', `+${currency}${earned}`, '#00C851', 'Earned'],
                            ['⭐', `+${isAdult ? 120 : 90} XP`, '#FFD700', 'XP'],
                            ['💧', `${waterCount}×`, '#00BFFF', 'Watered'],
                            ['🧹', `${weedCount}×`, '#4CAF50', 'Weeding'],
                            crop.difficulty !== 'easy' && ['✨', `${fertCount}×`, '#FFD700', 'Fertilized'],
                            crop.difficulty === 'hard' && ['🧪', `${pestCount}×`, '#9C27B0', 'Sprayed']
                        ].filter(Boolean).map(([e, v, c, l]) => (
                            <div key={l} style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1rem', minWidth: '80px' }}>
                                <div style={{ fontSize: '1.5rem' }}>{e}</div>
                                <div style={{ color: c, fontWeight: 'bold' }}>{v}</div>
                                <div style={{ fontSize: '0.7rem', color: '#555' }}>{l}</div>
                            </div>
                        ))}
                    </div>

                    {computeBonus() > 1 && (
                        <div style={{ backgroundColor: 'rgba(255,213,0,0.08)', border: '1px solid #FFD70044', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                            <strong style={{ color: '#FFD700' }}>⭐ Efficiency Bonus!</strong>
                            <p style={{ color: '#ccc', margin: '0.4rem 0 0', fontSize: '0.88rem' }}>
                                You managed your farm with minimal inputs — bonus {Math.round((computeBonus() - 1) * 100)}% applied to your harvest value!
                            </p>
                        </div>
                    )}

                    <div style={{ backgroundColor: '#1a1a1a', borderRadius: '15px', padding: '1.25rem', marginBottom: '2rem', border: `1px solid ${crop.color}44`, textAlign: 'left' }}>
                        <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 0.5rem', fontWeight: 'bold' }}>🌍 {crop.isRotation ? 'Mastery Insight' : 'Real-World Learning'}</p>
                        <p style={{ color: '#ccc', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>{crop.funFact}</p>
                        <div style={{ backgroundColor: 'rgba(76,175,80,0.1)', borderLeft: '3px solid #4CAF50', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem' }}>
                            <small style={{ color: '#aaa' }}>💡 <strong>Agripreneur Tip:</strong> Pulled weeds can be recycled into <strong>compost</strong> or used as <strong>mulch</strong>! This is a core part of "Waste to Wealth" — turning a farm problem into a soil nutrient solution.</small>
                        </div>
                        {isAdult && <p style={{ color: '#888', margin: 0, fontSize: '0.82rem', borderTop: '1px solid #222', paddingTop: '0.5rem', marginTop: '0.5rem' }}>📈 {crop.businessNote}</p>}
                    </div>

                    <button
                        onClick={() => {
                            if (crop.level === currentLevel && currentLevel < 5) {
                                setCurrentLevel(prev => prev + 1);
                            }
                            resetAll();
                        }}
                        className="btn"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '1.05rem', padding: '0.9rem 2.5rem' }}
                    >
                        {crop.level < currentLevel ? '🌱 Plant Again' : crop.level < 5 ? '🌱 Unlock Next Level!' : '🌱 Master Another Rotation'}
                    </button>
                </div>
            )}

            <style>{`
                @keyframes popIn { 0%{transform:scale(0.9);opacity:0} 80%{transform:scale(1.02)} 100%{transform:scale(1);opacity:1} }
                @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
            `}</style>
        </div>
    );
};

export default TeenAdultFarmSimulator;
