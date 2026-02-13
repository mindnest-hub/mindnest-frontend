import React, { useState } from 'react';
import { civicEducationContent } from '../data/civicEducationContent';

const CivicGuide = ({ ageGroup }) => {
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const [activeModule, setActiveModule] = useState('politicalParties');
    const [activeSubModule, setActiveSubModule] = useState(null);

    const modules = [
        { id: 'politicalParties', title: '🏛 Political Parties', icon: '🏛️' },
        { id: 'wards', title: '🏘 Wards & Local Gov', icon: '🏘️' },
        { id: 'comprehensiveCurriculum', title: '📚 10-Module Guide', icon: '📚' }
    ];

    const renderContent = () => {
        if (activeModule === 'comprehensiveCurriculum') {
            const curriculum = civicEducationContent.comprehensiveCurriculum[isTeen ? 'teens' : 'adults'];

            if (activeSubModule !== null) {
                const module = curriculum[activeSubModule];
                return (
                    <div className="guide-content" style={{ animation: 'fadeIn 0.5s' }}>
                        <button
                            onClick={() => setActiveSubModule(null)}
                            className="btn btn-sm"
                            style={{ marginBottom: '1.5rem', backgroundColor: '#9C27B0', color: 'white' }}
                        >
                            ← Back to Modules
                        </button>
                        <h2 style={{ color: '#9C27B0', marginBottom: '1.5rem' }}>{module.title}</h2>
                        <div
                            style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                color: '#ddd',
                                whiteSpace: 'pre-wrap'
                            }}
                            dangerouslySetInnerHTML={{ __html: module.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        />
                    </div>
                );
            }

            return (
                <div className="guide-content" style={{ animation: 'fadeIn 0.5s' }}>
                    <h2 style={{ color: '#9C27B0', marginBottom: '1.5rem' }}>📚 Comprehensive Civic Curriculum</h2>
                    <p style={{ color: '#aaa', marginBottom: '2rem' }}>
                        A complete guide to understanding civic power, government, and your role as a citizen.
                    </p>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {curriculum.map((module, index) => (
                            <button
                                key={module.id}
                                onClick={() => setActiveSubModule(index)}
                                className="btn btn-outline"
                                style={{
                                    textAlign: 'left',
                                    padding: '1.5rem',
                                    height: 'auto',
                                    whiteSpace: 'normal',
                                    borderColor: '#9C27B0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>{module.title.split(' ')[0]}</span>
                                <span style={{ flex: 1 }}>{module.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        const content = civicEducationContent[activeModule][isTeen ? 'teens' : 'adults'];

        return (
            <div className="guide-content" style={{ animation: 'fadeIn 0.5s' }}>
                <h2 style={{ color: '#9C27B0', marginBottom: '2rem' }}>{content.title}</h2>
                {content.sections.map((section, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: '2.5rem',
                            padding: '1.5rem',
                            backgroundColor: 'rgba(156, 39, 176, 0.05)',
                            borderRadius: '15px',
                            borderLeft: '4px solid #9C27B0'
                        }}
                    >
                        <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1.3rem' }}>
                            {section.heading}
                        </h3>
                        <div
                            style={{
                                fontSize: '1.05rem',
                                lineHeight: '1.8',
                                color: '#ddd',
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            {/* Module Navigation */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {modules.map(module => (
                    <button
                        key={module.id}
                        onClick={() => {
                            setActiveModule(module.id);
                            setActiveSubModule(null);
                        }}
                        className="btn"
                        style={{
                            backgroundColor: activeModule === module.id ? '#9C27B0' : '#222',
                            color: activeModule === module.id ? 'white' : '#aaa',
                            border: `2px solid ${activeModule === module.id ? '#9C27B0' : '#444'}`,
                            padding: '1rem',
                            height: 'auto',
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>{module.icon}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{module.title}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {renderContent()}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .guide-content {
                    background-color: #1a1a1a;
                    padding: 2rem;
                    borderRadius: 20px;
                    border: 1px solid #333;
                }

                @media (max-width: 768px) {
                    .guide-content {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CivicGuide;
