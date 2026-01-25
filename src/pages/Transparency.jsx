import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Transparency = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
                }}
            >
                ← Back to Hub
            </button>

            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-secondary)' }}>The Glass House 🛡️</h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                    We don't just tell you we're legit. We prove it.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Section 1: Corporate Identity */}
                <div className="card" style={{ borderTop: '4px solid var(--color-primary)' }}>
                    <h2>🏢 Corporate Identity</h2>
                    <p style={{ color: '#aaa', marginBottom: '1rem' }}>Verify our legal existence with the government.</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#333', borderRadius: '10px' }}>
                            <strong>CAC Registration:</strong> <span style={{ color: '#fff' }}>RC 1234567</span>
                            <br />
                            <small style={{ color: '#888' }}>(Check at <a href="https://search.cac.gov.ng" target="_blank" style={{ color: 'var(--color-accent)' }}>search.cac.gov.ng</a>)</small>
                        </li>
                        <li style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#333', borderRadius: '10px' }}>
                            <strong>EFCC SCUML:</strong> <span style={{ color: '#fff' }}>RN: SC 987654</span>
                            <br />
                            <small style={{ color: '#888' }}>Licensed to operate designated non-financial business.</small>
                        </li>
                        <li style={{ padding: '1rem', backgroundColor: '#333', borderRadius: '10px' }}>
                            <strong>Tax ID (TIN):</strong> <span style={{ color: '#fff' }}>234-XXXX-XXXX</span>
                        </li>
                    </ul>
                </div>

                {/* Section 2: The "No-Cash" Policy */}
                <div className="card" style={{ borderTop: '4px solid #ff4444' }}>
                    <h2>🚫 The "No-Cash" Rule</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        To protect you from fraud, <strong>we do not accept cash payments</strong>.
                    </p>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: '10px', border: '1px solid #ff4444' }}>
                        <p style={{ color: '#fff', margin: 0 }}>
                            All payments must be made to our corporate account:
                            <br /><br />
                            <strong>Bank:</strong> Zenith Bank
                            <br />
                            <strong>Name:</strong> MindNest Realty Ltd
                            <br />
                            <strong>Account:</strong> 101XXXXXXX
                        </p>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#aaa' }}>
                        <em>If any agent asks you to pay cash or into a personal account, report them immediately.</em>
                    </p>
                </div>

                {/* Section 3: Downloadable Due Diligence */}
                <div className="card" style={{ borderTop: '4px solid #00C851' }}>
                    <h2>📂 Open Source Verification</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Don't take our word for it. Download a sample "Search Report" and take it to the Land Registry yourself.
                    </p>
                    <button
                        className="btn"
                        style={{ width: '100%', backgroundColor: '#333', border: '1px solid #00C851', color: '#00C851' }}
                        onClick={() => showToast("This would download a sample PDF of a C of O and Survey Plan.", 'info')}
                    >
                        📥 Download Sample Search Report
                    </button>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#aaa' }}>
                        Includes: Redacted C of O, Survey Plan, and Deed of Assignment.
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', backgroundColor: '#222', borderRadius: '15px' }}>
                <h3>🤝 The "Verify-Us" Challenge</h3>
                <p style={{ maxWidth: '600px', margin: '1rem auto', color: '#ccc' }}>
                    We challenge you to investigate us. We believe that the more you look, the more you'll trust us.
                    That's the MindNest Standard.
                </p>
            </div>
        </div>
    );
};

export default Transparency;
