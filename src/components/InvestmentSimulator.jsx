import React, { useState, useEffect } from 'react';

const InvestmentSimulator = () => {
    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [years, setYears] = useState(10);
    const [interestRate, setInterestRate] = useState(12);
    const [totalValue, setTotalValue] = useState(0);
    const [totalContributed, setTotalContributed] = useState(0);
    const [assetClass, setAssetClass] = useState('mutual_fund');
    const [isFreemium, setIsFreemium] = useState(false);

    const assetRates = {
        bank: { rate: 4, label: 'Savings Account (Low Risk)' },
        mutual_fund: { rate: 12, label: 'Mutual Funds (Medium Risk)' },
        real_estate: { rate: 30, label: 'Real Estate (High Growth)' }
    };

    useEffect(() => {
        setInterestRate(assetRates[assetClass].rate);
    }, [assetClass]);

    useEffect(() => {
        if (isFreemium) {
            setMonthlyContribution(1000); // ~$1 approx
        }
    }, [isFreemium]);

    useEffect(() => {
        calculateGrowth();
    }, [monthlyContribution, years, interestRate]);

    const calculateGrowth = () => {
        let total = 0;
        let contributed = 0;
        const monthlyRate = interestRate / 100 / 12;
        const months = years * 12;

        for (let i = 0; i < months; i++) {
            total = (total + monthlyContribution) * (1 + monthlyRate);
            contributed += monthlyContribution;
        }

        setTotalValue(total);
        setTotalContributed(contributed);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div style={{ backgroundColor: '#2a2a2a', padding: '1.5rem', borderRadius: '10px', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--color-primary)', margin: 0 }}>📈 Wealth Builder</h3>
                <button
                    onClick={() => setIsFreemium(!isFreemium)}
                    style={{
                        fontSize: '0.8rem', padding: '0.3rem 0.6rem', borderRadius: '15px',
                        border: '1px solid var(--color-accent)', background: isFreemium ? 'var(--color-accent)' : 'transparent',
                        color: isFreemium ? '#000' : 'var(--color-accent)', cursor: 'pointer'
                    }}
                >
                    {isFreemium ? 'Micro-Invest Mode ($1)' : 'Standard Mode'}
                </button>
            </div>

            <p style={{ color: '#ddd', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                See how different investments grow your money over time.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.8rem' }}>Choose Asset Class</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    {Object.entries(assetRates).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setAssetClass(key)}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '5px',
                                border: assetClass === key ? '1px solid var(--color-primary)' : '1px solid #444',
                                backgroundColor: assetClass === key ? 'rgba(156, 39, 176, 0.2)' : '#333',
                                color: assetClass === key ? 'var(--color-primary)' : '#aaa',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                        >
                            {data.label.split(' (')[0]}
                            <br />
                            <span style={{ fontSize: '0.7rem' }}>{data.rate}% APY</span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.8rem' }}>Monthly Save (₦)</label>
                    <input
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        disabled={isFreemium}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #444', backgroundColor: isFreemium ? '#222' : '#333', color: '#fff', opacity: isFreemium ? 0.7 : 1 }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.8rem' }}>Years to Grow</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
                    />
                </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#333', borderRadius: '10px', border: '1px solid #444' }}>
                <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>In {years} years, you will have:</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                    {formatCurrency(totalValue)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    You only saved: <span style={{ color: '#fff' }}>{formatCurrency(totalContributed)}</span>
                    <br />
                    Growth: <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(totalValue - totalContributed)}</span>
                </div>
            </div>

            {assetClass === 'real_estate' && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(0, 200, 81, 0.1)', borderRadius: '5px', borderLeft: '4px solid #00C851' }}>
                    <p style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>
                        <strong>💡 Pro Tip:</strong> Land banking in developing areas often yields the highest returns (30%+).
                        <br />
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>For verified land deals, consult <strong>MindNest Realty</strong>.</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default InvestmentSimulator;
