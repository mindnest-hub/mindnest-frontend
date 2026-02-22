import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import Toast from '../components/Toast';
import { useGamification } from '../context/GamificationContext';
import CivicGuide from '../components/CivicGuide';

const Civics = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { addEarnings, moduleEarnings } = useWallet();
    const { addPoints } = useGamification();

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
    const [viewMode, setViewMode] = useState('games'); // 'games' or 'guide'

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                addPoints(50); // Gamification: Award 50 points per pillar
                showToast(`Pillar Completed! +${currency}200 🗳️`, 'success');
            } else {
                addPoints(100); // Final mastery bonus
                showToast(`Final Mastery Revealed! 🏆`, 'success');
            }
            triggerConfetti();
        }
    };



    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // --- PILLAR 1: GOVT FUNCTIONS (Advanced) ---
    const [govtStep, setGovtStep] = useState(0);
    const kidGovtScenarios = [
        { q: "The local road is full of potholes. Who should fix it?", a: "Executive", options: ["Executive", "Legislative", "Judiciary"], hint: `The Executive runs the ${countryName} government & builds infrastructure.` },
        { q: "A new law is needed to protect children. Who makes it?", a: "Legislative", options: ["Executive", "Legislative", "Judiciary"], hint: `The Legislative branch (like our ${parliament}) makes the laws.` },
        { q: "Someone stole a cow and needs to be judged. Who handles this?", a: "Judiciary", options: ["Executive", "Legislative", "Judiciary"], hint: "The Judiciary interprets laws & settles disputes." }
    ];

    const teenGovtScenarios = [
        { q: "A reporter wants to interview a Minister. Which branch is the Minister in?", a: "Executive", options: ["Executive", "Legislature", "Judiciary", "Press"], hint: "The Executive implements policy and manages ministries." },
        { q: "A new law on digital privacy is being debated in the House. Which branch?", a: "Legislature", options: ["Executive", "Legislature", "Judiciary", "Police"], hint: "The Legislature makes, debates, and passes laws." },
        { q: "A citizen sues the government over a land dispute. Who decides?", a: "Judiciary", options: ["Executive", "Legislature", "Judiciary", "Traditional Leaders"], hint: "The Judiciary interprets the law and settles disputes." },
        { q: "The National Budget needs approval before money is spent. Who approves it?", a: "Legislature", options: ["Executive", "Legislature", "Judiciary", "Central Bank"], hint: "The Legislature holds the 'power of the purse'." },
        { q: "A governor is inaugurated and starts appointing commissioners. Which branch?", a: "Executive", options: ["Executive", "Legislature", "Judiciary", "Civil Service"], hint: "The Executive head appoints the team to carry out governance." }
    ];

    const adultGovtScenarios = [
        { q: "National security policy is failing. Who is ultimately responsible for the strategy?", a: "Executive", options: ["Executive", "Legislature", "Judiciary", "Civil Society"], hint: "The Executive branch manages national security and the armed forces." },
        { q: "A bill is vetoed by the President. How can it still become law?", a: "Legislature override", options: ["Legislature override", "Judiciary ruling", "Public protest", "It can't"], hint: "The Legislature can override a veto with a two-thirds majority." },
        { q: "A law is found to violate the Constitution. Who can nullify it?", a: "Judiciary", options: ["Executive", "Legislature", "Judiciary", "Electoral Commission"], hint: "The Judiciary has the power of judicial review." },
        { q: "Who audits the government's spending to ensure transparency?", a: "Auditor-General/Legislature", options: ["Auditor-General/Legislature", "Executive", "The Bank", "The Press"], hint: "The Auditor-General reports to the Legislature to check the Executive." },
        { q: "Which body regulates the conduct of elections to ensure fairness?", a: "INEC/Electoral Body", options: ["INEC/Electoral Body", "The President", "The Army", "Ruling Party"], hint: "An independent electoral body is vital for democratic legitimacy." },
        { q: "A state wants to create its own police force. Who decides if this is constitutional?", a: "Supreme Court", options: ["Supreme Court", "The Governor", "The Senate", "Police IG"], hint: "Institutional disputes regarding the constitution are settled by the highest court." },
        { q: "The Central Bank changes interest rates. Which part of governance is this?", a: "Executive/Monetary Policy", options: ["Executive/Monetary Policy", "Legislature", "Judiciary", "Private Sector"], hint: "Financial regulation and monetary policy are executive functions carried out by the Central Bank." }
    ];

    const govtScenarios = isKid ? kidGovtScenarios : (isTeen ? teenGovtScenarios : adultGovtScenarios);

    // --- PILLAR 2: KNOW YOUR RIGHTS (Advanced) ---
    const [rightsStage, setRightsStage] = useState(0);
    const kidRightsLevels = [
        { title: "Level 1: Basic Human Rights 🌱", desc: "These are the rights you are born with.", rights: [{ t: "Right to Life", d: "No one can take your life away.", icon: "🌱" }, { t: "Freedom of Movement", d: "You can travel anywhere safely.", icon: "🚶" }] },
        { title: "Level 2: Civic Power 🗳️", desc: "Your power as a citizen of the nation.", rights: [{ t: "Right to Vote", d: "You choose who leads at 18.", icon: "🗳️" }, { t: "Freedom of Speech", d: "You can speak your truth respectfully.", icon: "🗣️" }] },
        { title: "Level 3: Extra Protection 🛡️", desc: "Rights that protect kids and consumers.", rights: [{ t: "Children's Rights", d: "Right to play and be protected from work.", icon: "🪁" }, { t: "Consumer Rights", d: "Right to get what you paid for (Quality).", icon: "🏷️" }] }
    ];

    const teenRightsLevels = [
        {
            title: 'Level 1: Personal Freedoms',
            desc: 'Identify your rights to speech and assembly (Chapter IV).',
            rights: [
                { t: "Freedom of Expression", d: "Right to speak and share info (Section 39).", icon: "🗣️" },
                { t: "Peaceful Assembly", d: "Right to join groups and clubs (Section 40).", icon: "👥" }
            ]
        },
        {
            title: 'Level 2: Liberty & Privacy',
            desc: 'Understanding your basic protections from the state.',
            rights: [
                { t: "Personal Liberty", d: "Protection from illegal arrest (Section 35).", icon: "🔓" },
                { t: "Private & Family Life", d: "Protection of your data and home (Section 37).", icon: "🏠" }
            ]
        },
        {
            title: 'Level 3: Belief & Movement',
            desc: 'Your right to follow your path and travel freely.',
            rights: [
                { t: "Conscience & Religion", d: "Freedom to believe and worship (Section 38).", icon: "⚖️" },
                { t: "Freedom of Movement", d: "Right to travel throughout the nation (Section 41).", icon: "🚶" }
            ]
        }
    ];

    const adultRightsLevels = [
        {
            title: "Level 1: Fair Trial & Justice 📜",
            desc: "Critical legal rights in the court system.",
            rights: [
                { t: "Fair Hearing", d: "Right to be heard within reasonable time (Section 36).", icon: "🔨" },
                { t: "Innocence", d: "Presumed innocent until proven guilty (Section 36(5)).", icon: "🕊️" }
            ]
        },
        {
            title: "Level 2: Property & Equality 🏘️",
            desc: "Economic and social protections for adults.",
            rights: [
                { t: "Own Property", d: "Right to own land anywhere in the nation (Section 43).", icon: "🏡" },
                { t: "Freedom from Discrimination", d: "No bias based on tribe, sex, or religion (Section 42).", icon: "✊" }
            ]
        },
        {
            title: "Level 3: Redress & Enforcement ⚔️",
            desc: "How to fight for your rights when they are breached.",
            rights: [
                { t: "Access to High Court", d: "Right to sue for rights enforcement (Section 46).", icon: "⚖️" },
                { t: "Dignity of Person", d: "Protection from torture or slavery (Section 34).", icon: "🔗" }
            ]
        }
    ];

    const rightsLevels = isKid ? kidRightsLevels : (isTeen ? teenRightsLevels : adultRightsLevels);




    // --- PILLAR 7: BUDGET & SELF-RELIANCE ---
    const [budgetAllocation, setBudgetAllocation] = useState({ education: 25, health: 25, roads: 25, security: 25 });
    const totalBudget = Object.values(budgetAllocation).reduce((a, b) => a + b, 0);
    const [showSelfReliance, setShowSelfReliance] = useState(false);

    // --- PILLAR 11: STATECRAFT SIMULATOR ---
    const [simRole, setSimRole] = useState(null); // 'President', 'Governor', 'Minister'
    const [simPriority, setSimPriority] = useState(null); // 'Education', 'Economy', 'Security'
    const [simStage, setSimStage] = useState(0);

    // --- GAME STATES FOR POLISHED PILLARS ---
    const [respStep, setRespStep] = useState(0);
    const [lawStep, setLawStep] = useState(0);
    const [projStep, setProjStep] = useState(0);
    const [toolStep, setToolStep] = useState(0);
    const [budgetStep, setBudgetStep] = useState(0);
    const [ethicsStage, setEthicsStage] = useState(0);
    const [leadStep, setLeadStep] = useState(0);
    const [localStep, setLocalStep] = useState(0);
    const [simStep, setSimStep] = useState(0);

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


    const renderGovtGame = () => {
        const scenarios = isKid ? kidGovtScenarios : (isTeen ? teenGovtScenarios : adultGovtScenarios);
        return (
            <div className="card" style={{ borderTop: '4px solid #9C27B0' }}>
                <h3>{isKid ? 'Who Should Fix This?' : (isTeen ? 'Constitutional Watchdog' : 'The Legislative Path')} 🏛️</h3>
                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
                    {isKid ? 'Match the problem to the branch of government.' : (isTeen ? 'Analyze the news and identify the branch involved.' : 'Navigate the complex process of governance.')}
                </p>

                {govtStep < scenarios.length ? (
                    <div>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem' }}>"{scenarios[govtStep].q}"</p>
                        <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                            {scenarios[govtStep].options.map(opt => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(1)}
                                    onClick={() => {
                                        if (opt === scenarios[govtStep].a) {
                                            showToast("Correct!", 'success');
                                            setActiveFact({ term: "Governance 🎓", fact: scenarios[govtStep].hint });
                                            if (govtStep === scenarios.length - 1) handlePillarComplete(1);
                                            setGovtStep(prev => prev + 1);
                                        } else {
                                            showToast(scenarios[govtStep].hint, 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(1)) ? 0.5 : 1 }}
                                >
                                    <Term name={opt} />
                                    {(pillarTimer > 0 && !completedPillars.includes(1)) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#00C851' }}>
                        <h4>{isKid ? 'Mastery Achieved!' : 'System Mastered!'} 🏆</h4>
                        <p>{isKid ? 'You now know who to hold accountable.' : 'You understand the checks and balances of your nation.'}</p>
                        <button onClick={() => setGovtStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Play Again</button>
                    </div>
                )}
            </div>
        );
    };


    const renderRights = () => {
        const levels = isKid ? kidRightsLevels : (isTeen ? teenRightsLevels : adultRightsLevels);
        return (
            <div className="card" style={{ borderTop: '4px solid #2196F3' }}>
                <h3>{levels[rightsStage].title}</h3>
                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>{levels[rightsStage].desc}</p>
                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                    {levels[rightsStage].rights.map((r, i) => (
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
                    {rightsStage < levels.length - 1 ? (
                        <button
                            disabled={pillarTimer > 0 && !completedPillars.includes(2)}
                            onClick={() => {
                                showToast(`Level ${rightsStage + 1} Complete! Next...`, 'success');
                                const rightsFacts = [
                                    "Your fundamental rights are the core shield that protects your dignity as a human being.",
                                    "Civic rights, like voting, are the tools you use to shape the leadership of your country.",
                                    "Special protections exist for children and consumers to ensure the most vulnerable are safe.",
                                    "Environmental rights protect our land and water for future generations of Africans.",
                                    "Digital rights ensure your privacy and data are protected in a connected world.",
                                    "Cultural rights preserve our heritage and diverse languages across the continent.",
                                    "Economic rights guarantee fair opportunities and protection in the marketplace."
                                ];
                                setActiveFact({ term: "Fundamental Rights ⚖️", fact: rightsFacts[rightsStage] || "Keep learning about your rights!" });
                                setRightsStage(prev => prev + 2);
                            }}
                            className="btn btn-primary"
                            style={{ width: '100%', height: 'auto', whiteSpace: 'normal', backgroundColor: '#2196F3', opacity: (pillarTimer > 0 && !completedPillars.includes(2)) ? 0.5 : 1 }}
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
                            style={{ width: '100%', height: 'auto', whiteSpace: 'normal', backgroundColor: '#00C851', opacity: (pillarTimer > 0 && !completedPillars.includes(2)) ? 0.5 : 1 }}
                        >
                            I Mastered my Rights! ✅ {(pillarTimer > 0 && !completedPillars.includes(2)) && `(${pillarTimer}s)`}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // --- PILLAR 3: RESPONSIBILITIES (Advanced) ---
    const kidRespScenarios = [
        { q: "You see litter on the street near your house. What do you do?", a: "Pick it up", options: ["Pick it up", "Wait for Govt", "Ignore it"], hint: "A clean community starts with individual responsibility." },
        { q: "You witness a neighbor's property being vandalized. What do you do?", a: "Report it", options: ["Report it", "Join in", "Stay silent"], hint: "Protecting public and private property is a civic duty." },
        { q: "It's election day in your neighborhood. You are 18+.", a: "Go Vote", options: ["Go Vote", "Stay home", "Go to a party"], hint: "Voting is both a right and a responsibility." }
    ];

    const teenRespScenarios = [
        { q: "You discover a local stream is being polluted by a factory. What is your civic duty?", a: "Mobilize & Report", options: ["Mobilize & Report", "Wait for others", "Ignore it"], hint: "The 'Ubuntu' spirit means protecting the community's resources together." },
        { q: "The National Anthem is playing at a public event. How do you respond?", a: "Stand Respectfully", options: ["Stand Respectfully", "Keep walking", "Talk loudly"], hint: "Respecting national symbols shows unity and patriotism." },
        { q: "A younger student is being excluded from a game because of their tribe. Action?", a: "Include & Educate", options: ["Include & Educate", "Walk away", "Join the exclusion"], hint: "Promoting Pan-African unity starts with ending discrimination in our own circles." },
        { q: "You see a viral news story that seems suspicious. What is your digital responsibility?", a: "Fact-check before sharing", options: ["Fact-check before sharing", "Share it immediately", "Comment something angry"], hint: "Responsible citizens prevent the spread of misinformation." },
        { q: "Your school is holding a 'Community Clean-up' day on a Saturday. Response?", a: "Volunteer to lead", options: ["Volunteer to lead", "Stay home and sleep", "Watch from a distance"], hint: "Leadership starts with small acts of service to your immediate environment." }
    ];

    const adultRespScenarios = [
        { q: "You notice a government project in your ward is stalled. Action?", a: "Audit & Petition", options: ["Audit & Petition", "Complain on FB", "Do nothing"], hint: "Citizens should track local projects and use formal channels for accountability." },
        { q: "You are called for community oversight or townhall. Response?", a: "Attend & Speak", options: ["Attend & Speak", "Stay home", "Send a representative"], hint: "Active participation in local governance is the core of a thriving democracy." },
        { q: "You witness a professional colleague accepting a bribe. Action?", a: "Report to authorities", options: ["Report to authorities", "Ask for a share", "Keep quiet"], hint: "Integrity in the workplace is essential for national development." },
        { q: "It is tax season for your small business. What is your primary duty?", a: "File and pay accurately", options: ["File and pay accurately", "Hide your income", "Wait for a tax amnesty"], hint: "Taxes fund the public services that sustain our economy." },
        { q: "A local election is approaching, but you don't like any candidate.", a: "Research & Vote anyway", options: ["Research & Vote anyway", "Stay home in protest", "Tear your voter card"], hint: "Voting is a responsibility to choose the 'least bad' or best option for progress." },
        { q: "You are offered a position on a community board. Response?", a: "Accept if qualified", options: ["Accept if qualified", "Decline to stay 'neutral'", "Ask for a salary first"], hint: "Civic service often requires non-compensated contribution of your expertise." },
        { q: "You notice a neighbor is struggling with mental health issues. Role?", a: "Connect with support", options: ["Connect with support", "Gossip about it", "Ignore it"], hint: "A healthy society is a caring society where we look out for each other." }
    ];

    const respScenarios = isKid ? kidRespScenarios : (isTeen ? teenRespScenarios : adultRespScenarios);

    // --- PILLAR 4: EVERYDAY LAW (Advanced) ---
    const kidLawScenarios = [
        { q: "A LASTMA/Police officer stops you and asks for your license. You have it. What is your right?", a: "Show it politely", options: ["Show it politely", "Argue & Shout", "Run away"], hint: "Cooperation and knowing your rights prevents unnecessary conflict." },
        { q: "Your landlord enters your apartment without notice or permission. Is this legal?", a: "No", options: ["Yes", "No", "Maybe"], hint: "In most places, a tenant has a right to 'Quiet Enjoyment' and notice before entry." },
        { q: "You bought a phone that stopped working after 1 day. The shop says 'No Refund'. Help?", a: "Consumer Rights Act", options: ["Consumer Rights Act", "Cry", "Break the shop glass"], hint: "The Consumer Protection Act protects you from faulty goods despite what some shops say." }
    ];

    const teenLawScenarios = [
        { q: "You want to sign an 'End User License' for an app. What should you do?", a: "Read the Privacy section", options: ["Read the Privacy section", "Click accept immediately", "Delete app"], hint: "Digital literacy includes understanding what data you are giving away." },
        { q: "You are starting a small side-hustle. What is a 'Contract'?", a: "A binding agreement", options: ["A binding agreement", "A friendly promise", "A type of tax"], hint: "Contracts protect both parties in a business transaction." },
        { q: "Is taking a photo of someone without permission in public legal?", a: "Generally Yes", options: ["Generally Yes", "Always No", "Only if they are rich"], hint: "Laws vary, but public spaces usually have lower privacy expectations than private ones." },
        { q: "A friend is being bullied on a group chat. What is a legal digital responsibility?", a: "Report & Support", options: ["Report & Support", "Join the jokes", "Delete the chat"], hint: "Cyberbullying can have legal consequences; standing against it is a civic duty." },
        { q: "You created a cool logo for your brand. How do you protect it?", a: "Trademark/Copyright", options: ["Trademark/Copyright", "Tell everyone it's yours", "Keep it a secret"], hint: "Intellectual Property laws help you own and profit from your creative work." }
    ];

    const adultLawScenarios = [
        { q: "You are dealing with a property dispute. What is the first step?", a: "Mediation/Legal Review", options: ["Mediation/Legal Review", "Self-help/Force", "Social media rant"], hint: "Legal disputes should be settled through formal mediation or the court system." },
        { q: "What is the consequence of tax evasion for a business?", a: "Heavy Fines/Jail", options: ["Heavy Fines/Jail", "Nothing", "A small pat on back"], hint: "Paying taxes is a legal requirement that funds the nation's infrastructure." },
        { q: "What is 'Intellectual Property' (IP) protection used for?", a: "Protecting inventions", options: ["Protecting inventions", "Owning people", "Buying land"], hint: "IP laws allow creators to own and profit from their original ideas." },
        { q: "Your employer asks you to work 12 hours a day without extra pay. Right?", a: "Right to Fair Labor", options: ["Right to Fair Labor", "Just do it for the experience", "Quit immediately"], hint: "Labor laws set limits on working hours and guarantee overtime or fair treatment." },
        { q: "A landlord wants to increase rent mid-contract by 100%. Legal?", a: "Check Tenancy Law", options: ["Check Tenancy Law", "Pay it to avoid trouble", "Refusal to pay any rent"], hint: "Tenancy laws protect both parties from arbitrary changes in agreed terms." },
        { q: "You discover a public official is mismanaging funds. Potential action?", a: "Public Interest Litigation", options: ["Public Interest Litigation", "Ignore it", "Bribe them for a share"], hint: "Citizens can use the courts to seek justice for matters affecting the whole community." },
        { q: "How do you request records from a government agency in Africa?", a: "Freedom of Information Act", options: ["Freedom of Information Act", "Ask on Twitter", "Wait for the news"], hint: "The FOI Act is a powerful tool for transparency and government accountability." }
    ];

    const lawScenarios = isKid ? kidLawScenarios : (isTeen ? teenLawScenarios : adultLawScenarios);

    const renderResponsibilities = () => {
        const scenarios = isKid ? kidRespScenarios : (isTeen ? teenRespScenarios : adultRespScenarios);
        return (
            <div className="card" style={{ borderTop: '4px solid #4CAF50' }}>
                <h3>{isKid ? 'The Good Citizen Test' : (isTeen ? 'Digital & Civic Duty' : 'The Sentinel Test')} 🤝</h3>
                {respStep < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>"{scenarios[respStep].q}"</p>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {scenarios[respStep].options.map(opt => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(3)}
                                    onClick={() => {
                                        if (opt === scenarios[respStep].a) {
                                            showToast("Responsible Choice! ✅", 'success');
                                            setActiveFact({ term: "Civic Duty 🤝", fact: scenarios[respStep].hint });
                                            if (respStep === scenarios.length - 1) handlePillarComplete(3);
                                            setRespStep(prev => prev + 1);
                                        } else {
                                            showToast(scenarios[respStep].hint, 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ textAlign: 'left', padding: '1rem', whiteSpace: 'normal', height: 'auto', opacity: (pillarTimer > 0 && !completedPillars.includes(3)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(3)) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ color: '#00C851' }}>Duty Accepted! 🏆</h4>
                        <p>{isKid ? 'You are ready to build the nation.' : 'Your integrity strengthens the foundation of society.'}</p>
                        <button onClick={() => setRespStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Re-test 🔄</button>
                    </div>
                )}
            </div>
        );
    };

    const renderLaw = () => {
        const scenarios = isKid ? kidLawScenarios : (isTeen ? teenLawScenarios : adultLawScenarios);
        return (
            <div className="card" style={{ borderTop: '4px solid #FF9800' }}>
                <h3>{isKid ? 'Legal Eagle Challenge' : (isTeen ? 'Contract & Digital Literacy' : 'The Law & The Professional')} 🦅</h3>
                {lawStep < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>"{scenarios[lawStep].q}"</p>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {scenarios[lawStep].options.map(opt => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(4)}
                                    onClick={() => {
                                        if (opt === scenarios[lawStep].a) {
                                            showToast("Legal Mastery! ✅", 'success');
                                            setActiveFact({ term: "Law & Society ⚖️", fact: scenarios[lawStep].hint });
                                            if (lawStep === scenarios.length - 1) handlePillarComplete(4);
                                            setLawStep(prev => prev + 1);
                                        } else {
                                            showToast(scenarios[lawStep].hint, 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(4)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(4)) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ color: '#FF9800' }}>{isKid ? 'Legal Eagle Certified!' : 'Jurisprudence Mastery Achieved!'} 🛡️</h4>
                        <p>{isKid ? 'You know your rights and the law.' : 'You are equipped to navigate the legal complexities of society.'}</p>
                        <button onClick={() => setLawStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Re-play 🔄</button>
                    </div>
                )}
            </div>
        );
    };

    // --- PILLAR 5: COMMUNITY PROJECTS (Advanced) ---
    const kidProjScenarios = [
        { q: "Level 1: Audit - What is the most pressing issue in your street today?", options: ["Blocked Drains", "Littering", "Broken Street-lights"], icon: "🔍" },
        { q: "Level 2: Mobilization - Who will you invite to your first meeting?", options: ["Neighbors & Friends", "Only Government officials", "Nobody, I'll do it alone"], icon: "🤝" },
        { q: "Level 3: The Pitch - How will you present your solution to the Chairman?", options: ["Written Proposal & Data", "Shouting & Protests", "Ignore it"], icon: "📝" }
    ];

    const teenProjScenarios = [
        { q: "Level 1: Youth Mobilization - How do you attract volunteers for a park cleanup?", options: ["Social Media & Peer impact", "Pay them a small fee", "Wait for teachers"], icon: "📢" },
        { q: "Level 2: Resource Mapping - Where can you find tools and support?", options: ["Local businesses & PTA", "Steal from the store", "Buy everything brand new"], icon: "🗺️" },
        { q: "Level 3: Impact Pitch - How do you convince the Principal to support your club?", options: ["Presentation of Benefits", "Demand it as a right", "Quit school"], icon: "💡" },
        { q: "Level 4: Sustainability - How do you keep the project going after 6 months?", options: ["System of rotation & Mentorship", "Ask for money every day", "Quit when it gets hard"], icon: "🔄" },
        { q: "Level 5: Digital Advocacy - How do you scale your impact online?", options: ["Impact stories & Hashtags", "Shouting at people", "Buying fake followers"], icon: "📱" }
    ];

    const adultProjScenarios = [
        { q: "Level 1: Needs Assessment - How do you validate a community project idea?", options: ["Surveys & Townhall data", "Personal opinion", "Asking the Oracle"], icon: "📊" },
        { q: "Level 2: Grant Writing - What is the most critical part of a funding proposal?", options: ["Measurable Outcomes & Budget", "Poetic descriptions", "Threatening to stop working"], icon: "🖋️" },
        { q: "Level 3: Public-Private Partnership - How do you engage corporate CSR?", options: ["Align with their ESG goals", "Beg for charity", "Force them via laws"], icon: "🤝" },
        { q: "Level 4: Stakeholder Engagement - How do you handle opposition to your project?", options: ["Dialogue & Conciliation", "Ignore them", "Shame them publicly"], icon: "👥" },
        { q: "Level 5: Policy Advocacy - How do you turn a project into a local law?", options: ["Policy Brief & Lobbying", "Hiring a lawyer", "Complaining on radio"], icon: "📜" },
        { q: "Level 6: Scaling Impact - How do you move from one ward to the whole LGA?", options: ["Replicable Model & Networking", "Working 24/7 alone", "Waiting for government"], icon: "📈" },
        { q: "Level 7: Governance Monitoring - How do you ensure the project remains ethical?", options: ["Social Audits & Transparency", "Trusting everyone blindly", "Keeping secrets"], icon: "⚖️" }
    ];

    const renderProjects = () => {
        const scenarios = isKid ? kidProjScenarios : (isTeen ? teenProjScenarios : adultProjScenarios);
        return (
            <div className="card" style={{ borderTop: '4px solid #E91E63' }}>
                <h3>{isKid ? 'Village Hero Quest' : (isTeen ? 'Youth Impact Catalyst' : 'Community Solutions Architect')} 🦸‍♂️</h3>
                {projStep < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{scenarios[projStep].icon}</div>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>{scenarios[projStep].q}</p>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {scenarios[projStep].options.map((opt, i) => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(5)}
                                    onClick={() => {
                                        if (i === 0) {
                                            showToast("Great Leadership! 🚀", 'success');
                                            setActiveFact({ term: "Civic Action 🏗️", fact: "Collaboration is the key to sustainable community development." });
                                            if (projStep === scenarios.length - 1) handlePillarComplete(5);
                                            setProjStep(prev => prev + 1);
                                        } else {
                                            showToast("Try a more collaborative approach!", 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(5)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(5) && i === 0) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ color: '#E91E63' }}>{isKid ? 'Village Hero Crowned!' : 'Impact Catalyst Optimized!'} 👑</h4>
                        <p>{isKid ? 'Your community is better because you led.' : 'You have the tools to transform your environment.'}</p>
                        <button onClick={() => setProjStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Start New Project 🏗️</button>
                    </div>
                )}
            </div>
        );
    };

    // --- PILLAR 6: CIVIC TOOLS (Advanced) ---
    const kidToolScenarios = [
        { q: "Level 1: Verification - You get a WhatsApp message saying 'Click here for free money'. Do you click?", options: ["Delete & Ignore", "Click & Share", "Forward to friends"], icon: "📱" },
        { q: "Level 2: Mapping - Where do you find the layout of your Local Government?", options: ["Official State Website", "Ask on Street", "Wait for election"], icon: "🗺️" },
        { q: "Level 3: Reporting - You see a transformer sparking. Who do you call first?", options: ["Electric Co. / Emergency", "Nobody", "Call your friend"], icon: "📞" }
    ];

    const teenToolScenarios = [
        { q: "Level 1: Freedom of Information (FOI) - How do you ask a school board for their budget?", options: ["Formal FOI Request", "Shouting in the hall", "Wait until graduation"], icon: "📂" },
        { q: "Level 2: Digital Fact-Checking - Which tool helps verify a suspicious viral video?", options: ["Reverse Image Search", "Just believing it", "Sharing it to check"], icon: "🔍" },
        { q: "Level 3: Online Petitions - What makes a petition more effective for change?", options: ["Specific ask & Evidence", "A lot of emojis", "Angry language"], icon: "🖋️" },
        { q: "Level 4: Mobile Civic Tech - Which app helps report local infrastructure issues?", options: ["Civic reporting apps", "Instagram only", "Gaming apps"], icon: "📱" },
        { q: "Level 5: Social Media Advocacy - How do you tag a leader effectively?", options: ["Evidence & Polite mention", "Constant spamming", "Using insults"], icon: "📢" }
    ];

    const adultToolScenarios = [
        { q: "Level 1: Administrative Law - How do you appeal a wrong tax assessment?", options: ["Tax Appeal Tribunal", "Not paying it", "Hiding your assets"], icon: "⚖️" },
        { q: "Level 2: Lobbying - How do you influence high-level legislative change?", options: ["Professional Advocacy/Lobbying", "Bribery", "Twitter hashtags only"], icon: "🏛️" },
        { q: "Level 3: Investigative Journalism - How do you support accountability?", options: ["Supporting credible media", "Ignoring news", "Spreading rumors"], icon: "🗞️" },
        { q: "Level 4: Judicial Review - How do you challenge a government's executive order?", options: ["Filing for Judicial Review", "Ignoring the order", "Buying a protest banner"], icon: "⚖️" },
        { q: "Level 5: Public Budget Tracking - Which platform shows state spending?", options: ["Open Budget Portals", "The leader's blog", "Private bank statements"], icon: "📉" },
        { q: "Level 6: Whistleblowing - How do you report corruption safely?", options: ["Secure Whistleblower channels", "Telling a neighbor", "Posting on Facebook"], icon: "🤫" },
        { q: "Level 7: Int. Mechanisms - Where do you go if national courts fail human rights?", options: ["Regional/Int. Courts", "Nowhere, the end", "A private vigilante"], icon: "🌐" }
    ];


    const toolScenarios = [
        { t: "Level 1: The Letter 📝", d: "Draft a formal complaint about power outages.", c: "To the DISCO Manager, I report persistent outages at [My Area]...", icon: "✉️" },
        { t: "Level 2: The Petition ✍️", d: "Learn to build a digital petition for new roads.", c: "We the residents of [Area] demand fixed roads. Sign below!", icon: "🖋️" },
        { t: "Level 3: The Request 🕵️‍♂️", d: "Use the FOI Act to request project data.", c: "Under the FOI Act, I request the budget spent on [Project]...", icon: "📜" }
    ];

    const renderTools = () => {
        const scenarios = isKid ? kidToolScenarios : (isTeen ? teenToolScenarios : adultToolScenarios);
        const legacyScenarios = [ // Fallback for old render logic if needed, but better use age-based
            { t: "Level 1: The Letter 📝", d: "Draft a formal complaint about power outages.", c: "To the DISCO Manager, I report persistent outages at [My Area]...", icon: "✉️" },
            { t: "Level 2: The Petition ✍️", d: "Learn to build a digital petition for new roads.", c: "We the residents of [Area] demand fixed roads. Sign below!", icon: "🖋️" },
            { t: "Level 3: The Request 🕵️‍♂️", d: "Use the FOI Act to request project data.", c: "Under the FOI Act, I request the budget spent on [Project]...", icon: "📜" }
        ];

        return (
            <div className="card" style={{ borderTop: '4px solid #607D8B' }}>
                <h3>{isKid ? 'Civic Helper Workshop' : (isTeen ? 'Digital Advocacy Hub' : 'The Professional Activist')} 🛠️</h3>
                {toolStep < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{scenarios[toolStep].icon}</div>
                        <h4>{scenarios[toolStep].q}</h4>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            {scenarios[toolStep].options.map(opt => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(6)}
                                    onClick={() => {
                                        // Simple logic: first option is best for flow
                                        showToast("Tool Mastered! ✅", 'success');
                                        setActiveFact({ term: "Civic Tools 🛠️", fact: "Knowledge is the greatest tool for civic empowerment." });
                                        if (toolStep === scenarios.length - 1) handlePillarComplete(6);
                                        setToolStep(prev => prev + 1);
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(6)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(6)) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ color: '#607D8B' }}>Workshop Complete! 🦾</h4>
                        <p>You have the tools to hold any leader accountable.</p>
                        <button onClick={() => setToolStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Re-visit Tools 🔄</button>
                    </div>
                )}
            </div>
        );
    };


    // --- PILLAR 7: BUDGET & MONEY (Advanced) ---
    const kidBudgetScenarios = [
        { q: "Level 1: The Audit - Where does most of our national tax money go?", options: ["Public Services (Health/Edu)", "Private Luxury", "Hidden accounts"], a: 0, fact: "Taxes fund the infrastructure we all use—like roads and hospitals." },
        { q: "Level 2: Allocation - You have ₦100. How do you split it fairly?", options: ["Spread across all sectors", "Give it all to one friend", "Keep it in a safe"], a: 0, fact: "A balanced budget ensures no sector of society is left behind." },
        { q: "Level 3: Revenue - Where does the government get money to build?", options: ["Taxes & Resources", "It's free", "Borrowing only"], a: 0, fact: "Citizen taxes and natural resources are the primary fuel for development." }
    ];

    const teenBudgetScenarios = [
        { q: "Level 1: Transparency - What is the 'Power of the Purse'?", options: ["Legislature's power to approve spending", "Having a lot of money", "Secret spending"], a: 0, fact: "The Legislature must approve every cent the Executive spends." },
        { q: "Level 2: National Debt - When is borrowing money by a country okay?", options: ["To build lasting infrastructure", "To pay salaries", "To buy luxury cars"], a: 0, fact: "Debt should only be used for investments that create future wealth." },
        { q: "Level 3: Fiscal Responsibility - Why should a country save in a 'Rainy Day' fund?", options: ["For economic emergencies", "To hide money from citizens", "Because it's a trend"], a: 0, fact: "Sovereign Wealth Funds protect countries during global financial crises." },
        { q: "Level 4: Inflation - Why do prices of goods rise when too much money is printed?", options: ["Value of money drops", "Shopkeepers get greedy", "Goods become magic"], a: 0, fact: "Maintaining the value of currency is a key job of the Central Bank." },
        { q: "Level 5: Personal vs Civic - Why should you save money for your future?", options: ["To be independent & contribute", "To buy video games only", "To show off to friends"], a: 0, fact: "Financial independence allows you to be a more effective civic participant." }
    ];

    const adultBudgetScenarios = [
        { q: "Level 1: Macroeconomics - What is the difference between a Deficit and a Surplus?", options: ["Deficit: Spending > Revenue", "Surplus: Spending > Revenue", "They are the same"], a: 0, fact: "Managing a deficit is a key part of fiscal policy." },
        { q: "Level 2: Resource Management - What is the 'Natural Resource Curse'?", options: ["Dependence on one export (like oil)", "Resources disappearing", "Ghost stories"], a: 0, fact: "Diversifying the economy is essential to avoid the resource curse." },
        { q: "Level 3: Social Auditing - How can citizens track local budget performance?", options: ["Reviewing Open Budget portals", "Waiting for news", "Asking the neighbor"], a: 0, fact: "Many governments now publish open data for citizen oversight." },
        { q: "Level 4: Sovereign Wealth - What is the purpose of an 'Intergenerational Fund'?", options: ["To save for future citizens", "To pay current salaries", "To fund current elections"], a: 0, fact: "Wealth from natural resources belongs to both present and future generations." },
        { q: "Level 5: Illicit Flows - What is the impact of money laundering on a nation?", options: ["Weakens the economy & security", "Makes the country rich", "Nothing, it's just paper"], a: 0, fact: "Stopping illicit financial flows is crucial for national stability." },
        { q: "Level 6: Debt Management - What is 'Debt Sustainability'?", options: ["Ability to pay back without crisis", "Borrowing until you stop", "Never paying back"], a: 0, fact: "Managing debt ratios ensures the country remains credit-worthy." },
        { q: "Level 7: Economic Diversification - Why move from oil to 'Knowledge Economy'?", options: ["Resources run out; knowledge grows", "Knowledge is cheaper", "Oil is too heavy"], a: 0, fact: "A diversified economy is more resilient to global market shocks." }
    ];

    const renderBudget = () => {
        const scenarios = isKid ? kidBudgetScenarios : (isTeen ? teenBudgetScenarios : adultBudgetScenarios);
        return (
            <div className="card" style={{ borderTop: '4px solid #FFEB3B' }}>
                <h3 style={{ color: '#FFEB3B' }}>{isKid ? 'National Budget Master' : (isTeen ? 'Fiscal Navigator' : 'The Wealth of Nations')} 💰</h3>
                {budgetStep < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>{scenarios[budgetStep].q}</p>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {scenarios[budgetStep].options.map((opt, i) => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(7)}
                                    onClick={() => {
                                        if (i === scenarios[budgetStep].a) {
                                            showToast(scenarios[budgetStep].fact, 'success');
                                            setActiveFact({ term: "Budgeting Fact 🎓", fact: scenarios[budgetStep].fact });
                                            if (budgetStep === scenarios.length - 1) handlePillarComplete(7);
                                            setBudgetStep(prev => prev + 1);
                                        } else {
                                            showToast("Try a more sustainable choice!", 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(7)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(7) && i === 0) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <h4 style={{ color: '#FFEB3B' }}>Financial Freedom Master! 🏆</h4>
                        <div style={{ backgroundColor: 'rgba(255, 235, 59, 0.1)', padding: '1.2rem', borderRadius: '15px', margin: '1rem 0', borderLeft: '4px solid #FFEB3B', textAlign: 'left' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '0.5rem', color: '#fff', fontSize: '1rem' }}>
                                "External support is not evil. It becomes harmful only when it replaces local effort instead of strengthening it."
                            </p>
                        </div>
                        <button onClick={() => setBudgetStep(0)} className="btn btn-sm" style={{ marginTop: '2rem' }}>Re-study Budget 🔄</button>
                    </div>
                )}
            </div>
        );
    };

    // --- PILLAR 8: ETHICS (Advanced) ---
    const renderEthics = () => {
        const scenarios = isKid ? [
            { q: "You found ₦50 on the playground. What's the right thing to do?", options: ["Give to teacher to find owner", "Keep it for candy", "Give to your best friend"], a: 0, hint: "Honesty build a better school for everyone." },
            { q: "A friend asks you to lie to their parents about where they were.", options: ["Refuse politely", "Help them lie", "Tell everyone"], a: 0, hint: "Integrity is about being truthful even when it's hard." },
            { q: "You broke a window while playing. Do you admit it?", options: ["Yes, and offer to help fix it", "Run away", "Blame someone else"], a: 0, hint: "Taking responsibility is the mark of a hero." }
        ] : isTeen ? [
            { q: "Academic Integrity: A friend offers you the answers to the math test.", options: ["Refuse and study harder", "Accept them to pass", "Report the friend immediately"], a: 0, hint: "Cheating devalues your education and your character." },
            { q: "Peer Pressure: Everyone is sharing a private photo of a classmate.", options: ["Delete it and don't share", "Share it to feel included", "Show it to your parents"], a: 0, hint: "Respecting others' privacy is a digital responsibility." },
            { q: "Social Ethics: You see someone being treated unfairly because of their tribe.", options: ["Stand up for them", "Join in the teasing", "Stay silent"], a: 0, hint: "A leader stands up for justice, even when they are alone." },
            { q: "Digital Integrity: You found a way to use a paid app for free illegally.", options: ["Pay for it or use a free alt", "Use the illegal version", "Tell everyone how to do it"], a: 0, hint: "Respecting intellectual property is an ethical digital choice." },
            { q: "Sportsmanship: You see a teammate cheating during a sports match.", options: ["Tell them to play fair", "Help them hide it", "Ignore it if you're winning"], a: 0, hint: "Integrity in small games prepares you for integrity in large ones." }
        ] : [
            { q: "Corporate Integrity: You discover your company is dumping waste illegally.", options: ["Report to environmental agency", "Keep quiet for your bonus", "Quit without saying anything"], a: 0, hint: "Professional ethics protect the health of the entire nation." },
            { q: "Anti-Corruption: A contractor offers you a kickback to win a bid.", options: ["Report the bribe attempt", "Take it once 'for charity'", "Ignore it and award them anyway"], a: 0, hint: "Corruption is the biggest obstacle to our national progress." },
            { q: "Public Office: You have the power to hire a relative who is unqualified.", options: ["Hiring based on merit only", "Give them the job", "Create a fake position"], a: 0, hint: "Meritocracy ensures the best people serve the people." },
            { q: "Business Ethics: A competitor's secret documents are left on your desk.", options: ["Return them unopened", "Read them to get ahead", "Share them with the press"], a: 0, hint: "Ethical competition drives long-term success more than cheating." },
            { q: "Whistleblowing: You uncover systematic fraud in your department.", options: ["Report through secure channels", "Anonymously blackmail the boss", "Keep a record but say nothing"], a: 0, hint: "Whistleblower protections exist to help you stand for truth safely." },
            { q: "Professionalism: You are asked to ignore a safety flaw in a public bridge.", options: ["Report it immediately", "Sign off to save time", "Let someone else handle it"], a: 0, hint: "Professional accountability can save lives." },
            { q: "Leadership Ethics: Your team made a mistake that will look bad on you.", options: ["Take responsibility as leader", "Blame the newest member", "Try to hide the mistake"], a: 0, hint: "Accountability is the foundation of trust in leadership." }
        ];

        return (
            <div className="card" style={{ borderTop: '4px solid #00BCD4' }}>
                <h3>{isKid ? 'The Integrity Shield' : (isTeen ? 'Ethics & Peer Power' : 'The Pillar of Integrity')} 💎</h3>
                {ethicsStage < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>"{scenarios[ethicsStage].q}"</p>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {scenarios[ethicsStage].options.map((opt, i) => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(8)}
                                    onClick={() => {
                                        if (i === 0) {
                                            showToast("Integrity Upheld! 💎", 'success');
                                            setActiveFact({ term: "Ethics Fact 💎", fact: scenarios[ethicsStage].hint });
                                            if (ethicsStage === scenarios.length - 1) handlePillarComplete(8);
                                            setEthicsStage(prev => prev + 1);
                                        } else {
                                            showToast("Think about the long-term character!", 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(8)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(8) && i === 0) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ color: '#00BCD4' }}>Man of Integrity! 🛡️</h4>
                        <p>{isKid ? 'You protected your heart.' : 'Your character is a beacon for the nation.'}</p>
                        <button onClick={() => setEthicsStage(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Re-study Ethics 🔄</button>
                    </div>
                )}
            </div>
        );
    };


    // --- PILLAR 9: LEADERSHIP (Advanced) ---
    const renderLeadership = () => {
        const scenarios = isKid ? [
            { q: "Level 1: Kindness - A citizen is hungry. Your response?", options: ["Share food & resources", "Tell them to work harder", "Ignore them"], a: 0, fact: "Kindness is the first step of a great leader." },
            { q: "Level 2: Teamwork - Your community needs to build a well. Action?", options: ["Call everyone to help", "Do it all alone", "Wait for someone else"], a: 0, fact: "True leaders bring people together." },
            { q: "Level 3: Honesty - You found a bag of money. What now?", options: ["Report to Authorities", "Keep it for toys", "Give to friends"], a: 0, fact: "Honesty build trust." }
        ] : isTeen ? [
            { q: "Level 1: Vision - Your school needs a green club. How do you start?", options: ["Present a 1-year plan", "Demand it from Principal", "Hope someone else does it"], a: 0, fact: "Vision is seeing the future clearly." },
            { q: "Level 2: Crisis - A flash flood hits the neighborhood. Your role?", options: ["Organize emergency help", "Panic and run", "Wait for news"], a: 0, fact: "Leadership is calm during the storm." },
            { q: "Level 3: Ethics - A friend asks you to leak exam questions. Response?", options: ["Refuse and explain why", "Do it to 'help' them", "Keep quiet but do it"], a: 0, fact: "Ethics is the compass of power." },
            { q: "Level 4: Collaboration - Your team is arguing over the project topic.", options: ["Identify common goals", "Pick your own topic only", "Quit the team"], a: 0, fact: "Great leaders build bridges, not walls." },
            { q: "Level 5: Influence - You need to convince your class to save water.", options: ["Impact stories & Data", "Shouting orders", "Setting a bad example"], a: 0, fact: "Influence is earned through credibility, not force." }
        ] : [
            { q: "Level 1: Strategy - The national power grid is failing. First step?", options: ["Diversify energy sources", "Blame the previous team", "Ignore the data"], a: 0, fact: "Strategic thinking solves root causes." },
            { q: "Level 2: Diplomacy - Two neighboring states are in a border dispute.", options: ["Negotiate a trade deal", "Send the military", "Ignore the conflict"], a: 0, fact: "Multilateral diplomacy is the engine of regional prosperity." },
            { q: "Level 3: Legacy - How do you want to be remembered after 4 years?", options: ["By the institutions built", "By the wealth acquired", "By the enemies defeated"], a: 0, fact: "Legacy is what lives after the leader leaves." },
            { q: "Level 4: Institutional Reform - Civil service is slow and corrupt.", options: ["Digitize & Merit-based hiring", "Hire more relatives", "Blame the citizens"], a: 0, fact: "Technology and meritocracy are the cures for bureaucratic stagnation." },
            { q: "Level 5: Internal Conflict - Your cabinet is divided on a major policy.", options: ["Consensus & Alignment", "Fire everyone who disagrees", "Flip a coin"], a: 0, fact: "Diverse opinions should strengthen, not stall, leadership." },
            { q: "Level 6: Communication - A national crisis is causing public panic.", options: ["Honest & Frequent updates", "Hide until it blows over", "Blame the media"], a: 0, fact: "Trust is built through transparency during crises." },
            { q: "Level 7: Global Partnership - How to attract foreign direct investment?", options: ["Rule of Law & Infrastructure", "Begging for grants", "Promising the world"], a: 0, fact: "Stability and justice are the best magnets for growth." }
        ];

        return (
            <div className="card" style={{ borderTop: '4px solid #795548' }}>
                <h3>{isKid ? 'Kind Leader Academy' : (isTeen ? 'Visionary Leadership' : 'The Statesman\'s Path')} 🧠</h3>
                {leadStep < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>"{scenarios[leadStep].q}"</p>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {scenarios[leadStep].options.map((opt, i) => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(9)}
                                    onClick={() => {
                                        if (i === 0) {
                                            showToast("Visionary Leadership! 🚀", 'success');
                                            setActiveFact({ term: "Leadership Fact 🧠", fact: scenarios[leadStep].fact });
                                            if (leadStep === scenarios.length - 1) handlePillarComplete(9);
                                            setLeadStep(prev => prev + 1);
                                        } else {
                                            showToast("Think about the common good!", 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(9)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(9) && i === 0) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ color: '#795548' }}>{isKid ? 'Hero Leader!' : 'Statesman Recognized!'} 👑</h4>
                        <p>{isKid ? 'You led with your heart.' : 'You have the strategic mind to lead a nation.'}</p>
                        <button onClick={() => setLeadStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Re-study Leadership 🔄</button>
                    </div>
                )}
            </div>
        );
    };

    // --- PILLAR 10: LOCAL GOVERNANCE (Advanced) ---
    const renderLocal = () => {
        const scenarios = isKid ? [
            { q: "Who is the leader closest to your home?", options: ["The Councillor", "The President", "The King"], a: 0, fact: "Councillors manage your immediate Ward." },
            { q: "Where do you go to report 1 broken street light?", options: ["LGA Office", "The Hospital", "The School"], a: 0, fact: "The Local Government Area (LGA) handles local maintenance." },
            { q: "What is a 'Townhall' meeting?", options: ["Where neighbours discuss issues", "A party", "A type of school"], a: 0, fact: "Townhalls are the heartbeat of local democracy." }
        ] : isTeen ? [
            { q: "How can a student influence local government?", options: ["Organizing a Youth Townhall", "Voting (but I'm under 18)", "Doing nothing"], a: 0, fact: "Youth organizations have a powerful voice at the local level." },
            { q: "Why is the Ward Councillor's phone number important?", options: ["To report community issues", "To ask for money", "For prank calls"], a: 0, fact: "Direct communication is vital for local accountability." },
            { q: "What is a community 'Bylaw'?", options: ["A local rule made by the LGA", "A national law", "A secret code"], a: 0, fact: "LGAs have the power to make specific rules for their area." },
            { q: "You notice waste is piling up at the local market. Action?", options: ["Report to LGA Waste Dept", "Wait for it to disappear", "Burn it yourself"], a: 0, fact: "Reporting to the correct department ensures systematic cleanup." },
            { q: "What is the purpose of a 'Youth Council' in an LGA?", options: ["To advise on youth-specific needs", "To plan parties", "To replace the Chairman"], a: 0, fact: "Youth councils provide a formal link between young people and local leaders." }
        ] : [
            { q: "Public Hearing: A new market development is proposed. Action?", options: ["Review plans and submit feedback", "Wait for it to be built", "Complain after it's done"], a: 0, fact: "Public hearings are legal requirements for community input." },
            { q: "Budget Defense: Your LGA chairman presents a project list.", options: ["Verify project survival & cost", "Clap for chairman", "Ignore it"], a: 0, fact: "Citizen oversight ensures local funds are used properly." },
            { q: "Local Taxation: Why pay land rates to the LGA?", options: ["To fund local waste & roads", "To make chairman rich", "Because it's a gift"], a: 0, fact: "Local taxes fund the services in your immediate area." },
            { q: "You want to build a small shop extension. Who gives the permit?", options: ["LGA Planning Authority", "The Police", "Your neighbors"], a: 0, fact: "Local government regulates land use and building safety." },
            { q: "Community Policing: How do citizens help local security?", options: ["Oversight & Information sharing", "Taking the law into own hands", "Paying bribes to officers"], a: 0, fact: "Citizen cooperation and oversight improve local security outcomes." },
            { q: "Infrastructure: A local road has a massive pothole. Procedure?", options: ["File a maintenance request", "Plant a tree in it", "Wait for national govt"], a: 0, fact: "Identifying correctly which level of government owns a road helps fix it faster." },
            { q: "Transparency: How can you see what your LGA spent last year?", options: ["Check the Annual Report/Portal", "Guess based on the roads", "Asking the Chairman's friend"], a: 0, fact: "LGAs are required to publish financial statements for public audit." }
        ];

        return (
            <div className="card" style={{ borderTop: '4px solid #3F51B5' }}>
                <h3>{isKid ? 'LGA Hero Quest' : (isTeen ? 'Local Impact Lab' : 'Municipal Oversight')} 🏘️</h3>
                {localStep < scenarios.length ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Step {localStep + 1}</p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>"{scenarios[localStep].q}"</p>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {scenarios[localStep].options.map((opt, i) => (
                                <button
                                    key={opt}
                                    disabled={pillarTimer > 0 && !completedPillars.includes(10)}
                                    onClick={() => {
                                        if (i === scenarios[localStep].a) {
                                            showToast("Local Insight Gained! 🏘️", 'success');
                                            setActiveFact({ term: "Local Gov Fact 🏗️", fact: scenarios[localStep].fact });
                                            if (localStep === scenarios.length - 1) handlePillarComplete(10);
                                            setLocalStep(prev => prev + 1);
                                        } else {
                                            showToast("Think about local accountability!", 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{ height: 'auto', whiteSpace: 'normal', padding: '1rem', opacity: (pillarTimer > 0 && !completedPillars.includes(10)) ? 0.5 : 1 }}
                                >
                                    {opt} {(pillarTimer > 0 && !completedPillars.includes(10) && i === 0) && ` (${pillarTimer}s)`}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ color: '#3F51B5' }}>Local Governance Master! 🎖️</h4>
                        <p>You are an active partner in local progress.</p>
                        <button onClick={() => setLocalStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Re-engage 🔄</button>
                    </div>
                )}
            </div>
        );
    };

    // --- PILLAR 11: STATECRAFT SIMULATOR (Advanced) ---
    const renderSimulator = () => {
        const roles = [
            { t: 'President', color: '#FFD700', d: isKid ? 'Lead the whole country' : 'Federal Policy & Resources' },
            { t: 'Governor/Senator', color: '#00C851', d: isKid ? 'Lead your state' : 'Legislative & State Oversight' },
            { t: 'Strategic Minister', color: '#2196F3', d: isKid ? 'Help the President' : 'Institutional Innovation' }
        ];

        const priorities = isKid ? [
            { t: 'Education', icon: '📚', d: 'Schools & Teachers' },
            { t: 'Economy', icon: '📈', d: 'Helping people earn money' },
            { t: 'Security', icon: '🛡️', d: 'Keeping everyone safe' }
        ] : [
            { t: 'Human Capital', icon: '🧠', d: 'Education, Health & R&D' },
            { t: 'Infrastructural Surplus', icon: '🏗️', d: 'Energy, Rails & Digital' },
            { t: 'Systemic Transparency', icon: '⚖️', d: 'Anti-Corruption & Rule of Law' }
        ];

        const scenarios = isAdult ? [
            { q: "Fiscal Policy Crisis: Inflation is rising. Your move?", options: ["Restrict spending & hike interest", "Print more money", "Fix prices manually"], a: 0, fact: "Macroeconomic stability requires painful but necessary fiscal discipline." },
            { q: "Diplomatic Strain: A neighbor is violating trade treaties.", options: ["Negotiate via Regional Bloc", "Declare immediate war", "Do nothing"], a: 0, fact: "Multilateral diplomacy is the engine of regional prosperity." },
            { q: "Institutional Reform: Civil service is slow and corrupt.", options: ["Digitize & Merit-based hiring", "Hire more relatives", "Blame the citizens"], a: 0, fact: "Technology and meritocracy are the cures for bureaucratic stagnation." },
            { q: "Reform Pivot: The nation's debt is too high. Action?", options: ["Restructure & Cut waste", "Print money to pay it", "Stop paying entirely"], a: 0, fact: "Responsible debt management preserves national credit and future." },
            { q: "Energy Transition: Global oil prices are dropping forever.", options: ["Invest in Renewables & Gas", "Hope prices rise again", "Drill more oil quickly"], a: 0, fact: "Economic resilience comes from diversifying energy and income." },
            { q: "Integration: AU wants a common currency. Response?", options: ["Analyze convergence & Align", "Refuse to talk", "Join immediately without prep"], a: 0, fact: "Regional integration requires strong domestic economic foundations." },
            { q: "Global Crisis: A pandemic is affecting world trade.", options: ["Strategic Reserve & Local Prod", "Wait for vaccine grants only", "Close all borders permanently"], a: 0, fact: "A leader must build domestic capacity while maintaining global links." }
        ] : (isTeen ? [
            { q: "Budget Choice: You have extra revenue. Where does it go?", options: ["Youth Entrepreneurship Fund", "Buying new SUVs for staff", "Building another statue"], a: 0, fact: "Investing in youth is the highest ROI for any nation." },
            { q: "Media Crisis: Fake news is causing a panic.", options: ["Fact-check & Public address", "Ban social media", "Ignore it"], a: 0, fact: "A leader must communicate truth in the face of chaos." },
            { q: "Pollution Incident: A factory is polluting the river.", options: ["Heavy fines & Remediation", "Take a bribe to hide it", "Close the factory forever"], a: 0, fact: "Balance economic growth with environmental sustainability." },
            { q: "Education Reform: Students are graduating without jobs.", options: ["Skill-based curriculum update", "Build more classrooms only", "Make exams harder"], a: 0, fact: "Quality of education is as important as access." },
            { q: "Employment: High youth unemployment. Strategy?", options: ["Support startups & Voc training", "Give everyone a small cash gift", "Tell them to wait for govt jobs"], a: 0, fact: "Job creation happens when the environment for business is friendly." }
        ] : [
            { q: "Crisis: The playground is broken.", options: ["Organize a repair day", "Cry", "Blame the principal"], a: 0, fact: "Leaders take action to solve problems." },
            { q: "Teamwork: Everyone is arguing over the ball.", options: ["Set up a fair rotation", "Take the ball away", "Join the fight"], a: 0, fact: "Peace is better for everyone." },
            { q: "Honesty: You find a phone on the chair.", options: ["Give to Lost & Found", "Keep it", "Tell a friend"], a: 0, fact: "Doing the right thing build trust." }
        ]);

        return (
            <div className="card" style={{ borderTop: '4px solid #FFD700', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
                <h3 style={{ color: '#FFD700', wordBreak: 'break-word' }}>{isKid ? 'Hero Simulator' : 'Statecraft Excellence'} 🏆</h3>
                {simStep === 0 ? (
                    <div style={{ animation: 'fadeIn 0.5s', width: '100%' }}>
                        <p style={{ wordBreak: 'break-word' }}>Select your leadership role:</p>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
                            {roles.map(r => (
                                <button
                                    key={r.t}
                                    onClick={() => { setSimRole(r.t); setSimStep(1); }}
                                    className="btn btn-outline"
                                    style={{
                                        borderColor: r.color,
                                        height: 'auto',
                                        whiteSpace: 'normal',
                                        flexDirection: 'column',
                                        padding: '1.2rem',
                                        textAlign: 'center',
                                        width: '100%',
                                        display: 'flex',
                                        wordBreak: 'break-word',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <strong style={{ color: r.color, display: 'block', marginBottom: '0.5rem', width: '100%' }}>{r.t}</strong>
                                    <p style={{ fontSize: '0.85rem', color: '#aaa', margin: 0, lineHeight: '1.4', width: '100%' }}>{r.d}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : simStep === 1 ? (
                    <div style={{ animation: 'fadeIn 0.5s', width: '100%' }}>
                        <p style={{ wordBreak: 'break-word' }}>Define your core strategic pillar:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
                            {priorities.map(p => (
                                <button
                                    key={p.t}
                                    onClick={() => { setSimPriority(p.t); setSimStep(2); }}
                                    className="btn btn-outline"
                                    style={{
                                        height: 'auto',
                                        whiteSpace: 'normal',
                                        flexDirection: 'column',
                                        padding: '1.2rem',
                                        width: '100%',
                                        display: 'flex',
                                        wordBreak: 'break-word',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{p.icon}</span>
                                    <strong style={{ display: 'block', marginBottom: '0.3rem', width: '100%' }}>{p.t}</strong>
                                    <p style={{ fontSize: '0.75rem', color: '#aaa', margin: 0, width: '100%' }}>{p.d}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : simStep < scenarios.length + 2 ? (
                    <div style={{ animation: 'fadeIn 0.5s', width: '100%' }}>
                        <p style={{ wordBreak: 'break-word' }}><strong>🚨 Challenge {simStep - 1}:</strong> {scenarios[simStep - 2].q}</p>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
                            {scenarios[simStep - 2].options.map((opt, i) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        if (i === 0) {
                                            showToast("Statecraft Mastery!", 'success');
                                            if (simStep === scenarios.length + 1) handlePillarComplete(11);
                                            setSimStep(prev => prev + 1);
                                        } else {
                                            showToast(scenarios[simStep - 2].fact, 'warning');
                                        }
                                    }}
                                    className="btn btn-outline"
                                    style={{
                                        height: 'auto',
                                        whiteSpace: 'normal',
                                        padding: '1rem 1.5rem',
                                        width: '100%',
                                        display: 'block',
                                        wordBreak: 'break-word',
                                        textAlign: 'center',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 1s' }}>
                        <div style={{ fontSize: '4rem' }}>👑</div>
                        <h4>Legacy Confirmed!</h4>
                        <p>Your leadership has strengthened the foundations of the nation.</p>
                        <button onClick={() => setSimStep(0)} className="btn btn-sm" style={{ marginTop: '1rem' }}>Lead Again 🔄</button>
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

                <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto', textAlign: 'center', animation: 'fadeIn 0.8s' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ccc', fontStyle: 'italic' }}>
                        "Welcome to the Civics & Leadership Module. Here, we build the foundation of a great nation by understanding our duties, protecting our rights, and mastering the tools of governance. Whether you are a student, a professional, or a community leader, this journey will equip you to make a meaningful impact in <strong>{countryName}</strong>."
                    </p>
                </div>

                <div style={{
                    marginTop: '1rem', padding: '0.5rem 1.5rem', backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    borderRadius: '30px', display: 'inline-block', border: '1px solid #9C27B0'
                }}>
                    Progress: <strong>{completedPillars.length} / 11</strong> | Earnings: <strong>{currency}{(completedPillars.filter(id => id <= 10).length) * 200}</strong>
                </div>
            </header>

            {/* VIEW TOGGLE FOR TEENS/ADULTS ONLY */}
            {!isKid && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => setViewMode('games')}
                        className="btn"
                        style={{
                            backgroundColor: viewMode === 'games' ? '#9C27B0' : '#222',
                            color: viewMode === 'games' ? 'white' : '#aaa',
                            border: `2px solid ${viewMode === 'games' ? '#9C27B0' : '#444'}`,
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        🎮 Interactive Games
                    </button>
                    <button
                        onClick={() => setViewMode('guide')}
                        className="btn"
                        style={{
                            backgroundColor: viewMode === 'guide' ? '#9C27B0' : '#222',
                            color: viewMode === 'guide' ? 'white' : '#aaa',
                            border: `2px solid ${viewMode === 'guide' ? '#9C27B0' : '#444'}`,
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        📚 Civic Guide
                    </button>
                </div>
            )}

            {/* RENDER CIVIC GUIDE OR INTERACTIVE GAMES */}
            {viewMode === 'guide' && !isKid ? (
                <CivicGuide ageGroup={ageGroup} />
            ) : (
                <div className="civics-layout-wrapper">
                    {/* PILLAR NAVIGATION */}
                    <div className="pillar-nav-grid">
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
                    <div className="pillar-content-area">
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
                </div >
            )}


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
                                animation: 'popIn 0.3s', position: 'relative'
                            }}
                        >
                            <button onClick={() => setActiveFact(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                            <h2 style={{ color: '#FFD700', marginTop: 0 }}>{activeFact.term}</h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#fff' }}>{activeFact.fact}</p>

                            <button
                                onClick={() => setActiveFact(null)}
                                className="btn"
                                style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#FFD700', color: 'black' }}
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

                .civics-layout-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    align-items: center;
                }
                .pillar-nav-grid {
                    width: 100%;
                    max-width: 1000px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                    gap: 0.75rem;
                    order: 1;
                }
                .pillar-content-area {
                    width: 100%;
                    max-width: 800px;
                    min-height: 400px;
                    position: relative;
                    order: 2;
                }

                @media (max-width: 768px) {
                    .pillar-nav-grid {
                         grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 480px) {
                    .pillar-nav-grid {
                         grid-template-columns: 1fr;
                    }
                }
            `}</style>

        </div >
    );
};

export default Civics;


