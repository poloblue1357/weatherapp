const puppeteer = require('puppeteer');

const BASE_URL = 'https://dropzonefinder.com';

async function getCountrySlugs() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/dropzones`, { waitUntil: 'networkidle2' });

    const slugs = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="/dropzones/"]');
        const found = [];
        links.forEach(link => {
            const parts = link.getAttribute('href').split('/').filter(Boolean);
            if (parts.length === 2 && !found.includes(parts[1])) {
                found.push(parts[1]);
            }
        });
        return found;
    });

    await browser.close();
    console.log(slugs);
    console.log(`Total: ${slugs.length} countries`);
}

getCountrySlugs();