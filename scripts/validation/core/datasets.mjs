import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

import { validateSchema } from './schema.mjs';

function normalizeFrontMatterValue(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeFrontMatterValue(item));
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, normalizeFrontMatterValue(entryValue)]),
    );
  }

  return value;
}

async function collectFiles(rootDirectory, includeFile) {
  const entries = await fs.readdir(rootDirectory, { withFileTypes: true });
  const discoveredFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      discoveredFiles.push(...await collectFiles(fullPath, includeFile));
      continue;
    }

    if (includeFile(fullPath, entry.name)) {
      discoveredFiles.push(fullPath);
    }
  }

  return discoveredFiles.sort((left, right) => left.localeCompare(right, 'fr'));
}

function createParseError(filePath, error) {
  const details = error instanceof Error ? error.message : String(error);
  return {
    filePath,
    errors: [`front matter invalide: ${details}`],
  };
}

export function createMarkdownFrontMatterDataset(config) {
  return {
    ...config,
    async validate() {
      const files = await collectFiles(config.directory, config.includeFile);
      const results = [];

      for (const filePath of files) {
        let source;
        try {
          source = await fs.readFile(filePath, 'utf8');
        } catch (error) {
          results.push({
            filePath,
            errors: [`lecture impossible: ${error instanceof Error ? error.message : String(error)}`],
          });
          continue;
        }

        let parsed;
        try {
          parsed = matter(source);
        } catch (error) {
          results.push(createParseError(filePath, error));
          continue;
        }

        const normalizedData = normalizeFrontMatterValue(parsed.data);
        const errors = validateSchema(config.schema, normalizedData);

        if (typeof config.validateEntry === 'function') {
          const customErrors = config.validateEntry({
            filePath,
            data: normalizedData,
            content: parsed.content,
            parsed,
          });

          if (Array.isArray(customErrors) && customErrors.length > 0) {
            errors.push(...customErrors);
          }
        }

        if (errors.length > 0) {
          results.push({ filePath, errors });
        }
      }

      return {
        name: config.name,
        directory: config.directory,
        scannedFiles: files.length,
        invalidFiles: results.length,
        results,
      };
    },
  };
}

function printDatasetResult(datasetResult, projectRoot) {
  if (datasetResult.invalidFiles === 0) {
    console.log(`[OK] ${datasetResult.name}: ${datasetResult.scannedFiles} fichier(s) valide(s)`);
    return;
  }

  console.error(`[ERROR] ${datasetResult.name}: ${datasetResult.invalidFiles} fichier(s) invalide(s) sur ${datasetResult.scannedFiles}`);

  for (const result of datasetResult.results) {
    const relativeFilePath = path.relative(projectRoot, result.filePath).split(path.sep).join('/');
    console.error(`  - ${relativeFilePath}`);
    for (const error of result.errors) {
      console.error(`    * ${error}`);
    }
  }
}

export async function runDatasets({ datasets, datasetNames, projectRoot }) {
  const selectedDatasets = datasetNames.length === 0
    ? datasets
    : datasets.filter((dataset) => datasetNames.includes(dataset.name));

  const unknownDatasetNames = datasetNames.filter(
    (datasetName) => !datasets.some((dataset) => dataset.name === datasetName),
  );

  if (unknownDatasetNames.length > 0) {
    console.error(`Jeux de données inconnus: ${unknownDatasetNames.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  if (selectedDatasets.length === 0) {
    console.error('Aucun jeu de données sélectionné.');
    process.exitCode = 1;
    return;
  }

  let hasErrors = false;
  for (const dataset of selectedDatasets) {
    const result = await dataset.validate(projectRoot);
    printDatasetResult(result, projectRoot);
    hasErrors ||= result.invalidFiles > 0;
  }

  if (hasErrors) {
    process.exitCode = 1;
    return;
  }

  console.log(`Validation terminée pour ${selectedDatasets.length} jeu(x) de données.`);
}