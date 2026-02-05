import React, { useState } from 'react';

const WordOriginPopup = ({ wordData, onClose }) => {
    const [layer, setLayer] = useState(1);

    if (!wordData) return null;

    const handleNext = () => {
        if (layer < 3) setLayer(prev => prev + 1);
        else onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, animation: 'fadeIn 0.3s'
        }}>
            <div className="card" style={{
                width: '90%', maxWidth: '500px',
                background: 'linear-gradient(145deg, #1a1a1a, #222)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Header Decor */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                    background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
                }}></div>

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer'
                    }}
                >
                    ×
                </button>

                <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>

                    {/* LAYER 1: SURFACE */}
                    {layer === 1 && (
                        <div style={{ animation: 'slideUp 0.4s' }}>
                            <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '1rem' }}>
                                Word Origin
                            </div>
                            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{wordData.icon}</div>
                            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.5rem' }}>{wordData.word}</h2>
                            <h3 style={{ fontSize: '1.2rem', color: '#FFD700', marginBottom: '1.5rem', fontWeight: 'normal' }}>
                                {wordData.layer1.title}
                            </h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ccc', marginBottom: '2rem' }}>
                                {wordData.layer1.text}
                            </p>
                            <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%' }}>
                                Analyze Meaning 🔍
                            </button>
                        </div>
                    )}

                    {/* LAYER 2: COGNITIVE */}
                    {layer === 2 && (
                        <div style={{ animation: 'slideUp 0.4s' }}>
                            <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#FFD700', marginBottom: '1rem' }}>
                                Critical Insight
                            </div>
                            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem' }}>
                                {wordData.layer2.title}
                            </h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ccc', marginBottom: '2rem', borderLeft: '3px solid #FFD700', paddingLeft: '1rem', textAlign: 'left' }}>
                                {wordData.layer2.text}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                                    Close
                                </button>
                                <button onClick={handleNext} className="btn btn-primary" style={{ flex: 1 }}>
                                    Dive Deeper 🌊
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LAYER 3: DEPTH */}
                    {layer === 3 && (
                        <div style={{ animation: 'slideUp 0.4s' }}>
                            <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#00C851', marginBottom: '1rem' }}>
                                Historical Context
                            </div>
                            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem' }}>
                                {wordData.layer3.title}
                            </h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ccc', marginBottom: '2rem' }}>
                                {wordData.layer3.text}
                            </p>
                            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
                                Complete Lesson 🎓
                            </button>
                        </div>
                    )}

                    {/* Step Indicators */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                        {[1, 2, 3].map(step => (
                            <div key={step} style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                backgroundColor: step === layer ? '#FFD700' : '#444',
                                transition: 'background 0.3s'
                            }}></div>
                        ))}
                    </div>

                </div>
            </div>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
};

export default WordOriginPopup;
