import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createMarkdownFrontMatterDataset } from '../core/datasets.mjs';
import {
  arrayField,
  enumField,
  objectField,
  optional,
  stringField,
} from '../core/schema.mjs';
import {
  fileExistsFromWebPathRule,
  httpUrlRule,
  isoDateRule,
  pathPrefixRule,
} from '../core/rules.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..', '..', '..');

const STATUTS_OEUVRES = [
  'Terminé',
  'En cours',
  'Abandonné',
  'Réécriture',
];

const assetExistsRule = fileExistsFromWebPathRule({ projectRoot, sourceRoot: 'src' });

const lienSchema = objectField({
  label: stringField(),
  url: stringField({ validators: [httpUrlRule] }),
  logo: stringField({ validators: [pathPrefixRule('/images/sites/'), assetExistsRule] }),
});

const sectionSchema = objectField({
  title: stringField(),
  content: stringField(),
});

const suiteSchema = objectField({
  titre: stringField(),
  url: stringField({ validators: [pathPrefixRule('/oeuvres/')] }),
});

const auteurSchema = objectField({
  nom: stringField(),
  url: stringField({ validators: [pathPrefixRule('/auteurs/')] }),
});

const oeuvreSchema = objectField({
  titre: stringField(),
  auteur: auteurSchema,
  description: stringField(),
  statut: enumField(STATUTS_OEUVRES, { caseInsensitive: true }),
  image: stringField({ validators: [pathPrefixRule('/images/covers/'), assetExistsRule] }),
  dateAjout: stringField({ validators: [isoDateRule] }),
  tagsOeuvre: optional(arrayField(stringField())),
  liens: optional(arrayField(lienSchema)),
  sections: optional(arrayField(sectionSchema)),
  suites: optional(arrayField(suiteSchema)),
});

export const oeuvresDataset = createMarkdownFrontMatterDataset({
  name: 'oeuvres',
  directory: path.join(projectRoot, 'src', 'oeuvres'),
  includeFile(filePath, fileName) {
    return fileName.endsWith('.md') && !fileName.endsWith('.11tydata.json');
  },
  schema: oeuvreSchema,
});