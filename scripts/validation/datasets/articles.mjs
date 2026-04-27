import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createMarkdownFrontMatterDataset } from '../core/datasets.mjs';
import {
  arrayField,
  objectField,
  optional,
  stringField,
} from '../core/schema.mjs';
import {
  isoDateRule,
  pathPrefixRule,
  trailingSlashForInternalPathRule,
} from '../core/rules.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..', '..', '..');

const articleSchema = objectField({
  titre: stringField(),
  datePublication: stringField({ validators: [isoDateRule] }),
  redacteur: stringField(),
  auteurs: optional(arrayField(stringField({ validators: [pathPrefixRule('/auteurs/'), trailingSlashForInternalPathRule] }))),
  oeuvres: optional(arrayField(stringField({ validators: [pathPrefixRule('/oeuvres/'), trailingSlashForInternalPathRule] }))),
});

export const articlesDataset = createMarkdownFrontMatterDataset({
  name: 'articles',
  directory: path.join(projectRoot, 'src', 'articles'),
  includeFile(filePath, fileName) {
    return fileName.endsWith('.md') && !fileName.endsWith('.11tydata.json');
  },
  schema: articleSchema,
  validateEntry({ content }) {
    if (typeof content !== 'string' || content.trim().length === 0) {
      return ['content: corps de l\'article requis'];
    }

    return [];
  },
});
