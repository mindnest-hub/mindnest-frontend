import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { wordOrigins } from '../data/wordOrigins';
import WordOriginPopup from './WordOriginPopup';

const WordOriginManager = ({ ageGroup }) => {
    const location = useLocation();
    const [activeWord, setActiveWord] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [position, setPosition] = useState({ x: window.innerWidth - 250, y: window.innerHeight - 250 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

    // Cooldown in milliseconds (7 minutes)
    const COOLDOWN = 7 * 60 * 1000;

    useEffect(() => {
        const checkAndShow = () => {
            const lastShown = localStorage.getItem('lastWordOriginShown');
            const now = Date.now();

            if (lastShown && (now - parseInt(lastShown)) < COOLDOWN) {
                return;
            }

            const path = location.pathname;
            const categories = routeMap[path];

            if (categories) {
                const candidates = wordOrigins.filter(w =>
                    categories.includes(w.category) && !seenWords.includes(w.id)
                );

                if (candidates.length > 0) {
                    const word = candidates[Math.floor(Math.random() * candidates.length)];
                    setShowToast(word);
                    localStorage.setItem('lastWordOriginShown', now.toString());
                }
            }
        };

        // Check on mount and on route change
        const initialTimer = setTimeout(checkAndShow, 10000); // Wait 10s after landing

        // Setup interval to check every minute (optional, but good if they stay on page)
        const interval = setInterval(checkAndShow, 60000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [location.pathname, seenWords]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const newX = Math.max(0, Math.min(window.innerWidth - 220, e.clientX - dragStart.x));
            const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const handleOpen = (e) => {
        // Only open if we aren't dragging
        if (isDragging) return;

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
                    onMouseDown={handleMouseDown}
                    onClick={handleOpen}
                    style={{
                        position: 'fixed',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        backgroundColor: '#FFD700',
                        color: '#000',
                        padding: '1rem 1.5rem',
                        borderRadius: '50px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        animation: 'bounceIn 0.5s',
                        fontWeight: 'bold',
                        userSelect: 'none',
                        transition: isDragging ? 'none' : 'all 0.1s ease-out'
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

