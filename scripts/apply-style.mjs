#!/usr/bin/env node

import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

function value(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function fail(message) {
  console.error(`apply-style: ${message}`);
  process.exit(1);
}

async function existing(...candidates) {
  for (const candidate of candidates) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch {}
  }
  return undefined;
}

const kitArg = value('--kit');
const siteArg = value('--site');
if (!kitArg || !siteArg) fail('usage: node scripts/apply-style.mjs --kit <kit.html> --site <dir>');

const kit = path.resolve(kitArg);
const site = path.resolve(siteArg);
const html = await readFile(kit, 'utf8');
const tokens = html.match(/\/\* tokens:start \*\/[\s\S]*?\/\* tokens:end \*\//)?.[0];
if (!tokens) fail('style kit does not contain a complete /* tokens:start */ … /* tokens:end */ block');

const tokenTarget = path.join(site, 'src', 'styles', 'tokens.css');
try { await stat(tokenTarget); } catch { fail(`site is missing ${tokenTarget}`); }
await writeFile(tokenTarget, `${tokens.trim()}\n`);

const kitDirectory = path.dirname(kit);
const light = await existing(
  path.join(kitDirectory, 'hero-template.light.svg'),
  path.join(kitDirectory, 'assets', 'hero-template.light.svg'),
);
const dark = await existing(
  path.join(kitDirectory, 'hero-template.dark.svg'),
  path.join(kitDirectory, 'assets', 'hero-template.dark.svg'),
);
if (!light || !dark) fail('style kit needs hero-template.light.svg and hero-template.dark.svg beside the HTML or in assets/');

const styleTarget = path.join(site, 'public', 'style');
await mkdir(styleTarget, { recursive: true });
await cp(light, path.join(styleTarget, 'hero.light.svg'));
await cp(dark, path.join(styleTarget, 'hero.dark.svg'));

const archiveTarget = path.join(site, 'style-kit');
await rm(archiveTarget, { recursive: true, force: true });
await cp(kitDirectory, archiveTarget, { recursive: true });

console.log(`Applied confirmed style kit to ${site}`);
