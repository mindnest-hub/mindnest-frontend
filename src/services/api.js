const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Local storage fallback functions
const localAuth = {
    signup: (email, password, ageGroup, username) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: Date.now(),
            email,
            username,
            ageGroup,
            createdAt: new Date().toISOString()
        };

        users.push({ ...newUser, password });
        localStorage.setItem('users', JSON.stringify(users));

        const token = btoa(JSON.stringify({ userId: newUser.id, email }));
        return { access_token: token, user: newUser };
    },

    login: (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = user;
        const token = btoa(JSON.stringify({ userId: user.id, email }));
        return { access_token: token, user: userWithoutPassword };
    },

    getProfile: (token) => {
        try {
            const decoded = JSON.parse(atob(token));
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.id === decoded.userId);

            if (!user) throw new Error('User not found');

            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch {
            throw new Error('Invalid token');
        }
    }
};

export const api = {
    // Auth
    signup: async (email, password, ageGroup, username) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, ageGroup, username }),
            });
            // We ignore failures here as Supabase is the primary auth now
            return res.json();
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    verifyOtp: async (email, code) => {
        // Supabase handles OTP verification on frontend usually
        return { success: true };
    },

    login: async (email, password) => {
        // Supabase handles login on frontend
        return { success: true };
    },

    // User
    getProfile: async (token) => {
        const res = await fetch(`${API_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch profile');
        }
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
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to update progress');
        }
        return res.json();
    },

    getLeaderboard: async () => {
        try {
            const res = await fetch(`${API_URL}/user/leaderboard`);
            if (!res.ok) throw new Error('Backend unavailable');
            return res.json();
        } catch (error) {
            return [];
        }
    }
};
