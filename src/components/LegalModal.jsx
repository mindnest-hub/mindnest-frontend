import React, { useState } from 'react';

const LegalModal = ({ onClose, defaultTab = 'terms' }) => {
    const [tab, setTab] = useState(defaultTab);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 6000,
            backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', padding: '1rem'
        }}>
            <div style={{
                backgroundColor: '#111', width: '100%', maxWidth: '600px',
                borderRadius: '20px', overflow: 'hidden', border: '1px solid #333',
                display: 'flex', flexDirection: 'column', maxHeight: '85vh'
            }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                    <button
                        onClick={() => setTab('terms')}
                        style={{
                            flex: 1, padding: '1.25rem', background: 'none', border: 'none',
                            color: tab === 'terms' ? 'var(--color-primary)' : '#888',
                            fontWeight: 'bold', borderBottom: tab === 'terms' ? '3px solid var(--color-primary)' : '3px solid transparent',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        Terms of Service
                    </button>
                    <button
                        onClick={() => setTab('privacy')}
                        style={{
                            flex: 1, padding: '1.25rem', background: 'none', border: 'none',
                            color: tab === 'privacy' ? 'var(--color-primary)' : '#888',
                            fontWeight: 'bold', borderBottom: tab === 'privacy' ? '3px solid var(--color-primary)' : '3px solid transparent',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        Privacy Policy
                    </button>
                    <button onClick={onClose} style={{
                        padding: '0 1.5rem', background: 'none', border: 'none',
                        color: '#666', fontSize: '1.5rem', cursor: 'pointer'
                    }}>
                        &times;
                    </button>
                </div>

                <div style={{
                    padding: '2rem', overflowY: 'auto', flex: 1, color: '#ccc',
                    lineHeight: '1.6', fontSize: '0.95rem'
                }}>
                    {tab === 'terms' && (
                        <div>
                            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Terms of Service</h2>
                            <p>Last updated: March 2026</p>
                            <p><strong>1. Acceptance of Terms:</strong> By accessing and using MindNest Africa, you accept and agree to be bound by the terms and provisions of this agreement.</p>
                            <p><strong>2. User Accounts:</strong> You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use.</p>
                            <p><strong>3. Appropriate Conduct:</strong> Users agree not to engage in any activity that interferes with or disrupts the services. Any abusive behavior may result in account termination.</p>
                            <p><strong>4. Intellectual Property:</strong> All content, features, and functionality of MindNest are owned by MindNest Africa and are protected by international copyright laws.</p>
                            <p><strong>5. In-App Currency:</strong> Virtual currency ("MindNest Coins") have no real-world value outside the application unless explicitly stated for specific withdrawal programs.</p>
                        </div>
                    )}

                    {tab === 'privacy' && (
                        <div>
                            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Privacy Policy</h2>
                            <p>Last updated: March 2026</p>
                            <p><strong>1. Information Collection:</strong> We collect information you provide directly to us when you create an account, such as your email address, username, and age group.</p>
                            <p><strong>2. Use of Information:</strong> We use the information we collect to provide, maintain, and improve our services, as well as to process transactions and send related information.</p>
                            <p><strong>3. Data Security:</strong> We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
                            <p><strong>4. Account Deletion:</strong> You have the right to request deletion of your personal data. You can delete your account entirely at any time from your profile settings.</p>
                            <p><strong>5. Third-Party Services:</strong> We may use third-party services (like Supabase for authentication) that have their own privacy policies governing data handling.</p>
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #222', textAlign: 'center' }}>
                    <button onClick={onClose} className="btn" style={{ width: '100%', maxWidth: '300px' }}>
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
