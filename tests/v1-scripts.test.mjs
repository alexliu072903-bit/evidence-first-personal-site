import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = path.join(root, 'scripts');

test('new-site creates the selected modules and refuses non-empty targets', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'v1-new-site-'));
  const output = path.join(parent, 'site');
  execFileSync(process.execPath, [
    path.join(scripts, 'new-site.mjs'),
    '--output', output,
    '--name', 'Test Person',
    '--languages', 'en',
    '--modules', 'projects,about',
    '--site', 'https://example.github.io',
    '--base', '/profile',
  ]);
  const config = await readFile(path.join(output, 'src', 'site.config.mjs'), 'utf8');
  assert.match(config, /"writing":false/);
  assert.match(config, /base: "\/profile"/);
  await assert.rejects(() => readFile(path.join(output, 'src', 'pages', 'writing', 'index.astro')));
  await assert.rejects(() => readFile(path.join(output, '.github', 'workflows', 'deploy.yml')));
  const refused = spawnSync(process.execPath, [
    path.join(scripts, 'new-site.mjs'),
    '--output', output,
    '--name', 'Again',
    '--languages', 'en',
    '--modules', 'about',
  ], { encoding: 'utf8' });
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /not empty/);
});

test('apply-style transfers the exact token block, haze files, and archive', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'v1-style-'));
  const kit = path.join(parent, 'kit');
  const site = path.join(parent, 'site');
  await mkdir(path.join(kit, 'assets'), { recursive: true });
  await mkdir(path.join(site, 'src', 'styles'), { recursive: true });
  await writeFile(path.join(site, 'src', 'styles', 'tokens.css'), 'old');
  const tokenBlock = '/* tokens:start */\n:root { --color-ink: #123456; }\n/* tokens:end */';
  await writeFile(path.join(kit, 'index.html'), `<style>${tokenBlock}</style>`);
  await writeFile(path.join(kit, 'assets', 'hero-template.light.svg'), '<svg id="light"/>');
  await writeFile(path.join(kit, 'assets', 'hero-template.dark.svg'), '<svg id="dark"/>');
  execFileSync(process.execPath, [path.join(scripts, 'apply-style.mjs'), '--kit', path.join(kit, 'index.html'), '--site', site]);
  assert.equal((await readFile(path.join(site, 'src', 'styles', 'tokens.css'), 'utf8')).trim(), tokenBlock);
  assert.match(await readFile(path.join(site, 'public', 'style', 'hero.light.svg'), 'utf8'), /light/);
  assert.match(await readFile(path.join(site, 'style-kit', 'index.html'), 'utf8'), /tokens:start/);
});

test('check-site reports a broken internal link and an empty translation', async () => {
  const site = await mkdtemp(path.join(os.tmpdir(), 'v1-broken-site-'));
  await mkdir(path.join(site, 'src', 'content', 'projects'), { recursive: true });
  await mkdir(path.join(site, 'src', 'content', 'writing'), { recursive: true });
  await writeFile(path.join(site, 'package.json'), JSON.stringify({ type: 'module', scripts: { build: 'node build.mjs' } }));
  await writeFile(path.join(site, 'src', 'site.config.mjs'), `export default { name: 'Test', languages: ['zh-CN','en'], deployment: { base: '/' } };`);
  await writeFile(path.join(site, 'build.mjs'), `import { mkdir, writeFile } from 'node:fs/promises'; await mkdir('dist',{recursive:true}); await writeFile('dist/index.html','<main><p data-t="">中文</p><a href="/missing/">broken</a></main>');`);
  const result = spawnSync(process.execPath, [path.join(scripts, 'check-site.mjs'), '--site', site], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /translation: empty secondary-language field/);
  assert.match(result.stderr, /internal-link: target is missing from dist/);
});

test('inventory-site rejects a non-http source before browser work', () => {
  const result = spawnSync(process.execPath, [path.join(scripts, 'inventory-site.mjs'), '--url', 'file:///tmp/site', '--out', '/tmp/inventory.json'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /http or https/);
});
