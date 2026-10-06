#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function fail(message) {
  console.error(`init-site: ${message}`);
  process.exitCode = 1;
}

function validateContract(contract) {
  const errors = [];
  if (!contract || typeof contract !== 'object') errors.push('contract must be a JSON object');
  if (!contract?.name?.trim()) errors.push('name is required');
  if (!contract?.description?.trim()) errors.push('description is required');
  if (!contract?.primaryLanguage?.trim()) errors.push('primaryLanguage is required');
  if (!Array.isArray(contract?.languages) || contract.languages.length === 0) {
    errors.push('languages must contain at least the primary language');
  } else if (!contract.languages.includes(contract.primaryLanguage)) {
    errors.push('languages must include primaryLanguage');
  }
  for (const module of ['projects', 'writing', 'about']) {
    if (typeof contract?.modules?.[module] !== 'boolean') errors.push(`modules.${module} must be true or false`);
  }
  if (contract?.modules?.about && !contract?.about?.trim()) errors.push('about is required when modules.about is true');
  if (!['local', 'github-pages'].includes(contract?.deployment?.mode)) {
    errors.push('deployment.mode must be local or github-pages');
  }
  if (contract?.deployment?.mode === 'github-pages') {
    try { new URL(contract.deployment.site); } catch { errors.push('deployment.site must be an absolute URL for github-pages'); }
    if (!contract.deployment.base?.startsWith('/')) errors.push('deployment.base must start with / for github-pages');
  }
  return errors;
}

const contractPath = argument('--contract');
const outputPath = argument('--output');

if (!contractPath || !outputPath) {
  fail('usage: node scripts/init-site.mjs --contract <contract.json> --output <empty-directory>');
} else {
  const absoluteContract = path.resolve(contractPath);
  const absoluteOutput = path.resolve(outputPath);
  let contract;
  try {
    contract = JSON.parse(await readFile(absoluteContract, 'utf8'));
  } catch (error) {
    fail(`cannot read contract: ${error.message}`);
  }

  if (contract) {
    const errors = validateContract(contract);
    if (errors.length) {
      fail(`invalid contract:\n- ${errors.join('\n- ')}`);
    } else {
      let outputExists = false;
      try { outputExists = (await stat(absoluteOutput)).isDirectory(); } catch {}
      if (outputExists && (await readdir(absoluteOutput)).length > 0) {
        fail(`output directory is not empty: ${absoluteOutput}`);
      } else {
        await mkdir(absoluteOutput, { recursive: true });
        await cp(path.join(root, 'assets', 'site-foundation'), absoluteOutput, { recursive: true });
        await mkdir(path.join(absoluteOutput, 'src', 'content', 'projects'), { recursive: true });
        await mkdir(path.join(absoluteOutput, 'src', 'content', 'writing'), { recursive: true });
        const normalized = {
          name: contract.name.trim(),
          description: contract.description.trim(),
          primaryLanguage: contract.primaryLanguage,
          languages: [...new Set(contract.languages)],
          modules: contract.modules,
          about: contract.modules.about ? contract.about.trim() : null,
          resume: contract.resume ?? null,
          deployment: {
            mode: contract.deployment.mode,
            site: contract.deployment.site ?? 'http://localhost:4321',
            base: contract.deployment.base ?? '/',
          },
          skin: null,
        };
        await writeFile(
          path.join(absoluteOutput, 'src', 'site.config.mjs'),
          `// Generated from the user-approved site contract.\nexport default ${JSON.stringify(normalized, null, 2)};\n`,
        );
        console.log(`Initialized site foundation at ${absoluteOutput}`);
      }
    }
  }
}
