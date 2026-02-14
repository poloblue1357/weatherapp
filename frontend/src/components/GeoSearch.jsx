import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { fetchGeoData } from '../api/geoAPI';

const GeoSearch = forwardRef(({ location, setLocation, geoSearch, setGeoSearch, onLocationSelect }, ref) => {
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);
    const skipNextFetch = useRef(false); // Flag to skip fetch after selection

    // Expose cancelPendingFetch to parent via ref
    useImperativeHandle(ref, () => ({
        cancelPendingFetch: () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    }));

    useEffect(() => {
        if (!location || location.length < 3) {
            setGeoSearch(null);
            return;
        }

        // Skip fetch if flag is set (after clicking a suggestion)
        if (skipNextFetch.current) {
            skipNextFetch.current = false;
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await fetchGeoData(location);
                setGeoSearch(data);
            } catch (error) {
                console.error('Failed to fetch:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutRef.current);
    }, [location, setGeoSearch]);

    return (
        <>
            {(loading || geoSearch?.results?.length > 0) && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    {loading && <div className="text-gray-400 p-2">Loading...</div>}
                    {geoSearch?.results?.map((city) => (
                        <div
                            key={city.place_id}
                            className="p-3 cursor-pointer hover:bg-blue-100 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                            onClick={() => {
                                skipNextFetch.current = true; // Skip next fetch
                                setLocation(city.formatted);

                                if(onLocationSelect && city.lat && city.lon) {
                                    onLocationSelect(city.lat, city.lon)
                                }

                                setGeoSearch(null);
                            }}
                        >
                    {city.formatted}
                </div>
            ))}
            </div>
            )}
        </>
    );
});

export default GeoSearch;