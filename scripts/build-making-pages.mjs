import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(await readFile(path.join(root, 'public/data/projects.json'), 'utf8'));
const stories = JSON.parse(await readFile(path.join(root, 'public/data/game-stories.json'), 'utf8'));
const destination = path.join(root, 'public/making');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const asset = value => escape('/' + String(value).replace(/^\.\//, ''));
const stamp = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

function comparison(project) {
  const data = project.comparison;
  if (!data?.before || !data?.after) return '';
  return `<section class="guide-section" id="iteration"><p class="eyebrow">an iteration you can see</p><h2>the space between versions.</h2><figure class="comparison"><div class="comparison-stage" style="--comparison-position:50%"><img class="comparison-after" src="${asset(data.after)}" alt="${escape(project.title)}: ${escape(data.afterLabel || 'Current version')}" loading="lazy"><img class="comparison-before" src="${asset(data.before)}" alt="${escape(project.title)}: ${escape(data.beforeLabel || 'Earlier version')}" loading="lazy"><div class="comparison-labels"><span>${escape(data.beforeLabel || 'Earlier version')}</span><span>${escape(data.afterLabel || 'Current version')}</span></div><span class="comparison-divider" aria-hidden="true">↔</span><input class="comparison-range" type="range" min="0" max="100" value="50" aria-label="Compare earlier and current ${escape(project.title)}"></div><figcaption>${escape(data.caption)} Drag the handle, or use the arrow keys.</figcaption></figure></section>`;
}

function reel(project) {
  if (!project.video && !project.image) return '';
  if (!project.video) return `<figure class="guide-media"><img src="${asset(project.image)}" alt="${escape(project.title)} prototype screenshot" width="1280" height="720"><figcaption>A frame from the prototype.</figcaption></figure>`;
  const chapters = project.reel?.chapters || [];
  return `<figure class="guide-media"><video id="game-reel" controls muted playsinline preload="metadata" poster="${asset(project.videoPoster || project.image)}" aria-label="${escape(project.title)} gameplay reel"><source src="${asset(project.video)}" type="video/mp4"></video><figcaption>a few moments in play · ${Math.round(project.reel?.duration || 12)} seconds · silent reel</figcaption>${chapters.length ? `<div class="reel-chapters" role="group" aria-label="Reel chapters">${chapters.map((chapter, index) => `<button type="button" data-time="${Number(chapter.time)}" aria-label="Watch ${escape(chapter.title)}"><span>${String(index + 1).padStart(2, '0')}</span>${escape(chapter.title)}</button>`).join('')}</div><details class="reel-description"><summary>what’s in this reel</summary><ol>${chapters.map(chapter => `<li><span>${stamp(chapter.time)}</span><strong>${escape(chapter.title)}</strong>${chapter.description ? `<p>${escape(chapter.description)}</p>` : ''}</li>`).join('')}</ol></details>` : ''}</figure>`;
}

await mkdir(destination, { recursive: true });
// This directory is generated exclusively by this script.
for (const entry of await readdir(destination)) await rm(path.join(destination, entry), { recursive: true, force: true });
const games = projects.filter(project => project.category === 'Games' && stories[project.id]);
const selectedIds = ['moonbite', 'pocket-gods', 'cloudline-chaos', 'slime-rangers', 'impossible-lab'];
const selected = selectedIds.map(id => games.find(project => project.id === id));
for (const project of games) {
  const story = stories[project.id];
  const index = selectedIds.indexOf(project.id);
  const next = selected[index < 0 ? 1 : (index + 1) % selected.length];
  const previous = selected[index < 0 ? 0 : (index + selected.length - 1) % selected.length];
  const isDownload = /\.(zip|exe|dmg)(?:[?#]|$)/i.test(project.url || '');
  const url = project.url ? /^https?:/.test(project.url) ? escape(project.url) : asset(project.url) : '';
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#142b49"><title>${escape(project.title)} — the making of · Ian Gavilan</title><meta name="description" content="${escape(story.approach)}"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="preload" href="/assets/fonts/patrick-hand.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/notebook-guide.css"><script type="module" src="/assets/notebook-guide.js"></script></head>
<body><a class="skip-link" href="#the-build">Skip to the build story</a><header class="guide-header"><a href="/#project=${encodeURIComponent(project.id)}">← back to the notebook</a><a href="/#about">ian gavilan</a></header>
<main class="guide-shell"><section class="guide-opening"><p class="eyebrow">a page from the making of / ${escape(project.status)}</p><h1>${escape(project.title)}</h1><p class="guide-summary">${escape(project.summary)}</p><nav class="guide-index" aria-label="On this page"><a href="#the-question">the curiosity</a><a href="#the-build">the build</a>${project.comparison ? '<a href="#iteration">the iteration</a>' : ''}<a href="#the-practice">the practice</a></nav></section>
${reel(project)}
<section class="guide-section curiosity" id="the-question"><p class="eyebrow">01 / the question behind it</p><h2>${escape(story.question)}</h2><p>${escape(story.approach)}</p></section>
<section class="guide-section" id="the-build"><div class="section-opening"><p class="eyebrow">02 / from idea to something playable</p><h2>how the pieces came together.</h2></div><ol class="build-steps">${story.steps.map((step, i) => `<li><span class="step-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><h3>${escape(step.title)}</h3><p>${escape(step.body)}</p></div></li>`).join('')}</ol></section>
${comparison(project)}
<section class="guide-section" id="the-practice"><p class="eyebrow">03 / the skills in the work</p><h2>what this helped me practice.</h2><p>${escape(story.practice)}</p><ul class="skills" aria-label="Skills practiced">${story.skills.map(skill => `<li>${escape(skill)}</li>`).join('')}</ul><div class="reflection"><h3>a note on the process.</h3><p>${escape(story.reflection)}</p></div></section>
<section class="guide-section project-state"><p class="eyebrow">where the project stands</p><p>${escape(story.scope)}</p><div class="project-actions">${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${isDownload ? 'download the prototype ↓' : project.status === 'Private prototype' ? 'open the private prototype ↗' : 'play the game ↗'}<span class="sr-only"> (opens in a new tab)</span></a>` : ''}${project.sourceUrl ? `<a href="${escape(project.sourceUrl)}" target="_blank" rel="noopener noreferrer">view the source ↗<span class="sr-only"> (opens in a new tab)</span></a>` : ''}<a href="/#project=${encodeURIComponent(project.id)}">back to the project ↖</a></div></section>
<nav class="other-stories" aria-label="More game stories"><a href="/making/${previous.id}/"><span>← previous page</span>${escape(previous.title)}</a><a href="/making/${next.id}/"><span>next page →</span>${escape(next.title)}</a></nav></main><footer class="guide-footer"><a href="/">ian's notebook</a><span>always making something.</span></footer></body></html>`;
  const dir = path.join(destination, project.id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), page);
}
console.log(`Prepared ${games.length} game making-of pages.`);
