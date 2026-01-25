import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';

const Civics = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { addEarnings, moduleEarnings } = useWallet();

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const isAdult = !isKid && !isTeen;

    const [activePillar, setActivePillar] = useState(1);
    const [toast, setToast] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // --- PERSISTENCE ---
    const [completedPillars, setCompletedPillars] = useState(() => {
        const saved = localStorage.getItem('civicsProgress');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('civicsProgress', JSON.stringify(completedPillars));
    }, [completedPillars]);

    const handlePillarComplete = (id) => {
        if (!completedPillars.includes(id)) {
            setCompletedPillars([...completedPillars, id]);
            addEarnings('civics', 200); // ₦200 per pillar
            showToast("Pillar Completed! +₦200 🗳️", 'success');
            triggerConfetti();
        }
    };

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // --- PILLAR 1: GOVT FUNCTIONS ---
    const [govtStep, setGovtStep] = useState(0);
    const govtScenarios = [
        { q: "The local road is full of potholes. Who should fix it?", a: "Executive", options: ["Executive", "Legislative", "Judiciary"], hint: "The Executive runs the government & builds infrastructure." },
        { q: "A new law is needed to protect children. Who makes it?", a: "Legislative", options: ["Executive", "Legislative", "Judiciary"], hint: "The Legislative branch makes the laws." },
        { q: "Someone stole a cow and needs to be judged. Who handles this?", a: "Judiciary", options: ["Executive", "Legislative", "Judiciary"], hint: "The Judiciary interprets laws & settles disputes." }
    ];

    // --- PILLAR 7: BUDGET SIMULATOR ---
    const [budgetAllocation, setBudgetAllocation] = useState({ education: 25, health: 25, roads: 25, security: 25 });
    const totalBudget = Object.values(budgetAllocation).reduce((a, b) => a + b, 0);

    const pillars = [
        { id: 1, title: "1. Govt Functions 🏛️", color: "#9C27B0" },
        { id: 2, title: "2. Your Rights ⚖️", color: "#2196F3" },
        { id: 3, title: "3. Responsibilities 🤝", color: "#4CAF50" },
        { id: 4, title: "4. Everyday Law 📜", color: "#FF9800" },
        { id: 5, title: "5. Community Projects 🏗️", color: "#E91E63" },
        { id: 6, title: "6. Civic Tools 🛠️", color: "#607D8B" },
        { id: 7, title: "7. Budget & Money 💰", color: "#FFEB3B" },
        { id: 8, title: "8. Ethics & Integrity 💎", color: "#00BCD4" },
        { id: 9, title: "9. Leadership Mindset 🧠", color: "#795548" },
        { id: 10, title: "10. Local Governance 🏘️", color: "#3F51B5" }
    ];

    const renderGovtGame = () => (
        <div className="card" style={{ borderTop: '4px solid #9C27B0' }}>
            <h3>Who Should Fix This? 🏛️</h3>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Match the problem to the branch of government.</p>

            {govtStep < 3 ? (
                <div>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem' }}>"{govtScenarios[govtStep].q}"</p>
                    <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                        {govtScenarios[govtStep].options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => {
                                    if (opt === govtScenarios[govtStep].a) {
                                        showToast("Correct!", 'success');
                                        if (govtStep === 2) handlePillarComplete(1);
                                        setGovtStep(prev => prev + 1);
                                    } else {
                                        showToast(govtScenarios[govtStep].hint, 'warning');
                                    }
                                }}
                                className="btn btn-outline"
                                style={{ height: '80px' }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', color: '#00C851' }}>
                    <h4>Mastery Achieved! 🏆</h4>
                    <p>You now know who to hold accountable.</p>
                    <button onClick={() => setGovtStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Play Again</button>
                </div>
            )}
        </div>
    );

    const renderRights = () => (
        <div className="card" style={{ borderTop: '4px solid #2196F3' }}>
            <h3>Know Your Power ⚖️</h3>
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                {[
                    { t: "Right to Life", d: "The most basic right for every human.", icon: "🌱" },
                    { t: "Right to Vote", d: "Your power to choose your leaders at 18.", icon: "🗳️" },
                    { t: "Right to Education", d: "Every child deserves to learn.", icon: "📚" }
                ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#222', padding: '1rem', borderRadius: '15px' }}>
                        <span style={{ fontSize: '2rem' }}>{r.icon}</span>
                        <div>
                            <strong style={{ display: 'block', color: '#2196F3' }}>{r.t}</strong>
                            <small style={{ color: '#888' }}>{r.d}</small>
                        </div>
                    </div>
                ))}
                <button onClick={() => handlePillarComplete(2)} className="btn btn-primary" style={{ marginTop: '1rem' }}>I Know My Rights! ✅</button>
            </div>
        </div>
    );

    const renderResponsibilities = () => (
        <div className="card" style={{ borderTop: '4px solid #4CAF50' }}>
            <h3>Your Duty 🤝</h3>
            <p>Rights come with duties. Are you a good citizen?</p>
            <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                {["Obey Laws 📜", "Pay Taxes 💰", "Vandalize No Property 🛑", "Report Crimes 📞", "Vote 🗳️"].map(d => (
                    <div key={d} style={{ backgroundColor: '#222', padding: '1rem', textAlign: 'center', borderRadius: '12px', border: '1px solid #444' }}>{d}</div>
                ))}
            </div>
            <button onClick={() => handlePillarComplete(3)} className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>I Accept My Duties 🤝</button>
        </div>
    );

    const renderLaw = () => (
        <div className="card" style={{ borderTop: '4px solid #FF9800' }}>
            <h3>Simple Law 📜</h3>
            <p style={{ fontStyle: 'italic', color: '#aaa' }}>"Ignorance of the law is no excuse."</p>
            <div style={{ marginTop: '1.5rem' }}>
                <p><strong>Common Everyday Laws:</strong></p>
                <ul style={{ color: '#ccc', lineHeight: '1.8' }}>
                    <li><strong>Traffic:</strong> Always wear a seatbelt. Drive on the right.</li>
                    <li><strong>Tenancy:</strong> Both landlord and tenant have rights under the law.</li>
                    <li><strong>Contracts:</strong> Any agreement you sign is legally binding. Read first!</li>
                </ul>
            </div>
            <button onClick={() => handlePillarComplete(4)} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#FF9800' }}>Understood! ✅</button>
        </div>
    );

    const renderProjects = () => (
        <div className="card" style={{ borderTop: '4px solid #E91E63' }}>
            <h3>Community Project Leader 🏗️</h3>
            {!isKid ? (
                <div style={{ textAlign: 'left' }}>
                    <p>How to fix a problem in 6 steps:</p>
                    <ol style={{ color: '#ccc', paddingLeft: '1.2rem', display: 'grid', gap: '0.8rem' }}>
                        <li><strong>Identify:</strong> Name the problem (e.g., Dirty Street).</li>
                        <li><strong>Gather:</strong> Find 3 friends to help.</li>
                        <li><strong>Leaders:</strong> Talk to the Baale or Ward Councillor.</li>
                        <li><strong>Propose:</strong> Write what you want to do.</li>
                        <li><strong>Fund:</strong> Crowdfund ₦2k for brooms/bins.</li>
                        <li><strong>Execute:</strong> Do the work and show the results!</li>
                    </ol>
                    <button onClick={() => handlePillarComplete(5)} className="btn" style={{ backgroundColor: '#E91E63', width: '100%', marginTop: '1rem' }}>Start Leading 🚀</button>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <p>Help clean your school or help a neighbor today!</p>
                    <button onClick={() => handlePillarComplete(5)} className="btn" style={{ backgroundColor: '#E91E63' }}>I Will Help! 🌟</button>
                </div>
            )}
        </div>
    );

    const renderTools = () => {
        const templates = [
            { t: "Formal Complaint 📝", c: "To [Office Name],\nI am writing to report [Issue] at [Location]. Please investigate.\n- [Your Name]" },
            { t: "Information Request 🕵️‍♂️", c: "Dear Public Officer,\nI request data on [Project Name] budget as per Freedom of Information Act.\n- Citizen" }
        ];

        return (
            <div className="card" style={{ borderTop: '4px solid #607D8B' }}>
                <h3>Civic Templates 🛠️</h3>
                <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1.5rem' }}>Copy these templates to engage your leaders.</p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {templates.map((tmp, i) => (
                        <div key={i} style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '15px', position: 'relative' }}>
                            <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', color: '#00C851' }}>{tmp.c}</pre>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(tmp.c);
                                    showToast("Copied to Clipboard!", 'success');
                                }}
                                className="btn btn-sm"
                                style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#444' }}
                            >
                                Copy {tmp.t}
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={() => handlePillarComplete(6)} className="btn" style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#607D8B' }}>Tools Ready ✅</button>
            </div>
        );
    };

    const renderBudget = () => (
        <div className="card" style={{ borderTop: '4px solid #FFEB3B' }}>
            <h3 style={{ color: '#FFEB3B' }}>Governor for a Day 💰</h3>
            <p>Spend 100% of your budget. Total: <span style={{ color: totalBudget === 100 ? '#00C851' : '#ff4444' }}>{totalBudget}%</span></p>

            <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                {Object.keys(budgetAllocation).map(key => (
                    <div key={key}>
                        <label style={{ textTransform: 'capitalize' }}>{key}: {budgetAllocation[key]}%</label>
                        <input
                            type="range" min="0" max="100" value={budgetAllocation[key]}
                            onChange={(e) => setBudgetAllocation({ ...budgetAllocation, [key]: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: '#FFEB3B' }}
                        />
                    </div>
                ))}
            </div>

            <button
                disabled={totalBudget !== 100}
                onClick={() => handlePillarComplete(7)}
                className="btn"
                style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#FFEB3B', color: 'black' }}
            >
                {totalBudget === 100 ? "Submit Budget ✅" : `Needs ${100 - totalBudget}% more`}
            </button>
        </div>
    );

    const renderEthics = () => (
        <div className="card" style={{ borderTop: '4px solid #00BCD4' }}>
            <h3>Integrity Check 💎</h3>
            <p>"Integrity is doing the right thing when no one is watching."</p>
            <div style={{ marginTop: '1.5rem', backgroundColor: '#222', padding: '1.5rem', borderRadius: '15px' }}>
                <p><strong>Scenario:</strong> You find ₦1,000 on correctly marked school property.</p>
                <div className="grid-cols" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={() => { showToast("Wrong choice!", 'error'); }} className="btn btn-outline" style={{ color: '#ff4444' }}>Keep It 🦊</button>
                    <button onClick={() => { showToast("Correct! Virtue is reward.", 'success'); handlePillarComplete(8); }} className="btn btn-outline" style={{ color: '#00C851' }}>Report It 💎</button>
                </div>
            </div>
        </div>
    );

    const renderLeadership = () => (
        <div className="card" style={{ borderTop: '4px solid #795548' }}>
            <h3>Leadership Mindset 🧠</h3>
            <p>"You don't need a title to lead."</p>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                {[
                    "Listen before you speak 👂",
                    "Organize without violence 🕊️",
                    "Include everyone 🌍",
                    "Stay calm under pressure 🌊"
                ].map(l => (
                    <div key={l} style={{ padding: '0.8rem', backgroundColor: '#333', borderRadius: '10px' }}>{l}</div>
                ))}
            </div>
            <button onClick={() => handlePillarComplete(9)} className="btn" style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#795548' }}>I Am A Leader! 🧠</button>
        </div>
    );

    const renderLocal = () => (
        <div className="card" style={{ borderTop: '4px solid #3F51B5' }}>
            <h3>Local Power 🏘️</h3>
            <p>Abuja is far. Your Ward Councillor is near.</p>
            <div style={{ marginTop: '1.5rem' }}>
                <p><strong>Who is around you?</strong></p>
                <ul style={{ color: '#ccc', display: 'grid', gap: '0.8rem' }}>
                    <li><strong>Ward Rep:</strong> Fixes local street lights and drainage.</li>
                    <li><strong>Councillor:</strong> Represents you at the Local Govt level.</li>
                    <li><strong>Chairman:</strong> Heads the whole Local Government Area (LGA).</li>
                </ul>
            </div>
            <button onClick={() => handlePillarComplete(10)} className="btn" style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#3F51B5' }}>Engage Locally ✅</button>
        </div>
    );

    const activePillarData = pillars.find(p => p.id === activePillar);

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {showConfetti && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}>
                    {/* Confetti simulation (simplified) */}
                    <div style={{ textAlign: 'center', marginTop: '20%' }}>
                        <h1 style={{ fontSize: '5rem', animation: 'bounce 1s infinite' }}>🎉</h1>
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/')} className="btn-back">← Hub</button>

            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#9C27B0' }}>Civics & Leadership 🇳🇬</h1>
                <p style={{ color: '#aaa' }}>Complete all 10 pillars to become a Master Citizen.</p>
                <div style={{
                    marginTop: '1rem', padding: '0.5rem 1.5rem', backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    borderRadius: '30px', display: 'inline-block', border: '1px solid #9C27B0'
                }}>
                    Total Earned: <strong>₦{completedPillars.length * 200}</strong> / ₦2,000
                </div>
            </header>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* PILLAR NAVIGATION */}
                <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {pillars.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActivePillar(p.id)}
                            className={`btn ${activePillar === p.id ? 'active' : ''}`}
                            style={{
                                backgroundColor: activePillar === p.id ? p.color : '#222',
                                color: activePillar === p.id ? 'black' : (completedPillars.includes(p.id) ? '#00C851' : 'white'),
                                border: `1px solid ${completedPillars.includes(p.id) ? '#00C851' : '#444'}`,
                                padding: '1rem', borderRadius: '15px', fontSize: '0.8rem', position: 'relative'
                            }}
                        >
                            {p.title}
                            {completedPillars.includes(p.id) && <span style={{ position: 'absolute', top: '5px', right: '5px' }}>✅</span>}
                        </button>
                    ))}
                </div>

                {/* PILLAR CONTENT */}
                <div style={{ flex: '2 1 400px', minHeight: '400px' }}>
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <h2 style={{ color: activePillarData.color, marginBottom: '1.5rem' }}>{activePillarData.title}</h2>
                        {activePillar === 1 && renderGovtGame()}
                        {activePillar === 2 && renderRights()}
                        {activePillar === 3 && renderResponsibilities()}
                        {activePillar === 4 && renderLaw()}
                        {activePillar === 5 && renderProjects()}
                        {activePillar === 6 && renderTools()}
                        {activePillar === 7 && renderBudget()}
                        {activePillar === 8 && renderEthics()}
                        {activePillar === 9 && renderLeadership()}
                        {activePillar === 10 && renderLocal()}
                    </div>
                </div>
            </div>

            <style>{`
        .btn-back { background: none; border: none; color: #9C27B0; font-size: 1.2rem; cursor: pointer; margin-bottom: 1rem; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>
        </div>
    );
};

export default Civics;
