#!/usr/bin/env node

import { createServer } from 'node:http';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const widths = [1440, 1100, 768, 375, 320];

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

function mimeType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

async function startServer(dist, base) {
  const normalizedBase = base === '/' ? '/' : `/${base.replace(/^\//, '').replace(/\/$/, '')}/`;
  const server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (normalizedBase !== '/') {
        if (!pathname.startsWith(normalizedBase)) {
          response.writeHead(404).end('Not found');
          return;
        }
        pathname = pathname.slice(normalizedBase.length);
      } else {
        pathname = pathname.replace(/^\//, '');
      }
      let target = path.resolve(dist, pathname);
      if (!target.startsWith(path.resolve(dist))) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      try {
        if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      } catch {
        if (pathname === '' || pathname.endsWith('/')) target = path.join(target, 'index.html');
      }
      const body = await readFile(target);
      response.writeHead(200, { 'content-type': mimeType(target) }).end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return { server, origin: `http://127.0.0.1:${address.port}`, base: normalizedBase };
}

function routeFromFile(dist, file) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '';
  if (relative === '404.html') return null;
  return relative.replace(/index\.html$/, '');
}

const siteArg = argument('--site');
if (!siteArg) {
  console.error('browser-qa: usage: node scripts/browser-qa.mjs --site <site-directory>');
  process.exit(1);
}

const site = path.resolve(siteArg);
const verify = spawnSync(process.execPath, [path.join(skillRoot, 'scripts', 'verify-site.mjs'), '--site', site], { stdio: 'inherit' });
if (verify.status !== 0) process.exit(verify.status ?? 1);

const configPath = path.join(site, 'src', 'site.config.mjs');
const config = (await import(`${pathToFileURL(configPath).href}?qa=${Date.now()}`)).default;
const dist = path.join(site, 'dist');
const routes = (await walk(dist))
  .filter((file) => file.endsWith('.html'))
  .map((file) => routeFromFile(dist, file))
  .filter((route) => route !== null);
const reportDirectory = path.join(site, 'qa');
const screenshotDirectory = path.join(reportDirectory, 'screenshots');
await mkdir(screenshotDirectory, { recursive: true });

const issues = [];
const captures = [];
const { server, origin, base } = await startServer(dist, config.deployment.base);
const browser = await chromium.launch({ headless: true });

try {
  for (const width of widths) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const pageIssues = [];
      page.on('pageerror', (error) => pageIssues.push(`page error: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') pageIssues.push(`console error: ${message.text()}`);
      });
      const url = `${origin}${base}${route}`;
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      if (!response?.ok()) pageIssues.push(`HTTP ${response?.status() ?? 'unknown'}`);

      const checks = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.getAttribute('src')),
      }));
      if (checks.overflow > 1) pageIssues.push(`horizontal overflow: ${checks.overflow}px`);
      for (const image of checks.brokenImages) pageIssues.push(`broken image: ${image}`);

      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const element = document.activeElement;
        if (!element || element === document.body) return { target: null, visible: false };
        const style = getComputedStyle(element);
        return {
          target: element.tagName.toLowerCase(),
          visible: (style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none',
        };
      });
      if (!focus.target) pageIssues.push('Tab did not move focus to an interactive element');
      else if (!focus.visible) pageIssues.push(`focus indicator is not visible on ${focus.target}`);

      const screenshotName = `${width}-${route === '' ? 'home' : route.replace(/\/$/, '').replaceAll('/', '-')}.png`;
      const screenshotPath = path.join(screenshotDirectory, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      captures.push(path.relative(site, screenshotPath));
      for (const issue of pageIssues) issues.push({ route: `/${route}`, width, issue });
      await page.close();
    }
  }

  if (config.languages.length > 1) {
    for (const language of config.languages.filter((value) => value !== config.primaryLanguage)) {
      for (const route of routes) {
        const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
        const url = `${origin}${base}${route}?lang=${encodeURIComponent(language)}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        const languageChecks = await page.evaluate((expectedLanguage) => {
          const missingText = [...document.querySelectorAll('[data-localized]')]
            .filter((node) => !node.hasAttribute('data-localized-optional'))
            .filter((node) => !JSON.parse(node.dataset.translations || '{}')[expectedLanguage])
            .map((node) => node.outerHTML.slice(0, 180));
          const missingAttributes = [...document.querySelectorAll('[data-localized-attribute]')]
            .filter((node) => !JSON.parse(node.dataset.attributeTranslations || '{}')[expectedLanguage])
            .map((node) => node.outerHTML.slice(0, 180));
          const badLinks = [...document.querySelectorAll('a[href]')]
            .map((link) => new URL(link.href, window.location.href))
            .filter((url) => url.origin === window.location.origin && !url.hash && url.searchParams.get('lang') !== expectedLanguage)
            .map((url) => url.pathname);
          const primaryVisible = [...document.querySelectorAll('[data-primary-only]')]
            .some((node) => getComputedStyle(node).display !== 'none');
          return {
            documentLanguage: document.documentElement.lang,
            missingText,
            missingAttributes,
            badLinks,
            primaryVisible,
          };
        }, language);
        if (languageChecks.documentLanguage !== language) issues.push({ route: `/${route}`, width: 375, issue: `document language stayed ${languageChecks.documentLanguage}` });
        for (const node of languageChecks.missingText) issues.push({ route: `/${route}`, width: 375, issue: `missing ${language} text: ${node}` });
        for (const node of languageChecks.missingAttributes) issues.push({ route: `/${route}`, width: 375, issue: `missing ${language} attribute: ${node}` });
        for (const link of languageChecks.badLinks) issues.push({ route: `/${route}`, width: 375, issue: `internal link lost ${language}: ${link}` });
        if (languageChecks.primaryVisible) issues.push({ route: `/${route}`, width: 375, issue: `primary-only long content is visible in ${language}` });
        const screenshotName = `375-${language}-${route === '' ? 'home' : route.replace(/\/$/, '').replaceAll('/', '-')}.png`;
        const screenshotPath = path.join(screenshotDirectory, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        captures.push(path.relative(site, screenshotPath));
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const report = {
  result: issues.length === 0 ? 'passed' : 'failed',
  widths,
  routes: routes.map((route) => `/${route}`),
  languages: config.languages,
  captures,
  issues,
};
await writeFile(path.join(reportDirectory, 'browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (issues.length) {
  console.error(`browser-qa: failed with ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue.route} at ${issue.width}px: ${issue.issue}`);
  process.exit(1);
}

console.log(`browser-qa: passed (${routes.length} routes × ${widths.length} widths)`);
