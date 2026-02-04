import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import SoilLab from '../components/SoilLab';
import AgriBusinessPlanner from '../components/AgriBusinessPlanner';
import InvestPitch from '../components/InvestPitch';
import { useWallet } from '../hooks/useWallet';

// Safe initialization helper
const safeInit = (key, defaultValue, type = 'number') => {
    try {
        const item = localStorage.getItem(key);
        if (item === null || item === "undefined") return defaultValue;
        if (type === 'boolean') return item === 'true';
        return Number(item) || defaultValue;
    } catch (e) {
        console.warn(`Error reading ${key}`, e);
        return defaultValue;
    }
};

const Agripreneurship = () => {
    const navigate = useNavigate();

    const { addEarnings, deductGlobal, balance, getAgeGroup } = useWallet();
    const safeGetAgeGroup = getAgeGroup || (() => 'kids');
    const ageGroup = safeGetAgeGroup() || 'kids';
    const isAdult = ageGroup !== 'kids' && ageGroup !== 'teens';

    // State with Safe Init
    const [isPremium, setIsPremium] = useState(false);
    const [soilMoisture, setSoilMoisture] = useState(80);
    const [cropStage, setCropStage] = useState(0);
    const [money, setMoney] = useState(1000);
    const [harvestCount, setHarvestCount] = useState(() => safeInit('agriHarvestCount', 0));
    const [showBank, setShowBank] = useState(false);
    const [showCert, setShowCert] = useState(false);
    const [weather, setWeather] = useState('Sunny ☀️');
    const [activeTab, setActiveTab] = useState('farm');
    const [toast, setToast] = useState(null);
    const [showTechQuiz, setShowTechQuiz] = useState(false);
    const [pendingUpgrade, setPendingUpgrade] = useState(null);

    // Processing state
    const [hasProcessingUnit, setHasProcessingUnit] = useState(() => safeInit('agriHasProcessing', false, 'boolean'));
    const [processedStock, setProcessedStock] = useState(() => safeInit('agriProcessedStock', 0));

    // Climate and upgrades state
    const [climateResilience, setClimateResilience] = useState(() => safeInit('agriResilience', 0));
    const [upgrades, setUpgrades] = useState({
        solar: false,
        seeds: false,
        vertical: false
    });

    const techQuizzes = {
        solar: { q: "Why is solar irrigation better for climate resilience?", options: ["It depends on rain", "It provides constant energy without fuel costs", "It makes the crops taste like sun"], a: 1 },
        seeds: { q: "What is the main benefit of drought-resistant seeds?", options: ["They need more water", "They can survive heatwaves", "They grow into giant trees"], a: 1 },
        vertical: { q: "How does vertical farming improve sustainability?", options: ["It uses more land", "It saves space and uses 90% less water", "It's closer to the clouds"], a: 1 }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Level State
    const [soldFlakes, setSoldFlakes] = useState(() => safeInit('agriSoldFlakes', 0));

    // Level Logic
    // 1. Novice: Start
    // 2. Smallholder: Harvests >= 3
    // 3. Processor: Money >= 2000
    // 4. Tech Farmer: Sold Flakes >= 5
    // 5. Agri-Tycoon: Resilience >= 50
    const getLevel = () => {
        try {
            if ((climateResilience || 0) >= 50 && (soldFlakes || 0) >= 5 && (money || 0) >= 2000 && (harvestCount || 0) >= 3) return 5;
            if ((soldFlakes || 0) >= 5 && (money || 0) >= 2000 && (harvestCount || 0) >= 3) return 4;
            if ((money || 0) >= 2000 && (harvestCount || 0) >= 3) return 3;
            if ((harvestCount || 0) >= 3) return 2;
            return 1;
        } catch (e) { return 1; }
    };

    const level = getLevel();
    const levelTitles = {
        1: { title: "Novice Farmer 👨‍u200d🌾", next: "Harvest 3 crops to level up!" },
        2: { title: "Smallholder 🚜", next: "Save ₦2,000 to unlock Processing!" },
        3: { title: "Processor 🏭", next: "Sell 5 boxes of Corn Flakes to unlock Tech!" },
        4: { title: "Tech Farmer ☀️", next: "Reach 50% Resilience to become a Tycoon!" },
        5: { title: "Agri-Tycoon 🤴", next: "You are a Master of Agriculture!" }
    };

    // Safe Level Access
    const currentLevelInfo = levelTitles[level] || levelTitles[1];

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Persistence
    useEffect(() => {
        localStorage.setItem('agriLevel', level);
        localStorage.setItem('agriSoldFlakes', soldFlakes);
        localStorage.setItem('agriResilience', climateResilience);
        localStorage.setItem('agriHasProcessing', hasProcessingUnit);
        localStorage.setItem('agriProcessedStock', processedStock);
    }, [level, soldFlakes, climateResilience, hasProcessingUnit, processedStock]);

    // Simulation tick
    useEffect(() => {
        const timer = setInterval(() => {
            // Solar irrigation reduces moisture loss
            const loss = upgrades.solar ? 2 : 5;
            setSoilMoisture(prev => Math.max(0, prev - loss));

            // Random Events based on Resilience
            if (Math.random() > 0.95) {
                const eventSeverity = Math.max(0, 100 - climateResilience);
                if (eventSeverity > 50) {
                    setWeather('Heatwave 🔥');
                    setSoilMoisture(prev => Math.max(0, prev - 20));
                } else {
                    setWeather('Sunny ☀️');
                }
            }
        }, 2000);
        return () => clearInterval(timer);
    }, [climateResilience, upgrades.solar]);

    const handleWater = () => {
        setSoilMoisture(100);
    };

    const handlePlant = () => {
        if (money >= 100) {
            setMoney(prev => prev - 100);
            setCropStage(1);
            setSoilMoisture(100);
        }
    };

    const handleHarvest = () => {
        if (cropStage === 2) {
            // If user has vertical farm, yield is higher
            const yieldMultiplier = upgrades.vertical ? 1.5 : 1;
            const yieldAmount = 300 * yieldMultiplier;

            if (hasProcessingUnit) {
                if (window.confirm("Harvest complete! Process into Corn Flakes for 3x value? (Requires time)")) {
                    setCropStage(0);
                    setProcessedStock(prev => prev + 1);
                    showToast("Processing... 🏭", 'info');
                } else {
                    setMoney(prev => prev + yieldAmount);
                    addEarnings('agri', yieldAmount);
                    setCropStage(3);
                    setTimeout(() => setCropStage(0), 2000);
                }
            } else {
                setMoney(prev => prev + yieldAmount);
                addEarnings('agri', yieldAmount);
                setCropStage(3);
                setTimeout(() => setCropStage(0), 2000);
            }
            setHarvestCount(prev => prev + 1);
        }
    };

    const handleSellProcessed = () => {
        if (processedStock > 0) {
            const earnings = 900; // 3x of 300
            setMoney(prev => prev + earnings);
            addEarnings('agri', earnings);
            setProcessedStock(prev => prev - 1);
            setSoldFlakes(prev => prev + 1);
            showToast("Sold Corn Flakes! 🥣 +₦900", 'success');
        }
    };

    const buyProcessingUnit = () => {
        if (level < 3) {
            showToast(`Locked! Reach Level 3 (Smallholder) to unlock. Need ₦2,000 capital.`, 'error');
            return;
        }
        if (money >= 5000) {
            setMoney(prev => prev - 5000);
            setHasProcessingUnit(true);
            showToast("Processing Unit Acquired! 🏭\nYou can now convert Maize into Corn Flakes.", 'success');
        } else {
            showToast("Insufficient funds. Need ₦5,000.", 'error');
        }
    };

    const buyUpgrade = (type, cost, resilienceBoost, requiredLevel) => {
        if (level < requiredLevel) {
            showToast(`Locked! Reach Level ${requiredLevel} to unlock this tech.`, 'error');
            return;
        }
        if (money >= cost && !upgrades[type]) {
            setPendingUpgrade({ type, cost, resilienceBoost });
            setShowTechQuiz(true);
        } else if (upgrades[type]) {
            showToast("Already owned!", 'info');
        } else {
            showToast(`Insufficient funds. Need ₦${cost.toLocaleString()}.`, 'error');
        }
    };

    const confirmUpgrade = () => {
        const { type, cost, resilienceBoost } = pendingUpgrade;
        setMoney(prev => prev - cost);
        setUpgrades(prev => ({ ...prev, [type]: true }));
        setClimateResilience(prev => prev + resilienceBoost);
        showToast(`${type.toUpperCase()} Upgrade Installed! Resilience +${resilienceBoost}% 🌍`, 'success');
        setShowTechQuiz(false);
        setPendingUpgrade(null);
    };

    const handleLabComplete = (score) => {
        const reward = Math.floor(score / 2);
        setMoney(prev => prev + reward);
        addEarnings('agri', reward);
        showToast(`Soil Lab complete! Earned ₦${reward}.`, 'success');
    };

    const handleDeal = (amount) => {
        setMoney(prev => prev + amount);
        addEarnings('agri', amount);
        showToast(`Funding Received! ₦${amount.toLocaleString()} added to your farm capital.`, 'success');
    };

    // Grow crop
    useEffect(() => {
        if (cropStage === 1 && soilMoisture > 30) {
            const growTimer = setTimeout(() => setCropStage(2), 5000);
            return () => clearTimeout(growTimer);
        }
    }, [cropStage, soilMoisture]);

    const getCropEmoji = () => {
        switch (cropStage) {
            case 0: return '🟫'; // Soil
            case 1: return '🌱'; // Sprout
            case 2: return '🌽'; // Corn/Maize (Mature)
            case 3: return '💰'; // Sold
            default: return '🟫';
        }
    };

    const isMasterAgripreneur = balance >= 5000 && harvestCount >= 3;

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start'
                }}
            >
                ← Back to Hub
            </button>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Smart Agri-Tech 🌱</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>Farm Smart. Pitch Big. Feed Africa.</p>

                {/* CAREER STATUS BAR */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid #FFD700', maxWidth: '600px', margin: '1.5rem auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>⭐ {currentLevelInfo.title}</span>
                        <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Level {level}/5</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ width: `${(level / 5) * 100}%`, height: '100%', backgroundColor: '#FFD700', transition: 'width 0.5s' }}></div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0 }}>Next Goal: {currentLevelInfo.next}</p>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="btn btn-outline" style={{ cursor: 'default', border: '1px solid var(--color-primary)', padding: '0.6rem 1.25rem' }}>
                        Farm Capital: <span style={{ color: '#00C851', fontWeight: 'bold' }}>₦{money.toLocaleString()}</span>
                    </div>
                    <div className="btn btn-outline" style={{ cursor: 'default', border: '1px solid #FF8800', padding: '0.6rem 1.25rem' }}>
                        Climate Resilience: <span style={{ color: climateResilience > 70 ? '#00C851' : climateResilience > 30 ? 'orange' : 'red', fontWeight: 'bold' }}>{climateResilience}%</span>
                    </div>
                </div>
            </header>

            {/* TAB NAVIGATION */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('farm')}
                    style={{ padding: '1rem 2rem', background: 'none', border: 'none', color: activeTab === 'farm' ? 'var(--color-primary)' : '#aaa', borderBottom: activeTab === 'farm' ? '3px solid var(--color-primary)' : 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    🚜 My Farm
                </button>
                <button
                    onClick={() => setActiveTab('soil')}
                    style={{ padding: '1rem 2rem', background: 'none', border: 'none', color: activeTab === 'soil' ? '#00BFFF' : '#aaa', borderBottom: activeTab === 'soil' ? '3px solid #00BFFF' : 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    🧪 Soil Lab
                </button>

                {isAdult && (
                    <button
                        onClick={() => setActiveTab('business')}
                        style={{ padding: '1rem 2rem', background: 'none', border: 'none', color: activeTab === 'business' ? 'var(--color-accent)' : '#aaa', borderBottom: activeTab === 'business' ? '3px solid var(--color-accent)' : 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        💼 Business Hub
                    </button>
                )}

                <button
                    onClick={() => setActiveTab('future')}
                    style={{ padding: '1rem 2rem', background: 'none', border: 'none', color: activeTab === 'future' ? '#FF8800' : '#aaa', borderBottom: activeTab === 'future' ? '3px solid #FF8800' : 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    🚀 Future Tech
                </button>
            </div>

            {/* FARM SIMULATION TAB */}
            {
                activeTab === 'farm' && (
                    <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <div className="card">
                            <h2 style={{ marginBottom: '1rem' }}>Farm Status 📊</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Weather:</span>
                                <strong>{weather}</strong>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <span>Soil Moisture:</span>
                                <div style={{ width: '100%', height: '10px', backgroundColor: '#333', borderRadius: '5px', marginTop: '0.5rem' }}>
                                    <div style={{ width: `${soilMoisture}%`, height: '100%', backgroundColor: soilMoisture < 30 ? 'red' : '#00BFFF', borderRadius: '5px', transition: 'width 0.5s' }}></div>
                                </div>
                            </div>
                            {hasProcessingUnit && (
                                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#333', borderRadius: '10px' }}>
                                    <h4>🏭 Processing Unit</h4>
                                    <p>Corn Flakes Stock: {processedStock} boxes</p>
                                    <button
                                        onClick={handleSellProcessed}
                                        disabled={processedStock === 0}
                                        className="btn"
                                        style={{ width: '100%', backgroundColor: processedStock > 0 ? 'var(--color-secondary)' : '#555' }}
                                    >
                                        Sell Stock (+₦900/box)
                                    </button>
                                </div>
                            )}
                            {!hasProcessingUnit && (
                                <button onClick={buyProcessingUnit} className="btn" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#444', border: '1px solid var(--color-secondary)', opacity: level >= 3 ? 1 : 0.5 }}>
                                    {level >= 3 ? 'Buy Processing Unit (₦5,000) 🏗️' : '🔒 Locked (Reach Level 3)'}
                                </button>
                            )}
                        </div>

                        <div className="card" style={{ textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '2rem' }}>Field 1 ({upgrades.vertical ? 'Vertical Farm 🏢' : 'Maize'})</h2>
                            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>{getCropEmoji()}</div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                {cropStage === 0 && <button className="btn btn-primary" onClick={handlePlant}>Plant (-₦100)</button>}
                                {cropStage > 0 && cropStage < 3 && <button className="btn" style={{ backgroundColor: '#00BFFF', color: '#fff' }} onClick={handleWater}>Irrigate 💧</button>}
                                {cropStage === 2 && <button className="btn" style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }} onClick={handleHarvest}>Harvest (+₦{upgrades.vertical ? '450' : '300'})</button>}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* SOIL LAB TAB */}
            {
                activeTab === 'soil' && (
                    <SoilLab onComplete={handleLabComplete} />
                )
            }

            {/* BUSINESS HUB TAB */}
            {activeTab === 'business' && (
                <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', minHeight: '600px' }}>
                    <div style={{ height: '100%' }}>
                        <AgriBusinessPlanner onClose={() => { }} />
                    </div>
                    <div style={{ height: '100%' }}>
                        {isPremium ? (
                            <InvestPitch onDeal={handleDeal} />
                        ) : (
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '2px solid gold' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                                <h2 style={{ color: 'gold' }}>Premium Pitch Room</h2>
                                <p style={{ color: '#aaa', margin: '1rem 0' }}>Unlock the ability to pitch your business to global investors.</p>
                                <button
                                    onClick={() => setIsPremium(true)}
                                    className="btn"
                                    style={{ backgroundColor: 'gold', color: 'black', fontWeight: 'bold', padding: '1rem 2rem' }}
                                >
                                    Unlock Premium Access (Demo)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FUTURE TECH TAB */}
            {
                activeTab === 'future' && (
                    <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h2>Evolution of Farming 🚜</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '3rem 0', alignItems: 'center' }}>
                                <div style={{ opacity: 0.5 }}>
                                    <div style={{ fontSize: '3rem' }}>⛏️</div>
                                    <p>Manual (1900s)</p>
                                </div>
                                <div style={{ fontSize: '2rem', color: '#555' }}>→</div>
                                <div style={{ opacity: 0.8 }}>
                                    <div style={{ fontSize: '3rem' }}>🚜</div>
                                    <p>Mechanized (1980s)</p>
                                </div>
                                <div style={{ fontSize: '2rem', color: '#555' }}>→</div>
                                <div style={{ transform: 'scale(1.2)' }}>
                                    <div style={{ fontSize: '4rem' }}>🚁</div>
                                    <p style={{ color: '#FF8800', fontWeight: 'bold' }}>Precision (Now)</p>
                                </div>
                            </div>
                        </div>

                        {/* STATS BAR */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            backgroundColor: '#333', padding: '1rem', borderRadius: '15px', marginBottom: '2rem',
                            border: '1px solid #00C851', flexWrap: 'wrap', gap: '1rem'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Farm Capital</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00C851' }}>₦{money}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Global Savings</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FFD700' }}>₦{balance}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Harvests</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{harvestCount} 🌾</div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setShowBank(!showBank)} className="btn btn-sm" style={{ backgroundColor: '#FFD700', color: '#000' }}>
                                    🏦 Agri-Bank
                                </button>
                                <button onClick={() => setShowCert(!showCert)} className="btn btn-sm" style={{ backgroundColor: '#2196F3' }}>
                                    🎓 Certification
                                </button>
                            </div>
                        </div>

                        {/* BANK OVERLAY */}
                        {showBank && (
                            <div style={{
                                marginBottom: '1rem', padding: '1rem', backgroundColor: '#444', borderRadius: '10px',
                                border: '2px solid #FFD700', animation: 'fadeIn 0.3s'
                            }}>
                                <h3 style={{ color: '#FFD700', marginTop: 0 }}>🏦 Agri-Bank Capital Injection</h3>
                                <p>Transfer earnings from other modules (Finance, Critical Thinking, etc.) to invest in your farm!</p>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button onClick={() => {
                                        if (deductGlobal(100)) {
                                            setMoney(m => m + 100);
                                            showToast("Transferred ₦100 to Farm Capital! 💰", 'success');
                                        } else {
                                            showToast("Insufficient Global Savings! Play other games to earn more. 🎮", 'error');
                                        }
                                    }} className="btn btn-primary" style={{ flex: '1 1 140px' }}>
                                        Inject ₦100
                                    </button>
                                    <button onClick={() => {
                                        if (deductGlobal(500)) {
                                            setMoney(m => m + 500);
                                            showToast("Transferred ₦500 to Farm Capital! 💰", 'success');
                                        } else {
                                            showToast("Insufficient Global Savings! Play other games to earn more. 🎮", 'error');
                                        }
                                    }} className="btn btn-primary" style={{ flex: '1 1 140px' }}>
                                        Inject ₦500
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CERTIFICATION OVERLAY */}
                        {showCert && (
                            <div style={{
                                marginBottom: '1rem', padding: '1rem', backgroundColor: '#222', borderRadius: '10px',
                                border: '2px solid #2196F3', animation: 'fadeIn 0.3s', textAlign: 'center'
                            }}>
                                <h3 style={{ color: '#2196F3', marginTop: 0 }}>🎓 Master Agripreneur Certification</h3>
                                <p>Prove your worthiness to withdraw real earnings!</p>

                                <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>Total Earnings {'>'} ₦5,000:</span>
                                        <span style={{ color: balance >= 5000 ? '#00C851' : '#ff4444' }}>{balance >= 5000 ? "✅ Passed" : `❌ (${balance}/5000)`}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>Harvest Cycles {'>'} 3:</span>
                                        <span style={{ color: harvestCount >= 3 ? '#00C851' : '#ff4444' }}>{harvestCount >= 3 ? "✅ Passed" : `❌ (${harvestCount}/3)`}</span>
                                    </div>
                                </div>

                                {isMasterAgripreneur ? (
                                    <div style={{ padding: '2rem', backgroundColor: '#00C851', borderRadius: '15px', textAlign: 'center' }}>
                                        <h2>🎊 Master Agripreneur Status Unlocked!</h2>
                                        <button onClick={() => showToast("🎉 CERTIFIED! \n\nYou have proven yourself as a Master Agripreneur.\nShow this screen to your guardian to redeem your rewards!", 'success')} className="btn" style={{ backgroundColor: '#fff', color: '#00C851', marginTop: '1rem' }}>View Certificate</button>
                                    </div>
                                ) : (
                                    <p style={{ color: '#aaa', fontStyle: 'italic' }}>Complete the requirements to unlock withdrawals.</p>
                                )}
                            </div>
                        )}

                        <div className="card">
                            <h2>Future-Proof Upgrades 🌍</h2>
                            <p style={{ color: '#aaa', marginBottom: '1rem' }}>Invest in sustainability to survive climate change.</p>

                            <div className="grid-cols" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-hover)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>☀️ Solar Irrigation</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Reduces water usage. Resilience +20.</div>
                                    </div>
                                    <button
                                        onClick={() => buyUpgrade('solar', 2000, 20, 4)}
                                        disabled={upgrades.solar}
                                        className={upgrades.solar ? "btn btn-outline" : "btn btn-primary"}
                                        style={{ padding: '0.6rem 1.25rem', opacity: upgrades.solar ? 0.6 : level < 4 ? 0.5 : 1 }}
                                    >
                                        {upgrades.solar ? 'Installed ✅' : level < 4 ? '🔒 Lvl 4' : '₦2,000'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-hover)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>🌵 Drought Seeds</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Resist heatwaves. Resilience +10.</div>
                                    </div>
                                    <button
                                        onClick={() => buyUpgrade('seeds', 500, 10, 2)}
                                        disabled={upgrades.seeds}
                                        className={upgrades.seeds ? "btn btn-outline" : "btn btn-primary"}
                                        style={{ padding: '0.6rem 1.25rem', opacity: upgrades.seeds ? 0.6 : level < 2 ? 0.5 : 1 }}
                                    >
                                        {upgrades.seeds ? 'Stocked ✅' : level < 2 ? '🔒 Lvl 2' : '₦500'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-hover)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>🏢 Vertical Farm</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>+50% Yield. Max Resilience.</div>
                                    </div>
                                    <button
                                        onClick={() => buyUpgrade('vertical', 10000, 50, 5)}
                                        disabled={upgrades.vertical}
                                        className={upgrades.vertical ? "btn btn-outline" : "btn btn-primary"}
                                        style={{ padding: '0.6rem 1.25rem', opacity: upgrades.vertical ? 0.6 : level < 5 ? 0.5 : 1 }}
                                    >
                                        {upgrades.vertical ? 'Built ✅' : level < 5 ? '🔒 Lvl 5' : '₦10,000'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* TECH QUIZ MODAL */}
            {showTechQuiz && pendingUpgrade && techQuizzes[pendingUpgrade.type] && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 10000, padding: '1rem'
                }}>
                    <div className="card" style={{ maxWidth: '400px', backgroundColor: '#1E1E1E', border: '2px solid #FF8800', textAlign: 'center' }}>
                        <h3 style={{ color: '#FF8800' }}>Tech-Check Challenge 🧠</h3>
                        <p style={{ margin: '1.5rem 0', fontSize: '1.1rem' }}>{techQuizzes[pendingUpgrade.type].q}</p>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {techQuizzes[pendingUpgrade.type].options.map((opt, i) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        if (i === techQuizzes[pendingUpgrade.type].a) {
                                            confirmUpgrade();
                                        } else {
                                            showToast("Incorrect! Think about sustainability.", 'error');
                                        }
                                    }}
                                    className="btn btn-outline"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowTechQuiz(false)} className="btn btn-sm" style={{ marginTop: '1.5rem', color: '#ff4444' }}>Cancel Upgrade ❌</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agripreneurship;
