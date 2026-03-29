import { useState, useCallback } from 'react';

export const useLocation = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getCountryFlag = (countryCode) => {
        if (!countryCode) return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    const verifyLocation = useCallback(async (isSilent = false) => {
        setIsLoading(true);
        try {
            // Priority 1: Instant IP-based lookup (No permission needed, fast)
            const response = await fetch(`https://ipapi.co/json/`);
            const data = await response.json();
            
            if (data.country_code) {
                const result = {
                    countryCode: data.country_code,
                    countryName: data.country_name,
                    flag: getCountryFlag(data.country_code),
                    verified: false // IP-verified
                };
                localStorage.setItem('userLocation', JSON.stringify(result));
                
                // If not silent, try to "upgrade" to GPS verification for better accuracy
                if (!isSilent && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            // Successfully got GPS
                            const upgraded = { ...result, verified: true };
                            localStorage.setItem('userLocation', JSON.stringify(upgraded));
                        },
                        () => {}, // Ignore errors for background check
                        { timeout: 5000 }
                    );
                }

                return result;
            }
        } catch (error) {
            console.warn("Silent location check failed:", error);
            const fallback = { countryCode: 'NG', flag: '🇳🇬', verified: false };
            localStorage.setItem('userLocation', JSON.stringify(fallback));
            return fallback;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { verifyLocation, getCountryFlag, isLoading };
};
