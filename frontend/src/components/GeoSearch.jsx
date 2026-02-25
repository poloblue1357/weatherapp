import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { fetchGeoData } from '../api/geoAPI';

const GeoSearch = forwardRef(({ location, setLocation, geoSearch, setGeoSearch, onLocationSelect }, ref) => {
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);
    const skipNextFetch = useRef(false);

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

        if (skipNextFetch.current) {
            skipNextFetch.current = false;
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // ── Fix: cancelled flag prevents stale responses from updating state ──
        let cancelled = false;

        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await fetchGeoData(location);
                if (!cancelled) setGeoSearch(data);
            } catch (error) {
                if (!cancelled) console.error('Failed to fetch:', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeoutRef.current);
            setLoading(false);
        };
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
                                skipNextFetch.current = true;
                                setLocation(city.formatted);
                                if (onLocationSelect && city.lat && city.lon) {
                                    onLocationSelect(city.lat, city.lon);
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