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

Cette commande est aussi exécutée par la CI GitHub Actions sur chaque `push` et `pull_request`.

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

# Installation en tant qu’application (PWA)
Ce site intègre une Progressive Web App (PWA), ce qui permet de l’installer et d'y accéder depuis son écran d'accueil que ça soit sur PC comme sur mobile. L’installation crée une icône dédiée, ouvre le site dans une fenêtre indépendante et réagit comme une application native sur mobile ou un logiciel natif sur PC.

## Comment installer selon votre plateforme :

### Chrome (Windows / macOS / Linux)
1. Ouvrir le site.
2. Cliquer sur l’icône Installer l’application dans la barre d’adresse (petit ordinateur avec une flèche).
3. Confirmer l’installation.

### Microsoft Edge
1. Ouvrir le site.
2. Menu … → Applications → Installer ce site en tant qu’application.
3. Valider.

### Android (Chrome/Firefox)
1. Ouvrir le site.
2. Un bandeau Ajouter à l’écran d’accueil peut apparaître automatiquement.
3. Sinon : Menu ⋮ → Installer l’application ou Ajouter à l’écran d’accueil.

### iOS (Safari)
1. Ouvrir le site.
2. Appuyer sur le bouton Partager.
3. Choisir Ajouter à l’écran d’accueil.
*(Safari est obligatoire pour installer une PWA sur iPhone/iPad.)*