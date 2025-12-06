import React from 'react';

const ShareButton = ({ title, text, url, label = "Share", style = {} }) => {
    const handleShare = async () => {
        const shareData = {
            title: title || 'MindNest',
            text: text || 'Check out MindNest!',
            url: url || window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled', err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                alert('Link copied to clipboard!');
            } catch (err) {
                alert('Could not share. Please copy the URL manually.');
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                ...style
            }}
        >
            <span>📤</span> {label}
        </button>
    );
};

export default ShareButton;
