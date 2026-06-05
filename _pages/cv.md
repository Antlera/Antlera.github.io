---
layout: page
permalink: /cv/
title: cv
nav: true
nav_order: 5
description: the canonical CV lives in a single PDF — this page is just a doorway to it.
---

<script>
  // Fast path: shoot straight to the PDF in real browsers.
  if (typeof window !== "undefined") {
    window.location.replace("{{ '/assets/pdf/CV.pdf' | relative_url }}");
  }
</script>

<p style="margin-top: 2rem; font-style: italic; opacity: 0.7;">
  Redirecting to <a href="{{ '/assets/pdf/CV.pdf' | relative_url }}">CV.pdf</a>…
</p>
