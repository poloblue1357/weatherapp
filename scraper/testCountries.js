const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://dropzonefinder.com';

async function getCountrySlugs() {
    const { data: html } = await axios.get(`${BASE_URL}/dropzones`);
    console.log(html.slice(0, 500))
   
    // Extract all country slugs from the JSON blob
    const matches = html.match(/"slug":"([a-z-]+)","[^}]*"dropzoneCount":(\d+)/g);
   
    if (!matches) {
        console.log('No matches found');
        return [];
    }

    const slugs = matches
        .map(m => {
            const slugMatch = m.match(/"slug":"([a-z-]+)"/);
            const countMatch = m.match(/"dropzoneCount":(\d+)/);
            return {
                slug: slugMatch ? slugMatch[1] : null,
                count: countMatch ? parseInt(countMatch[1]) : 0
            };
        })
        .filter(s => s.slug && s.count > 0)
        .map(s => s.slug);

    console.log(slugs);
    console.log(`Total: ${slugs.length} countries`);
    return slugs;
}

getCountrySlugs();