const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://dropzonefinder.com';
const DELAY_MS = 1500;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Extract the embedded JSON blob from the page
function extractPageData(html) {
    const scriptMatch = html.match(/\{"id":"[^"]+","name":"[^"]+","latitude":([-\d.]+),"longitude":([-\d.]+),"country":"[^"]+","dropzoneCount":\d+,"slug":"[^"]+"\}/g);
    if (!scriptMatch) return null;

    return scriptMatch.map(match => {
        try {
            return JSON.parse(match);
        } catch {
            return null;
        }
    }).filter(Boolean);
}

// Extract structured data (JSON-LD) for address, phone, email
function extractStructuredData(html) {
    const $ = cheerio.load(html);
    let result = {};

    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).html());
            if (json.geo) {
                result.telephone = json.telephone || null;
                result.email = json.email || null;
                result.url = json.url || null;
                if (json.address) {
                    result.city = json.address.addressLocality || null;
                    result.state = json.address.addressRegion || null;
                    result.country = json.address.addressCountry || null;
                }
            }
        } catch {
            // skip malformed JSON-LD
        }
    });

    return result;
}

// Use Puppeteer to get all country slugs (JS rendered)
async function getCountrySlugs() {
    console.log('Launching browser to fetch country list...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/dropzones`, { waitUntil: 'networkidle2' });
    const html = await page.content();
    console.log(`Sample HTML:`, html.slice(html.indexOf('uruguay'), html.indexOf('uruguay') + 200))
    await browser.close();

    // Debug — find where dropzoneCount appears
    const idx = html.indexOf('dropzoneCount');
    console.log('Context around dropzoneCount:', html.slice(idx - 100, idx + 100));

    // Extract slugs from the JSON blob
    const matches = [...html.matchAll(/\\"slug\\":\\"([a-z-]+)\\",.*?\\"dropzoneCount\\":(\d+)/g)];
    console.log('Match count:', matches.length);
    console.log('First match:', matches[0]);
   
    const slugs = matches
        .map(m => m[2])
        .filter((slug, idx, arr) => arr.indexOf(slug) === idx); // dedupe

    console.log(`Found ${slugs.length} countries with dropzones`);
    console.log(slugs);
    return slugs;
}

// Get all DZ slugs from a country page
async function getDZSlugsForCountry(countrySlug) {
    const { data: html } = await axios.get(`${BASE_URL}/dropzones/${countrySlug}`);
    const $ = cheerio.load(html);
    const slugs = [];

    $('a[href^="/dropzones/"]').each((_, el) => {
        const href = $(el).attr('href');
        const parts = href.split('/').filter(Boolean);
        if (parts.length === 3) {
            slugs.push({ countrySlug, dzSlug: parts[2] });
        }
    });

    return slugs;
}

// Scrape a single DZ page
async function scrapeDZ(countrySlug, dzSlug) {
    const url = `${BASE_URL}/dropzones/${countrySlug}/${dzSlug}`;
    try {
        const { data: html } = await axios.get(url);

        const pageData = extractPageData(html);
        const structuredData = extractStructuredData(html);

        if (!pageData || pageData.length === 0) {
            console.warn(`  No page data found for ${dzSlug}`);
            return null;
        }

        const dz = pageData[0];

        return {
            id: dz.id,
            name: dz.name,
            slug: dz.slug,
            latitude: dz.latitude,
            longitude: dz.longitude,
            city: structuredData.city || null,
            state: structuredData.state || null,
            country: structuredData.country || dz.country,
            source: 'scraped',
        };
    } catch (err) {
        console.error(`  Error scraping ${dzSlug}:`, err.message);
        return null;
    }
}

async function main() {
    const results = [];

    try {
        const countrySlugs = await getCountrySlugs();

        for (const countrySlug of countrySlugs) {
            console.log(`\nScraping country: ${countrySlug}`);
            await delay(DELAY_MS);

            let dzSlugs = [];
            try {
                dzSlugs = await getDZSlugsForCountry(countrySlug);
            } catch (err) {
                console.error(`  Error fetching DZs for ${countrySlug}:`, err.message);
                continue;
            }

            console.log(`  Found ${dzSlugs.length} dropzones`);

            for (const { countrySlug: cs, dzSlug } of dzSlugs) {
                console.log(`  Scraping: ${dzSlug}`);
                await delay(DELAY_MS);

                const dz = await scrapeDZ(cs, dzSlug);
                if (dz) {
                    results.push(dz);
                    console.log(`  ✓ ${dz.name} (${dz.latitude}, ${dz.longitude})`);
                }
            }
        }

        fs.writeFileSync('dropzones_v2.json', JSON.stringify(results, null, 2));
        console.log(`\nDone! Scraped ${results.length} dropzones → dropzones_v2.json`);

    } catch (err) {
        console.error('Fatal error:', err.message);
        if (results.length > 0) {
            fs.writeFileSync('dropzones_partial.json', JSON.stringify(results, null, 2));
            console.log(`Saved ${results.length} partial results → dropzones_partial.json`);
        }
    }
}

main();