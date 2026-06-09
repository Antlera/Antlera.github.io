---
layout: default
permalink: /blog/
title: playground
description: thoughts, songs on rotation, and a wall of photos — my corner of the web.
nav: true
nav_order: 4
netease_playlist_id: "436513472" # 网易云 playlist id — "Antlera喜欢的音乐" (music.163.com/playlist?id=XXXX)
---

<style>
  /* This page's hero has no portrait, so opt out of the two-column hero grid. */
  .bebop-hero.bebop-hero--plain {
    display: block;
    text-align: center;
  }
  .bebop-hero.bebop-hero--plain .hero-title {
    transform: rotate(-1deg);
  }

  .pg-tagline {
    font-family: "Caveat", "Reenie Beanie", cursive;
    color: var(--bebop-brick);
    font-size: 1.35rem;
    line-height: 1;
    margin-bottom: 0.35rem;
    transform: rotate(-2deg);
    display: inline-block;
  }
</style>

<div class="bebop-page">

  <section class="bebop-hero bebop-hero--plain" style="padding: 3.5rem 0 1.5rem;">
    <div class="hero-eyebrow">♪ playground</div>
    <h1 class="hero-title" style="font-size: clamp(3.4rem, 11vw, 7rem); margin-bottom: 0;">
      a <span class="accent">playground</span>.
    </h1>
  </section>

  <section class="bebop-section">
    <div class="pg-tagline">a working mind</div>
    {% include bebop_section_rule.liquid title="thoughts" id="thoughts" %}
    {% include bebop_writing.liquid %}
  </section>

  <section class="bebop-section">
    <div class="pg-tagline">a waking rhythm</div>
    {% include bebop_section_rule.liquid title="songs I'm listening to" id="songs" %}
    {% include bebop_songs.liquid %}
  </section>

  <section class="bebop-section">
    <div class="pg-tagline">a walking player</div>
    {% include bebop_section_rule.liquid title="photo wall" id="photos" %}
    {% include bebop_photo_wall.liquid %}
  </section>

</div>
