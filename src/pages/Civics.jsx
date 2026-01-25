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

    // --- LOCALIZATION & IDENTITY ---
    const [userName, setUserName] = useState(() => localStorage.getItem('civicsUserName') || "");
    const [selectedCountry, setSelectedCountry] = useState(() => localStorage.getItem('civicsCountry') || "");
    const [showSetup, setShowSetup] = useState(!localStorage.getItem('civicsCountry'));

    const countries = [
        { name: "Nigeria", currency: "₦", parliament: "National Assembly" },
        { name: "Kenya", currency: "KSh", parliament: "Parliament" },
        { name: "Ghana", currency: "GH₵", parliament: "Parliament" },
        { name: "South Africa", currency: "R", parliament: "National Assembly" },
        { name: "USA", currency: "$", parliament: "Congress" },
        { name: "United Kingdom", currency: "£", parliament: "Parliament" },
        { name: "Other", currency: "¤", parliament: "Legislature" }
    ];

    const currentCountryData = countries.find(c => c.name === selectedCountry) || countries[0];
    const countryName = selectedCountry || "Nigeria";
    const currency = currentCountryData.currency;
    const parliament = currentCountryData.parliament;

    useEffect(() => {
        if (userName) localStorage.setItem('civicsUserName', userName);
        if (selectedCountry) localStorage.setItem('civicsCountry', selectedCountry);
    }, [userName, selectedCountry]);

    const [activePillar, setActivePillar] = useState(1);

    const [toast, setToast] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeFact, setActiveFact] = useState(null); // { term, fact }
    const [showCertificate, setShowCertificate] = useState(false);

    // --- PERSISTENCE ---
    const [completedPillars, setCompletedPillars] = useState(() => {
        const saved = localStorage.getItem('civicsProgress');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('civicsProgress', JSON.stringify(completedPillars));
    }, [completedPillars]);

    const isComplete = completedPillars.length >= 10;
    const isMaster = completedPillars.length === 11;

    // --- TIMER STATE ---
    const [pillarTimer, setPillarTimer] = useState(15);

    useEffect(() => {
        let interval = null;
        if (pillarTimer > 0 && !completedPillars.includes(activePillar)) {
            interval = setInterval(() => {
                setPillarTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [pillarTimer, activePillar, completedPillars]);

    useEffect(() => {
        if (!completedPillars.includes(activePillar)) {
            setPillarTimer(15);
        } else {
            setPillarTimer(0);
        }
    }, [activePillar, completedPillars]);


    const civicFacts = {
        "Executive": "The Executive branch (President/Governor) is like the 'Pilot' of the country. They make sure the engines are running and follow the flight plan!",
        "Legislative": "The Legislative branch (National Assembly) are the 'Lawmakers'. They represent your voice and decide the rules for everyone to follow.",
        "Legislature": "Same as Legislative! They make the rules.",
        "Judiciary": "The Judiciary (Courts) are the 'Referees'. If there's a disagreement about a rule, they decide who is right based on the law book.",
        "Democracy": "Democracy means 'Power to the People'. It's a system where YOU choose who leads you by voting.",
        "Accountability": "This means leaders must explain their actions to the citizens. If they promise a road, they must show the road!",
        "Constitution": "The Constitution is the 'Grand Rulebook' of Nigeria. No person, not even the President, is above the rules in this book.",
        "Ward": "A Ward is the smallest area for voting. It's your immediate neighborhood in the eyes of the government.",
        "Councillor": "A Councillor is the leader closest to you. They represent your Ward at the Local Government level.",
        "Budget": "A Budget is a plan for how to spend money. It's like a shopping list for the whole state!",
        "Integrity": "Integrity is doing the right thing even when no one is watching. It's the foundation of a great leader."
    };

    const Term = ({ name }) => (
        <span
            onClick={() => setActiveFact({ term: name, fact: civicFacts[name] })}
            style={{
                color: '#FFD700', textDecoration: 'underline', textDecorationStyle: 'dotted',
                cursor: 'help', fontWeight: 'bold'
            }}
        >
            {name}
        </span>
    );


    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const handlePillarComplete = (id) => {
        if (!completedPillars.includes(id)) {
            setCompletedPillars([...completedPillars, id]);
            if (id <= 10) {
                addEarnings('civics', 200); // ₦200 per pillar for first 10
                showToast(`Pillar Completed! +${currency}200 🗳️`, 'success');
            } else {
                showToast(`Final Mastery Revealed! 🏆`, 'success');
            }
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
        { q: "The local road is full of potholes. Who should fix it?", a: "Executive", options: ["Executive", "Legislative", "Judiciary"], hint: `The Executive runs the ${countryName} government & builds infrastructure.` },
        { q: "A new law is needed to protect children. Who makes it?", a: "Legislative", options: ["Executive", "Legislative", "Judiciary"], hint: `The Legislative branch (like our ${parliament}) makes the laws.` },
        { q: "Someone stole a cow and needs to be judged. Who handles this?", a: "Judiciary", options: ["Executive", "Legislative", "Judiciary"], hint: "The Judiciary interprets laws & settles disputes." }
    ];

    // --- PILLAR 2: KNOW YOUR RIGHTS (3 LEVELS) ---
    const [rightsStage, setRightsStage] = useState(0);
    const rightsLevels = [
        {
            title: "Level 1: Basic Human Rights 🌱",
            desc: "These are the rights you are born with.",
            rights: [
                { t: "Right to Life", d: "No one can take your life away.", icon: "🌱" },
                { t: "Freedom of Movement", d: "You can travel anywhere safely.", icon: "🚶" }
            ]
        },
        {
            title: "Level 2: Civic Power 🗳️",
            desc: "Your power as a citizen of the nation.",
            rights: [
                { t: "Right to Vote", d: "You choose who leads at 18.", icon: "🗳️" },
                { t: "Freedom of Speech", d: "You can speak your truth respectfully.", icon: "🗣️" }
            ]
        },
        {
            title: "Level 3: Extra Protection 🛡️",
            desc: "Rights that protect kids and consumers.",
            rights: [
                { t: "Children's Rights", d: "Right to play and be protected from work.", icon: "🪁" },
                { t: "Consumer Rights", d: "Right to get what you paid for (Quality).", icon: "🏷️" }
            ]
        }
    ];




    // --- PILLAR 7: BUDGET & SELF-RELIANCE ---
    const [budgetAllocation, setBudgetAllocation] = useState({ education: 25, health: 25, roads: 25, security: 25 });
    const totalBudget = Object.values(budgetAllocation).reduce((a, b) => a + b, 0);
    const [showSelfReliance, setShowSelfReliance] = useState(false);

    // --- PILLAR 11: STATECRAFT SIMULATOR ---
    const [simRole, setSimRole] = useState(null); // 'President', 'Governor', 'Minister'
    const [simPriority, setSimPriority] = useState(null); // 'Education', 'Economy', 'Security'
    const [simStage, setSimStage] = useState(0);

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
        { id: 10, title: "10. Local Governance 🏘️", color: "#3F51B5" },
        { id: 11, title: "11. Statecraft Simulator 🏆", color: "#FFD700" }
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
                                disabled={pillarTimer > 0 && !completedPillars.includes(1)}
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
                                style={{ height: '80px', textTransform: 'none', opacity: (pillarTimer > 0 && !completedPillars.includes(1)) ? 0.5 : 1 }}
                            >
                                <Term name={opt} />
                                {(pillarTimer > 0 && !completedPillars.includes(1)) && ` (${pillarTimer}s)`}
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
            <h3>{rightsLevels[rightsStage].title}</h3>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>{rightsLevels[rightsStage].desc}</p>
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                {rightsLevels[rightsStage].rights.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#222', padding: '1rem', borderRadius: '15px', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                        <span style={{ fontSize: '2rem' }}>{r.icon}</span>
                        <div>
                            <strong style={{ display: 'block', color: '#2196F3' }}>{r.t}</strong>
                            <small style={{ color: '#888' }}>{r.d}</small>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                {rightsStage < 2 ? (
                    <button
                        disabled={pillarTimer > 0 && !completedPillars.includes(2)}
                        onClick={() => {
                            showToast(`Level ${rightsStage + 1} Complete! Next...`, 'success');
                            setRightsStage(prev => prev + 1);
                        }}
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: '#2196F3', opacity: (pillarTimer > 0 && !completedPillars.includes(2)) ? 0.5 : 1 }}
                    >
                        Learn More Power ⚡ {(pillarTimer > 0 && !completedPillars.includes(2)) && `(${pillarTimer}s)`}
                    </button>
                ) : (
                    <button
                        disabled={pillarTimer > 0 && !completedPillars.includes(2)}
                        onClick={() => {
                            handlePillarComplete(2);
                            setRightsStage(0);
                        }}
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: '#00C851', opacity: (pillarTimer > 0 && !completedPillars.includes(2)) ? 0.5 : 1 }}
                    >
                        I Mastered my Rights! ✅ {(pillarTimer > 0 && !completedPillars.includes(2)) && `(${pillarTimer}s)`}
                    </button>
                )}
            </div>
        </div>
    );

    const [respStep, setRespStep] = useState(0);
    const respScenarios = [
        { q: "You see litter on the street near your house. What do you do?", a: "Pick it up", options: ["Pick it up", "Wait for Govt", "Ignore it"], hint: "A clean community starts with individual responsibility." },
        { q: "You witness a neighbor's property being vandalized. What do you do?", a: "Report it", options: ["Report it", "Join in", "Stay silent"], hint: "Protecting public and private property is a civic duty." },
        { q: "It's election day in your neighborhood. You are 18+.", a: "Go Vote", options: ["Go Vote", "Stay home", "Go to a party"], hint: "Voting is both a right and a responsibility." }
    ];

    const renderResponsibilities = () => (
        <div className="card" style={{ borderTop: '4px solid #4CAF50' }}>
            <h3>The Good Citizen Test 🤝</h3>
            {respStep < 3 ? (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>"{respScenarios[respStep].q}"</p>
                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        {respScenarios[respStep].options.map(opt => (
                            <button
                                key={opt}
                                disabled={pillarTimer > 0 && !completedPillars.includes(3)}
                                onClick={() => {
                                    if (opt === respScenarios[respStep].a) {
                                        showToast("Responsible Choice! ✅", 'success');
                                        if (respStep === 2) handlePillarComplete(3);
                                        setRespStep(prev => prev + 1);
                                    } else {
                                        showToast(respScenarios[respStep].hint, 'warning');
                                    }
                                }}
                                className="btn btn-outline"
                                style={{ textAlign: 'left', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(3)) ? 0.5 : 1 }}
                            >
                                {opt} {(pillarTimer > 0 && !completedPillars.includes(3)) && ` (${pillarTimer}s)`}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <h4 style={{ color: '#00C851' }}>Duty Accepted! 🏆</h4>
                    <p>You are ready to build the nation.</p>
                    <button onClick={() => setRespStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Re-test 🔄</button>
                </div>
            )}
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
            <button
                disabled={pillarTimer > 0 && !completedPillars.includes(4)}
                onClick={() => handlePillarComplete(4)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', backgroundColor: '#FF9800', opacity: (pillarTimer > 0 && !completedPillars.includes(4)) ? 0.5 : 1 }}
            >
                Understood! ✅ {(pillarTimer > 0 && !completedPillars.includes(4)) && `(${pillarTimer}s)`}
            </button>
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
                        <li><strong>Leaders:</strong> Talk to the Local Leader or <Term name="Councillor" />.</li>
                        <li><strong>Propose:</strong> Write what you want to do.</li>
                        <li><strong>Fund:</strong> Crowdfund {currency}2,000 for tools.</li>
                        <li><strong>Execute:</strong> Do the work and show the results!</li>
                    </ol>
                    <button onClick={() => handlePillarComplete(5)} className="btn" style={{ backgroundColor: '#E91E63', width: '100%', marginTop: '1rem' }}>Start Leading 🚀</button>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <p>Help clean your school or help a neighbor today!</p>
                    <button
                        disabled={pillarTimer > 0 && !completedPillars.includes(5)}
                        onClick={() => handlePillarComplete(5)}
                        className="btn"
                        style={{ backgroundColor: '#E91E63', opacity: (pillarTimer > 0 && !completedPillars.includes(5)) ? 0.5 : 1 }}
                    >
                        I Will Help! 🌟 {(pillarTimer > 0 && !completedPillars.includes(5)) && `(${pillarTimer}s)`}
                    </button>
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
                <button
                    disabled={pillarTimer > 0 && !completedPillars.includes(6)}
                    onClick={() => handlePillarComplete(6)}
                    className="btn"
                    style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#607D8B', opacity: (pillarTimer > 0 && !completedPillars.includes(6)) ? 0.5 : 1 }}
                >
                    Tools Ready ✅ {(pillarTimer > 0 && !completedPillars.includes(6)) && `(${pillarTimer}s)`}
                </button>
            </div>
        );
    };


    const renderBudget = () => (
        <div className="card" style={{ borderTop: '4px solid #FFEB3B' }}>
            <h3 style={{ color: '#FFEB3B' }}>Governor for a Day 💰</h3>
            {!showSelfReliance ? (
                <div>
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
                        onClick={() => setShowSelfReliance(true)}
                        className="btn"
                        style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#FFEB3B', color: 'black' }}
                    >
                        {totalBudget === 100 ? "Submit Budget & Learn Self-Reliance 📜" : `Needs ${100 - totalBudget}% more`}
                    </button>
                </div>
            ) : (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <h4 style={{ color: '#FFD700' }}>Lesson: National Self-Reliance for {countryName} 🏛️</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#ccc', textAlign: 'justify' }}>
                        "Independence means <strong>self-reliance</strong>. It cannot be real if {countryName} depends upon gifts and loans for its development.
                        Gifts which weaken our own efforts should not be accepted. Loans are better, but they must be used <strong>profitably</strong> to ensure repayment.
                        Burdening citizens with big loans that do not benefit the majority is not help—it is suffering."
                    </p>
                    <div style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '10px', marginTop: '1rem', borderLeft: '4px solid #FFEB3B' }}>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>
                            <strong>Takeaway:</strong> Real independence for {countryName} comes from our own efforts and wise use of resources, not just external assistance.
                        </p>
                    </div>
                    <button
                        disabled={pillarTimer > 0 && !completedPillars.includes(7)}
                        onClick={() => {
                            handlePillarComplete(7);
                            setShowSelfReliance(false);
                        }}
                        className="btn"
                        style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#00C851', opacity: (pillarTimer > 0 && !completedPillars.includes(7)) ? 0.5 : 1 }}
                    >
                        I Understand Self-Reliance ✅ {(pillarTimer > 0 && !completedPillars.includes(7)) && `(${pillarTimer}s)`}
                    </button>
                </div>
            )}
        </div>
    );

    const [ethicsStage, setEthicsStage] = useState(0);
    const renderEthics = () => (
        <div className="card" style={{ borderTop: '4px solid #00BCD4' }}>
            <h3><Term name="Integrity" /> Simulation 💎</h3>
            {ethicsStage === 0 ? (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <p><strong>Whistleblower Scenario:</strong> You discover a senior official is diverting funds meant for a new primary school in your {currentCountryData.name === "Nigeria" ? "LGA" : "district"}.</p>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                        <button onClick={() => setEthicsStage(1)} className="btn btn-outline" style={{ color: '#00C851' }}>Report anonymously 📞</button>
                        <button onClick={() => showToast("Silence helps corruption grow.", 'error')} className="btn btn-outline" style={{ color: '#ff4444' }}>Stay silent 🤐</button>
                        <button onClick={() => showToast("Bribery is a crime!", 'error')} className="btn btn-outline" style={{ color: '#FFD700' }}>Ask for a cut 💰</button>
                    </div>
                </div>
            ) : ethicsStage === 1 ? (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <p>The official offers you {currency}500,000 to delete the evidence. What do you do?</p>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                        <button onClick={() => setEthicsStage(2)} className="btn btn-outline" style={{ color: '#00C851' }}>Reject & Expose 💎</button>
                        <button onClick={() => { setEthicsStage(0); showToast("Integrity Lost! Try again.", 'error'); }} className="btn btn-outline" style={{ color: '#ff4444' }}>Take the money ❌</button>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
                    <h4 style={{ color: '#00BCD4' }}>Man of Integrity!</h4>
                    <p>You protected the future of {countryName}'s children.</p>
                    <button
                        disabled={pillarTimer > 0 && !completedPillars.includes(8)}
                        onClick={() => handlePillarComplete(8)}
                        className="btn"
                        style={{ backgroundColor: '#00BCD4', width: '100%', marginTop: '1.5rem', opacity: (pillarTimer > 0 && !completedPillars.includes(8)) ? 0.5 : 1 }}
                    >
                        Complete Pillar 8 {(pillarTimer > 0 && !completedPillars.includes(8)) && ` (${pillarTimer}s)`}
                    </button>
                </div>
            )}
        </div>
    );


    const [leadStep, setLeadStep] = useState(0);
    const renderLeadership = () => (
        <div className="card" style={{ borderTop: '4px solid #795548' }}>
            <h3>Leadership Mastery 🧠</h3>
            {leadStep === 0 ? (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <p>"Real leadership is about service, not power."</p>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#333', borderRadius: '12px' }}>
                            <strong>Trait 1: Empathy 👂</strong>
                            <p style={{ fontSize: '0.85rem', margin: '0.5rem 0', color: '#aaa' }}>Listen to your people before making big decisions.</p>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#333', borderRadius: '12px' }}>
                            <strong>Trait 2: Peace 🕊️</strong>
                            <p style={{ fontSize: '0.85rem', margin: '0.5rem 0', color: '#aaa' }}>Organize and solve problems without violence.</p>
                        </div>
                        <button onClick={() => setLeadStep(1)} className="btn" style={{ backgroundColor: '#795548' }}>Next Leadership Lesson →</button>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                    <p style={{ marginBottom: '1.5rem' }}>"Are you ready to lead by serving others?"</p>
                    <button
                        disabled={pillarTimer > 0 && !completedPillars.includes(9)}
                        onClick={() => handlePillarComplete(9)}
                        className="btn"
                        style={{ width: '100%', backgroundColor: '#795548', opacity: (pillarTimer > 0 && !completedPillars.includes(9)) ? 0.5 : 1 }}
                    >
                        I Accept the Lead ✅ {(pillarTimer > 0 && !completedPillars.includes(9)) && ` (${pillarTimer}s)`}
                    </button>
                </div>
            )}
        </div>
    );

    const renderLocal = () => (
        <div className="card" style={{ borderTop: '4px solid #3F51B5' }}>
            <h3>Local Power 🏘️</h3>
            <p>Abuja is far. Your <Term name="Councillor" /> is near.</p>
            <div style={{ marginTop: '1.5rem' }}>
                <p><strong>Who is around you?</strong></p>
                <ul style={{ color: '#ccc', display: 'grid', gap: '0.8rem' }}>
                    <li><strong><Term name="Ward" /> Rep:</strong> Fixes local street lights and drainage.</li>
                    <li><strong><Term name="Councillor" />:</strong> Represents you at the Local Govt level.</li>
                    <li><strong>Chairman:</strong> Heads the whole Local Government Area (LGA).</li>
                </ul>
            </div>
            <button
                disabled={pillarTimer > 0 && !completedPillars.includes(10)}
                onClick={() => handlePillarComplete(10)}
                className="btn"
                style={{ width: '100%', marginTop: '1.5rem', backgroundColor: '#3F51B5', opacity: (pillarTimer > 0 && !completedPillars.includes(10)) ? 0.5 : 1 }}
            >
                Engage Locally ✅ {(pillarTimer > 0 && !completedPillars.includes(10)) && `(${pillarTimer}s)`}
            </button>
        </div>
    );


    const [simStep, setSimStep] = useState(0);

    const renderSimulator = () => {
        const roles = [
            { t: 'President', color: '#FFD700', d: 'Lead the entire nation and manage federal resources.' },
            { t: 'Governor', color: '#00C851', d: 'Manage a state and focus on local infrastructure and education.' },
            { t: 'Minister', color: '#2196F3', d: 'Advise the President and execute specialized policies.' }
        ];

        const priorities = [
            { t: 'Education', icon: '📚', d: 'Focus on schools, teachers, and student welfare.' },
            { t: 'Economy', icon: '📈', d: 'Focus on business growth, jobs, and inflation control.' },
            { t: 'Security', icon: '🛡️', d: 'Focus on safety, community policing, and ending crime.' }
        ];

        return (
            <div className="card" style={{ borderTop: '4px solid #FFD700' }}>
                <h3 style={{ color: '#FFD700' }}>Statecraft Simulator 🏆</h3>
                {simStep === 0 ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p>Choose your leadership role to begin:</p>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            {roles.map(r => (
                                <button
                                    key={r.t}
                                    onClick={() => { setSimRole(r.t); setSimStep(1); }}
                                    className="btn btn-outline"
                                    style={{ textAlign: 'left', padding: '1rem', borderColor: r.color }}
                                >
                                    <strong style={{ color: r.color }}>{r.t}</strong>
                                    <p style={{ fontSize: '0.8rem', margin: '0.3rem 0', color: '#aaa' }}>{r.d}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : simStep === 1 ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p>As **{simRole}**, what is your #1 national priority?</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                            {priorities.map(p => (
                                <button
                                    key={p.t}
                                    onClick={() => { setSimPriority(p.t); setSimStep(2); }}
                                    className="btn btn-outline"
                                    style={{ height: '120px' }}
                                >
                                    <span style={{ fontSize: '2rem' }}>{p.icon}</span><br />
                                    <strong>{p.t}</strong>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : simStep === 2 ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p><strong>🚨 NATIONAL CRISIS:</strong> A major strike has broken out in the **{simPriority}** sector! Citizens are losing patience.</p>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.5rem' }}>How do you resolve it?</p>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setSimStep(3)} className="btn btn-outline" style={{ color: '#00C851' }}>Dialog & Compromise 🤝</button>
                            <button onClick={() => { setSimStep(0); showToast("Citizens are unhappy with force!", 'error'); }} className="btn btn-outline" style={{ color: '#ff4444' }}>Force & Arrests ❌</button>
                            <button onClick={() => { setSimStep(0); showToast("Silence makes it worse!", 'error'); }} className="btn btn-outline" style={{ color: '#FFD700' }}>Ignore & Hope it goes away 🤐</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👑</div>
                        <h4 style={{ color: '#FFD700' }}>Leadership Mastery: Complete!</h4>
                        <p>You led with wisdom as **{simRole}**. Your legacy of **{simPriority}** is secure.</p>
                        <button
                            disabled={pillarTimer > 0 && !completedPillars.includes(11)}
                            onClick={() => handlePillarComplete(11)}
                            className="btn"
                            style={{ backgroundColor: '#FFD700', color: 'black', width: '100%', marginTop: '1.5rem', opacity: (pillarTimer > 0 && !completedPillars.includes(11)) ? 0.5 : 1 }}
                        >
                            Claim Your Legacy 🏆 {(pillarTimer > 0 && !completedPillars.includes(11)) && ` (${pillarTimer}s)`}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const activePillarData = pillars.find(p => p.id === activePillar);

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {showConfetti && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}>
                    <div style={{ textAlign: 'center', marginTop: '20%' }}>
                        <h1 style={{ fontSize: '5rem', animation: 'bounce 1s infinite' }}>🎉</h1>
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/')} className="btn-back">← Hub</button>

            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#9C27B0' }}>Civics & Leadership {currentCountryData.name === "Nigeria" ? "🇳🇬" : "🌍"}</h1>
                <p style={{ color: '#aaa' }}>Complete all 10 pillars to become a Master Citizen of {countryName}.</p>
                <div style={{
                    marginTop: '1rem', padding: '0.5rem 1.5rem', backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    borderRadius: '30px', display: 'inline-block', border: '1px solid #9C27B0'
                }}>
                    Progress: <strong>{completedPillars.length} / 11</strong> | Earnings: <strong>{currency}{(completedPillars.filter(id => id <= 10).length) * 200}</strong>
                </div>
            </header>


            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* PILLAR NAVIGATION */}
                <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {pillars.map((p, idx) => {
                        const isUnlocked = idx === 0 || completedPillars.includes(pillars[idx - 1].id);
                        const isDone = completedPillars.includes(p.id);

                        return (
                            <button
                                key={p.id}
                                disabled={!isUnlocked}
                                onClick={() => setActivePillar(p.id)}
                                className={`btn ${activePillar === p.id ? 'active' : ''}`}
                                style={{
                                    backgroundColor: activePillar === p.id ? p.color : '#222',
                                    color: activePillar === p.id ? 'black' : (isDone ? '#00C851' : (isUnlocked ? 'white' : '#555')),
                                    border: `1px solid ${isDone ? '#00C851' : (isUnlocked ? '#444' : '#222')}`,
                                    padding: '1rem', borderRadius: '15px', fontSize: '0.8rem', position: 'relative',
                                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                    opacity: isUnlocked ? 1 : 0.6
                                }}
                            >
                                {!isUnlocked && <span style={{ marginRight: '0.5rem' }}>🔒</span>}
                                {p.title}
                                {isDone && <span style={{ position: 'absolute', top: '5px', right: '5px' }}>✅</span>}
                            </button>
                        );
                    })}
                </div>

                {/* PILLAR CONTENT */}
                <div style={{ flex: '2 1 400px', minHeight: '400px', position: 'relative' }}>
                    {pillarTimer > 0 && !completedPillars.includes(activePillar) && (
                        <div style={{ position: 'absolute', top: '-30px', right: 0, backgroundColor: '#9C27B0', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', animation: 'pulse 1s infinite' }}>
                            📖 Reading: {pillarTimer}s
                        </div>
                    )}
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
                        {activePillar === 11 && renderSimulator()}

                        {/* MASTERY AWARD BUTTON */}
                        {isMaster && (
                            <div style={{
                                marginTop: '3rem', padding: '2rem', backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                borderRadius: '20px', border: '2px dashed #9C27B0', textAlign: 'center',
                                animation: 'fadeIn 1s'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                                <h3 style={{ color: '#9C27B0' }}>Mastery Achieved!</h3>
                                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>You have successfully completed all 11 pillars of Civic Mastery.</p>
                                <button
                                    onClick={() => setShowCertificate(true)}
                                    className="btn btn-primary"
                                    style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: '#9C27B0' }}
                                >
                                    Claim Your Certificate 📜
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* CIVIC FACT MODAL */}
            {
                activeFact && (
                    <div
                        onClick={() => setActiveFact(null)}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center',
                            alignItems: 'center', zIndex: 10000, padding: '1rem'
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                backgroundColor: '#1E1E1E', padding: '2rem', borderRadius: '24px',
                                width: '90%', maxWidth: '400px', border: '2px solid #FFD700',
                                textAlign: 'center', boxShadow: '0 0 30px rgba(255,215,0,0.2)',
                                animation: 'popIn 0.3s'
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                            <h2 style={{ color: '#FFD700', marginTop: 0 }}>{activeFact.term}</h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#fff' }}>{activeFact.fact}</p>
                            <button
                                onClick={() => setActiveFact(null)}
                                className="btn"
                                style={{ marginTop: '2rem', width: '100%', backgroundColor: '#FFD700', color: 'black' }}
                            >
                                Got it! 👑
                            </button>
                        </div>
                    </div>
                )
            }

            {/* CERTIFICATE AWARD MODAL */}
            {
                showCertificate && (
                    <div
                        onClick={() => setShowCertificate(false)}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center',
                            alignItems: 'center', zIndex: 10001, padding: '1rem'
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                backgroundColor: '#fff', padding: '3rem', borderRadius: '15px',
                                maxWidth: '650px', width: '100%', textAlign: 'center', color: '#1a1a1a',
                                border: '15px solid #9C27B0', boxShadow: '0 0 50px rgba(156, 39, 176, 0.4)',
                                fontFamily: 'serif', position: 'relative'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '1.5rem', color: '#333' }} onClick={() => setShowCertificate(false)}>×</div>
                            <h1 style={{ color: '#9C27B0', fontSize: '2.5rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Certificate of Mastery</h1>
                            <p style={{ fontSize: '1.2rem', color: '#555', margin: '1rem 0' }}>This is to certify that</p>
                            <h2 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#000', borderBottom: '2px solid #eee', display: 'inline-block', padding: '0 2rem' }}>{userName || "Valued Citizen"}</h2>
                            <p style={{ fontSize: '1.1rem', color: '#555', margin: '1.5rem 0' }}>
                                has successfully completed the 10 Pillars of <br />
                                <strong>Civics & Leadership Certification</strong><br />
                                representing the great nation of <strong>{countryName}</strong>.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '3rem' }}>
                                <div style={{ textAlign: 'center', borderTop: '1px solid #333', width: '150px', padding: '0.5rem' }}>
                                    <p style={{ fontSize: '0.9rem', margin: 0 }}>MindNest Hub</p>
                                    <small style={{ color: '#888' }}>Issuer</small>
                                </div>
                                <div style={{ fontSize: '4rem', opacity: 0.1 }}>🏆</div>
                                <div style={{ textAlign: 'center', borderTop: '1px solid #333', width: '150px', padding: '0.5rem' }}>
                                    <p style={{ fontSize: '0.9rem', margin: 0 }}>{new Date().toLocaleDateString()}</p>
                                    <small style={{ color: '#888' }}>Date</small>
                                </div>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="btn"
                                style={{ marginTop: '2.5rem', width: '100%', backgroundColor: '#9C27B0', color: 'white', fontFamily: 'sans-serif' }}
                            >
                                Download / Print Certificate 🎓
                            </button>
                        </div>
                    </div>
                )
            }

            {/* MODULE SETUP MODAL */}
            {
                showSetup && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center',
                        alignItems: 'center', zIndex: 10005, padding: '1.5rem'
                    }}>
                        <div style={{
                            backgroundColor: '#1a1a1a', padding: '2.5rem', borderRadius: '30px',
                            maxWidth: '450px', width: '100%', border: '2px solid #9C27B0', textAlign: 'center',
                            animation: 'fadeIn 0.5s'
                        }}>
                            <h2 style={{ color: '#9C27B0', fontSize: '2rem', marginBottom: '1rem' }}>Module Setup 🏢</h2>
                            <p style={{ color: '#aaa', marginBottom: '2rem' }}>Please provide your details to personalize your civic learning experience.</p>

                            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                                <label style={{ color: '#eee', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Your Full Name</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="E.g. Kofi Mensah"
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
                                />
                            </div>

                            <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                                <label style={{ color: '#eee', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Your Country</label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <button
                                disabled={!userName || !selectedCountry}
                                onClick={() => setShowSetup(false)}
                                className="btn"
                                style={{
                                    width: '100%', backgroundColor: '#9C27B0', color: 'white',
                                    padding: '1rem', borderRadius: '15px', fontWeight: 'bold',
                                    opacity: (!userName || !selectedCountry) ? 0.5 : 1
                                }}
                            >
                                Start Learning 🚀
                            </button>
                        </div>
                    </div>
                )
            }

            <style>{`
                .btn-back { background: none; border: none; color: #9C27B0; font-size: 1.2rem; cursor: pointer; margin-bottom: 1rem; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    75% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); }
                }
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Civics;


