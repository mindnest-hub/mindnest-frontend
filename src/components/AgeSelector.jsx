import React from 'react';

const AgeSelector = ({ onSelect }) => {
    const ageGroups = [
        { id: 'kids', label: 'Kids (5-12)', icon: '🎈', color: '#FFD700' },
        { id: 'teens', label: 'Teens (13-19)', icon: '🚀', color: '#00BFFF' },
        { id: 'adults', label: 'Adults (20+)', icon: '🌍', color: '#006B3C' },
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Welcome to MindNest</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                    Select your age group to begin your journey.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    {ageGroups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => onSelect(group.id)}
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: `2px solid ${group.color}`,
                                borderRadius: 'var(--border-radius)',
                                padding: '2rem',
                                color: 'var(--color-text)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = `0 0 30px ${group.color}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{group.icon}</div>
                            <h3 style={{ color: group.color, marginBottom: '0.5rem' }}>{group.label}</h3>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgeSelector;
