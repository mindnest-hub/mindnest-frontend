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
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 3000,
            backdropFilter: 'blur(15px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            padding: '2rem 1rem'
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '800px',
                width: '100%',
                margin: '0 auto',
                minHeight: 'fit-content'
            }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '1rem', color: 'var(--color-primary)' }}>Welcome to MindNest</h2>
                <p style={{
                    fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
                    color: 'var(--color-text-muted)',
                    marginBottom: '2rem',
                    lineHeight: '1.6',
                    maxWidth: '90%',
                    margin: '0 auto 2.5rem auto'
                }}>
                    MindNest rewards young people for learning real-world skills and verified knowledge and connects them to opportunities.
                </p>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                    Select your age group to begin your journey.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {ageGroups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => onSelect(group.id)}
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: `2px solid ${group.color}`,
                                borderRadius: 'var(--border-radius)',
                                padding: '2rem 1rem',
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
                            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{group.icon}</div>
                            <h3 style={{ color: group.color, marginBottom: '0.5rem', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>{group.label}</h3>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgeSelector;
