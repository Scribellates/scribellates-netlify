# Installations 

## INSTALLER LE PROJET
```
git clone https://github.com/Scribellates/scribellates-netlify-static.git
cd scribellates-netlify-static
```

## INSTALLER LES DÉPENDANCES
```
npm install
```

## GÉNÉRER LE SITE
```
npm run build
```

## VALIDER LES DONNÉES
```
npm run validate:data
```

## VALIDER UNIQUEMENT LES ŒUVRES
```
npm run validate:oeuvres
```

Le build exécute automatiquement la validation des données avant Eleventy.

## LANCER LE SERVEUR DE DÉVELOPPEMENT
```
npm run dev
```

# Structure du projet

## Dossiers 

- `src/` : Contient les fichiers sources du projet, y compris les pages, les styles et les composants.
- `public/` : Contient les fichiers statiques qui seront copiés tels quels dans le dossier de distribution.
- `documentations/` : Contient les fichiers de directions de conception.
- `scripts/validation/` : Contient le moteur de validation réutilisable pour les jeux de données Markdown/front matter.

# Wireframes

![liens wireframes](https://www.figma.com/design/hMWDt2JdikfHJ5dFyrFmVY/Sans-titre?node-id=0-1&t=FS7Gd3u4PIl83a0o-1)