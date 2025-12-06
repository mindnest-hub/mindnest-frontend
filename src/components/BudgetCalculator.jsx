import React, { useState, useEffect } from 'react';

const BudgetCalculator = () => {
    const [income, setIncome] = useState(50000);
    const [needs, setNeeds] = useState(50);
    const [wants, setWants] = useState(30);
    const [savings, setSavings] = useState(20);

    // Recalculate percentages when sliders move
    const handleSliderChange = (type, value) => {
        let newNeeds = needs;
        let newWants = wants;
        let newSavings = savings;

        if (type === 'needs') {
            newNeeds = value;
            const remaining = 100 - newNeeds;
            newWants = Math.round(remaining * (wants / (wants + savings)));
            newSavings = 100 - newNeeds - newWants;
        } else if (type === 'wants') {
            newWants = value;
            const remaining = 100 - newWants;
            newNeeds = Math.round(remaining * (needs / (needs + savings)));
            newSavings = 100 - newWants - newNeeds;
        } else {
            newSavings = value;
            const remaining = 100 - newSavings;
            newNeeds = Math.round(remaining * (needs / (needs + wants)));
            newWants = 100 - newSavings - newNeeds;
        }

        setNeeds(newNeeds);
        setWants(newWants);
        setSavings(newSavings);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    return (
        <div style={{ backgroundColor: '#2a2a2a', padding: '1.5rem', borderRadius: '10px', marginTop: '1rem' }}>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>📊 50/30/20 Budget Rule</h3>
            <p style={{ color: '#ddd', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                The golden rule of wealth: 50% Needs, 30% Wants, 20% Savings. Adjust the sliders to see how your money splits.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Monthly Income (₦)</label>
                <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '5px',
                        border: '1px solid #444',
                        backgroundColor: '#333',
                        color: '#fff',
                        fontSize: '1.1rem'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Needs Slider */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#ff6b6b' }}>🏠 Needs ({needs}%)</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(income * (needs / 100))}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={needs}
                        onChange={(e) => handleSliderChange('needs', Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#ff6b6b' }}
                    />
                </div>

                {/* Wants Slider */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#4ecdc4' }}>🎮 Wants ({wants}%)</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(income * (wants / 100))}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={wants}
                        onChange={(e) => handleSliderChange('wants', Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#4ecdc4' }}
                    />
                </div>

                {/* Savings Slider */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#ffe66d' }}>💰 Savings ({savings}%)</span>
                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(income * (savings / 100))}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={savings}
                        onChange={(e) => handleSliderChange('savings', Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#ffe66d' }}
                    />
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#333', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>💡 Pro Tip:</h4>
                <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    {savings < 20
                        ? "Your savings are below 20%. Try cutting down on 'Wants' like data bundles or eating out to save more for your future empire!"
                        : "Great job! Saving 20% or more is the fastest way to financial freedom. Put this money in an investment account, not under your mattress!"}
                </p>
            </div>
        </div>
    );
};

export default BudgetCalculator;
