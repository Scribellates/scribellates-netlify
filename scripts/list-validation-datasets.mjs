import fs from 'node:fs/promises';

import { datasetNames } from './validation/datasets/index.mjs';

const payload = JSON.stringify(datasetNames);

if (process.argv.includes('--github-output')) {
  const githubOutputPath = process.env.GITHUB_OUTPUT;

  if (!githubOutputPath) {
    console.error('La variable GITHUB_OUTPUT est requise avec --github-output.');
    process.exitCode = 1;
  } else {
    await fs.appendFile(githubOutputPath, `datasets=${payload}\n`, 'utf8');
  }
} else {
  console.log(payload);
}