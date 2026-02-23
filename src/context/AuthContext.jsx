import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as api from '../services/api';

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
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, age_group: ageGroup }
            }
        });
        if (error) {
            console.error("Supabase Signup Error:", error);
            throw error;
        }

        // Optionally notify backend to create profile
        try {
            await api.signup(email, password, ageGroup, username);
        } catch (e) {
            console.warn('Backend profile creation failed, might already exist or handled by trigger');
        }

        return data.user;
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

    const upgradeToElite = async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No active session');

        try {
            const data = await api.upgradeElite(token);
            if (data.user) {
                setUser(prev => ({ ...prev, ...data.user }));
            }
            return data;
        } catch (error) {
            console.error('Upgrade to Elite failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, verifyOtp, logout, upgradeToElite, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
