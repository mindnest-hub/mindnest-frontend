// Hook to manage leaderboard data stored in localStorage under "leaderboard"
// Provides functions to get top users and update current user's earnings

export const useLeaderboard = () => {
    const STORAGE_KEY = "leaderboard";
    const USER_KEY = "userProfile";

    const getLeaderboard = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (_) {
                return [];
            }
        }
        return [];
    };

    const saveLeaderboard = (list) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    };

    const getUserProfile = () => {
        const raw = localStorage.getItem(USER_KEY);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (_) {
                return {};
            }
        }
        return {};
    };

    const saveUserProfile = (profile) => {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
    };

    // Call this after earnings change to update leaderboard
    const updateEarnings = (additional) => {
        const profile = getUserProfile();
        const newTotal = (profile.totalEarnings || 0) + additional;
        const updatedProfile = { ...profile, totalEarnings: newTotal };
        saveUserProfile(updatedProfile);

        // Update leaderboard list
        let list = getLeaderboard();
        const existing = list.find((u) => u.username === updatedProfile.username);
        if (existing) {
            existing.totalEarnings = newTotal;
        } else {
            // If no username yet, assign a placeholder
            const placeholder = updatedProfile.username || `User${Date.now()}`;
            list.push({ username: placeholder, totalEarnings: newTotal });
        }
        // Sort descending
        list.sort((a, b) => b.totalEarnings - a.totalEarnings);
        // Keep top 10
        list = list.slice(0, 10);
        saveLeaderboard(list);
    };

    const getUserRank = () => {
        const profile = getUserProfile();
        const list = getLeaderboard();
        const idx = list.findIndex((u) => u.username === profile.username);
        return idx >= 0 ? idx + 1 : null;
    };

    return { getLeaderboard, updateEarnings, getUserRank, getUserProfile, saveUserProfile };
};
