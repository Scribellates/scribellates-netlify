import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runDatasets } from './validation/core/datasets.mjs';
import { loadDatasets } from './validation/datasets/index.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');
const datasets = await loadDatasets();

await runDatasets({
  datasets,
  datasetNames: ['oeuvres'],
  projectRoot,
});