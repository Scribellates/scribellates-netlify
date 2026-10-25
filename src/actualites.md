---
title: Posts
layout: articles-layout.njk
pagination:
  data: collections.articlesByPublication
  size: 8
  alias: articlesPage
permalink: "/posts/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber | plus: 1 }}/{% endif %}index.html"
---
