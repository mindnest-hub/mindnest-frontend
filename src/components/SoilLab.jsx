import React, { useState } from 'react';
import Toast from './Toast';
import { soilScenarios, treatments } from '../data/soilScenarios';

const SoilLab = ({ onComplete }) => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [labReport, setLabReport] = useState(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Get current scenario
    const scenario = soilScenarios[currentScenario];

    const runAnalysis = () => {
        setLabReport({
            id: scenario.id,
            ph: scenario.ph,
            nutrients: scenario.nutrients,
            desc: scenario.condition
        });
    };

    const handleTreatmentSelect = (treatmentId) => {
        setSelectedTreatment(treatmentId);
    };

    const applyTreatment = () => {
        if (!selectedTreatment) return;

        if (selectedTreatment === scenario.correctTreatment) {
            showToast(`Correct! ${scenario.explanation} ✅`, 'success');
            setScore(prev => prev + 100);
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
                nextScenario();
            }, 2000);
        } else {
            showToast("Incorrect treatment. Check the Lab Report again! ❌", 'error');
            setScore(prev => Math.max(0, prev - 20));
        }
    };

    const handleFinalSubmit = () => {
        showToast(`Lab Work Complete! Final Score: ${score + 100}. You are now a Soil Expert! 🎓`, 'success');
        if (onComplete) onComplete(score + 100);
    };

    const nextScenario = () => {
        setLabReport(null);
        setSelectedTreatment(null);
        if (currentScenario < soilScenarios.length - 1) {
            setCurrentScenario(prev => prev + 1);
        } else {
            handleFinalSubmit();
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem', position: 'relative' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {showConfetti && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', background: 'radial-gradient(circle, transparent 20%, transparent 20%, transparent 80%, transparent 80%, transparent 100%)', backgroundSize: '10px 10px', animation: 'confetti 1s infinite', zIndex: 10 }}></div>
            )}

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>🧪 Soil Analysis Lab</h3>
                <span className="btn btn-outline" style={{ padding: '0.3rem 1rem', fontSize: '0.9rem', cursor: 'default' }}>Score: {score}</span>
            </header>

            <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {/* Visual Inspection Panel */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <h4 style={{ color: 'var(--color-text-muted)', marginTop: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visual Inspection 👁️</h4>
                    <div style={{ fontSize: '4.5rem', textAlign: 'center', margin: '1.5rem 0' }}>
                        {scenario.condition.includes('Yellow') ? '🍂' : scenario.condition.includes('Purple') ? '🟣' : scenario.condition.includes('Burnt') ? '🔥' : '🌱'}
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '1rem', color: 'var(--color-text)', textAlign: 'center' }}>"{scenario.desc}"</p>
                    <button onClick={runAnalysis} disabled={labReport} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', opacity: labReport ? 0.6 : 1 }}>
                        {labReport ? "Analysis Complete ✅" : "Run Soil Test 🔬"}
                    </button>
                </div>

                {/* Lab Report Panel */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px',
                    border: '1px solid var(--color-border)', opacity: labReport ? 1 : 0.5,
                    transition: 'var(--transition)'
                }}>
                    <h4 style={{ color: 'var(--color-text-muted)', marginTop: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lab Report 📋</h4>
                    {labReport ? (
                        <div style={{ fontFamily: 'inherit' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <strong>pH Level:</strong>
                                <span style={{
                                    padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem',
                                    backgroundColor: labReport.ph < 6 ? 'rgba(255,165,0,0.1)' : labReport.ph > 7.5 ? 'rgba(255,69,0,0.1)' : 'rgba(0,200,81,0.1)',
                                    color: labReport.ph < 6 ? 'orange' : labReport.ph > 7.5 ? 'red' : '#00C851'
                                }}>{labReport.ph} ({labReport.ph < 6 ? 'Acidic' : labReport.ph > 7.5 ? 'Alkaline' : 'Optimal'})</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-muted)' }}>Nitrogen (N):</span> <strong>{labReport.nutrients.N}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-muted)' }}>Phosphorus (P):</span> <strong>{labReport.nutrients.P}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-muted)' }}>Potassium (K):</span> <strong>{labReport.nutrients.K}</strong></div>
                            </div>
                            <div style={{
                                marginTop: '1.25rem', padding: '0.75rem', borderRadius: '8px',
                                backgroundColor: 'rgba(255,69,0,0.05)', border: '1px solid rgba(255,69,0,0.2)'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-danger)', fontWeight: '600' }}>Diagnosis: {labReport.desc}</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                            Run inspection analysis<br />to unlock soil data
                        </div>
                    )}
                </div>
            </div>

            {/* Treatment Station */}
            <div style={{ marginTop: '2.5rem' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Select Remedy Treatment 💊</h4>
                <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    {treatments.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleTreatmentSelect(t.id)}
                            disabled={!labReport}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                border: selectedTreatment === t.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                backgroundColor: selectedTreatment === t.id ? 'var(--color-primary-soft)' : 'rgba(255,255,255,0.02)',
                                color: '#fff',
                                cursor: 'pointer',
                                opacity: labReport ? 1 : 0.5,
                                transition: 'var(--transition)',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{t.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t.type} • ₦{t.cost}</div>
                        </button>
                    ))}
                </div>
                <button
                    onClick={applyTreatment}
                    disabled={!selectedTreatment}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', fontSize: '1.1rem' }}
                >
                    Apply Treatment & Cure Soil 🚜
                </button>
            </div>
        </div>
    );
};

export default SoilLab;
