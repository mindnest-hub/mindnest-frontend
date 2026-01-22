import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-dismiss after 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const getBgColor = () => {
        switch (type) {
            case 'success': return '#00C851';
            case 'error': return '#ff4444';
            case 'warning': return '#FF8800';
            default: return '#33b5e5';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: getBgColor(),
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: 99999,
            animation: 'slideUp 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'center',
            minWidth: '300px',
            justifyContent: 'center'
        }}>
            <span style={{ fontSize: '1.2rem' }}>
                {type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span style={{ fontWeight: 'bold' }}>{message}</span>
            <style>{`
                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Toast;
