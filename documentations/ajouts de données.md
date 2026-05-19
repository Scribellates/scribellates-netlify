# TEMPLATES
les templates sont des fichiers markdown avec des champs pré-remplis, qui servent de base pour créer de nouveaux articles ou fiches d'oeuvres. Ils sont situés dans le dossier `templates` à la racine du projet.
Les données commençant par un astérisque sont des champs optionnels, qui peuvent être laissés vides ou supprimés si ils ne sont pas pertinents pour l'article, l'oeuvre ou l'auteur que vous voulez ajouter.

# COMMENT AJOUTER DE NOUVELLES DONNEES
## Oeuvre

créez un fichier dans src/oeuvres/[nom oeuvre].md en suivant le [template suivant](/templates/oeuvres.md)

## Article

créez un fichier dans src/articles/[article].md en suivant le [template suivant](/templates/articles.md)

Merci de garder un nom de fichier court mais indicatif pour faciliter la navigation et la maintenance du projet, pas besoin que le nom soit le titre de l'article entier.

## Auteur

créez un fichier dans src/auteurs/[nom auteur].md en suivant le [template suivant](/templates/auteurs.md)

# VALIDATION DES DONNEES
Toutes les données ajoutées doivent être validées pour s'assurer qu'elles respectent les formats attendus et éviter les erreurs sur le site. Pour cela, nous avons mis en place une pipeline de validation qui vérifie les données à chaque fois qu'elles sont ajoutées ou modifiées.

Plus d'informations sur la validation des données dans la documentation dédiée : [Validation pipeline](/documentations/validation-pipeline.md)