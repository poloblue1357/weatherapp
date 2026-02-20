import express from "express"
import axios from "axios"

const router = express.Router()
const GEOAPIFY_BASE = 'https://api.geoapify.com/v1/geocode/autocomplete';

router.get('/autocomplete', async (req, res) => {
    try {
        const { text, limit = 4, filter, lang, ...otherParams } = req.query;

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
        });

        const response = await axios.get(`${GEOAPIFY_BASE}?${params.toString()}`); // Fixed: added (
        // console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error('Geoapify proxy error:', error.message);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

export default router