import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                handleSession(session);
            } else {
                setLoading(false);
            }
        }).catch(err => {
            console.error("Session check failed", err);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                handleSession(session);
            } else {
                setUser(null);
                localStorage.removeItem('token');
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSession = async (session) => {
        const token = session.access_token;
        localStorage.setItem('token', token);
        try {
            const userData = await api.getProfile(token);
            setUser({ ...session.user, ...userData });
        } catch (error) {
            setUser(session.user);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    };

    const signup = async (email, password, ageGroup, username) => {
        // 1. First sync with backend to capture waitlist entry and get immediate token
        let backendData = null;
        try {
            backendData = await api.signup(email, password, ageGroup, username);
        } catch (e) {
            console.error('Backend profile creation failed:', e);
        }

        // 2. Attempt Supabase signup in background (to trigger email if it works)
        try {
            await supabase.auth.signUp({
                email,
                password,
                options: { data: { username, age_group: ageGroup } }
            });
        } catch (e) {
            console.warn('Supabase signup failed/limited, proceeding with backend session');
        }

        // 3. If backend returned a token, use it immediately (Waitlist Bypass)
        if (backendData && backendData.access_token) {
            console.log("Waitlist Bypass: Logging in via backend token");
            const session = { access_token: backendData.access_token, user: backendData.user };
            handleSession(session);
            return backendData.user;
        }

        throw new Error('Signup failed. Please try again later.');
    };

    const verifyOtp = async (email, code) => {
        const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' });
        if (error) throw error;
        return data.user;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        setUser(null);
    };

    const upgradeToElite = async (duration) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No active session');

        try {
            const data = await api.upgradeToElite(token, duration);
            if (data.user) {
                setUser(prev => ({ ...prev, ...data.user }));
            }
            return data;
        } catch (error) {
            console.error('Upgrade to Elite failed:', error);
            throw error;
        }
    };

    const purchaseAiUnlimited = async (duration) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No active session');

        try {
            const data = await api.purchaseAiUnlimited(token, duration);
            if (data.user) {
                setUser(prev => ({ ...prev, ...data.user }));
            }
            return data;
        } catch (error) {
            console.error('AI Unlimited purchase failed:', error);
            throw error;
        }
    };

    const deleteAccount = async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No active session');
        try {
            await api.deleteAccount(token);
            // After successful deletion on backend, log out of Supabase
            await supabase.auth.signOut();
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Failed to delete account:', error);
            throw error;
        }
    };

    const refreshProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const userData = await api.getProfile(token);
            setUser(prev => ({ ...prev, ...userData }));
        } catch (error) {
            console.error('Failed to refresh profile:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user, login, signup, verifyOtp, logout, deleteAccount,
            upgradeToElite, purchaseAiUnlimited, refreshProfile, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
