import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import toast from '../components/Toast';
import { useGamification } from '../context/GamificationContext';
import Header from '../components/Header';
import { civicEducationContent } from '../data/civicEducationContent';
import BudgetSimulator from '../components/BudgetSimulator';
import PoliticalTrickSimulator from '../components/PoliticalTrickSimulator';
import ClassCaptainSimulator from '../components/ClassCaptainSimulator';

const Civics = ({ ageGroup }) => {
    const navigate = useNavigate();
    const { addEarnings } = useWallet();
    const { addPoints } = useGamification();

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';

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

    useEffect(() => {
        if (userName) localStorage.setItem('civicsUserName', userName);
        if (selectedCountry) localStorage.setItem('civicsCountry', selectedCountry);
    }, [userName, selectedCountry]);

    // --- CONTENT SELECTION ---
    let modules = [];
    if (isKid) modules = civicEducationContent.kidsCivics;
    else if (isTeen) modules = civicEducationContent.teenCivics;
    else modules = civicEducationContent.adultCivics;

    const [activeModule, setActiveModule] = useState(modules[0].id);
    const [toastMsg, setToastMsg] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [completedModules, setCompletedModules] = useState(() => {
        const saved = localStorage.getItem('civicsExpansionProgress');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('civicsExpansionProgress', JSON.stringify(completedModules));
    }, [completedModules]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const showToast = (message, type = 'info') => {
        setToastMsg({ message, type });
    };

    const handleModuleComplete = (id) => {
        if (!completedModules.includes(id)) {
            setCompletedModules([...completedModules, id]);
            addEarnings('civics', 250);
            addPoints(75);
            showToast(`Module Mastered! +${currency}250 🏆`, 'success');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    const isAllComplete = completedModules.length === modules.length;

    // View State: 'modules' | 'budget_sim' | 'trick_sim' | 'captain_sim'
    const [activeView, setActiveView] = useState('modules');

    const renderContent = (content) => {
        return content.split('### ').map((section, idx) => {
            if (!section.trim()) return null;
            const [heading, ...bodyParts] = section.split('\n');
            const body = bodyParts.join('\n');
            return (
                <div key={idx} style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <h4 style={{ color: '#FFD700', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{heading}</h4>
                    <pre style={{
                        color: '#eee',
                        fontFamily: 'inherit',
                        whiteSpace: 'pre-wrap',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        margin: 0
                    }}>{body}</pre>
                </div>
            );
        });
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '1rem' }}>
            <Header />
            {toastMsg && <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: toastMsg.type === 'success' ? '#00C851' : '#ff4444', color: '#fff', padding: '1rem 2rem', borderRadius: '30px', zIndex: 10000, fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', animation: 'bounce 0.5s' }}>
                {toastMsg.message}
                <button onClick={() => setToastMsg(null)} style={{ background: 'none', border: 'none', color: 'white', marginLeft: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
            </div>}

            {showConfetti && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '5rem' }}>
                    🎊 🎉 🎊
                </div>
            )}

            <header style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(156, 39, 176, 0.1)', padding: '0.5rem 1.5rem', borderRadius: '20px', color: '#9C27B0', fontWeight: 'bold', marginBottom: '1rem', border: '1px solid rgba(156, 39, 176, 0.3)' }}>
                    Civic Education Hub 🏛️
                </div>
                <h1 style={{ color: '#FFD700', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    The Next Generation of Leadership
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    {isKid ? "Learn how to be a great community helper and fair leader!" : (isTeen ? "Understand power, systems, and how to hold leaders accountable." : "Master public finance, political strategy, and true citizen sovereignty.")}
                </p>
                <div style={{ marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
                    Citizen: <strong style={{ color: '#fff' }}>{userName || "Agent"}</strong> | Republic of <strong style={{ color: '#fff' }}>{countryName}</strong>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setActiveView('modules')}
                        className="btn"
                        style={{ backgroundColor: activeView === 'modules' ? '#9C27B0' : '#333', color: 'white' }}
                    >
                        📚 Learning Modules
                    </button>

                    {isKid ? (
                        <button
                            onClick={() => setActiveView('captain_sim')}
                            className="btn"
                            style={{ backgroundColor: activeView === 'captain_sim' ? '#2196F3' : '#333', color: 'white' }}
                        >
                            🗳️ Class Captain Sim
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setActiveView('budget_sim')}
                                className="btn"
                                style={{ backgroundColor: activeView === 'budget_sim' ? '#00C851' : '#333', color: 'white' }}
                            >
                                💰 Budget Simulator
                            </button>
                            <button
                                onClick={() => setActiveView('trick_sim')}
                                className="btn"
                                style={{ backgroundColor: activeView === 'trick_sim' ? '#FF4444' : '#333', color: 'white' }}
                            >
                                🕵️ Spot The Trick
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            {activeView === 'modules' && (
                <div className="civics-layout-wrapper">
                    <div className="pillar-nav-grid">
                        {modules.map(mod => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveModule(mod.id)}
                                style={{
                                    backgroundColor: activeModule === mod.id ? '#9C27B0' : '#1a1a1a',
                                    color: activeModule === mod.id ? '#fff' : '#aaa',
                                    border: `1px solid ${completedModules.includes(mod.id) ? '#00C851' : (activeModule === mod.id ? '#9C27B0' : '#333')}`,
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: activeModule === mod.id ? '0 0 15px rgba(156, 39, 176, 0.4)' : 'none'
                                }}
                            >
                                <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>{mod.title.split(':')[0]}</span>
                                {completedModules.includes(mod.id) && <span style={{ color: '#00C851' }}>✅</span>}
                            </button>
                        ))}
                    </div>

                    <div className="pillar-content-area card">
                        {modules.map(mod => (
                            <div key={mod.id} style={{ display: activeModule === mod.id ? 'block' : 'none', animation: 'fadeIn 0.5s' }}>
                                <h2 style={{ color: '#9C27B0', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                                    {mod.title}
                                </h2>

                                {renderContent(mod.content)}

                                <div style={{ marginTop: '3rem', textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                                    {!completedModules.includes(mod.id) ? (
                                        <button
                                            onClick={() => handleModuleComplete(mod.id)}
                                            className="btn btn-primary"
                                            style={{ backgroundColor: '#9C27B0', color: '#fff', fontSize: '1.1rem', padding: '1rem 3rem' }}
                                        >
                                            Complete Module & Earn {currency}250 ⚡
                                        </button>
                                    ) : (
                                        <div style={{ color: '#00C851', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            ✅ Module Mastered!
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isAllComplete && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <button onClick={() => setShowCertificate(true)} className="btn btn-outline" style={{ color: '#FFD700', borderColor: '#FFD700' }}>
                                    🎓 View Your Certificate
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SIMULATORS */}
            {activeView === 'budget_sim' && <BudgetSimulator currency={currency} ageGroup={ageGroup} onComplete={() => handleModuleComplete('sim_budget')} />}
            {activeView === 'trick_sim' && <PoliticalTrickSimulator ageGroup={ageGroup} onComplete={() => handleModuleComplete('sim_trick')} />}
            {activeView === 'captain_sim' && <ClassCaptainSimulator onComplete={() => handleModuleComplete('sim_captain')} />}


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
                            <p style={{ color: '#aaa', marginBottom: '2rem' }}>Welcome to the expanded Civics module. Please verify your details.</p>

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
                                Enter Module 🚀
                            </button>
                        </div>
                    </div>
                )
            }

            {/* CERTIFICATE MODAL */}
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
                            <h1 style={{ color: '#9C27B0', fontSize: '2.5rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Certificate of Civic Mastery</h1>
                            <p style={{ fontSize: '1.2rem', color: '#555', margin: '1rem 0' }}>This is to certify that</p>
                            <h2 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#000', borderBottom: '2px solid #eee', display: 'inline-block', padding: '0 2rem' }}>{userName || "Valued Citizen"}</h2>
                            <p style={{ fontSize: '1.1rem', color: '#555', margin: '1.5rem 0' }}>
                                has successfully completed the Advanced Expansion of <br />
                                <strong>Civics & Leadership Certification</strong><br />
                                representing the great nation of <strong>{countryName}</strong>.
                            </p>
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

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
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
                }
                .pillar-content-area {
                    width: 100%;
                    max-width: 800px;
                    min-height: 400px;
                }
            `}</style>
        </div >
    );
};

export default Civics;
