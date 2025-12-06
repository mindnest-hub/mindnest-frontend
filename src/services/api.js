const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    // Auth
    signup: async (email, password, ageGroup, username) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, ageGroup, username }),
        });
        if (!res.ok) throw new Error('Signup failed');
        return res.json();
    },

    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },

    // User
    getProfile: async (token) => {
        const res = await fetch(`${API_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
    },

    updateProgress: async (token, data) => {
        const res = await fetch(`${API_URL}/user/progress`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update progress');
        return res.json();
    },

    getLeaderboard: async () => {
        const res = await fetch(`${API_URL}/user/leaderboard`);
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        return res.json();
    }
};
