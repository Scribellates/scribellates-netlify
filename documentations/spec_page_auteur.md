# Page individuelle d'une œuvre

## Nom Auteur

le nom de l'auteur devra être placé en haut à gauche de la page

## Image et description de l'auteur

L'image de l'auteur doit être placée à gauche de la page, et la description de l'auteur doit être placée à droite de l'image, dans une police plus petite et plus claire que celle du nom de l'auteur.

## Sections customisables

Il doit être possible d'ajouter des sections personnalisées à la page de l'auteur.
Dans le fichier .md de l'auteur, il doit être possible d'ajouter des sections personnalisées, qui seront affichées sous la description de l'auteur.
```markdown
sections:
  - title: Section 1
    content: |
        Contenu de la section 1
  - title: Section 2
    content: |
        Contenu de la section 2
```

## Division gauche de la page (70% de la largeur)

### Liste des œuvres de l'auteur
Il doit être possible d'afficher la liste des œuvres de l'auteur, qui seront affichées sous les sections personnalisées. Les œuvres doivent être affichées sous forme de liste de cards lié à l'oeuvre.
```markdown
oeuvres:
  - titre: Titre de l'œuvre 1
    url: /oeuvres/titre-de-l-oeuvre-1/
  - titre: Titre de l'œuvre 2
    url: /oeuvres/titre-de-l-oeuvre-2/
```

## Division droite de la page (30% de la largeur)

### Dernière actualités de l'auteur
Il doit être possible d'afficher les dernières actualités de l'auteur, qui seront affichées sous le cadre d'informations. Les actualités doivent être affichées sous forme de liste, avec la date de l'actualité et un lien vers l'article correspondant.