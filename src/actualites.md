---
title: Actualites
layout: articles-layout.njk
pagination:
  data: collections.articlesByPublication
  size: 9
  alias: articlesPage
permalink: "/actualites/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber | plus: 1 }}/{% endif %}index.html"
---
