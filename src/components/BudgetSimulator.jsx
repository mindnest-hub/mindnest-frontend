import React, { useState } from 'react';
import { api } from '../services/api';

const BudgetSimulator = ({ currency, ageGroup, onComplete }) => {
    const totalBudget = 100000000000; // 100 Billion
    const [allocations, setAllocations] = useState({
        healthcare: 0,
        education: 0,
        infrastructure: 0,
        security: 0,
        agriculture: 0,
        debtServicing: 0
    });

    const [isSaving, setIsSaving] = useState(false);
    const [step, setStep] = useState(0);

    const categories = [
        { id: 'healthcare', label: '🏥 Healthcare', desc: "Hospitals, doctors' salaries, medicine." },
        { id: 'education', label: '📚 Education', desc: "Schools, teachers, university research." },
        { id: 'infrastructure', label: '🏗️ Infrastructure', desc: "Roads, power grids, public transport." },
        { id: 'security', label: '🛡️ Security', desc: "Police, military, emergency services." },
        { id: 'agriculture', label: '🌾 Agriculture', desc: "Farming subsidies, food security." },
        { id: 'debtServicing', label: '💳 Debt Servicing', desc: "Paying back mandatory national loans." }
    ];

    const currentTotal = Object.values(allocations).reduce((a, b) => a + b, 0);
    const balance = totalBudget - currentTotal;

    const handleSliderChange = (id, value) => {
        const numValue = Number(value);
        const oldVal = allocations[id];
        const difference = numValue - oldVal;

        if (balance - difference >= 0) {
            setAllocations(prev => ({ ...prev, [id]: numValue }));
        } else {
            // max available
            setAllocations(prev => ({ ...prev, [id]: oldVal + balance }));
        }
    };

    const formatMoney = (amount) => {
        return (amount / 1000000000).toFixed(1) + ' Billion';
    };

    const analyzeBudget = () => {
        const insights = [];
        if (allocations.debtServicing < 20000000000) {
            insights.push("⚠️ You underfunded Debt Servicing. The state might default on loans and lose international credit.");
        }
        if (allocations.education < 15000000000) {
            insights.push("⚠️ Low Education budget will lead to a skill shortage in the next 10 years.");
        }
        if (allocations.infrastructure > 40000000000) {
            insights.push("💡 High Infrastructure spending! This will create immediate construction jobs.");
        }
        if (allocations.healthcare < 10000000000) {
            insights.push("⚠️ Critical Healthcare underfunding. Life expectancy will drop during emergencies.");
        }

        if (insights.length === 0) insights.push("✅ A very balanced approach! You navigated the competing priorities well.");
        return insights;
    };

    const submitBudget = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await api.submitResearchData(token, {
                    ageGroup,
                    simulatorType: 'BUDGET',
                    decisionData: {
                        allocations: allocations,
                        totalBudget: totalBudget,
                        unspent: balance
                    }
                });
            }
        } catch (err) {
            console.error("Failed to save research data:", err);
        } finally {
            setIsSaving(false);
            setStep(1);
        }
    };

    return (
        <div className="card" style={{ borderTop: `4px solid #00C851`, maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#00C851', textAlign: 'center', marginBottom: '1rem' }}>💰 State Budget Simulator</h2>

            {step === 0 && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#ccc' }}>
                        You are the Governor. You have <strong>{currency}{formatMoney(totalBudget)}</strong>. Allocate it wisely. <br />
                        <small style={{ color: '#ff4444' }}>Warning: Debt servicing usually requires at least 20 Billion.</small>
                    </p>

                    <div style={{ position: 'sticky', top: 0, backgroundColor: '#1a1a1a', padding: '1rem', zIndex: 10, borderBottom: '1px solid #333', textAlign: 'center', borderRadius: '10px', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, color: balance === 0 ? '#00C851' : '#FFD700' }}>
                            Unallocated Balance: {currency}{formatMoney(balance)}
                        </h3>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {categories.map(c => (
                            <div key={c.id} style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong style={{ fontSize: '1.1rem' }}>{c.label}</strong>
                                    <span style={{ color: '#00C851', fontWeight: 'bold' }}>{currency}{formatMoney(allocations[c.id])}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 1rem 0' }}>{c.desc}</p>
                                <input
                                    type="range"
                                    min="0"
                                    max={totalBudget}
                                    step="1000000000" // 1 Billion steps
                                    value={allocations[c.id]}
                                    onChange={(e) => handleSliderChange(c.id, e.target.value)}
                                    style={{ width: '100%', accentColor: '#00C851' }}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={submitBudget}
                        disabled={balance > 0 || isSaving}
                        className="btn"
                        style={{ width: '100%', marginTop: '2rem', backgroundColor: balance > 0 ? '#333' : '#00C851', color: 'white', opacity: isSaving ? 0.5 : 1 }}
                    >
                        {isSaving ? "Publishing Budget..." : (balance > 0 ? `Allocate remaining ${currency}${formatMoney(balance)}` : "Approve State Budget ⚖️")}
                    </button>
                </div>
            )}

            {step === 1 && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <h3 style={{ color: '#00C851', textAlign: 'center', marginBottom: '2rem' }}>Budget Impact Analysis</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        {analyzeBudget().map((insight, idx) => (
                            <div key={idx} style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', borderLeft: '4px solid #FFD700' }}>
                                {insight}
                            </div>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '2rem' }}>
                        Budgeting is the hardest part of governance. Every extra naira sent to infrastructure is a naira taken from healthcare. True leaders balance these competing needs.
                    </p>

                    <button
                        onClick={onComplete}
                        className="btn"
                        style={{ width: '100%', backgroundColor: '#00C851', color: 'white' }}
                    >
                        Complete Simulation
                    </button>
                </div>
            )}
        </div>
    );
};

export default BudgetSimulator;
