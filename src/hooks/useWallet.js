import { useState, useEffect } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const MODULE_CAPS = {
    history: 4000,
    finance: 2000,
    tech: 2000,
    agri: 2000,
    civics: 2000,
    health: 2000,
    criticalThinking: 1500
};
const DEFAULT_CAP = 2000;
const WITHDRAWAL_LIMIT = 5000;

export const useWallet = () => {
    const { token } = useAuth();
    // Track spendable balance per module
    const [moduleBalances, setModuleBalances] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('moduleBalances')) || { finance: 0, history: 0, tech: 0, agri: 0, civics: 0, health: 0 };
        } catch (e) {
            console.error("Error parsing moduleBalances:", e);
            return { finance: 0, history: 0, tech: 0, agri: 0, civics: 0, health: 0 };
        }
    });

    // Track lifetime earnings per module (for Caps)
    const [moduleEarnings, setModuleEarnings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('moduleEarnings')) || { finance: 0, history: 0, tech: 0, agri: 0, civics: 0, health: 0 };
        } catch (e) {
            console.error("Error parsing moduleEarnings:", e);
            return { finance: 0, history: 0, tech: 0, agri: 0, civics: 0, health: 0 };
        }
    });

    // Derived global balance (Sum of all module balances)
    const balance = Object.values(moduleBalances).reduce((acc, val) => acc + (Number(val) || 0), 0);

    const { updateEarnings } = useLeaderboard();
    const [isSyncing, setIsSyncing] = useState(false);

    // Fetch progress from backend on mount or when token changes
    useEffect(() => {
        if (token) {
            setIsSyncing(true);
            api.getProfile(token)
                .then(userData => {
                    if (userData.moduleBalances && typeof userData.moduleBalances === 'object') {
                        setModuleBalances(userData.moduleBalances);
                    }
                    if (userData.moduleEarnings && typeof userData.moduleEarnings === 'object') {
                        setModuleEarnings(userData.moduleEarnings);
                    }
                })
                .catch(err => console.error("Failed to fetch profile from backend:", err))
                .finally(() => setIsSyncing(false));
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem('moduleBalances', JSON.stringify(moduleBalances));
        localStorage.setItem('moduleEarnings', JSON.stringify(moduleEarnings));
        localStorage.setItem('walletBalance', balance);

        // Sync with backend if logged in (Debounced)
        if (token) {
            const timeoutId = setTimeout(() => {
                api.updateProgress(token, {
                    moduleBalances,
                    moduleEarnings,
                    xp: (moduleEarnings.history || 0) + (moduleEarnings.finance || 0) + (moduleEarnings.tech || 0),
                    walletBalance: balance
                }).catch(err => console.error("Failed to sync progress with backend:", err));
            }, 2000); // 2 second debounce

            return () => clearTimeout(timeoutId);
        }
    }, [moduleBalances, moduleEarnings, balance, token]);

    const getModuleCap = (module) => {
        const savedAgeGroup = localStorage.getItem('ageGroup');
        const isYoung = savedAgeGroup && (savedAgeGroup.toLowerCase() === 'kids' || savedAgeGroup.toLowerCase() === 'teens');

        // Global Anti-Exploitation Cap for Kids/Teens
        if (isYoung) {
            // Special exception for History module as requested
            if (module === 'history') return 2000;
            // Special exception for Finance module (15 levels * 100 coins)
            if (module === 'finance') return 1500;
            // Default cap for all other modules for kids
            return 1000;
        }

        return MODULE_CAPS[module] || DEFAULT_CAP;
    };

    const addEarnings = (module, amount) => {
        const currentModuleEarning = moduleEarnings[module] || 0;
        const currentModuleBalance = moduleBalances[module] || 0;
        const cap = getModuleCap(module);

        const remainingSpace = Math.max(0, cap - currentModuleEarning);
        const actualAmount = Math.min(amount, remainingSpace);

        if (actualAmount > 0) {
            setModuleEarnings(prev => ({ ...prev, [module]: currentModuleEarning + actualAmount }));
            setModuleBalances(prev => ({ ...prev, [module]: currentModuleBalance + actualAmount }));

            // Update leaderboard
            updateEarnings(actualAmount);

            return { success: true, amount: actualAmount, capped: false };
        }

        // Silent Cap: Still return success so games continue, but add nothing
        return { success: true, amount: 0, capped: true };
    };

    const deductPenalty = (module, amount) => {
        setModuleBalances(prev => {
            const current = prev[module] || 0;
            return { ...prev, [module]: Math.max(0, current - amount) };
        });
    };

    const setModuleBalance = (module, newBalance) => {
        setModuleBalances(prev => ({ ...prev, [module]: Math.max(0, newBalance) }));
    };

    const deductGlobal = (amount) => {
        let remaining = amount;
        let newBalances = { ...moduleBalances };

        // Order of spending: Finance -> History -> Tech -> Others
        const modules = Object.keys(newBalances);

        for (const module of modules) {
            if (remaining <= 0) break;

            const available = newBalances[module];
            const spend = Math.min(available, remaining);

            if (spend > 0) {
                newBalances[module] -= spend;
                remaining -= spend;
            }
        }

        if (remaining === 0) {
            setModuleBalances(newBalances);
            return true; // Success
        }
        return false; // Insufficient funds
    };

    const getAgeGroup = () => localStorage.getItem('ageGroup');

    return { balance, moduleBalances, addEarnings, deductPenalty, setModuleBalance, getModuleCap, deductGlobal, moduleEarnings, getAgeGroup, WITHDRAWAL_LIMIT, isSyncing };
};
