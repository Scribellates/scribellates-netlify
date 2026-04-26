---
title: Oeuvres
layout: oeuvres-layout.njk
pagination:
  data: collections.oeuvres
  size: 8
  alias: oeuvresPage
permalink: "/oeuvres/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber | plus: 1 }}/{% endif %}index.html"
---
