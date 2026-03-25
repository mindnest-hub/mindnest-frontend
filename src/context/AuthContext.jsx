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
        // 1. Create Profile in Backend (this sends the email via Resend)
        let response;
        try {
            response = await api.signup(email, password, ageGroup, username);
        } catch (e) {
            console.error('[AUTH CONTEXT] Backend signup exception:', e);
            throw new Error(`Backend Error: ${e.message}. Have you set VITE_API_URL in your hosting service?`);
        }
        
        if (response.error) {
            console.error('[AUTH CONTEXT] Backend signup rejected:', response.error);
            throw new Error(response.error);
        }


        // 2. Also register in Supabase for identity synchronization (optional but good for social logins later)
        // We ignore the email from Supabase (it's often blocked anyway)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username, age_group: ageGroup } }
        });
        
        if (error) console.warn('Supabase sync warning:', error.message);
        return data.user;
    };

    const resendOtp = async (email) => {
        const response = await api.resendOtp(email);
        return response;
    };

    const verifyOtp = async (email, code) => {
        const data = await api.verifyOtp(email, code);
        // data contains { access_token, user }
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            setUser(data.user);
        }
        return data.user;
    };


    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/reset-password`,
        });
        if (error) throw error;
        return true;
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        return true;
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
            user, login, signup, verifyOtp, logout, deleteAccount, resendOtp,
            resetPassword, updatePassword,
            upgradeToElite, purchaseAiUnlimited, refreshProfile, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
