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
  isoDateRule,
  pathPrefixRule,
} from '../core/rules.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..', '..', '..');

const assetExistsRule = fileExistsFromWebPathRule({ projectRoot, sourceRoot: 'src' });

const oeuvreSchema = objectField({
  titre: stringField(),
  url: stringField({ validators: [pathPrefixRule('/oeuvres/')] }),
});

const sectionSchema = objectField({
  title: stringField(),
  content: stringField(),
});

const actualiteSchema = objectField({
  titre: stringField(),
  url: stringField({ validators: [pathPrefixRule('/')] }),
  date: stringField({ validators: [isoDateRule] }),
});

const auteurSchema = objectField({
  nom: stringField(),
  biographie: stringField(),
  image: stringField({ validators: [pathPrefixRule('/images/auteurs/'), assetExistsRule] }),
  oeuvres: arrayField(oeuvreSchema, { minLength: 1 }),
  sections: optional(arrayField(sectionSchema)),
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