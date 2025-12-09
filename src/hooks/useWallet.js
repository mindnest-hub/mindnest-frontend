import { useState, useEffect } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

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

    useEffect(() => {
        localStorage.setItem('moduleBalances', JSON.stringify(moduleBalances));
        localStorage.setItem('moduleEarnings', JSON.stringify(moduleEarnings));
        localStorage.setItem('walletBalance', balance); // Keep for backward compatibility if needed
    }, [moduleBalances, moduleEarnings, balance]);

    const getModuleCap = (module) => {
        const savedAgeGroup = localStorage.getItem('ageGroup');
        const isYoung = savedAgeGroup && (savedAgeGroup.toLowerCase() === 'kids' || savedAgeGroup.toLowerCase() === 'teens');

        // Global Anti-Exploitation Cap for Kids/Teens
        if (isYoung) {
            // Special exception for History module as requested
            if (module === 'history') return 2000;
            // Default cap for all other modules for kids
            return 1000;
        }

        return MODULE_CAPS[module] || DEFAULT_CAP;
    };

    const addEarnings = (module, amount) => {
        const currentModuleEarning = moduleEarnings[module] || 0;
        const currentModuleBalance = moduleBalances[module] || 0;
        const cap = getModuleCap(module);

        if (currentModuleEarning >= cap) {
            return { success: false, message: `Max earnings (₦${cap}) reached for this section! Try another module.` };
        }

        const remainingSpace = cap - currentModuleEarning;
        const actualAmount = Math.min(amount, remainingSpace);

        if (actualAmount > 0) {
            setModuleEarnings(prev => ({ ...prev, [module]: currentModuleEarning + actualAmount }));
            setModuleBalances(prev => ({ ...prev, [module]: currentModuleBalance + actualAmount }));

            // Update leaderboard
            updateEarnings(actualAmount);

            return { success: true, amount: actualAmount };
        }

        return { success: false, message: "Cap reached." };
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

    return {
        balance, // Global sum
        moduleBalances, // Individual balances
        moduleEarnings, // Lifetime earnings (for caps)
        addEarnings,
        deductPenalty,
        getModuleCap,
        WITHDRAWAL_LIMIT,
        setModuleBalance
    };
};
