# Pipeline de validation des donnees

La validation des donnees est construite autour d'un moteur de schema reutilisable pour des fichiers Markdown avec front matter YAML.

## Commandes disponibles

```bash
npm run validate:data
npm run validate:oeuvres
node ./scripts/validate-data.mjs oeuvres
```

`npm run build` execute automatiquement `npm run validate:data` avant le build Eleventy.

## Structure

- `scripts/validation/core/schema.mjs` : primitives de schema (`stringField`, `objectField`, `arrayField`, `optional`, `enumField`) et moteur de validation recursif.
- `scripts/validation/core/rules.mjs` : regles reutilisables de format (`isoDateRule`, `httpUrlRule`, `pathPrefixRule`, `fileExistsFromWebPathRule`).
- `scripts/validation/core/datasets.mjs` : collecte des fichiers, parsing du front matter, normalisation YAML, execution et rendu console.
- `scripts/validation/datasets/manifest.mjs` : registre des types de donnees et chargement paresseux des schemas.
- `scripts/validation/datasets/*.mjs` : definition des schemas metier par type de donnees.
- `scripts/validate-data.mjs` : point d'entree generique pour valider tous les datasets ou une selection.
- `scripts/validate-oeuvres.mjs` : point d'entree cible pour les oeuvres.
- `scripts/list-validation-datasets.mjs` : expose la liste des datasets pour la CI GitHub Actions.

## CI GitHub

Le workflow GitHub Actions est defini dans `.github/workflows/validate-data.yml`.

Il est organise en deux etapes :

1. Une etape de decouverte puis de validation par type de donnees, avec un job distinct par dataset.
2. Une etape finale automatique qui execute la validation globale sur tous les datasets apres succes des jobs specifiques.

Pour les oeuvres, la validation couvre maintenant aussi l'existence physique des fichiers images references par `image` et `liens[].logo` dans `src/`.

## Ajouter un nouveau type de donnees

1. Creer un fichier dans `scripts/validation/datasets/`, par exemple `articles.mjs`.
2. Declarer un schema avec les briques du moteur.
3. Exporter un dataset avec `createMarkdownFrontMatterDataset({...})`.
4. L'ajouter a `scripts/validation/datasets/index.mjs`.
5. Lancer `npm run validate:data`.

Exemple minimal :

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createMarkdownFrontMatterDataset } from '../core/datasets.mjs';
import { objectField, stringField } from '../core/schema.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..', '..', '..');

const articleSchema = objectField({
  titre: stringField(),
  slug: stringField(),
});

export const articlesDataset = createMarkdownFrontMatterDataset({
  name: 'articles',
  directory: path.join(projectRoot, 'src', 'articles'),
  includeFile(filePath, fileName) {
    return fileName.endsWith('.md');
  },
  schema: articleSchema,
});
```