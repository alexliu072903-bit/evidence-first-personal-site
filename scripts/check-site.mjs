#!/usr/bin/env node

import { createServer } from 'node:http';
import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

function value(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function exists(target) {
  try { await access(target); return true; } catch { return false; }
}

async function walk(directory) {
  if (!(await exists(directory))) return [];
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

function routeFromFile(dist, file) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '';
  if (relative === '404.html') return null;
  return relative.replace(/index\.html$/, '');
}

function mimeType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
  if (file.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

async function startServer(dist, base) {
  const normalizedBase = base === '/' ? '/' : `/${base.replace(/^\//, '').replace(/\/$/, '')}/`;
  const server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (normalizedBase !== '/') {
        if (!pathname.startsWith(normalizedBase)) return response.writeHead(404).end('Not found');
        pathname = pathname.slice(normalizedBase.length);
      } else pathname = pathname.replace(/^\//, '');
      let target = path.resolve(dist, pathname);
      const relative = path.relative(dist, target);
      if (relative.startsWith('..') || path.isAbsolute(relative)) return response.writeHead(403).end('Forbidden');
      try { if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html'); }
      catch { if (pathname === '' || pathname.endsWith('/')) target = path.join(target, 'index.html'); }
      response.writeHead(200, { 'content-type': mimeType(target) }).end(await readFile(target));
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, origin: `http://127.0.0.1:${server.address().port}`, base: normalizedBase };
}

const siteArg = value('--site');
if (!siteArg) {
  console.error('check-site: usage: node scripts/check-site.mjs --site <dir> [--browser] [--external]');
  process.exit(1);
}

const site = path.resolve(siteArg);
const runBrowser = process.argv.includes('--browser');
const checkExternal = process.argv.includes('--external');
const issues = [];
const reportDirectory = path.join(site, 'qa');
await mkdir(reportDirectory, { recursive: true });

const build = spawnSync('npm', ['run', 'build'], { cwd: site, stdio: 'inherit' });
if (build.status !== 0) {
  issues.push({ type: 'build', message: 'production build failed' });
} else {
  const configPath = path.join(site, 'src', 'site.config.mjs');
  const config = (await import(`${pathToFileURL(configPath).href}?check=${Date.now()}`)).default;
  const dist = path.join(site, 'dist');
  const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));
  const base = config.deployment.base === '/' ? '/' : `/${config.deployment.base.replace(/^\//, '').replace(/\/$/, '')}/`;
  const external = new Set();

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');
    if (config.languages.length > 1 && /data-t(?:-[\w-]+)?=""/.test(html)) {
      issues.push({ type: 'translation', file: path.relative(site, htmlFile), message: 'empty secondary-language field' });
    }
    for (const match of html.matchAll(/(?:href|src|data-t-href|data-t-src)="([^"]+)"/g)) {
      const raw = match[1].replaceAll('&amp;', '&');
      if (/^(?:mailto:|tel:|data:|#)/.test(raw)) continue;
      if (/^https?:\/\//.test(raw)) {
        external.add(raw);
        continue;
      }
      let pathname = raw.split(/[?#]/)[0];
      if (base !== '/' && pathname.startsWith(base)) pathname = pathname.slice(base.length);
      else pathname = pathname.replace(/^\//, '');
      let target = path.join(dist, pathname);
      if (pathname === '' || pathname.endsWith('/')) target = path.join(target, 'index.html');
      if (!(await exists(target))) issues.push({ type: 'internal-link', file: path.relative(site, htmlFile), value: raw, message: 'target is missing from dist' });
    }
  }

  for (const collection of ['projects', 'writing']) {
    for (const file of (await walk(path.join(site, 'src', 'content', collection))).filter((item) => /\.mdx?$/.test(item))) {
      const source = await readFile(file, 'utf8');
      if (!/^publication:\s*['"]?draft['"]?\s*$/m.test(source)) continue;
      const id = path.basename(file).replace(/\.mdx?$/, '');
      if (await exists(path.join(dist, collection, id, 'index.html'))) {
        issues.push({ type: 'draft-leak', file: path.relative(site, file), message: `draft route exists in dist/${collection}/${id}` });
      }
    }
  }

  if (checkExternal) {
    for (const url of external) {
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        if (!response.ok) issues.push({ type: 'external-link', value: url, message: `HEAD returned ${response.status}` });
      } catch (error) {
        issues.push({ type: 'external-link', value: url, message: error.message });
      }
    }
  }

  if (runBrowser) {
    const screenshotDirectory = path.join(reportDirectory, 'screenshots');
    await mkdir(screenshotDirectory, { recursive: true });
    const routes = htmlFiles.map((file) => routeFromFile(dist, file)).filter((route) => route !== null);
    const { server, origin, base: serverBase } = await startServer(dist, config.deployment.base);
    const browser = await chromium.launch({ headless: true });
    try {
      for (const width of [1440, 375]) {
        for (const route of routes) {
          const page = await browser.newPage({ viewport: { width, height: 900 } });
          const pageIssues = [];
          page.on('pageerror', (error) => pageIssues.push(`page error: ${error.message}`));
          page.on('console', (message) => { if (message.type() === 'error') pageIssues.push(`console error: ${message.text()}`); });
          const primaryUrl = new URL(`${origin}${serverBase}${route}`);
          primaryUrl.searchParams.set('lang', config.languages[0]);
          await page.goto(primaryUrl.href, { waitUntil: 'networkidle' });
          const primaryState = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
          }));
          if (primaryState.overflow > 1) pageIssues.push(`horizontal overflow: ${primaryState.overflow}px`);
          for (const image of primaryState.brokenImages) pageIssues.push(`broken image: ${image}`);

          await page.keyboard.press('Tab');
          const focusVisible = await page.evaluate(() => {
            const element = document.activeElement;
            if (!element || element === document.body) return false;
            const style = getComputedStyle(element);
            return (style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none';
          });
          if (!focusVisible) pageIssues.push('real Tab focus is not visible');

          await page.screenshot({ path: path.join(screenshotDirectory, `${width}-${route === '' ? 'home' : route.replace(/\/$/, '').replaceAll('/', '-')}-primary.png`), fullPage: true });

          if (config.languages.length > 1) {
            await page.locator('[data-language-toggle]').click();
            const secondaryLanguage = config.languages[1];
            const switched = await page.evaluate(({ expected, name, primaryLanguage }) => {
              const main = (document.querySelector('main')?.innerText || '').replaceAll(name, '');
              const chinese = (main.match(/[\u3400-\u9fff]/g) || []).join('');
              const englishRun = main.match(/(?:[A-Za-z][A-Za-z'-]*\s+){3}[A-Za-z][A-Za-z'-]*/)?.[0] || '';
              const badLinks = [...document.querySelectorAll('a[href]')]
                .map((link) => new URL(link.href, location.href))
                .filter((url) => url.origin === location.origin && !url.hash && url.searchParams.get('lang') !== expected)
                .map((url) => url.pathname);
              return {
                lang: document.documentElement.lang,
                chinese: primaryLanguage === 'zh-CN' ? chinese : '',
                englishRun: primaryLanguage === 'en' ? englishRun : '',
                badLinks,
                title: document.title,
                expectedTitle: document.documentElement.dataset.titleSecondary,
              };
            }, { expected: secondaryLanguage, name: config.name, primaryLanguage: config.languages[0] });
            if (switched.lang !== secondaryLanguage) pageIssues.push(`document lang stayed ${switched.lang}`);
            if (switched.chinese) pageIssues.push(`Chinese remained after switch: ${switched.chinese.slice(0, 40)}`);
            if (switched.englishRun) pageIssues.push(`English remained after switch: ${switched.englishRun}`);
            for (const link of switched.badLinks) pageIssues.push(`internal link lost ?lang=${secondaryLanguage}: ${link}`);
            if (switched.expectedTitle && switched.title !== switched.expectedTitle) pageIssues.push('document title did not switch');
            await page.screenshot({ path: path.join(screenshotDirectory, `${width}-${route === '' ? 'home' : route.replace(/\/$/, '').replaceAll('/', '-')}-secondary.png`), fullPage: true });
          }

          for (const message of pageIssues) issues.push({ type: 'browser', route: `/${route}`, width, message });
          await page.close();
        }
      }
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

const report = { result: issues.length === 0 ? 'passed' : 'failed', issues };
await writeFile(path.join(reportDirectory, 'check-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (issues.length) {
  console.error(`check-site: failed with ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue.type}: ${issue.message}${issue.value ? ` (${issue.value})` : ''}`);
  process.exit(1);
}
console.log('check-site: passed');
