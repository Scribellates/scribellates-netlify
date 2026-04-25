---
title: Auteurs
layout: auteurs-layout.njk
pagination:
  data: collections.auteurs
  size: 12
  alias: auteursPage
permalink: "/auteurs/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber | plus: 1 }}/{% endif %}index.html"
---
