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

    deleteAccount: async (token) => {
        const res = await fetch(`${API_URL}/user/account`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to delete account');
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

    addReward: async (token, amount, xp, actionId, reason) => {
        const res = await fetch(`${API_URL}/user/reward`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, xp, actionId, reason }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to add reward');
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
    },

    // Payment
    initializePayment: async (token, email, amount) => {
        const res = await fetch(`${API_URL}/payment/initialize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, amount }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to initialize payment');
        }
        return res.json();
    },

    verifyPayment: async (token, reference) => {
        const res = await fetch(`${API_URL}/payment/verify/${reference}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to verify payment');
        }
        return res.json();
    },

    upgradeToElite: async (token, duration) => {
        const res = await fetch(`${API_URL}/user/upgrade-elite`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to upgrade to Elite');
        }
        return res.json();
    },

    purchaseAiUnlimited: async (token, duration) => {
        const res = await fetch(`${API_URL}/user/purchase-ai-unlimited`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Purchase failed');
        }
        return res.json();
    },

    getTransactions: async (token) => {
        const res = await fetch(`${API_URL}/user/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch transactions');
        }
        return res.json();
    },

    getAiHistory: async (token) => {
        const res = await fetch(`${API_URL}/ai/history`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch AI history');
        }
        return res.json();
    },

    sendAiChat: async (token, messageData) => {
        const res = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(messageData),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'AI Mentor is busy');
        }
        return res.json();
    },

    clearAiHistory: async (token) => {
        const res = await fetch(`${API_URL}/ai/history`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to clear history');
        }
        return res.json();
    },

    requestWithdrawal: async (token, amount, bankDetails) => {
        const res = await fetch(`${API_URL}/user/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, bankDetails }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to request withdrawal');
        }
        return res.json();
    },

    getAdminWithdrawals: async (token, status) => {
        const url = status ? `${API_URL}/user/admin/withdrawals?status=${status}` : `${API_URL}/user/admin/withdrawals`;
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch withdrawals');
        }
        return res.json();
    },

    getAdminKycPending: async (token) => {
        const res = await fetch(`${API_URL}/user/admin/kyc-pending`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch pending KYC');
        }
        return res.json();
    },

    updateAdminKycStatus: async (token, userId, verified) => {
        const res = await fetch(`${API_URL}/user/admin/kyc/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ verified }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to update KYC status');
        }
        return res.json();
    },

    updateAdminWithdrawalStatus: async (token, requestId, status) => {
        const res = await fetch(`${API_URL}/user/admin/withdraw/${requestId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to update withdrawal status');
        }
        return res.json();
    },

    getAdminStats: async (token) => {
        const res = await fetch(`${API_URL}/user/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch admin stats');
        }
        return res.json();
    },
    submitKYC: async (token, data) => {
        const res = await fetch(`${API_URL}/user/kyc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to submit KYC');
        }
        return res.json();
    },

    // Civics Research
    submitResearchData: async (token, data) => {
        const res = await fetch(`${API_URL}/civics/research`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to submit research data');
        }
        return res.json();
    },

    getAdminResearchData: async (token) => {
        const res = await fetch(`${API_URL}/civics/admin/research`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch research data');
        }
        return res.json();
    }
};
