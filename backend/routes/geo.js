import express from "express"
import axios from "axios"

const router = express.Router()

const GEOAPIFY_BASE = 'https://api.geoapify.com/v1/geocode/autocomplete';

router.get('/autocomplete', async (req, res) => {
    try {
        const { text, limit = 5, filter, lang, ...otherParams } = req.query;
        // You can whitelist or validate params here to prevent abuse

        if (!text || text.length < 2) {
        return res.status(400).json({ error: 'Query too short' });
        }

        const params = new URLSearchParams({
            text,
            apiKey: process.env.GEOAPIFY_API_KEY,
            limit,
            ...(filter && { filter }),
            ...(lang && { lang }),
            format: 'json',
            // add bias, countrycode, etc. if you want to pass more
        });

        const response = await axios.get(`${GEOAPIFY_BASE}?${params.toString()}`);

        res.json(response.data);
    } catch (error) {
        console.error('Geoapify proxy error:', error.message);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

export default router


// {
//     "results": [
//         {
//             "datasource": {
//                 "sourcename": "openstreetmap",
//                 "attribution": "© OpenStreetMap contributors",
//                 "license": "Open Database License",
//                 "url": "https://www.openstreetmap.org/copyright"
//             },
//             "country": "United States",
//             "country_code": "us",
//             "state": "Utah",
//             "county": "Utah County",
//             "city": "Lehi",
//             "iso3166_2": "US-UT",
//             "lon": -111.8486019,
//             "lat": 40.3881114,
//             "state_code": "UT",
//             "result_type": "city",
//             "formatted": "Lehi, UT, United States of America",
//             "address_line1": "Lehi, UT",
//             "address_line2": "United States of America",
//             "category": "administrative",
//             "timezone": {
//                 "name": "America/Denver",
//                 "offset_STD": "-07:00",
//                 "offset_STD_seconds": -25200,
//                 "offset_DST": "-06:00",
//                 "offset_DST_seconds": -21600,
//                 "abbreviation_STD": "MST",
//                 "abbreviation_DST": "MDT"
//             },
//             "plus_code": "85GC95Q2+6H",
//             "plus_code_short": "Q2+6H Lehi, Utah County, United States",
//             "rank": {
//                 "importance": 0.4727102341101731,
//                 "confidence": 1,
//                 "confidence_city_level": 1,
//                 "match_type": "full_match"
//             },
//             "place_id": "51b4f4577e4ff65bc059361a65a2ad314440f00101f901f308030000000000c00208",
//             "bbox": {
//                 "lon1": -111.9449447,
//                 "lat1": 40.3559477,
//                 "lon2": -111.8152884,
//                 "lat2": 40.4717249
//             }
//         },
//         {
//             "datasource": {
//                 "sourcename": "openstreetmap",
//                 "attribution": "© OpenStreetMap contributors",
//                 "license": "Open Database License",
//                 "url": "https://www.openstreetmap.org/copyright"
//             },
//             "name": "Lehigh Acres",
//             "country": "United States",
//             "country_code": "us",
//             "state": "Florida",
//             "county": "Lee County",
//             "city": "Lehigh Acres",
//             "suburb": "Lehigh Acres",
//             "iso3166_2": "US-FL",
//             "lon": -81.65813327163374,
//             "lat": 26.6040585,
//             "state_code": "FL",
//             "result_type": "suburb",
//             "formatted": "Lehigh Acres, Lehigh Acres, FL, United States of America",
//             "address_line1": "Lehigh Acres",
//             "address_line2": "Lehigh Acres, FL, United States of America",
//             "timezone": {
//                 "name": "America/New_York",
//                 "offset_STD": "-05:00",
//                 "offset_STD_seconds": -18000,
//                 "offset_DST": "-04:00",
//                 "offset_DST_seconds": -14400,
//                 "abbreviation_STD": "EST",
//                 "abbreviation_DST": "EDT"
//             },
//             "plus_code": "76RWJ83R+JP",
//             "plus_code_short": "J83R+JP Lehigh Acres, Lee County, United States",
//             "rank": {
//                 "importance": 0.39734859701882214,
//                 "confidence": 1,
//                 "confidence_city_level": 1,
//                 "match_type": "full_match"
//             },
//             "place_id": "51e48403db1e6a54c059ee5eee93a39a3a40f00102f901e0eb000200000000c0020592030c4c6568696768204163726573",
//             "bbox": {
//                 "lon1": -81.7588607,
//                 "lat1": 26.51334,
//                 "lon2": -81.56382,
//                 "lat2": 26.6946557
//             }
//         },
//         {
//             "datasource": {
//                 "sourcename": "openstreetmap",
//                 "attribution": "© OpenStreetMap contributors",
//                 "license": "Open Database License",
//                 "url": "https://www.openstreetmap.org/copyright"
//             },
//             "country": "United States",
//             "country_code": "us",
//             "state": "Florida",
//             "county": "Lee County",
//             "city": "Lehigh Acres",
//             "postcode": "33936",
//             "iso3166_2": "US-FL",
//             "lon": -81.652407,
//             "lat": 26.6091509,
//             "state_code": "FL",
//             "result_type": "postcode",
//             "formatted": "Lehigh Acres, FL, United States of America",
//             "address_line1": "Lehigh Acres, FL",
//             "address_line2": "United States of America",
//             "category": "populated_place",
//             "timezone": {
//                 "name": "America/New_York",
//                 "offset_STD": "-05:00",
//                 "offset_STD_seconds": -18000,
//                 "offset_DST": "-04:00",
//                 "offset_DST_seconds": -14400,
//                 "abbreviation_STD": "EST",
//                 "abbreviation_DST": "EDT"
//             },
//             "plus_code": "76RWJ85X+M2",
//             "plus_code_short": "J85X+M2 Lehigh Acres, Lee County, United States",
//             "rank": {
//                 "importance": 0.16000999999999999,
//                 "confidence": 1,
//                 "confidence_city_level": 1,
//                 "match_type": "full_match"
//             },
//             "place_id": "519d2b4a09c16954c05937d43950f19b3a40f00103f901d33c38b501000000c0020792030833333933362b7573",
//             "bbox": {
//                 "lon1": -81.692407,
//                 "lat1": 26.5691509,
//                 "lon2": -81.612407,
//                 "lat2": 26.6491509
//             }
//         }
//     ],
//     "query": {
//         "text": "lehi",
//         "parsed": {
//             "city": "lehi",
//             "expected_type": "unknown"
//         },
//         "categories": []
//     }
// }