import React, { createContext, useContext, useState, useEffect } from 'react';

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({ children }) => {
    const [points, setPoints] = useState(() => {
        return parseInt(localStorage.getItem('userPoints') || '0');
    });

    const [level, setLevel] = useState('Beginner');
    const [badges, setBadges] = useState(() => {
        return JSON.parse(localStorage.getItem('userBadges') || '[]');
    });

    const [streak, setStreak] = useState(() => {
        return parseInt(localStorage.getItem('userStreak') || '0');
    });

    const [lastLoginDate, setLastLoginDate] = useState(() => {
        return localStorage.getItem('lastLoginDate') || '';
    });

    // Level thresholds
    const RANKS = {
        BEGINNER: { name: 'Beginner', min: 0, icon: '🌱' },
        BUILDER: { name: 'Builder', min: 1000, icon: '🔨' },
        ACHIEVER: { name: 'Achiever', min: 5000, icon: '🏆' },
        LEADER: { name: 'Leader', min: 10000, icon: '👑' },
        ELITE: { name: 'Elite', min: 25000, icon: '🛡️' }
    };

    useEffect(() => {
        localStorage.setItem('userPoints', points.toString());
        updateLevel(points);
    }, [points]);

    useEffect(() => {
        localStorage.setItem('userBadges', JSON.stringify(badges));
    }, [badges]);

    useEffect(() => {
        localStorage.setItem('userStreak', streak.toString());
    }, [streak]);

    useEffect(() => {
        localStorage.setItem('lastLoginDate', lastLoginDate);
    }, [lastLoginDate]);

    // Check streak on mount
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (lastLoginDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastLoginDate === yesterdayStr) {
                setStreak(prev => prev + 1);
            } else if (lastLoginDate !== '') {
                setStreak(1);
            } else {
                setStreak(1);
            }
            setLastLoginDate(today);
        }
    }, []);

    const updateLevel = (currentPoints) => {
        if (currentPoints >= RANKS.ELITE.min) setLevel(RANKS.ELITE.name);
        else if (currentPoints >= RANKS.LEADER.min) setLevel(RANKS.LEADER.name);
        else if (currentPoints >= RANKS.ACHIEVER.min) setLevel(RANKS.ACHIEVER.name);
        else if (currentPoints >= RANKS.BUILDER.min) setLevel(RANKS.BUILDER.name);
        else setLevel(RANKS.BEGINNER.name);
    };

    const addPoints = (amount, reason) => {
        setPoints(prev => prev + amount);
        // Analytics trigger would go here: track('points_earned', { amount, reason, total: points + amount })
        console.log(`Earned ${amount} points for: ${reason}`);
    };

    const awardBadge = (badgeId, badgeName, badgeIcon) => {
        if (!badges.find(b => b.id === badgeId)) {
            const newBadge = { id: badgeId, name: badgeName, icon: badgeIcon, date: new Date().toISOString() };
            setBadges(prev => [...prev, newBadge]);
            // Analytics trigger: track('badge_awarded', { badgeId, badgeName })
            return true;
        }
        return false;
    };

    const getRankInfo = () => {
        return Object.values(RANKS).find(r => r.name === level) || RANKS.BEGINNER;
    };

    const getNextRankInfo = () => {
        const ranksValues = Object.values(RANKS);
        const currentIndex = ranksValues.findIndex(r => r.name === level);
        if (currentIndex < ranksValues.length - 1) {
            return ranksValues[currentIndex + 1];
        }
        return null; // Already Elite
    };

    return (
        <GamificationContext.Provider value={{
            points,
            level,
            badges,
            streak,
            addPoints,
            awardBadge,
            getRankInfo,
            getNextRankInfo,
            RANKS
        }}>
            {children}
        </GamificationContext.Provider>
    );
};
