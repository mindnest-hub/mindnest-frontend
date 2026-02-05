import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { wordOrigins } from '../data/wordOrigins';
import WordOriginPopup from './WordOriginPopup';

const WordOriginManager = ({ ageGroup }) => {
    const location = useLocation();
    const [activeWord, setActiveWord] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [seenWords, setSeenWords] = useState(() => {
        return JSON.parse(localStorage.getItem('seenWordOrigins')) || [];
    });

    // Determine if user is a kid
    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';

    // Map routes to categories or specific words
    const routeMap = {
        '/finance': ['finance'],
        '/history': ['history'],
        '/civics': ['civics'],
        '/critical-thinking': ['critical-thinking'],
        '/transparency': ['civics', 'history'],
        '/agri': ['finance', 'history']
    };

    useEffect(() => {
        const path = location.pathname;
        const categories = routeMap[path];

        if (categories) {
            const candidates = wordOrigins.filter(w =>
                categories.includes(w.category) && !seenWords.includes(w.id)
            );

            if (candidates.length > 0) {
                const word = candidates[Math.floor(Math.random() * candidates.length)];
                const timer = setTimeout(() => {
                    setShowToast(word);
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [location.pathname, seenWords]);

    const handleOpen = () => {
        if (showToast) {
            setActiveWord(showToast);
            setShowToast(null);
            const newSeen = [...seenWords, showToast.id];
            setSeenWords(newSeen);
            localStorage.setItem('seenWordOrigins', JSON.stringify(newSeen));
        }
    };

    const handleClose = () => {
        setActiveWord(null);
    };

    return (
        <>
            {/* TOAST NOTIFICATION */}
            {showToast && !activeWord && (
                <div
                    onClick={handleOpen}
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '20px',
                        backgroundColor: '#FFD700',
                        color: '#000',
                        padding: '1rem 1.5rem',
                        borderRadius: '50px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        animation: 'bounceIn 0.5s',
                        fontWeight: 'bold'
                    }}
                >
                    <span style={{ fontSize: '1.5rem' }}>💡</span>
                    <div>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8 }}>Word Insight</div>
                        <div>Origin of "{showToast.word}"</div>
                    </div>
                </div>
            )}

            {/* FULL POPUP MODAL */}
            {activeWord && (
                <WordOriginPopup
                    wordData={activeWord}
                    onClose={handleClose}
                    isKid={isKid}
                />
            )}

            <style>{`
                @keyframes bounceIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default WordOriginManager;

