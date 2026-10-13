import { setupOpening, setupMusic, violaCharacter, bookCharacter, comparison } from './experience.js';
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const categories = ['All', 'Web', 'Apps', 'Games', 'Creative', 'Research'];
const state = { projects: [], category: 'All', query: '', liveOnly: false, limit: 12, lastTrigger: null };
const dialog = $('#project-dialog');
const list = $('#project-list');
const preview = $('#hover-preview');
let renderTimer;
const previewPlayers = new Set();
const mediaObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) {
    const player = [...previewPlayers].find(item => item.frame === entry.target);
    if (player) { player.visible = entry.isIntersecting; syncPreview(player); }
  }
}, { threshold: .12 }) : null;

function syncPreview(player) {
  const shouldPlay = document.documentElement.classList.contains('loaded') && player.visible && !player.userPaused && !dialog.open && !document.hidden && (!reducedMotion || player.userStarted);
  if (shouldPlay) {
    if (!player.video.src) player.video.src = player.source;
    player.video.play().catch(() => { player.button.textContent = 'Play preview ▷'; });
  } else player.video.pause();
}
const characterObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) entry.target.dataset.running = String(entry.isIntersecting && !reducedMotion);
}, { rootMargin: '40px' }) : null;

function watchCharacter(character) {
  character.dataset.running = String(!characterObserver && !reducedMotion);
  characterObserver?.observe(character);
  return character;
}

function discardCharacterObservers(container) {
  $$('.project-character', container).forEach(character => characterObserver?.unobserve(character));
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function projectStatus(project) {
  const label = String(project.status || (project.url ? 'Live' : 'Project'));
  const lower = label.toLowerCase();
  const className = lower.includes('live') || lower.includes('ready') ? 'status-live' : lower.includes('progress') || lower.includes('prototype') ? 'status-progress' : 'status-source';
  return { label, className };
}

function statusElement(project) {
  const { label, className } = projectStatus(project);
  return element('span', `status ${className}`, label);
}

function fallbackArt(project) {
  const fallback = element('div', 'feature-fallback');
  fallback.setAttribute('aria-hidden', 'true');
  const initials = project.title.split(/\s+/).slice(0, 2).map(word => word[0]).join('');
  fallback.append(element('span', '', initials), element('em', '', project.category));
  return fallback;
}

function projectCharacter(project) {
  if (project.id === 'off-the-page') return watchCharacter(violaCharacter());
  if (project.id === 'the-red-archive') return watchCharacter(bookCharacter());
  if (project.mascotSheet) {
    const sprite = element('span', 'project-character sprite-character');
    sprite.setAttribute('aria-hidden', 'true');
    sprite.style.setProperty('--sprite-duration', `${1.15 + (String(project.id).length % 4) * .12}s`);
    const fallback = projectCharacter({ ...project, mascotSheet: '' });
    fallback.classList.add('sprite-fallback');
    sprite.append(fallback);
    const sheet = new Image();
    sheet.onload = () => {
      discardCharacterObservers(sprite);
      sprite.replaceChildren();
      sprite.style.backgroundImage = `url("${project.mascotSheet}")`;
      sprite.classList.add('sprite-ready');
    };
    sheet.src = project.mascotSheet;
    return watchCharacter(sprite);
  }
  if (project.mascot) {
    const image = element('img', 'project-character');
    image.src = project.mascot;
    image.alt = '';
    image.decoding = 'async';
    image.addEventListener('error', () => image.replaceWith(pixelCharacter(project)), { once: true });
    return image;
  }
  return pixelCharacter(project);
}

function pixelCharacter(project) {
  // Each project has a deterministic face, silhouette, accessory, and nine-pixel emblem.
  // These small drawings are decorative; no borrowed game characters or external assets.
  let seed = 2166136261;
  for (const letter of project.id) seed = Math.imul(seed ^ letter.charCodeAt(0), 16777619) >>> 0;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 40 40');
  svg.setAttribute('class', 'project-character');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.dataset.character = project.id;
  const navy = '#123c80', white = '#f0faff', pale = '#afd9ff', blue = '#438dde';
  let drawingRoot = svg;
  const group = (className, draw) => {
    const node = document.createElementNS(ns, 'g');
    node.setAttribute('class', className);
    const previous = drawingRoot;
    drawingRoot.append(node);
    drawingRoot = node;
    draw();
    drawingRoot = previous;
  };
  const rect = (x, y, width, height, fill = white) => {
    const node = document.createElementNS(ns, 'rect');
    Object.entries({ x, y, width, height, fill }).forEach(([key, value]) => node.setAttribute(key, String(value)));
    drawingRoot.append(node);
  };
  const box = (x, y, width, height, fill = pale) => { rect(x, y, width, height, navy); rect(x + 1, y + 1, width - 2, height - 2, fill); };
  const legs = (x, y) => {
    group('pixel-foot pixel-foot-left', () => { box(x, y, 4, 5); rect(x - 1, y + 4, 6, 2, navy); });
    group('pixel-foot pixel-foot-right', () => { box(x + 12, y, 4, 5); rect(x + 12, y + 4, 6, 2, navy); });
  };
  const face = (x, y) => {
    group('pixel-eyes', () => { rect(x, y, 2, seed % 3 === 0 ? 1 : 3, navy); rect(x + 9, y, 2, 3, navy); });
    rect(x + 4, y + 5, 4, 1, navy); rect(x + 3, y + 4, 1, 1, navy); rect(x + 8, y + 4, 1, 1, navy);
  };
  if (project.category === 'Games') {
    legs(12, 31); box(9, 19, 22, 13); box(7, 11, 25, 12, pale);
    box(9, 6, 8, 9, white); box(23, 6, 8, 9, white);
    group('pixel-eyes', () => { rect(12, 8, 2, 4, navy); rect(26, 8, 2, 4, navy); }); rect(14, 18, 11, 1, navy);
    box(13, 24, 14, 7, white);
    group('pixel-sword', () => { rect(31, 9, 2, 17, navy); rect(33, 5, 3, 17, white); rect(34, 3, 2, 3, navy); rect(29, 22, 7, 2, navy); });
  } else if (project.category === 'Web') {
    legs(12, 29); box(6, 8, 27, 22, white); rect(7, 9, 25, 5, blue); rect(7, 14, 25, 1, navy);
    rect(9, 10, 2, 2); rect(13, 10, 2, 2); rect(17, 10, 2, 2); face(13, 18);
    box(2, 20, 4, 7); group('pixel-arm', () => box(33, 16 + seed % 4, 4, 7));
  } else if (project.category === 'Apps') {
    legs(12, 31); box(11, 22, 18, 11, blue); box(8, 7, 24, 16, white);
    group('pixel-antenna', () => { rect(19, 2, 2, 6, navy); box(17, 0, 6, 4, pale); }); face(14, 11);
    box(5, 24, 6, 5); group('pixel-arm', () => { box(29, 21, 5, 6); box(33, 13, 3, 13, white); rect(31, 11, 7, 3, navy); rect(33, 9, 3, 2, blue); });
  } else if (project.category === 'Research') {
    box(9, 10, 22, 23); rect(9, 6, 5, 7, navy); rect(26, 6, 5, 7, navy); rect(10, 8, 3, 5); rect(27, 8, 3, 5);
    box(10, 13, 9, 9, white); box(21, 13, 9, 9, white); group('pixel-eyes', () => { rect(14, 16, 2, 3, navy); rect(24, 16, 2, 3, navy); }); rect(19, 21, 2, 3, navy);
    group('pixel-arm', () => box(30, 23, 5, 8, pale));
    box(7, 27, 13, 8, white); box(20, 27, 13, 8, white); rect(11, 29, 6, 1, blue); rect(23, 31, 6, 1, blue); rect(12, 35, 4, 2, navy); rect(25, 35, 4, 2, navy);
  } else {
    box(10, 7, 20, 23, white); rect(8, 13, 2, 20, navy); rect(30, 13, 2, 20, navy); rect(10, 30, 5, 4, white); rect(17, 30, 6, 6, white); rect(25, 30, 5, 4, white);
    face(14, 15); group('pixel-arm', () => box(4, 23, 6, 6)); group('pixel-sword', () => { rect(33, 14, 2, 19, navy); box(31, 8, 6, 8, pale); rect(33, 5, 2, 3, navy); });
  }
  // ID-specific pixel emblem makes each little inhabitant distinct, even within a category.
  const emblemY = project.category === 'Web' ? 29 : project.category === 'Research' ? 7 : 25;
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) if ((seed >>> (x + y * 3 + 5)) & 1) rect(17 + x * 2, emblemY + y, 1, 1, seed % 2 ? navy : blue);
  const sparkX = seed % 2 ? 3 : 35;
  rect(sparkX, 3 + seed % 5, 1, 5); rect(sparkX - 2, 5 + seed % 5, 5, 1);
  svg.style.setProperty('--motion-delay', `${-(seed % 5000) / 1000}s`);
  svg.style.setProperty('--motion-duration', `${1.4 + seed % 9 / 10}s`);
  return watchCharacter(svg);
}

function projectImage(project, eager = false) {
  if (!project.image) return fallbackArt(project);
  const image = element('img');
  image.src = project.image;
  image.alt = `${project.title} project preview`;
  image.loading = eager ? 'eager' : 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => image.replaceWith(fallbackArt(project)), { once: true });
  return image;
}

function featuredMedia(project, eager) {
  const media = element('div', 'feature-media');
  const visual = element('button', 'feature-visual');
  visual.type = 'button';
  visual.setAttribute('aria-label', `View ${project.title} project details`);
  visual.addEventListener('click', () => openProject(project, visual));
  const frame = element('span', 'preview-frame');
  frame.append(projectImage(project, eager));
  const arrow = element('span', 'feature-open', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  visual.append(frame, arrow);
  media.append(visual);
  if (project.video) {
    const video = element('video', 'project-preview-video');
    video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    if (project.image) video.poster = project.image;
    const button = element('button', 'preview-control', 'Play preview ▷');
    button.type = 'button';
    button.setAttribute('aria-label', `Play preview of ${project.title}`);
    const player = { frame, video, button, source: project.video, visible: !mediaObserver, userPaused: false, userStarted: false };
    previewPlayers.add(player);
    video.addEventListener('loadeddata', () => video.classList.add('ready'));
    video.addEventListener('play', () => { button.textContent = 'Pause preview Ⅱ'; button.setAttribute('aria-label', `Pause preview of ${project.title}`); });
    video.addEventListener('pause', () => { button.textContent = 'Play preview ▷'; button.setAttribute('aria-label', `Play preview of ${project.title}`); });
    video.addEventListener('error', () => { video.remove(); button.remove(); previewPlayers.delete(player); mediaObserver?.unobserve(frame); });
    button.addEventListener('click', () => {
      player.userPaused = !video.paused;
      player.userStarted = true;
      syncPreview(player);
    });
    frame.append(video);
    media.append(button);
    mediaObserver?.observe(frame);
    if (!mediaObserver) syncPreview(player);
  }
  return media;
}

function dialogMedia(project) {
  if (!project.video) return projectImage(project, true);
  const video = element('video', 'dialog-video');
  video.src = project.video;
  video.controls = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  if (project.image) video.poster = project.image;
  video.setAttribute('aria-label', `${project.title} gameplay preview`);
  video.addEventListener('error', () => video.replaceWith(projectImage(project, true)), { once: true });
  return video;
}

function externalLink(url, label, className = '') {
  const link = element('a', className, label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `${label} (opens in a new tab)`);
  return link;
}

function renderFeatured() {
  for (const player of previewPlayers) { player.video.pause(); mediaObserver?.unobserve(player.frame); }
  previewPlayers.clear();
  const preferred = ['impossible-lab', 'the-red-archive', 'theory-studio', 'neighbor-ready', 'off-the-page'];
  const selected = preferred.map(id => state.projects.find(project => project.id === id)).filter(Boolean);
  const featured = selected.length ? selected : state.projects.filter(project => project.image && project.url).slice(0, 5);
  const fragment = document.createDocumentFragment();
  featured.forEach((project, index) => {
    const article = element('article', 'featured-project');
    article.dataset.projectId = project.id;
    const mascot = element('div', 'feature-mascot');
    const mascotButton = element('button');
    mascotButton.type = 'button';
    mascotButton.setAttribute('aria-label', `Meet ${project.title}`);
    mascotButton.append(projectCharacter(project));
    mascotButton.addEventListener('click', () => openProject(project, mascotButton));
    mascot.append(mascotButton);
    const visual = featuredMedia(project, index === 0);
    const body = element('div', 'feature-body');
    const caption = element('div', 'feature-caption');
    const details = element('button', 'feature-detail');
    details.type = 'button';
    details.append(element('h3', '', project.title));
    details.setAttribute('aria-label', `Take a closer look at ${project.title}`);
    details.addEventListener('click', () => openProject(project, details));
    caption.append(element('span', 'feature-index', `0${index + 1} /`), details);
    const actions = element('div', 'feature-actions');
    if (project.url) actions.append(externalLink(project.url, project.category === 'Games' ? 'Play ↗' : 'Explore ↗'));
    const more = element('button', '', 'Project notes +');
    more.type = 'button'; more.addEventListener('click', () => openProject(project, more));
    actions.append(more);
    body.append(caption, element('p', 'feature-summary', project.summary), actions);
    article.append(mascot, visual, body);
    fragment.append(article);
  });
  discardCharacterObservers($('#featured-work'));
  $('#featured-work').replaceChildren(fragment);
}

function renderFilters() {
  const fragment = document.createDocumentFragment();
  categories.forEach(category => {
    const count = category === 'All' ? state.projects.length : state.projects.filter(project => project.category === category).length;
    if (!count && category !== 'All') return;
    const button = element('button', 'filter', category);
    button.type = 'button';
    button.dataset.category = category;
    button.setAttribute('aria-pressed', String(state.category === category));
    const countNode = element('span', '', String(count));
    countNode.setAttribute('aria-hidden', 'true');
    button.append(countNode);
    button.setAttribute('aria-label', `${category}: ${count} projects`);
    button.addEventListener('click', () => {
      state.category = category;
      state.limit = 12;
      $$('.filter').forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.category === category)));
      renderProjects();
    });
    fragment.append(button);
  });
  $('#filters').replaceChildren(fragment);
}

function matchedProjects() {
  const terms = state.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return state.projects.filter(project => {
    if (state.category !== 'All' && project.category !== state.category) return false;
    if (state.liveOnly && !project.url) return false;
    const searchable = `${project.title} ${project.summary} ${project.category} ${project.tags.join(' ')}`.toLowerCase();
    return terms.every(term => searchable.includes(term));
  });
}

function renderProjects() {
  preview.classList.remove('show');
  const matches = matchedProjects();
  const visible = matches.slice(0, state.limit);
  const fragment = document.createDocumentFragment();
  visible.forEach(project => {
    const row = element('button', 'project-row');
    row.type = 'button';
    row.dataset.projectId = project.id;
    row.setAttribute('aria-label', `${project.title}, ${project.category}, ${projectStatus(project).label}. View project details`);
    const number = element('span', 'row-number', String(state.projects.indexOf(project) + 1).padStart(2, '0'));
    const info = element('span', 'row-info');
    info.append(element('h4', '', project.title), element('p', '', project.summary));
    if (project.video) {
      const indicator = element('span', 'row-video', '▷ Preview');
      $('h4', info).append(indicator);
    }
    const arrow = element('span', 'row-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    const character = element('span', 'row-character');
    character.setAttribute('aria-hidden', 'true');
    character.append(projectCharacter(project));
    row.append(number, character, info, element('span', 'row-category', project.category), statusElement(project), arrow);
    row.addEventListener('click', () => openProject(project, row));
    if (finePointer && !reducedMotion && project.image) {
      row.addEventListener('pointerenter', event => {
        if (innerWidth < 1000) return;
        const image = $('img', preview);
        image.src = project.image;
        image.onerror = () => preview.classList.remove('show');
        movePreview(event);
        preview.classList.add('show');
      });
      row.addEventListener('pointermove', movePreview);
      row.addEventListener('pointerleave', () => preview.classList.remove('show'));
    }
    fragment.append(row);
  });
  discardCharacterObservers(list);
  list.replaceChildren(fragment);
  $('#empty-state').hidden = matches.length > 0;
  $('#show-more').hidden = visible.length >= matches.length;
  const remaining = Math.min(12, matches.length - visible.length);
  $('#show-more').firstChild.textContent = `Show ${remaining} more ${remaining === 1 ? 'project' : 'projects'} `;
  $('#results-count').textContent = `${matches.length} ${matches.length === 1 ? 'project' : 'projects'}${state.category === 'All' ? '' : ` in ${state.category}`}${state.query ? ` matching “${state.query}”` : ''}`;
  $('#archive-end-note').textContent = matches.length ? `Showing ${visible.length} of ${matches.length}. ${visible.length === matches.length ? 'That’s the collection. For now.' : 'There’s more where that came from.'}` : '';
}

function movePreview(event) {
  const x = Math.min(innerWidth - 165, Math.max(165, event.clientX + 210));
  const y = Math.min(innerHeight - 120, Math.max(120, event.clientY - 50));
  preview.style.left = `${x}px`;
  preview.style.top = `${y}px`;
}

function detailParagraphs(detail) {
  if (typeof detail === 'string') return detail.split(/\n\s*\n/).filter(Boolean);
  if (Array.isArray(detail)) return detail.filter(item => typeof item === 'string');
  if (detail && typeof detail === 'object') return Object.entries(detail).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(value) ? value.join(' · ') : String(value)}`);
  return [];
}

function openProject(project, trigger) {
  if (!document.documentElement.classList.contains('loaded')) window.finishPortfolioLoader?.();
  document.dispatchEvent(new Event('portfolio-project-open'));
  state.lastTrigger = trigger || document.activeElement;
  preview.classList.remove('show');
  $('#dialog-eyebrow').textContent = `MY WORK / ${project.category}`;
  $('#dialog-title').textContent = project.title;
  discardCharacterObservers($('#dialog-mascot'));
  $('#dialog-mascot').replaceChildren(projectCharacter(project));
  $('#dialog-summary').textContent = project.summary;
  $$('#dialog-image video').forEach(video => video.pause());
  $('#dialog-image').replaceChildren(dialogMedia(project));
  const status = projectStatus(project);
  $('#dialog-status').className = `status ${status.className}`;
  $('#dialog-status').textContent = status.label;
  const paragraphs = detailParagraphs(project.detail).filter(text => text.trim() !== project.summary.trim());
  $('#dialog-detail').replaceChildren(...paragraphs.map(text => element('p', '', text)));
  const process = comparison(project);
  if (process) $('#dialog-detail').append(process);
  $('#dialog-detail').hidden = !paragraphs.length && !process;
  $('#dialog-tags').replaceChildren(...project.tags.map(tag => element('li', '', tag)));
  const links = [];
  const isDownload = project.url && /\.(zip|exe|dmg)(?:[?#]|$)/i.test(project.url);
  if (project.url) links.push(externalLink(project.url, isDownload ? 'Download the prototype ↓' : project.category === 'Games' ? 'Play the game ↗' : 'Open project ↗'));
  if (project.downloadUrl) links.push(externalLink(project.downloadUrl, 'Download extension files ↓'));
  if (project.sourceUrl) links.push(externalLink(project.sourceUrl, 'View source ↗'));
  if (!links.length) links.push(element('p', '', 'This project is part of the collection; a public release is not available yet.'));
  $('#dialog-links').replaceChildren(...links);
  if (!dialog.open) dialog.showModal();
  previewPlayers.forEach(syncPreview);
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
  history.replaceState(null, '', `${location.pathname}${location.search}#project=${encodeURIComponent(project.id)}`);
  $('#close-dialog').focus({ preventScroll: true });
}

function closeProject() { if (dialog.open) dialog.close(); }
$('#close-dialog').addEventListener('click', closeProject);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProject();
});
dialog.addEventListener('close', () => {
  $$('#dialog-image video').forEach(video => video.pause());
  previewPlayers.forEach(syncPreview);
  document.body.classList.remove('modal-open');
  if (location.hash.startsWith('#project=')) history.replaceState(null, '', `${location.pathname}${location.search}#work`);
  state.lastTrigger?.focus({ preventScroll: true });
});
window.addEventListener('hashchange', () => {
  if (location.hash.startsWith('#project=')) {
    const project = state.projects.find(item => item.id === decodeURIComponent(location.hash.slice(9)));
    if (project) openProject(project);
  } else closeProject();
});

$('#project-search').addEventListener('input', event => {
  clearTimeout(renderTimer);
  state.query = event.target.value;
  state.limit = 12;
  renderTimer = setTimeout(renderProjects, 90);
});
$('#live-filter').addEventListener('change', event => { state.liveOnly = event.target.checked; state.limit = 12; renderProjects(); });
$('#show-more').addEventListener('click', () => {
  const previousLimit = state.limit;
  state.limit += 12;
  renderProjects();
  $$('.project-row')[previousLimit]?.focus({ preventScroll: true });
});
$('#clear-filters').addEventListener('click', () => {
  state.category = 'All'; state.query = ''; state.liveOnly = false; state.limit = 12;
  $('#project-search').value = '';
  $('#live-filter').checked = false;
  renderFilters(); renderProjects();
  $('.filter')?.focus({ preventScroll: true });
});
$('#surprise-button').addEventListener('click', event => {
  const pool = matchedProjects().length ? matchedProjects() : state.projects;
  if (pool.length) openProject(pool[Math.floor(Math.random() * pool.length)], event.currentTarget);
});
document.addEventListener('keydown', event => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || dialog.open || ['INPUT', 'TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable) return;
  event.preventDefault();
  $('#project-search').focus();
});

$('#copy-email').addEventListener('click', async () => {
  const button = $('#copy-email');
  try {
    await navigator.clipboard.writeText('iangavilan31@gmail.com');
    button.firstChild.textContent = 'Email copied! ';
    $('#copy-status').textContent = 'Email address copied to clipboard.';
  } catch {
    button.firstChild.textContent = 'iangavilan31@gmail.com ';
    $('#copy-status').textContent = 'Email address: iangavilan31@gmail.com';
  }
  setTimeout(() => { button.firstChild.textContent = 'Copy email address '; }, 3500);
});
$('#footer-year').textContent = String(new Date().getFullYear());
$('#about-mascot').append(pixelCharacter({ id: 'ian-gavilan', category: 'Creative', title: 'Ian Gavilan' }));
window.addEventListener('scroll', () => preview.classList.remove('show'), { passive: true });
document.addEventListener('visibilitychange', () => previewPlayers.forEach(syncPreview));
window.addEventListener('portfolio-ready', () => {
  previewPlayers.forEach(syncPreview);
});
setupMusic();

async function start() {
  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) throw new Error(`Project collection returned ${response.status}`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.projects;
    if (!Array.isArray(items)) throw new Error('Project collection must be an array.');
    state.projects = items.filter(item => item && item.id && item.title).map(item => ({
      ...item,
      title: String(item.title),
      summary: String(item.summary || ''),
      category: categories.includes(item.category) && item.category !== 'All' ? item.category : 'Creative',
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      url: safeUrl(item.url), downloadUrl: safeUrl(item.downloadUrl), sourceUrl: safeUrl(item.sourceUrl), image: safeUrl(item.image), mascot: safeUrl(item.mascot), mascotSheet: safeUrl(item.mascotSheet), video: safeUrl(item.video),
      comparison: item.comparison ? { ...item.comparison, before: safeUrl(item.comparison.before), after: safeUrl(item.comparison.after) } : null,
    }));
    $$('[data-count]').forEach(node => { node.textContent = String(state.projects.length).padStart(2, '0'); });
    renderFeatured(); renderFilters(); renderProjects();
    setupOpening();
    $('#surprise-button').hidden = state.projects.length === 0;
    if (location.hash.startsWith('#project=')) {
      const requested = decodeURIComponent(location.hash.slice(9));
      const project = state.projects.find(item => item.id === requested);
      if (project) openProject(project, $('#work'));
    }
  } catch (error) {
    console.error(error);
    $('#results-count').textContent = 'The collection could not load.';
    const message = element('p', 'noscript-message', 'Please refresh to try again, or explore ');
    message.append(externalLink('https://github.com/iangavilan31-dot', 'the projects on GitHub ↗'));
    list.replaceChildren(message);
  }
}
start();
