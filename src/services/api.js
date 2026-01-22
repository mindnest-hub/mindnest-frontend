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
            if (!res.ok) throw new Error('Backend unavailable');
            return res.json();
        } catch (error) {
            // Fallback to local storage
            console.log('Using local authentication (no backend)');
            return localAuth.signup(email, password, ageGroup, username);
        }
    },

    login: async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error('Backend unavailable');
            return res.json();
        } catch (error) {
            // Fallback to local storage
            console.log('Using local authentication (no backend)');
            return localAuth.login(email, password);
        }
    },

    // User
    getProfile: async (token) => {
        try {
            const res = await fetch(`${API_URL}/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Backend unavailable');
            return res.json();
        } catch (error) {
            // Fallback to local storage
            console.log('Using local profile (no backend)');
            return localAuth.getProfile(token);
        }
    },

    updateProgress: async (token, data) => {
        try {
            const res = await fetch(`${API_URL}/user/progress`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Backend unavailable');
            return res.json();
        } catch (error) {
            // For now, just return success for local mode
            console.log('Local mode: progress not synced to backend');
            return { success: true };
        }
    },

    getLeaderboard: async () => {
        try {
            const res = await fetch(`${API_URL}/user/leaderboard`);
            if (!res.ok) throw new Error('Backend unavailable');
            return res.json();
        } catch (error) {
            // Return mock leaderboard for local mode
            console.log('Using mock leaderboard (no backend)');
            return [];
        }
    }
};
