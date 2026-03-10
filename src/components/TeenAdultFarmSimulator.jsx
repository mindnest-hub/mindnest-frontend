import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';

// ─── CROP CATALOGUE ────────────────────────────────────────────────────────────
// Each crop has a difficulty tier.
// Easy = water only
// Normal = water + fertilize
// Hard = water + fertilize + pest control + pruning

const CROP_CATALOGUE = [
    // ── EASY ─────────────────────────────────────────────────────────────────
    {
        id: 'sweet_potato',
        name: 'Sweet Potato',
        emoji: '🍠',
        color: '#FF9800',
        difficulty: 'easy',
        difficultyLabel: '🟢 Easy',
        seedCost: 150,
        harvestValue: 500,
        germinationDays: '7–10 days',
        growthDays: '90–120 days',
        mechanics: ['water'],
        funFact: 'Sweet potato is one of the most drought-tolerant crops in Nigeria. Vines can be planted without seeds!',
        businessNote: 'Profit margin: ~240% ROI. Very low input, steady local demand.',
        stages: [
            { name: 'Soil Prep', emoji: '🟫', desc: 'Ridge or mound the soil for drainage. Sweet potatoes need loose, well-drained earth.' },
            { name: 'Vine Cutting Planted', emoji: '🌱', desc: 'Plant vine cuttings (not seeds) horizontally in ridges. Water lightly.' },
            { name: 'Sprouting', emoji: '🌿', desc: 'Shoots emerge within 7–10 days. Roots begin anchoring underground.' },
            { name: 'Vine Spread', emoji: '🌿🌿', desc: 'Vines sprawl across the ground. This ground cover suppresses weeds naturally!' },
            { name: 'Root Swelling', emoji: '🟤', desc: 'Underground tubers begin to swell with starch. Reduce watering to avoid rot.' },
            { name: 'Maturation', emoji: '🍠', desc: 'Leaves start yellowing — the plant signals readiness. Test-dig one storage root.' },
            { name: 'Ready to Harvest! 🏆', emoji: '🍠✨', desc: 'Lift tubers carefully with a fork. Cure in the sun for 4–7 days before selling.' }
        ]
    },
    // ── NORMAL ───────────────────────────────────────────────────────────────
    {
        id: 'pepper',
        name: 'Scotch Bonnet Pepper',
        emoji: '🌶️',
        color: '#FF4444',
        difficulty: 'normal',
        difficultyLabel: '🟡 Normal',
        seedCost: 250,
        harvestValue: 900,
        germinationDays: '10–21 days',
        growthDays: '80–100 days',
        mechanics: ['water', 'fertilize'],
        funFact: 'Nigeria is one of the largest pepper producers in the world. Scotch bonnets command premium prices in markets.',
        businessNote: 'Profit margin: ~260% ROI. Multiple harvest windows per season boost income.',
        stages: [
            { name: 'Nursery Prep', emoji: '🟫', desc: 'Prepare seedling trays with loamy compost mix. Pepper seeds need 25–30°C to germinate.' },
            { name: 'Seed Sowing', emoji: '🌱', desc: 'Sow seeds 1cm deep. Cover lightly. Keep moist — never waterlogged.' },
            { name: 'Germination', emoji: '🌿', desc: 'Seeds crack open and cotyledons push above soil (Day 10–21). Guard against damping off.' },
            { name: 'Transplanting', emoji: '🪴', desc: 'At 6 weeks, transplant seedlings at 50cm spacing. Water immediately after transplant.' },
            { name: 'Vegetative Growth', emoji: '🌿🌿', desc: 'Apply nitrogen-rich fertilizer now for strong leafy growth. Stake tall plants.' },
            { name: 'Flowering', emoji: '🌼', desc: 'White/purple flowers appear. Avoid excess nitrogen now — switch to phosphorus fertilizer.' },
            { name: 'Fruit Set', emoji: '🟡', desc: 'Peppers form and grow. Maintain consistent moisture — drought causes blossom drop.' },
            { name: 'Ready to Harvest! 🏆', emoji: '🌶️✨', desc: 'Pick once fully coloured (red/orange). Leave some to continue producing for a second flush.' }
        ]
    },
    // ── HARD ─────────────────────────────────────────────────────────────────
    {
        id: 'watermelon',
        name: 'Watermelon',
        emoji: '🍉',
        color: '#00C851',
        difficulty: 'hard',
        difficultyLabel: '🔴 Hard',
        seedCost: 400,
        harvestValue: 1500,
        germinationDays: '3–10 days',
        growthDays: '70–85 days',
        mechanics: ['water', 'fertilize', 'pestcontrol'],
        funFact: 'Watermelons are 91% water. Nigeria produces over 700,000 tonnes annually, mostly in Kano and Zamfara.',
        businessNote: 'Profit margin: ~275% ROI. High risk but premium market pricing, especially in dry season.',
        stages: [
            { name: 'Deep Soil Prep', emoji: '🟫', desc: 'Till 30–40cm deep. Watermelons need deeply aerated soil for expansive root systems. Add organic matter.' },
            { name: 'Direct Sowing', emoji: '🌱', desc: 'Plant 3 seeds per hill, 2m apart. Thin to 2 strongest after germination.' },
            { name: 'Germination', emoji: '🌿', desc: 'Seedlings emerge in 3–10 days. Two seed leaves (cotyledons) open first. Thin weak seedlings.' },
            { name: 'Vine Establishment', emoji: '🌿🌿', desc: 'Vines begin to sprawl rapidly. Apply starter fertilizer with high phosphorus.' },
            { name: 'Rapid Vine Growth', emoji: '🍃🍃', desc: 'Vines can grow 30cm/day! Watch for aphids and cucumber beetles. Apply neem oil spray if spotted.' },
            { name: 'Flowering & Pollination', emoji: '🌺', desc: 'Male flowers appear first, then females (with tiny melon base). Bees must transfer pollen!' },
            { name: 'Fruit Set & Swelling', emoji: '🟢', desc: 'Fertilized fruits swell fast. Apply potassium-rich fertilizer. One fruit per vine for max size.' },
            { name: 'Maturation', emoji: '🍉', desc: 'Yellow ground spot, dry tendril, and hollow thump = nearly ripe. Stop watering 1 week before harvest.' },
            { name: 'Ready to Harvest! 🏆', emoji: '🍉✨', desc: 'Cut with a sharp knife leaving a 5cm stem. Handle gently — bruising reduces market price.' }
        ]
    }
];

const DIFFICULTY_CONFIG = {
    easy: { color: '#00C851', label: 'EASY', waterThreshold: 35, fertThreshold: null, pestChance: 0, description: 'Water management only. Perfect for starting your agribusiness.' },
    normal: { color: '#FF9800', label: 'NORMAL', waterThreshold: 40, fertThreshold: 50, pestChance: 0.08, description: 'Water + Fertilize. Balance nutrients to maximise yield.' },
    hard: { color: '#FF4444', label: 'HARD', waterThreshold: 45, fertThreshold: 55, pestChance: 0.18, description: 'Water + Fertilize + Pest Control. Professional-grade farm management.' }
};

const STAGE_DURATION = 4500;

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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const TeenAdultFarmSimulator = ({ ageGroup = 'teens', currency = '₦' }) => {
    const { addEarnings } = useWallet();
    const { addPoints } = useGamification();
    const isAdult = ageGroup === 'adults' || ageGroup === 'Adults';

    const [phase, setPhase] = useState('pick'); // 'pick' | 'growing' | 'done'
    const [chosenId, setChosenId] = useState(null);
    const [stage, setStage] = useState(0);
    const [moisture, setMoisture] = useState(100);
    const [fertility, setFertility] = useState(80);
    const [pestLevel, setPestLevel] = useState(0);
    const [growing, setGrowing] = useState(false);
    const [waterCount, setWaterCount] = useState(0);
    const [fertCount, setFertCount] = useState(0);
    const [pestCount, setPestCount] = useState(0);
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

    // Drain stats over time
    useEffect(() => {
        if (phase !== 'growing') return;
        const interval = setInterval(() => {
            setSoilDrain();
        }, 2500);
        return () => clearInterval(interval);
    }, [phase, crop]);

    const setSoilDrain = () => {
        const moistureLoss = crop?.difficulty === 'hard' ? 8 : crop?.difficulty === 'normal' ? 6 : 5;
        const fertilityLoss = crop?.difficulty !== 'easy' ? 4 : 0;
        setSoilDrain._count = (setSoilDrain._count || 0) + 1;
        setSoilDrain = undefined; // remove the closure-captured version — we use the effect below
    };

    // Use separate effect for resource drain to avoid stale closure issue
    useEffect(() => {
        if (phase !== 'growing' || !crop) return;
        const drain = setInterval(() => {
            const mLoss = crop.difficulty === 'hard' ? 8 : crop.difficulty === 'normal' ? 6 : 5;
            const fLoss = crop.difficulty !== 'easy' ? 4 : 0;
            setSoilDrain && undefined; // no-op safety
            setMoisture(prev => Math.max(0, prev - mLoss));
            if (crop.difficulty !== 'easy') setFertility(prev => Math.max(0, prev - fLoss));

            // Pest chance
            if (crop.difficulty !== 'easy' && Math.random() < (config?.pestChance || 0)) {
                setPestLevel(prev => {
                    const next = Math.min(100, prev + 20);
                    if (next >= 40) setPestAlert(true);
                    return next;
                });
            }
        }, 2500);
        return () => clearInterval(drain);
    }, [phase, crop]);

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
    }, [phase, growing, stage, canGrow, isLastStage]);

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
        setGrowing(true);
        setWaterCount(0); setFertCount(0); setPestCount(0);
        setPestAlert(false);
    };

    const handleWater = () => { setMoisture(100); setWaterCount(w => w + 1); };
    const handleFertilize = () => { setFertility(100); setFertCount(f => f + 1); };
    const handleSpray = () => { setPestLevel(0); setPestAlert(false); setPestCount(p => p + 1); };

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
        setMoisture(100); setFertility(80); setPestLevel(0);
        setGrowing(false); setWaterCount(0); setFertCount(0); setPestCount(0);
        setPestAlert(false); setShowBiz(false); setShowFact(false);
    };

    const earned = phase === 'done' && crop ? Math.floor(crop.harvestValue * computeBonus()) : 0;

    return (
        <div>
            {/* ── CROP PICKER ─────────────────────────────────────────── */}
            {phase === 'pick' && (
                <div style={{ animation: 'popIn 0.4s ease' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Farm Status 🌱</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {isAdult
                            ? 'Select your crop. Manage water, nutrients, and pests to maximise your profit margin.'
                            : 'Pick a crop and run your farm. Harder crops need more care but earn more!'}
                    </p>
                    <div style={{
                        display: 'inline-flex', gap: '0.5rem', marginBottom: '1.5rem',
                        backgroundColor: '#111', borderRadius: '20px', padding: '6px 12px', flexWrap: 'wrap'
                    }}>
                        <span style={{ color: '#00C851', fontSize: '0.8rem' }}>🟢 Easy: water only</span>
                        <span style={{ color: '#888' }}>|</span>
                        <span style={{ color: '#FF9800', fontSize: '0.8rem' }}>🟡 Normal: +fertilize</span>
                        <span style={{ color: '#888' }}>|</span>
                        <span style={{ color: '#FF4444', fontSize: '0.8rem' }}>🔴 Hard: +pests</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {CROP_CATALOGUE.map(c => (
                            <button key={c.id} onClick={() => handleChoose(c.id)}
                                style={{
                                    backgroundColor: '#1a1a1a', border: `2px solid ${c.color}`,
                                    borderRadius: '15px', padding: '1.25rem', textAlign: 'left',
                                    cursor: 'pointer', color: '#fff', fontFamily: 'inherit', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', gap: '1rem'
                                }}>
                                <span style={{ fontSize: '2.8rem' }}>{c.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: c.color }}>{c.name}</span>
                                        <DifficultyBadge diff={c.difficulty} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: '#aaa', flexWrap: 'wrap' }}>
                                        <span>🌱 Germinates: {c.germinationDays}</span>
                                        <span>📅 Full: {c.growthDays}</span>
                                        <span>💰 Harvest: {currency}{c.harvestValue}</span>
                                        <span>🌾 Seed: {currency}{c.seedCost}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>
                                        🔧 Manage: {c.mechanics.join(' + ')}
                                        {isAdult && <span style={{ color: '#888', marginLeft: '0.5rem' }}>· {c.businessNote.split('.')[0]}</span>}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: c.color, color: '#000', borderRadius: '20px', padding: '0.35rem 0.8rem', fontSize: '0.78rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                    Plant ▶
                                </div>
                            </button>
                        ))}
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
                        {crop.difficulty !== 'easy' && <StatBar label="Soil Fertility" value={fertility} color="#00C851" icon="🌿" />}
                        {crop.difficulty === 'hard' && (
                            <div style={{ marginBottom: '0.5rem' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${crop.mechanics.length + (isLastStage ? 1 : 0)}, 1fr)`, gap: '0.75rem', marginBottom: '1rem' }}>
                        {!isLastStage && (
                            <button onClick={handleWater} className="btn" style={{ backgroundColor: '#00BFFF', color: '#000', fontWeight: 'bold', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '0.75rem' }}>
                                💧<span style={{ fontSize: '0.75rem' }}>Water</span>
                            </button>
                        )}
                        {crop.difficulty !== 'easy' && !isLastStage && (
                            <button onClick={handleFertilize} className="btn" style={{ backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '0.75rem' }}>
                                🌿<span style={{ fontSize: '0.75rem' }}>Fertilize</span>
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
                        {[['💰', `+${currency}${earned}`, '#00C851', 'Earned'], ['⭐', `+${isAdult ? 120 : 90} XP`, '#FFD700', 'XP'], ['💧', `${waterCount}×`, '#00BFFF', 'Watered'], crop.difficulty !== 'easy' && ['🌿', `${fertCount}×`, '#4CAF50', 'Fertilized'], crop.difficulty === 'hard' && ['🧪', `${pestCount}×`, '#9C27B0', 'Sprayed']].filter(Boolean).map(([e, v, c, l]) => (
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

                    {/* Real-world learning card */}
                    <div style={{ backgroundColor: '#1a1a1a', borderRadius: '15px', padding: '1.25rem', marginBottom: '2rem', border: `1px solid ${crop.color}44`, textAlign: 'left' }}>
                        <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 0.5rem', fontWeight: 'bold' }}>🌍 Real-World Learning</p>
                        <p style={{ color: '#ccc', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>{crop.funFact}</p>
                        {isAdult && <p style={{ color: '#888', margin: 0, fontSize: '0.82rem', borderTop: '1px solid #222', paddingTop: '0.5rem' }}>📈 {crop.businessNote}</p>}
                    </div>

                    <button onClick={resetAll} className="btn" style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '1.05rem', padding: '0.9rem 2.5rem' }}>
                        🌱 Try a Different Crop
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
