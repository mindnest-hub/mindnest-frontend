import React, { useState, useEffect } from 'react';

const NOTIFICATION_TYPES = [
    "completed the Financial Literacy module! 💰",
    "just earned a 3-day streak! 🔥",
    "reached Level 5 in Critical Thinking! 🧠",
    "learned about the Mali Empire! 🌍",
    "shared their progress on WhatsApp! 📲",
    "just joined MindNest! 👋",
    "earned ₦500 in the Strategy Room! 💎"
];

const NAMES = [
    "Kwame (Ghana)", "Amina (Nigeria)", "Zainab (Kenya)", "Thabo (SA)",
    "Chioma (Nigeria)", "Kofi (Ghana)", "Nia (USA)", "Jabari (UK)",
    "Fatima (Egypt)", "Emmanuel (Tanzania)", "Grace (Uganda)"
];

const LiveNotifications = () => {
    const [notification, setNotification] = useState(null);
    const [visible, setVisible] = useState(false);

    const showNotification = (text) => {
        setNotification(text);
        setVisible(true);
        setTimeout(() => setVisible(false), 4000); // Hide after 4s
    };

    useEffect(() => {
        // 1. Listen for REAL events from the current user
        const handleRealEvent = (e) => {
            showNotification(`You ${e.detail.message}`);
        };
        window.addEventListener('mindnest-event', handleRealEvent);

        // 2. Simulate GLOBAL activity (Fake users)
        const interval = setInterval(() => {
            // Random chance to show a notification (every 10-20 seconds approx)
            if (Math.random() > 0.3) {
                const name = NAMES[Math.floor(Math.random() * NAMES.length)];
                const action = NOTIFICATION_TYPES[Math.floor(Math.random() * NOTIFICATION_TYPES.length)];
                showNotification(`${name} ${action}`);
            }
        }, 15000);

        return () => {
            window.removeEventListener('mindnest-event', handleRealEvent);
            clearInterval(interval);
        };
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            padding: '0.8rem 1.5rem',
            borderRadius: '50px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            animation: 'slideDown 0.5s ease-out',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            maxWidth: '90vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}>
            <span style={{ fontSize: '1.2rem' }}>🔔</span>
            {notification}
            <style>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

// Helper to trigger real events
export const triggerLiveEvent = (message) => {
    window.dispatchEvent(new CustomEvent('mindnest-event', { detail: { message } }));
};

export default LiveNotifications;
