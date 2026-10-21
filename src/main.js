import { createProjectOrbit } from './project-orbit.js';
import { setupOpening, setupMusic, violaCharacter, comparison, chalkIcon, setupNotebook, revealContent } from './experience.js';
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('notebook-motion-change', event => { reducedMotion = event.detail; previewPlayers.forEach(syncPreview); });
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
  const shouldPlay = document.documentElement.classList.contains('loaded') && player.visible && !player.userPaused && (!player.frame.closest('.orbit-card') || player.frame.closest('.orbit-card').dataset.position === 'center') && !dialog.open && !document.hidden && (!reducedMotion || player.userStarted);
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
  return watchCharacter(chalkIcon(project.category));
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

function featuredMedia(project, eager, select = openProject) {
  const media = element('div', 'feature-media');
  const visual = element('button', 'feature-visual');
  visual.type = 'button';
  visual.setAttribute('aria-label', `View ${project.title} project details`);
  visual.addEventListener('click', () => select(project, visual));
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
  const selections = [
    { id: 'games', label: 'games', description: 'Little worlds. Long detours. The games I keep coming back to.', ids: ['moonbite', 'pocket-gods', 'cloudline-chaos', 'slime-rangers', 'impossible-lab'] },
    { id: 'tools', label: 'tools', description: 'Useful little systems, made for a real question or a daily ritual.', ids: ['theory-studio', 'neighbor-ready', 'the-network', 'gradus', 'pane'] },
    { id: 'stories', label: 'stories & experiments', description: 'History, sound, and the things that happen between disciplines.', ids: ['the-red-archive', 'off-the-page', 'afterlives', 'afterimage', 'icarvs'] },
  ];
  const groups = selections.map(group => ({ ...group, projects: group.ids.map(id => state.projects.find(project => project.id === id)).filter(Boolean) }));
  $('#selected-count').textContent = String(new Set(groups.flatMap(group => group.ids)).size);
  $('#featured-work').replaceChildren(createProjectOrbit({
    groups,
    createMedia: featuredMedia,
    onOpen: openProject,
    onRotate: () => queueMicrotask(() => {
      // Drop media observers for the previous collection before resynchronizing the stage.
      for (const player of previewPlayers) {
        if (!player.frame.isConnected) { player.video.pause(); mediaObserver?.unobserve(player.frame); previewPlayers.delete(player); }
        else syncPreview(player);
      }
    }),
  }));
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
    const character = element('span', 'row-character row-thumbnail');
    character.setAttribute('aria-hidden', 'true');
    character.append(project.image ? projectImage(project) : projectCharacter(project));
    row.append(number, character, info, element('span', 'row-category', project.category), statusElement(project), arrow);
    row.addEventListener('click', () => openProject(project, row));
    fragment.append(row);
  });
  discardCharacterObservers(list);
  list.replaceChildren(fragment);
  revealContent(list);
  $('#empty-state').hidden = matches.length > 0;
  $('#show-more').hidden = visible.length >= matches.length;
  const remaining = Math.min(12, matches.length - visible.length);
  $('#show-more').firstChild.textContent = `Show ${remaining} more ${remaining === 1 ? 'project' : 'projects'} `;
  $('#results-count').textContent = `${matches.length} ${matches.length === 1 ? 'project' : 'projects'}${state.category === 'All' ? '' : ` in ${state.category}`}${state.query ? ` matching “${state.query}”` : ''}`;
  $('#archive-end-note').textContent = matches.length ? `Showing ${visible.length} of ${matches.length}. ${visible.length === matches.length ? 'That’s the collection. For now.' : 'There’s more where that came from.'}` : '';
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
  clearTimeout(closingTimer);
  dialog.classList.remove('is-closing');
  if (!dialog.open) dialog.showModal();
  previewPlayers.forEach(syncPreview);
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
  history.replaceState(null, '', `${location.pathname}${location.search}#project=${encodeURIComponent(project.id)}`);
  $('#close-dialog').focus({ preventScroll: true });
}

let closingTimer;
function closeProject() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  dialog.classList.add('is-closing');
  clearTimeout(closingTimer);
  closingTimer = setTimeout(() => dialog.close(), reducedMotion ? 0 : 240);
}
dialog.addEventListener('cancel', event => { event.preventDefault(); closeProject(); });
$('#close-dialog').addEventListener('click', closeProject);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProject();
});
dialog.addEventListener('close', () => {
  dialog.classList.remove('is-closing');
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
setupNotebook();
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
    revealContent(document);
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
