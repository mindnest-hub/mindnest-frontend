import React, { useState } from 'react';
import Toast from './Toast';

const ShareButton = ({ title, text, url }) => {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const handleShare = async () => {
        const shareData = {
            title: title || 'MindNest',
            text: text || 'Join me on MindNest to build wealth and learn skills!',
            url: url || window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url || window.location.href);
                showToast('Link copied to clipboard!', 'success');
            } catch (err) {
                showToast('Could not share. Please copy the URL manually.', 'error');
            }
        }
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <button
                onClick={handleShare}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                }}
            >
                Share 📤
            </button>
        </>
    );
};

export default ShareButton;
