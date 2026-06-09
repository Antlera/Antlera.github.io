---
layout: default
permalink: /blog/
title: playground
description: thoughts, songs on rotation, and a wall of photos — my corner of the web.
nav: true
nav_order: 4
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

  .pg-tracklist {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .pg-track {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.4rem 0;
    border-bottom: 1px dotted var(--bebop-edge);
  }
  .pg-track-n {
    width: 1.4rem;
    flex: none;
    text-align: right;
    font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
    font-size: 0.8rem;
    color: var(--bebop-ink-soft);
  }
  .pg-track-cover {
    flex: none;
    position: relative;
    line-height: 0;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  }
  .pg-track-cover img {
    width: 44px;
    height: 44px;
    object-fit: cover;
    display: block;
  }
  .pg-track-play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.42);
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  /* show the play affordance only for playable tracks */
  .pg-track[data-yt] { cursor: pointer; }
  .pg-track[data-yt]:hover .pg-track-play,
  .pg-track.is-playing .pg-track-play {
    opacity: 1;
  }
  .pg-track.is-playing .pg-track-title {
    color: var(--bebop-brick);
  }
  .pg-track.is-playing .pg-track-play {
    background: rgba(178, 58, 72, 0.55);
  }
  .pg-track-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
    text-decoration: none;
    line-height: 1.3;
  }
  .pg-track-title {
    color: var(--bebop-ink);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pg-track-artist {
    color: var(--bebop-ink-soft);
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pg-track:hover .pg-track-title {
    color: var(--bebop-brick);
  }
  .pg-songs-more {
    display: inline-block;
    margin-top: 0.9rem;
    font-size: 0.85rem;
    color: var(--bebop-ink-soft);
    text-decoration: none;
  }
  .pg-songs-more:hover {
    color: var(--bebop-brick);
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
