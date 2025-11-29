import { useState, useEffect } from 'react';

// Simple in-memory cache to avoid repeated API calls
const geocodeCache = new Map();

/**
 * Custom hook for reverse geocoding using Nominatim (OpenStreetMap)
 * Free service with rate limiting (1 request per second)
 * @param {number} latitude
 * @param {number} longitude
 * @returns {{ address: string, loading: boolean, error: string | null }}
 */
const useReverseGeocode = (latitude, longitude) => {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (latitude == null || longitude == null) {
            setAddress('');
            return;
        }

        const cacheKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

        // Check cache first
        if (geocodeCache.has(cacheKey)) {
            setAddress(geocodeCache.get(cacheKey));
            return;
        }

        const fetchAddress = async () => {
            setLoading(true);
            setError(null);

            try {
                // Using Nominatim API (free, rate-limited to 1 req/sec)
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'AegistNet-Dashboard/1.0',
                    },
                });

                if (!response.ok) {
                    throw new Error('Geocoding service unavailable');
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                // Format the address nicely
                let formattedAddress = '';
                const addr = data.address;

                if (addr) {
                    const parts = [];

                    // Street number and name
                    if (addr.house_number && addr.road) {
                        parts.push(`${addr.house_number} ${addr.road}`);
                    } else if (addr.road) {
                        parts.push(addr.road);
                    }

                    // City/town
                    if (addr.city || addr.town || addr.village) {
                        parts.push(addr.city || addr.town || addr.village);
                    }

                    // State/region
                    if (addr.state) {
                        parts.push(addr.state);
                    }

                    // Postal code
                    if (addr.postcode) {
                        parts.push(addr.postcode);
                    }

                    // Country
                    if (addr.country) {
                        parts.push(addr.country);
                    }

                    formattedAddress = parts.join(', ');
                }

                if (!formattedAddress) {
                    formattedAddress = data.display_name || 'Address not available';
                }

                setAddress(formattedAddress);
                geocodeCache.set(cacheKey, formattedAddress);
            } catch (err) {
                console.error('Reverse geocoding error:', err);
                setError(err.message);
                setAddress('Unable to load address');
            } finally {
                setLoading(false);
            }
        };

        // Rate limiting: delay execution to respect API limits
        const timeoutId = setTimeout(fetchAddress, 100);

        return () => clearTimeout(timeoutId);
    }, [latitude, longitude]);

    return { address, loading, error };
};

export default useReverseGeocode;
