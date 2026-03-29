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

    const verifyLocation = useCallback(async () => {
        setIsLoading(true);
        try {
            // Priority 1: Browser Geolocation (Most accurate but needs permission)
            const coords = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
            });

            // Priority 2: Reverse Geocode (Simple IP-based api fallback for "verify" part)
            const response = await fetch(`https://ipapi.co/json/`);
            const data = await response.json();
            
            if (data.country_code) {
                const result = {
                    countryCode: data.country_code,
                    countryName: data.country_name,
                    flag: getCountryFlag(data.country_code),
                    verified: true
                };
                localStorage.setItem('userLocation', JSON.stringify(result));
                return result;
            }
        } catch (error) {
            console.warn("Location check failed, falling back to IP only:", error);
            // Fallback: Just IP
            try {
                const response = await fetch(`https://ipapi.co/json/`);
                const data = await response.json();
                const result = {
                    countryCode: data.country_code || 'NG',
                    countryName: data.country_name || 'Nigeria',
                    flag: getCountryFlag(data.country_code || 'NG'),
                    verified: false
                };
                localStorage.setItem('userLocation', JSON.stringify(result));
                return result;
            } catch (inner) {
                return { countryCode: 'NG', flag: '🇳🇬', verified: false };
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { verifyLocation, getCountryFlag, isLoading };
};
