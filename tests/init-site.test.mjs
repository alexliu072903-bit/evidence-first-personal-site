import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const init = path.join(root, 'scripts', 'init-site.mjs');
const contract = path.join(root, 'tests', 'fixtures', 'contract.json');
const bilingualContract = path.join(root, 'tests', 'fixtures', 'bilingual-contract.json');

test('initializes only the declared foundation contract', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'site-foundation-'));
  const output = path.join(parent, 'site');
  execFileSync(process.execPath, [init, '--contract', contract, '--output', output]);
  const generated = await readFile(path.join(output, 'src', 'site.config.mjs'), 'utf8');
  assert.match(generated, /"projects": true/);
  assert.match(generated, /"writing": false/);
  assert.match(generated, /"skin": null/);
  assert.match(generated, /"copy"/);
  assert.doesNotMatch(generated, /Alex|AirJelly|Cairn/);
});

test('requires complete site copy for every enabled language', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'site-foundation-bilingual-'));
  const output = path.join(parent, 'site');
  execFileSync(process.execPath, [init, '--contract', bilingualContract, '--output', output]);
  const generated = await readFile(path.join(output, 'src', 'site.config.mjs'), 'utf8');
  assert.match(generated, /"zh-CN"/);
  assert.match(generated, /"跳到正文"/);

  const incomplete = JSON.parse(await readFile(bilingualContract, 'utf8'));
  delete incomplete.translations['zh-CN'].labels.currentState;
  const incompletePath = path.join(parent, 'incomplete.json');
  await writeFile(incompletePath, JSON.stringify(incomplete));
  const invalidOutput = path.join(parent, 'invalid-site');
  const result = spawnSync(process.execPath, [init, '--contract', incompletePath, '--output', invalidOutput], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /translations\.zh-CN\.labels\.currentState is required/);
});

test('refuses to overwrite a non-empty directory', async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), 'site-foundation-nonempty-'));
  await writeFile(path.join(output, 'keep.txt'), 'keep');
  const result = spawnSync(process.execPath, [init, '--contract', contract, '--output', output], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not empty/);
  assert.equal(await readFile(path.join(output, 'keep.txt'), 'utf8'), 'keep');
});

test('does not create partial output for an invalid contract', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'site-foundation-invalid-'));
  const output = path.join(parent, 'site');
  const badContract = path.join(parent, 'bad.json');
  await writeFile(badContract, JSON.stringify({ name: 'Missing everything else' }));
  const result = spawnSync(process.execPath, [init, '--contract', badContract, '--output', output], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  await assert.rejects(() => readFile(path.join(output, 'src', 'site.config.mjs')));
});

test('requires an explicit publication decision before building', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'site-foundation-publication-'));
  const output = path.join(parent, 'site');
  execFileSync(process.execPath, [init, '--contract', contract, '--output', output]);
  await writeFile(path.join(output, 'src', 'content', 'projects', 'unclassified.md'), `---\ntitle: Unclassified\n---\n`);
  const verify = path.join(root, 'scripts', 'verify-site.mjs');
  const result = spawnSync(process.execPath, [verify, '--site', output], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing explicit publication/);
});
