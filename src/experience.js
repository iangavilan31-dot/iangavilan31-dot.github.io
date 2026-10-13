const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = selector => document.querySelector(selector);

// Original pixel viola. The bow has its own pivot and moves only during playback.
export function violaCharacter() {
  const wrapper = document.createElement('span');
  wrapper.innerHTML = `<svg class="project-character pixel-viola" viewBox="0 0 48 48" shape-rendering="crispEdges" aria-hidden="true"><g fill="#153e75"><path d="M23 3h5v4h-1v10h4v3h3v6h-3v5h5v9h-3v4H19v-4h-3v-9h5v-5h-3v-6h3v-3h3V7h-1z"/><path fill="#e4f3ff" d="M24 4h3v2h-2v13h5v3h2v3h-3v8h5v6h-3v3H21v-3h-3v-6h5v-8h-3v-3h2v-3h3V6h-1z"/><path fill="#74a9e5" d="M23 22h6v4h-2v9h-3v-9h-1z"/><path d="M25 12h1v27h-1zM21 29h1v4h-1zM29 29h1v4h-1zM23 35h6v1h-6zM24 39h3v3h-3zM21 9h4v2h-4zM26 12h4v2h-4z"/></g><g class="viola-bow"><path fill="#153e75" d="M5 16h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v4h-2v-3h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2H9v-2H7v-2H5z"/><path fill="#fff" d="M7 17h1v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h-1v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2H9v-2H7z"/></g></svg>`;
  return wrapper.firstElementChild;
}

export function bookCharacter() {
  const wrapper = document.createElement('span');
  wrapper.innerHTML = `<svg class="project-character pixel-book" viewBox="0 0 40 40" shape-rendering="crispEdges" aria-hidden="true"><path fill="#153e75" d="M6 9h11v2h6V9h11v23H23v2h-6v-2H6z"/><path fill="#e6f4ff" d="M8 11h8v2h3v17h-3v-1H8zM21 13h3v-2h8v18h-8v1h-3z"/><path fill="#76ade7" d="M10 15h5v1h-5zM10 18h5v1h-5zM25 15h5v1h-5zM25 18h5v1h-5z"/><g class="pixel-eyes" fill="#153e75"><path d="M13 22h2v3h-2zM25 22h2v3h-2z"/></g><path fill="#153e75" d="M16 27h2v1h-2zM22 27h2v1h-2zM18 28h4v1h-4zM10 33h5v3h-7v-2h2zM25 33h5v1h2v2h-7z"/><g class="book-page"><path fill="#fff" d="M21 13h3v-2h8v3h-8v2h-3z"/></g></svg>`;
  return wrapper.firstElementChild;
}

export function setupOpening() {
  const stage = $('#intro-stage');
  const skip = $('#skip-intro');
  const replay = $('#replay-intro');
  let animations = [];
  let timer;
  let running = false;
  let frog;
  let introNodes = [];
  const cancel = () => {
    clearTimeout(timer);
    clearTimeout(window.portfolioFailOpen);
    animations.forEach(animation => animation.cancel());
    animations = [];
    introNodes.forEach(node => { node.style.removeProperty('visibility'); node.style.removeProperty('transform'); });
    introNodes = [];
    if (frog) { frog.classList.remove('opening-frog'); frog.style.removeProperty('background-position'); }
    stage.querySelector('.intro-pixels').replaceChildren();
    document.documentElement.classList.remove('intro-running');
    document.documentElement.classList.add('loaded');
    skip.hidden = true;
    running = false;
    window.dispatchEvent(new Event('portfolio-ready'));
  };
  const finish = () => {
    cancel();
    try { localStorage.setItem(window.portfolioIntroKey, String(Date.now())); } catch {}
  };
  window.finishPortfolioLoader = finish;
  const animate = (node, frames, options) => {
    const animation = node.animate(frames, { fill: 'both', ...options });
    animations.push(animation);
    return animation;
  };
  const play = () => {
    cancel();
    if (reducedMotion || typeof Element.prototype.animate !== 'function') return finish();
    const projects = [...document.querySelectorAll('.featured-project')];
    frog = projects[0]?.querySelector('.project-character');
    if (!frog) return finish();
    running = true;
    document.documentElement.classList.remove('loaded');
    document.documentElement.classList.add('intro-running');
    skip.hidden = false;
    const target = frog.getBoundingClientRect();
    const hero = $('#hero-title').getBoundingClientRect();
    const x = Math.round(Math.min(innerWidth - target.width - 32, Math.max(32, innerWidth * .47 - target.width / 2)));
    const y = Math.round(hero.bottom + (innerWidth < 620 ? 54 : 45));
    const dx = x - target.x, dy = y - target.y;
    const platform = stage.querySelector('.intro-platform');
    platform.style.cssText = `left:${x - 34}px;top:${y + target.height - 5}px;width:${target.width + 68}px`;
    frog.classList.add('opening-frog');
    const pose = (sx, sy, extraY = 0) => `translate(${dx}px,${dy + extraY}px) scale(${sx},${sy})`;
    animate(frog, [
      { transform: pose(1, 1), offset: 0 },
      { transform: pose(1, 1), offset: .12 },
      { transform: pose(1.12, .83, 8), offset: .25 },
      { transform: pose(.96, 1.04, -9), offset: .35 },
      { transform: pose(1.1, .9, 5), offset: .40 },
      { transform: pose(1, 1), offset: .5 },
      { transform: `translate(${Math.round(dx * .55)}px,${Math.round(dy * .5 - 38)}px)`, offset: .73 },
      { transform: 'translate(0,0) scale(1.07,.93)', offset: .88 },
      { transform: 'translate(0,0)', offset: 1 }
    ], { duration: 2900, easing: 'linear' });
    if (frog.classList.contains('sprite-character')) animate(frog, [
      { backgroundPosition: '0% 0%', offset: 0 },
      { backgroundPosition: '0% 100%', offset: .20 },
      { backgroundPosition: '50% 0%', offset: .29 },
      { backgroundPosition: '50% 100%', offset: .37 },
      { backgroundPosition: '0% 100%', offset: .44 },
      { backgroundPosition: '100% 100%', offset: .52 },
      { backgroundPosition: '100% 0%', offset: .60 },
      { backgroundPosition: '50% 0%', offset: .76 },
      { backgroundPosition: '0% 100%', offset: .88 },
      { backgroundPosition: '0% 0%', offset: 1 }
    ], { duration: 2900, easing: 'steps(1,end)' });
    animate(platform, [{ opacity: 0 }, { opacity: 1, offset: .12 }, { opacity: 1, offset: .43 }, { opacity: 0, offset: .76 }, { opacity: 0 }], { duration: 2800 });
    animate($('#hero-title'), [{ transform: 'translateY(10px)' }, { transform: 'translateY(0)' }], { duration: 2900, easing: 'cubic-bezier(.2,.8,.2,1)' });
    const impact = { x: x + target.width * .7, y: y + target.height - 8 };
    projects.forEach((project, index) => {
      const mascot = project.querySelector('.feature-mascot');
      const media = project.querySelector('.feature-media');
      const body = project.querySelector('.feature-body');
      if (index) {
        animate(mascot, [{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }], { duration: 480, delay: 1450 + index * 115, easing: 'steps(6,end)' });
        const rect = mascot.getBoundingClientRect();
        const destination = { x: rect.x + Math.min(55, rect.width / 2), y: Math.min(rect.y + 48, innerHeight - 20) };
        for (let pixel = 0; pixel < 4; pixel++) {
          const particle = document.createElement('i');
          stage.querySelector('.intro-pixels').append(particle);
          particle.style.left = `${impact.x}px`;
          particle.style.top = `${impact.y}px`;
          const tx = destination.x - impact.x + (pixel - 2) * 9;
          const ty = destination.y - impact.y + (pixel % 2) * 9;
          animate(particle, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, transform: `translate(${tx * .3}px,${ty * .3 - 35}px)`, offset: .3 }, { opacity: 1, transform: `translate(${tx}px,${ty}px)`, offset: .85 }, { opacity: 0, transform: `translate(${tx}px,${ty}px)` }], { duration: 650 + index * 100, delay: 1110 + pixel * 30, easing: 'cubic-bezier(.22,.65,.4,1)' });
        }
      }
      animate(media, [{ opacity: 0, clipPath: 'inset(0 0 100% 0)', transform: 'translateY(12px)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' }], { duration: 620, delay: 1770 + Math.min(index, 3) * 115, easing: 'cubic-bezier(.2,.7,.3,1)' });
      animate(body, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 2120 + Math.min(index, 3) * 90 });
    });
    timer = setTimeout(finish, 3020);
  };
  skip.addEventListener('click', finish);
  replay.addEventListener('click', () => { scrollTo({ top: 0, behavior: 'instant' }); play(); });
  document.querySelectorAll('.site-header a,.skip-link').forEach(link => link.addEventListener('click', () => { if (running) finish(); }));
  addEventListener('resize', () => { if (running) finish(); }, { passive: true });
  addEventListener('wheel', () => { if (running) finish(); }, { passive: true });
  addEventListener('pagehide', cancel);
  if (reducedMotion) { replay.textContent = 'Motion is reduced'; replay.disabled = true; }
  if (window.portfolioShouldIntroduce) play(); else finish();
}

export function comparison(project) {
  const data = project.comparison;
  if (!data?.before || !data?.after) return null;
  const figure = document.createElement('figure');
  figure.className = 'comparison';
  const stage = document.createElement('div');
  stage.className = 'comparison-stage';
  const before = new Image(), after = new Image();
  before.src = data.before; before.alt = `${project.title}: ${data.beforeLabel || 'Earlier version'}`;
  after.src = data.after; after.alt = `${project.title}: ${data.afterLabel || 'Current version'}`;
  before.className = 'comparison-before'; after.className = 'comparison-after';
  before.loading = after.loading = 'lazy';
  // Both captures fill the same measured frame without cropping. Mismatched ratios use a neutral mat.
  after.onload = () => { stage.style.aspectRatio = `${after.naturalWidth} / ${after.naturalHeight}`; };
  const labels = document.createElement('div'); labels.className = 'comparison-labels';
  [data.beforeLabel || 'Earlier version', data.afterLabel || 'Current version'].forEach(text => { const label = document.createElement('span'); label.textContent = text; labels.append(label); });
  const divider = document.createElement('span'); divider.className = 'comparison-divider'; divider.setAttribute('aria-hidden', 'true');
  const range = document.createElement('input'); range.type = 'range'; range.min = '0'; range.max = '100'; range.value = '50'; range.className = 'comparison-range'; range.setAttribute('aria-label', `Compare earlier and current ${project.title}`);
  const update = () => { stage.style.setProperty('--comparison-position', `${range.value}%`); range.setAttribute('aria-valuetext', `${range.value}% earlier version, ${100 - Number(range.value)}% current version`); };
  range.addEventListener('input', update); update();
  stage.append(before, after, labels, divider, range);
  figure.append(stage);
  if (data.caption) { const caption = document.createElement('figcaption'); caption.textContent = data.caption; figure.append(caption); }
  [before, after].forEach(image => image.addEventListener('error', () => { figure.replaceChildren(); const note = document.createElement('p'); note.textContent = 'The comparison image is unavailable. The current project preview is shown above.'; figure.append(note); }, { once: true }));
  return figure;
}

export function setupMusic() {
  $('#music-viola').append(violaCharacter());
  const panel = $('#listening-panel');
  const toggle = $('#open-listening');
  const play = $('#music-play');
  const stop = $('#music-stop');
  const volume = $('#music-volume');
  const status = $('#music-status');
  let player;
  let loading = false;
  let requestedPlay = false;
  let timeout;
  const motion = active => document.querySelectorAll('.pixel-viola').forEach(viola => viola.classList.toggle('playing', active));
  const pause = () => { requestedPlay = false; player?.pauseVideo?.(); motion(false); };
  const close = () => { pause(); panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); $('#music-aside').hidden = false; toggle.focus({ preventScroll: true }); };
  toggle.addEventListener('click', () => {
    if (!panel.hidden) return close();
    panel.hidden = false; $('#music-aside').hidden = true; toggle.setAttribute('aria-expanded', 'true'); play.focus({ preventScroll: true });
  });
  $('#close-listening').addEventListener('click', close);
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  const failed = () => {
    clearTimeout(timeout); loading = false; play.disabled = false; play.textContent = 'Try player again ▷';
    status.textContent = 'The embedded player is unavailable. You can watch the original on YouTube below.';
    motion(false);
  };
  const createPlayer = () => {
    try {
      player = new window.YT.Player('youtube-player', {
        host: 'https://www.youtube-nocookie.com', videoId: 'issbFnuFc2g', width: '100%', height: '100%',
        playerVars: { playsinline: 1, controls: 1, rel: 0, origin: location.origin },
        events: {
          onReady: () => { clearTimeout(timeout); loading = false; play.disabled = false; stop.disabled = false; $('#music-placeholder').hidden = true; player.setVolume(Number(volume.value)); if (requestedPlay && !panel.hidden && !document.hidden) player.playVideo(); status.textContent = requestedPlay ? 'Press play in the video if your browser pauses playback.' : 'Ready when you are.'; },
          onStateChange: event => {
            const playing = event.data === window.YT.PlayerState.PLAYING;
            motion(playing); play.textContent = playing ? 'Pause recording Ⅱ' : 'Play recording ▷';
            if (playing) {
              document.querySelectorAll('video').forEach(video => video.pause());
              status.textContent = 'Playing · Kenji Bunch, Blue Hour Duo (2022)';
            } else if (event.data === window.YT.PlayerState.PAUSED) status.textContent = 'Paused.';
            else if (event.data === window.YT.PlayerState.ENDED) status.textContent = 'The recording has ended.';
          },
          onError: failed
        }
      });
    } catch { failed(); }
  };
  play.addEventListener('click', () => {
    if (player?.getPlayerState) {
      if (player.getPlayerState() === window.YT.PlayerState.PLAYING) pause(); else { requestedPlay = true; player.playVideo(); }
      return;
    }
    if (loading) return;
    loading = true; requestedPlay = true; play.disabled = true; status.textContent = 'Connecting to the YouTube player…';
    timeout = setTimeout(failed, 15000);
    if (window.YT?.Player) createPlayer();
    else {
      window.onYouTubeIframeAPIReady = createPlayer;
      if (!document.querySelector('script[data-youtube-api]')) { const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; script.dataset.youtubeApi = ''; script.onerror = failed; document.head.append(script); }
    }
  });
  stop.addEventListener('click', () => { requestedPlay = false; player?.stopVideo?.(); motion(false); play.textContent = 'Play recording ▷'; status.textContent = 'Stopped. Play starts the recording again.'; });
  volume.addEventListener('input', () => player?.setVolume?.(Number(volume.value)));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  document.addEventListener('portfolio-project-open', pause);
  addEventListener('pagehide', () => { clearTimeout(timeout); player?.destroy?.(); });
}
