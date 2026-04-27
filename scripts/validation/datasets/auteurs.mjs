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
  fileExistsFromWebPathRule,
  httpUrlRule,
  isoDateRule,
  pathPrefixRule,
  trailingSlashForInternalPathRule,
} from '../core/rules.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..', '..', '..');

const assetExistsRule = fileExistsFromWebPathRule({ projectRoot, sourceRoot: 'src' });

const oeuvreSchema = objectField({
  titre: stringField(),
  url: stringField({ validators: [pathPrefixRule('/oeuvres/'), trailingSlashForInternalPathRule] }),
});

const sectionSchema = objectField({
  title: stringField(),
  content: stringField(),
});

const actualiteSchema = objectField({
  titre: stringField(),
  url: stringField({ validators: [pathPrefixRule('/'), trailingSlashForInternalPathRule] }),
  date: stringField({ validators: [isoDateRule] }),
});

const reseauSchema = objectField({
  label: stringField(),
  url: stringField({ validators: [httpUrlRule] }),
  logo: optional(stringField({ validators: [pathPrefixRule('/images/'), assetExistsRule] })),
});

const auteurSchema = objectField({
  nom: stringField(),
  biographie: stringField(),
  image: stringField({ validators: [pathPrefixRule('/images/auteurs/'), assetExistsRule] }),
  oeuvres: arrayField(oeuvreSchema, { minLength: 1 }),
  sections: optional(arrayField(sectionSchema)),
  reseaux: optional(arrayField(reseauSchema, { minLength: 1 })),
  actualites: optional(arrayField(actualiteSchema)),
});

export const auteursDataset = createMarkdownFrontMatterDataset({
  name: 'auteurs',
  directory: path.join(projectRoot, 'src', 'auteurs'),
  includeFile(filePath, fileName) {
    return fileName.endsWith('.md') && !fileName.endsWith('.11tydata.json');
  },
  schema: auteurSchema,
});