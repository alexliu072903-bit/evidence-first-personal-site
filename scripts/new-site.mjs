#!/usr/bin/env node

import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allowedLanguages = new Set(['zh-CN', 'en']);
const allowedModules = new Set(['projects', 'writing', 'about']);

function value(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function fail(message) {
  console.error(`new-site: ${message}`);
  process.exit(1);
}

const outputArg = value('--output');
const name = value('--name');
const languageArg = value('--languages');
const moduleArg = value('--modules');
const site = value('--site') ?? 'http://localhost:4321';
const base = value('--base') ?? '/';
const deploy = process.argv.includes('--deploy');

if (!outputArg || !name || !languageArg || !moduleArg) {
  fail('usage: node scripts/new-site.mjs --output <dir> --name <name> --languages zh-CN,en --modules projects,writing,about --site <url> --base <path> [--deploy]');
}

const languages = [...new Set(languageArg.split(',').map((item) => item.trim()).filter(Boolean))];
if (languages.length < 1 || languages.length > 2 || languages.some((language) => !allowedLanguages.has(language))) {
  fail('languages must contain one or both of zh-CN,en');
}
const modules = [...new Set(moduleArg.split(',').map((item) => item.trim()).filter(Boolean))];
if (modules.some((module) => !allowedModules.has(module))) fail('modules may contain only projects,writing,about');
if (!base.startsWith('/')) fail('base must start with /');
try { new URL(site); } catch { fail('site must be an absolute URL'); }

const output = path.resolve(outputArg);
let exists = false;
try { exists = (await stat(output)).isDirectory(); } catch {}
if (exists && (await readdir(output)).length > 0) fail(`output directory is not empty: ${output}`);

await mkdir(output, { recursive: true });
await cp(path.join(root, 'assets', 'site-template'), output, { recursive: true });

const enabled = {
  projects: modules.includes('projects'),
  writing: modules.includes('writing'),
  about: modules.includes('about'),
};

if (!enabled.projects) {
  await rm(path.join(output, 'src', 'pages', 'projects'), { recursive: true, force: true });
  await rm(path.join(output, 'src', 'content', 'projects'), { recursive: true, force: true });
}
if (!enabled.writing) {
  await rm(path.join(output, 'src', 'pages', 'writing'), { recursive: true, force: true });
  await rm(path.join(output, 'src', 'pages', 'rss.xml.js'), { force: true });
  await rm(path.join(output, 'src', 'content', 'writing'), { recursive: true, force: true });
}
if (!enabled.about) await rm(path.join(output, 'src', 'pages', 'about.astro'), { force: true });
if (!deploy) await rm(path.join(output, '.github'), { recursive: true, force: true });

await mkdir(path.join(output, 'src', 'content', 'translations'), { recursive: true });
if (enabled.projects) await mkdir(path.join(output, 'src', 'content', 'projects'), { recursive: true });
if (enabled.writing) await mkdir(path.join(output, 'src', 'content', 'writing'), { recursive: true });

const text = languages.length === 1
  ? JSON.stringify(name)
  : JSON.stringify({ [languages[0]]: name, [languages[1]]: name });
const config = `/** @type {import('./lib/site-types').SiteConfig} */
export default {
  name: ${JSON.stringify(name)},
  description: ${text},
  languages: ${JSON.stringify(languages)},
  modules: ${JSON.stringify(enabled)},
  capabilities: [],
  about: { summary: ${text}, sections: [] },
  deployment: { site: ${JSON.stringify(site)}, base: ${JSON.stringify(base)} },
  style: { hazeLight: 'style/hero.light.svg', hazeDark: 'style/hero.dark.svg' },
};
`;
await writeFile(path.join(output, 'src', 'site.config.mjs'), config);

console.log(`Created v1 site template at ${output}`);
console.log('Next: add evidence-backed content, complete site.config.mjs, confirm a style kit, then run apply-style.mjs.');
