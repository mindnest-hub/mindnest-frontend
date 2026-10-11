import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ backgroundColor: '#0A0A08', minHeight: '100vh', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header-like skeleton */}
                <div style={{ width: '100%', height: '60px', background: '#1c1c1c', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
                {/* Content skeletons */}
                <div style={{ width: '100%', height: '180px', background: '#1c1c1c', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: '100%', height: '180px', background: '#1c1c1c', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.2; }
                    100% { opacity: 0.6; }
                  }
                `}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
