import { chromium } from 'playwright';

const url = process.env.URL || 'https://emmanuelos.vercel.app/';
const out = 'public/screenshot-hero.png';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
