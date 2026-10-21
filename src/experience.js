import { gardenerArt, svgElement, chalkIcon } from './notebook-art.js';
export { chalkIcon };
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
let manualReduced = false;
try { manualReduced = sessionStorage.getItem('ian-notebook-motion') === 'reduced'; } catch {}
let reducedMotion = reducedQuery.matches || manualReduced;
document.documentElement.classList.toggle('motion-reduced', reducedMotion);
const $ = selector => document.querySelector(selector);
export function violaCharacter() {
 return svgElement(`<svg class="project-character chalk-viola" viewBox="0 0 70 90" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g><path class="draw-path" pathLength="1" d="M33 8q8-7 9 0l-3 18v13c11-6 19 8 8 14 0 7 12 9 9 20-4 15-33 16-38 1-4-11 10-16 9-21-11-7-1-20 9-14V25z M33 8h9m-8 7h6M35 28l-3 44m7-44-1 44m-8-6h10m-9 6 8 7 M25 55q-5 4-1 8m22-8q5 4 1 8"/></g><g class="viola-bow"><path class="draw-path" pathLength="1" d="M9 17l51 53m-49-56 52 54M9 17l2-3m49 56 3-2"/></g></svg>`);
}
export function bookCharacter() { return chalkIcon('Research'); }
let revealObserver;
export function revealContent(root=document) {
 const targets = root.querySelectorAll('.reveal, .project-row');
 targets.forEach((el,i)=>{
  if (el.dataset.observed) return;
  el.dataset.observed='true';
  if (el.classList.contains('project-row')) el.style.setProperty('--reveal-delay',`${Math.min(i%12,5)*35}ms`);
  if (reducedMotion || !revealObserver) el.classList.add('is-visible'); else revealObserver.observe(el);
 });
}
function letters(node) {
 if(!node || node.dataset.lettered) return;
 node.dataset.lettered='true';
 const text=node.textContent; node.setAttribute('aria-label',text);
 const span=document.createElement('span'); span.setAttribute('aria-hidden','true');
 let i=0;text.split(' ').forEach((word,wi)=>{if(wi){span.append(document.createTextNode(' '));i++;}const group=document.createElement('span');group.className='typed-word';[...word].forEach(letter=>{const s=document.createElement('span');s.textContent=letter;s.style.setProperty('--letter',i++);s.className='typed-letter';group.append(s);});span.append(group);});node.replaceChildren(span);
}
export function setupNotebook() {
 if ('IntersectionObserver' in window) revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
 $('#gardener').innerHTML=gardenerArt;
 letters($('#hero-title'));
 document.querySelectorAll('[data-type]').forEach(letters);
 const garden=$('#gardener'); let greetingTimer;
 const greet=()=>{if(reducedMotion)return;garden.classList.remove('greeting');requestAnimationFrame(()=>garden.classList.add('greeting'));clearTimeout(greetingTimer);greetingTimer=setTimeout(()=>garden.classList.remove('greeting'),2300);};
 garden.addEventListener('click',greet);
 if(matchMedia('(hover:hover) and (pointer:fine)').matches) {
  garden.addEventListener('pointermove',e=>{if(reducedMotion)return;const r=garden.getBoundingClientRect();garden.style.setProperty('--look-x',`${((e.clientX-r.left)/r.width-.5)*5}px`);garden.style.setProperty('--look-y',`${((e.clientY-r.top)/r.height-.5)*3}px`);});
  garden.addEventListener('pointerleave',()=>{garden.style.setProperty('--look-x','0px');garden.style.setProperty('--look-y','0px');});
 }
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>garden.classList.toggle('resting',!e.isIntersecting)),{threshold:.05});observer.observe(garden);}
 document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-hidden',document.hidden));
 // Keep existing hashes usable, and leave cross-page project links to normal navigation.
 document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{
  const target=document.getElementById(link.hash.slice(1));if(!target)return;
  e.preventDefault();window.finishPortfolioLoader?.();
  target.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});
  history.pushState(null,'',link.hash);
  if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
 }));
 const links=[...document.querySelectorAll('.site-header nav a')];
 if('IntersectionObserver' in window){const navObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){links.forEach(l=>l.setAttribute('aria-current',l.hash==='#'+(e.target.id==='archive'?'work':e.target.id)?'location':'false'));}},{rootMargin:'-15% 0px -55% 0px'});['top','work','archive','about','contact'].forEach(id=>navObserver.observe(document.getElementById(id)));}
 const motionButton=$('#motion-toggle');
 const updateMotion=()=>{
  reducedMotion=reducedQuery.matches||manualReduced;
  document.documentElement.classList.toggle('motion-reduced',reducedMotion);
  motionButton.textContent=reducedMotion?'motion: reduced':'motion: on';
  motionButton.setAttribute('aria-pressed',String(reducedMotion));
  motionButton.disabled=reducedQuery.matches;
  document.dispatchEvent(new CustomEvent('notebook-motion-change',{detail:reducedMotion}));
  if(reducedMotion){window.finishPortfolioLoader?.();document.querySelectorAll('.reveal,.project-row').forEach(el=>el.classList.add('is-visible'));document.querySelectorAll('video').forEach(v=>v.pause());}
 };
 motionButton.addEventListener('click',()=>{manualReduced=!manualReduced;try{sessionStorage.setItem('ian-notebook-motion',manualReduced?'reduced':'full');}catch{}updateMotion();});
 reducedQuery.addEventListener('change',updateMotion);
 updateMotion();
 revealContent();
}
export function setupOpening() {
 const stage=$('#intro-stage'),skip=$('#skip-intro'),replay=$('#replay-intro');let timer;let running=false;
 const finish=()=>{
  clearTimeout(timer);clearTimeout(window.portfolioFailOpen);
  document.documentElement.classList.remove('intro-running');
  document.documentElement.classList.add('loaded','notebook-ready');
  skip.hidden=true;stage.setAttribute('aria-hidden','true');running=false;
  try{sessionStorage.setItem('ian-notebook-arrived','1');}catch{}
  window.dispatchEvent(new Event('portfolio-ready'));
 };
 window.finishPortfolioLoader=finish;
 const play=()=>{
  if(reducedMotion)return finish();
  clearTimeout(timer);running=true;
  document.documentElement.classList.remove('notebook-ready');
  document.documentElement.classList.add('intro-running');skip.hidden=false;
  requestAnimationFrame(()=>{timer=setTimeout(finish,1750);});
 };
 skip.addEventListener('click',finish);
 replay.addEventListener('click',()=>{scrollTo({top:0,behavior:'instant'});play();});
 document.querySelectorAll('.site-header a,.skip-link').forEach(l=>l.addEventListener('click',finish));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&running)finish();});
 addEventListener('wheel',()=>{if(running)finish();},{passive:true});
 addEventListener('touchstart',e=>{if(running&&!stage.contains(e.target))finish();},{passive:true});
 let arrived=false;try{arrived=!!sessionStorage.getItem('ian-notebook-arrived');}catch{}
 if(reducedMotion){replay.textContent='Reduced motion is on';replay.disabled=true;finish();}
 else if(!arrived&&!location.hash)play();else finish();
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
  const motion = active => document.querySelectorAll('.chalk-viola').forEach(viola => viola.classList.toggle('playing', active));
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
