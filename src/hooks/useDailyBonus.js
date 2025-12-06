// Hook to manage daily login bonus
// Stores data in localStorage under "dailyBonus"
// Reset time is 1 AM local time

export const useDailyBonus = () => {
    const STORAGE_KEY = "dailyBonus";

    const getState = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (_) {
                return {};
            }
        }
        return {};
    };

    const saveState = (state) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    };

    const getNextResetTime = () => {
        const now = new Date();
        const reset = new Date(now);
        reset.setHours(1, 0, 0, 0);
        if (now.getHours() >= 1) {
            reset.setDate(reset.getDate() + 1);
        }
        return reset;
    };

    const canClaim = () => {
        const { lastClaim } = getState();
        if (!lastClaim) return true;
        const now = new Date();
        const reset = getNextResetTime();
        const last = new Date(lastClaim);
        // claim allowed if last claim was before the most recent reset
        return now >= reset && last < reset;
    };

    const claimBonus = () => {
        const state = getState();
        const today = new Date();
        const reset = getNextResetTime();
        const lastClaimDate = state.lastClaim ? new Date(state.lastClaim) : null;
        let streak = state.streak || 0;
        // If last claim was before the previous reset, streak continues, else reset
        if (lastClaimDate && lastClaimDate >= new Date(reset.getTime() - 24 * 60 * 60 * 1000)) {
            streak = Math.min(streak + 1, 7);
        } else {
            streak = 1;
        }
        const rewardMap = {
            1: 50,
            2: 75,
            3: 100,
            4: 125,
            5: 150,
            6: 175,
            7: 200,
        };
        const reward = rewardMap[streak] || 200;
        const newState = {
            lastClaim: today.toISOString(),
            streak,
            totalClaimed: (state.totalClaimed || 0) + reward,
        };
        saveState(newState);
        return { reward, streak };
    };

    return { canClaim, claimBonus, getState };
};
