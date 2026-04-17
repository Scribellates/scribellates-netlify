# Pipeline de validation des donnees

La validation des donnees est construite autour d'un moteur de schema reutilisable pour des fichiers Markdown avec front matter YAML.

## Commandes disponibles

```bash
npm run validate:data
```

`npm run build` execute automatiquement `npm run validate:data` avant le build Eleventy.

## Structure

- `scripts/validation/core/schema.mjs` : primitives de schema (`stringField`, `objectField`, `arrayField`, `optional`, `enumField`) et moteur de validation recursif.
- `scripts/validation/core/rules.mjs` : regles reutilisables de format (`isoDateRule`, `httpUrlRule`, `pathPrefixRule`, `fileExistsFromWebPathRule`).
- `scripts/validation/core/datasets.mjs` : collecte des fichiers, parsing du front matter, normalisation YAML, execution et rendu console.
- `scripts/validation/datasets/*.mjs` : definition des schemas metier par type de donnees.
- `scripts/validate-data.mjs` : point d'entree generique pour valider tous les datasets ou une selection.

## Ajouter un nouveau type de donnees

### 1. Identifier la source a valider

Choisir le dossier contenant les fichiers du nouveau type de donnees, par exemple `src/articles/`.

Verifier ensuite les points suivants :

- les fichiers sont bien des fichiers Markdown avec front matter YAML ;
- il faut exclure certains fichiers techniques comme des `.11tydata.json` ou des templates ;
- les champs obligatoires et optionnels sont clairement identifies a partir du template de donnees.

### 2. Creer un fichier de dataset

Creer un fichier dans `scripts/validation/datasets/`, par exemple `articles.mjs`.

Ce fichier a deux responsabilites :

- decrire le schema metier des donnees ;
- enregistrer comment trouver les fichiers a valider.

### 3. Construire le schema

Utiliser les briques du moteur de validation dans `scripts/validation/core/schema.mjs` :

- `stringField()` pour un champ texte simple ;
- `objectField({...})` pour un objet ;
- `arrayField(schema)` pour une liste ;
- `optional(schema)` pour marquer un champ optionnel ;
- `enumField([...])` pour une liste fermee de valeurs autorisees.

Ajouter ensuite des regles reutilisables avec `validators`, par exemple :

- `isoDateRule` pour une date `YYYY-MM-DD` ;
- `httpUrlRule` pour une URL externe ;
- `pathPrefixRule('/images/...')` pour imposer un prefixe de chemin ;
- `fileExistsFromWebPathRule(...)` pour verifier qu'un asset reference existe vraiment dans `src/`.

Conseils pratiques :

- commencer par les champs obligatoires, puis ajouter les champs optionnels ;
- extraire les sous-structures repetitives dans des schemas intermediaires comme `authorSchema`, `linkSchema`, `sectionSchema` ;
- garder les noms de schemas alignes sur le vocabulaire metier pour que les erreurs soient plus lisibles.

### 4. Declarer le dataset

Exporter le dataset avec `createMarkdownFrontMatterDataset({...})`.

Les proprietes importantes sont :

- `name` : identifiant du dataset, utilise par le validateur generique ;
- `directory` : dossier racine des fichiers a parcourir ;
- `includeFile(filePath, fileName)` : filtre pour selectionner uniquement les bons fichiers ;
- `schema` : schema principal applique au front matter.

Le `name` doit etre stable et explicite, car il sert aussi si tu veux executer uniquement un dataset via :

```bash
npm run validate:data articles
```

### 5. Enregistrer le dataset dans le registre global

Importer le nouveau dataset dans `scripts/validation/datasets/index.mjs`, puis l'ajouter au tableau `datasets`.

Exemple :

```js
import { articlesDataset } from './articles.mjs';

export const datasets = [
  articlesDataset,
];
```

Sans cette etape, `scripts/validate-data.mjs` ne verra pas le nouveau type de donnees.

### 6. Ajouter un script npm cible si necessaire

Ce n'est pas obligatoire, car `npm run validate:data` valide deja tous les datasets enregistres.

En revanche, si tu veux un point d'entree dedie pour un dataset, tu peux ajouter un script npm du type :

```json
{
  "scripts": {
    "validate:articles": "node ./scripts/validate-data.mjs articles"
  }
}
```

Cela permet de tester plus vite un seul type de donnees pendant le developpement.

### 7. Verifier localement

Executer d'abord la validation ciblee si elle existe, sinon la validation globale :

```bash
npm run validate:data
```

ou :

```bash
npm run validate:data articles
```

Puis verifier que le build complet passe toujours :

```bash
npm run build
```

### 8. Verifier l'integration CI

Le workflow GitHub Actions appelle `npm run validate:data`.

Donc si le dataset est bien ajoute dans `scripts/validation/datasets/index.mjs`, il sera automatiquement couvert par la CI, sans modification supplementaire du workflow.

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