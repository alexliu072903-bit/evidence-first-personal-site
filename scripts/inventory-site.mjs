#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

function value(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function fail(message) {
  console.error(`inventory-site: ${message}`);
  process.exit(1);
}

const urlArg = value('--url');
const outArg = value('--out');
const max = Number.parseInt(value('--max') ?? '50', 10);
if (!urlArg || !outArg || !Number.isInteger(max) || max < 1) {
  fail('usage: node scripts/inventory-site.mjs --url <old-site> [--max 50] --out <inventory.json>');
}

let start;
try { start = new URL(urlArg); } catch { fail('url must be absolute'); }
if (!['http:', 'https:'].includes(start.protocol)) fail('url must use http or https');

const origin = start.origin;
const queue = [start.href];
const seen = new Set();
const pages = [];
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  while (queue.length && pages.length < max) {
    const next = queue.shift();
    if (seen.has(next)) continue;
    seen.add(next);
    const response = await page.goto(next, { waitUntil: 'networkidle' });
    if (!response?.ok()) {
      pages.push({ url: next, error: `HTTP ${response?.status() ?? 'unknown'}` });
      continue;
    }
    const record = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      headings: [...document.querySelectorAll('h1,h2,h3')].map((node) => ({ level: node.tagName.toLowerCase(), text: node.textContent?.trim() ?? '' })),
      paragraphs: [...document.querySelectorAll('p')].map((node) => node.textContent?.trim() ?? '').filter(Boolean),
      links: [...document.querySelectorAll('a[href]')].map((link) => ({ text: link.textContent?.trim() ?? '', href: link.href })),
      images: [...document.querySelectorAll('img')].map((image) => ({ src: image.currentSrc || image.src, alt: image.alt })),
    }));
    pages.push({ url: page.url(), ...record });
    for (const link of record.links) {
      const candidate = new URL(link.href, page.url());
      candidate.hash = '';
      if (candidate.origin === origin && !seen.has(candidate.href) && !queue.includes(candidate.href)) queue.push(candidate.href);
    }
  }
} finally {
  await browser.close();
}

const output = path.resolve(outArg);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ source: start.href, capturedAt: new Date().toISOString(), pages }, null, 2)}\n`);
console.log(`Wrote private site inventory with ${pages.length} page(s) to ${output}`);
