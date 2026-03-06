import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        localStorage.removeItem('ageGroup');
        window.location.reload();
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2rem'
        }}>
            <div
                onClick={handleLogoClick}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
                <div style={{
                    width: '35px',
                    height: '35px',
                    background: 'var(--color-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                }}>🛡️</div>
                <span style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-heading)',
                    color: '#fff'
                }}>MindNest</span>
            </div>
        </nav>
    );
};

export default Header;
