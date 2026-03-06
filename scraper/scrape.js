const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://dropzonefinder.com';
const DELAY_MS = 1500;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Full list of all country slugs from the site's data
const ALL_COUNTRY_SLUGS = [
    'afghanistan','albania','algeria','andorra','angola','antigua-and-barbuda',
    'argentina','armenia','australia','austria','azerbaijan','bahamas','bahrain',
    'bangladesh','barbados','belarus','belgium','belize','benin','bhutan','bolivia',
    'bosnia-and-herzegovina','botswana','brazil','brunei','bulgaria','burkina-faso',
    'burundi','cambodia','cameroon','canada','cape-verde','central-african-republic',
    'chad','chile','china','colombia','comoros','congo','costa-rica','croatia','cuba',
    'cyprus','czech-republic','denmark','djibouti','dominica','dominican-republic',
    'ecuador','egypt','el-salvador','equatorial-guinea','eritrea','estonia','eswatini',
    'ethiopia','fiji','finland','france','gabon','gambia','georgia','germany','ghana',
    'greece','grenada','guatemala','guinea','guinea-bissau','guyana','haiti','holy-see',
    'honduras','hungary','iceland','india','indonesia','iran','iraq','ireland','israel',
    'italy','jamaica','japan','jordan','kazakhstan','kenya','kiribati','kosovo','kuwait',
    'kyrgyzstan','laos','latvia','lebanon','lesotho','liberia','libya','liechtenstein',
    'lithuania','luxembourg','macedonia','madagascar','malawi','malaysia','maldives',
    'mali','malta','marshall-islands','mauritania','mauritius','mexico','micronesia',
    'moldova','monaco','mongolia','montenegro','morocco','mozambique','myanmar',
    'namibia','nauru','nepal','netherlands','new-zealand','nicaragua','niger','nigeria',
    'north-korea','norway','oman','pakistan','palau','palestine-state','panama',
    'papua-new-guinea','paraguay','peru','philippines','poland','portugal','qatar',
    'romania','russia','rwanda','saint-kitts-and-nevis','saint-lucia',
    'saint-vincent-and-the-grenadines','samoa','san-marino','sao-tome-and-principe',
    'saudi-arabia','senegal','serbia','seychelles','sierra-leone','singapore',
    'slovakia','slovenia','solomon-islands','somalia','south-africa','south-korea',
    'south-sudan','spain','sri-lanka','sudan','suriname','sweden','switzerland',
    'syria','tajikistan','tanzania','thailand','timor-leste','togo','tonga',
    'trinidad-and-tobago','tunisia','turkey','turkmenistan','tuvalu','uganda',
    'ukraine','united-arab-emirates','united-kingdom','united-states','uruguay',
    'uzbekistan','vanuatu','venezuela','vietnam','yemen','zambia','zimbabwe'
];

function extractPageData(html) {
    const $ = cheerio.load(html);

    // Try meta tag first (individual DZ pages use this)
    const metaContent = $('meta[name="application/ld+json"]').attr('content');
    if (metaContent) {
        try {
            const parsed = JSON.parse(metaContent);
            const entries = Array.isArray(parsed) ? parsed : [parsed];
            const business = entries.find(e => e.geo);
            if (business) return [business];
        } catch {}
    }

    // Fallback: inline script tags
    let result = null;
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).html());
            const entries = Array.isArray(json) ? json : [json];
            const business = entries.find(e => e.geo);
            if (business && !result) result = [business];
        } catch {}
    });

    return result;
}

function extractStructuredData(html) {
    const $ = cheerio.load(html);
    let result = {};

    // Try meta tag first
    const metaContent = $('meta[name="application/ld+json"]').attr('content');
    if (metaContent) {
        try {
            const parsed = JSON.parse(metaContent);
            const entries = Array.isArray(parsed) ? parsed : [parsed];
            const business = entries.find(e => e.geo);
            if (business) {
                result.telephone = business.telephone || null;
                result.email = business.email || null;
                // website is in sameAs array, not url (url is the dropzonefinder page)
                result.url = (business.sameAs && business.sameAs[0]) || null;
                result.latitude = business.geo?.latitude || null;
                result.longitude = business.geo?.longitude || null;
                if (business.address) {
                    result.city = business.address.addressLocality || null;
                    result.state = business.address.addressRegion || null;
                    result.country = business.address.addressCountry || null;
                }
                return result;
            }
        } catch {}
    }

    // Fallback: inline script tags
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).html());
            const entries = Array.isArray(json) ? json : [json];
            const business = entries.find(e => e.geo);
            if (business && !result.latitude) {
                result.telephone = business.telephone || null;
                result.email = business.email || null;
                result.url = (business.sameAs && business.sameAs[0]) || null;
                result.latitude = business.geo?.latitude || null;
                result.longitude = business.geo?.longitude || null;
                if (business.address) {
                    result.city = business.address.addressLocality || null;
                    result.state = business.address.addressRegion || null;
                    result.country = business.address.addressCountry || null;
                }
            }
        } catch {}
    });

    return result;
}

async function getCountrySlugsFromPage() {
    console.log('Launching browser to fetch country list...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/dropzones`, { waitUntil: 'networkidle2' });
    const html = await page.content();
    await browser.close();

    const matches = [...html.matchAll(/\\"slug\\":\\"([a-z-]+)\\"/g)];
    return matches
        .map(m => m[1])
        .filter((slug, idx, arr) => arr.indexOf(slug) === idx);
}

// Use Puppeteer for JS-rendered country pages
async function getDZSlugsForCountry(countrySlug, usePuppeteer = false) {
    let html;

    if (usePuppeteer) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(`${BASE_URL}/dropzones/${countrySlug}`, { waitUntil: 'networkidle2' });
        html = await page.content();
        await browser.close();
    } else {
        const { data } = await axios.get(`${BASE_URL}/dropzones/${countrySlug}`);
        html = data;
    }

    const $ = cheerio.load(html);
    const slugs = [];
    $('a[href^="/dropzones/"]').each((_, el) => {
        const href = $(el).attr('href');
        const parts = href.split('/').filter(Boolean);
        if (parts.length === 3) slugs.push({ countrySlug, dzSlug: parts[2] });
    });

    // If axios got nothing, retry with Puppeteer
    if (!usePuppeteer && slugs.length === 0) {
        console.log(`  No DZs found via axios for ${countrySlug}, retrying with Puppeteer...`);
        return getDZSlugsForCountry(countrySlug, true);
    }

    return slugs;
}

async function scrapeDZ(countrySlug, dzSlug) {
    const url = `${BASE_URL}/dropzones/${countrySlug}/${dzSlug}`;
    try {
        const { data: html } = await axios.get(url);
        const sd = extractStructuredData(html);

        if (!sd.latitude || !sd.longitude) {
            console.warn(`  No structured data found for ${dzSlug}`);
            return null;
        }

        // Get name from page title as fallback
        const $ = cheerio.load(html);
        const titleText = $('title').text().split('|')[0].trim();

        return {
            id: dzSlug, // use slug as id since there's no UUID in static HTML
            name: titleText || dzSlug,
            slug: dzSlug,
            latitude: sd.latitude,
            longitude: sd.longitude,
            city: sd.city || null,
            state: sd.state || null,
            country: sd.country || countrySlug,
            telephone: sd.telephone || null,
            email: sd.email || null,
            website: sd.url || null,
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
        const slugsFromPage = await getCountrySlugsFromPage();

        // Merge: start with page slugs, then add any from the full list that are missing
        const missingFromPage = ALL_COUNTRY_SLUGS.filter(s => !slugsFromPage.includes(s));
        const allSlugs = [...slugsFromPage, ...missingFromPage];

        console.log(`Slugs from page: ${slugsFromPage.length}`);
        console.log(`Missing from page (added manually): ${missingFromPage.length}`);
        console.log('Missing:', missingFromPage);
        console.log(`Total to scrape: ${allSlugs.length}`);

        for (const countrySlug of allSlugs) {
            console.log(`\nScraping country: ${countrySlug}`);
            await delay(DELAY_MS);

            let dzSlugs = [];
            try {
                dzSlugs = await getDZSlugsForCountry(countrySlug);
            } catch (err) {
                console.error(`  Error fetching DZs for ${countrySlug}:`, err.message);
                continue;
            }

            if (dzSlugs.length === 0) {
                console.log(`  No dropzones found, skipping.`);
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