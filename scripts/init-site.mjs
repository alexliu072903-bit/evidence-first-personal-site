#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const supportedLanguages = new Set(['zh-CN', 'en']);
const labelKeys = [
  'projects', 'writing', 'about', 'resume', 'skipToContent', 'primaryNavigation',
  'siteSections', 'changeLanguage', 'situation', 'contribution', 'currentState',
  'notFound', 'notFoundDescription', 'sourceOpen', 'sourcePrivate', 'sourceMixed',
  'sourceNotApplicable',
];

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
  else if (!supportedLanguages.has(contract.primaryLanguage)) errors.push('primaryLanguage must be zh-CN or en');
  if (!Array.isArray(contract?.languages) || contract.languages.length === 0) {
    errors.push('languages must contain at least the primary language');
  } else if (!contract.languages.includes(contract.primaryLanguage)) {
    errors.push('languages must include primaryLanguage');
  }
  for (const language of contract?.languages ?? []) {
    if (!supportedLanguages.has(language)) errors.push(`unsupported language ${language}; only zh-CN and en are supported`);
  }
  for (const language of Object.keys(contract?.translations ?? {})) {
    if (!supportedLanguages.has(language)) errors.push(`unsupported translation ${language}; only zh-CN and en are supported`);
    if (!contract?.languages?.includes(language)) errors.push(`translations.${language} is present but ${language} is not enabled`);
  }
  for (const module of ['projects', 'writing', 'about']) {
    if (typeof contract?.modules?.[module] !== 'boolean') errors.push(`modules.${module} must be true or false`);
  }
  if (contract?.modules?.about && !contract?.about?.trim()) errors.push('about is required when modules.about is true');
  for (const key of labelKeys) {
    if (!contract?.labels?.[key]?.trim()) errors.push(`labels.${key} is required`);
  }
  for (const language of contract?.languages ?? []) {
    if (language === contract.primaryLanguage) continue;
    const translation = contract?.translations?.[language];
    if (!translation?.description?.trim()) errors.push(`translations.${language}.description is required`);
    if (contract?.modules?.about && !translation?.about?.trim()) errors.push(`translations.${language}.about is required`);
    for (const key of labelKeys) {
      if (!translation?.labels?.[key]?.trim()) errors.push(`translations.${language}.labels.${key} is required`);
    }
  }
  if (!['local', 'github-pages'].includes(contract?.deployment?.mode)) {
    errors.push('deployment.mode must be local or github-pages');
  }
  if (contract?.deployment?.mode === 'github-pages') {
    if (contract.deployment.approved !== true) errors.push('deployment.approved must be true after the owner approves the exact GitHub Pages target');
    try { new URL(contract.deployment.site); } catch { errors.push('deployment.site must be an absolute URL for github-pages'); }
    if (!contract.deployment.base?.startsWith('/')) errors.push('deployment.base must start with / for github-pages');
  }
  if (contract?.resume != null && (typeof contract.resume !== 'string' || !contract.resume.trim())) {
    errors.push('resume must be a non-empty local path or external URL');
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
        if (contract.deployment.mode === 'github-pages') {
          const workflowDirectory = path.join(absoluteOutput, '.github', 'workflows');
          await mkdir(workflowDirectory, { recursive: true });
          await cp(path.join(root, 'assets', 'deployment', 'github-pages.yml'), path.join(workflowDirectory, 'deploy.yml'));
        }
        await mkdir(path.join(absoluteOutput, 'src', 'content', 'projects'), { recursive: true });
        await mkdir(path.join(absoluteOutput, 'src', 'content', 'writing'), { recursive: true });
        const normalized = {
          name: contract.name.trim(),
          primaryLanguage: contract.primaryLanguage,
          languages: [...new Set(contract.languages)],
          modules: contract.modules,
          resume: contract.resume ?? null,
          copy: {
            [contract.primaryLanguage]: {
              description: contract.description.trim(),
              about: contract.modules.about ? contract.about.trim() : null,
              labels: contract.labels,
            },
            ...Object.fromEntries(
              Object.entries(contract.translations ?? {}).map(([language, translation]) => [language, {
                description: translation.description.trim(),
                about: contract.modules.about ? translation.about.trim() : null,
                labels: translation.labels,
              }]),
            ),
          },
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
