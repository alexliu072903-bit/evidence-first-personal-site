#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function exists(target) {
  try { await access(target); return true; } catch { return false; }
}

async function markdownFiles(directory) {
  if (!(await exists(directory))) return [];
  return (await readdir(directory)).filter((name) => /\.mdx?$/.test(name));
}

async function filesRecursively(directory) {
  const files = [];
  for (const name of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, name.name);
    if (name.isDirectory()) files.push(...await filesRecursively(target));
    else files.push(target);
  }
  return files;
}

async function classifiedEntries(directory, failures) {
  const entries = { public: [], draft: [] };
  for (const name of await markdownFiles(directory)) {
    const source = await readFile(path.join(directory, name), 'utf8');
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? '';
    const publication = frontmatter.match(/^publication:\s*['"]?(public|draft)['"]?\s*$/m)?.[1];
    if (!publication) failures.push(`${path.join(directory, name)}: missing explicit publication: public or publication: draft`);
    else entries[publication].push(name.replace(/\.mdx?$/, ''));
  }
  return entries;
}

const siteArg = argument('--site');
if (!siteArg) {
  console.error('verify-site: usage: node scripts/verify-site.mjs --site <site-directory>');
  process.exit(1);
}

const site = path.resolve(siteArg);
const failures = [];
const configPath = path.join(site, 'src', 'site.config.mjs');
if (!(await exists(configPath))) {
  console.error(`verify-site: missing ${configPath}`);
  process.exit(1);
}

const config = (await import(`${pathToFileURL(configPath).href}?verify=${Date.now()}`)).default;
for (const module of ['projects', 'writing']) {
  const entries = await classifiedEntries(path.join(site, 'src', 'content', module), failures);
  if (config.modules[module] && entries.public.length === 0) {
    failures.push(`${module} is enabled but has no public entries`);
  }
}

if (failures.length === 0) {
  const build = spawnSync('npm', ['run', 'build'], { cwd: site, stdio: 'inherit' });
  if (build.status !== 0) failures.push('production build failed');
}

if (failures.length === 0) {
  const dist = path.join(site, 'dist');
  const expected = [
    ['home', true, path.join(dist, 'index.html')],
    ['projects', config.modules.projects, path.join(dist, 'projects', 'index.html')],
    ['writing', config.modules.writing, path.join(dist, 'writing', 'index.html')],
    ['about', config.modules.about, path.join(dist, 'about', 'index.html')],
  ];
  for (const [name, enabled, target] of expected) {
    const present = await exists(target);
    if (enabled && !present) failures.push(`${name} route is declared but missing: ${target}`);
    if (!enabled && present) failures.push(`${name} route is disabled but was generated: ${target}`);
  }

  const htmlFiles = (await filesRecursively(dist)).filter((file) => file.endsWith('.html'));
  const base = config.deployment.base === '/' ? '/' : `${config.deployment.base.replace(/\/$/, '')}/`;
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      if (/^(?:https?:|mailto:|tel:|#|data:)/.test(value)) continue;
      let pathname = value.split(/[?#]/)[0];
      if (base !== '/' && pathname.startsWith(base)) pathname = pathname.slice(base.length);
      else pathname = pathname.replace(/^\//, '');
      let target = path.join(dist, pathname);
      if (pathname === '' || pathname.endsWith('/')) target = path.join(target, 'index.html');
      if (!(await exists(target))) failures.push(`${path.relative(site, htmlFile)}: broken local reference ${value}`);
    }
  }
}

if (failures.length) {
  console.error(`verify-site: failed\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('verify-site: passed');
