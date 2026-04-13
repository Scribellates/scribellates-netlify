# Page individuelle d'une œuvre

## Division gauche de la page (70% de la largeur)

### Titre

Le titre devra être le premier élément de la page, placé en haut à gauche

### Description

La description de l'œuvre doit être affichée sous le titre, dans une police plus petite et plus claire que celle du titre.

### Sections customisables

Il doit être possible d'ajouter des sections personnalisées à la page de l'œuvre.
Dans le fichier .md de l'oeuvre, il doit être possible d'ajouter des sections personnalisées, qui seront affichées sous la description de l'œuvre.
```markdown
sections:
  - title: Section 1
    content: |
        Contenu de la section 1
  - title: Section 2
    content: |
        Contenu de la section 2
```

### Liens de lecture
Il doit être possible d'ajouter des liens de lecture à la page de l'œuvre, qui seront affichés sous les sections personnalisées.
```markdown
liens:
  - label: Lire sur Scribellates
    url: https://scribellates.com/oeuvres/lumen-fortuna
  - label: Lire sur Wattpad
    url: https://www.wattpad.com/story/123456789-lumen-fortuna
```

## Division droite de la page (30% de la largeur)

### Cadre d'informations
Le cadre d'informations doit être placé en haut à droite de la page, et doit contenir les informations suivantes :
- Couverture de l'œuvre
- Auteur
- Statut
- Suites (si l'œuvre en a)
- Date d'ajout à la plateforme

### Dernière actualités de l'œuvre
Il doit être possible d'afficher les dernières actualités de l'œuvre, qui seront affichées sous le cadre d'informations. Les actualités doivent être affichées sous forme de liste, avec la date de l'actualité et un lien vers l'article correspondant.