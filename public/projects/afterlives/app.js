const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let reducedMotion = motionQuery.matches;
let introTimer, introStarted = false, introComplete = false;
let activeSection = $('main>section'), pointerX = 0, pointerY = 0, currentX = 0, currentY = 0, frame = null;
try { const stored = localStorage.getItem('afterlives-motion'); if (stored !== null) reducedMotion = stored === 'reduced'; } catch {}

function finishIntro() {
  clearTimeout(introTimer);
  document.body.classList.remove('intro-running');
  document.body.classList.add('intro-complete');
  $('#skip-intro').hidden = reducedMotion;
  $('#skip-intro').textContent = 'Replay opening ↻';
  introComplete = true;
}
function setMotion(reduced, save = false) {
  reducedMotion = reduced;
  document.documentElement.classList.toggle('reduced-motion', reduced);
  document.body.classList.toggle('motion-enabled', !reduced);
  $('#motion-toggle').setAttribute('aria-pressed', String(reduced));
  $('#motion-toggle').textContent = reduced ? 'Motion reduced' : 'Reduce motion';
  if (reduced) { finishIntro(); resetParallax(); }
  else if(introComplete) { $('#skip-intro').hidden=false; $('#skip-intro').textContent='Replay opening ↻'; }
  if (save) try { localStorage.setItem('afterlives-motion', reduced ? 'reduced' : 'full'); } catch {}
}
$('#motion-toggle').addEventListener('click', () => setMotion(!reducedMotion, true));
motionQuery.addEventListener('change', event => setMotion(event.matches));
function playIntro() {
  clearTimeout(introTimer); introComplete=false; introStarted=true;
  document.body.classList.remove('intro-running','intro-complete');
  void document.body.offsetWidth;
  document.body.classList.add('intro-running');
  $('#skip-intro').hidden=false; $('#skip-intro').textContent='Skip opening ↗';
  introTimer=setTimeout(finishIntro,9000);
}
$('#skip-intro').addEventListener('click', () => {
  if (introComplete) { $('#prologue').scrollIntoView({behavior:'smooth'}); playIntro(); } else finishIntro();
});
$('.enter-link').addEventListener('click', finishIntro);
setMotion(reducedMotion);
// The film begins only when its actual objects are decoded. Never expose a blank loader.
Promise.allSettled([$('[src="assets/venus-cutout.webp"]').decode(), $('.hero-sculpture img').decode(), document.fonts.ready]).then(() => {
  if (!reducedMotion && !introComplete && activeSection.id === 'prologue') {
    playIntro();
  } else finishIntro();
});

const details = {plato:{file:'detail-plato.webp',alt:'Enlarged detail of Plato holding a book and pointing upward in Raphael’s School of Athens.',caption:'Plato · detail from The School of Athens'},aristotle:{file:'detail-aristotle.webp',alt:'Enlarged detail of Aristotle holding the Ethics and extending his hand in Raphael’s School of Athens.',caption:'Aristotle · detail from The School of Athens'},raphael:{file:'detail-architecture.webp',alt:'Enlarged detail of Raphael’s monumental arches and coffered vaults.',caption:'Architecture · detail from The School of Athens'},manuscript:{file:'manuscript.webp',alt:'The complete illustrated frontispiece of Petrarch’s Virgil by Simone Martini.',caption:'Petrarch’s Virgil · Simone Martini'},comparison:{file:'aphrodite.webp',alt:'The Roman marble torso of Aphrodite in its unmasked museum photograph.',caption:'Aphrodite · The Met, accession 21.88.95'}};
const notes = {
  manuscript: { kicker: '01 / A CLASSICAL AUTHOR, REIMAGINED', title: 'Petrarch’s Virgil', body: '<p>This illuminated frontispiece by Simone Martini belonged to Petrarch’s treasured copy of Virgil. The ancient poet appears in an imagined scene, made for a fourteenth-century reader.</p><p>Classical literature here is an object to collect, annotate, illustrate, and cherish. The manuscript connects medieval craftsmanship with Petrarch’s enthusiasm for antiquity.</p><p class="note-detail">This is not the manuscript of Cicero’s letters found in 1345. Dates assigned to the frontispiece vary; it is labeled broadly as fourteenth century here.</p>', source: 'https://www.nga.gov/artists/1875-simone-martini', sourceLabel: 'Read the National Gallery of Art source ↗' },
  humanism: { kicker: '01 / HISTORICAL CONTEXT', title: 'Learning for a human life', body: '<p>Renaissance humanism centered on the study of grammar, rhetoric, poetry, history, and moral philosophy—the <em>studia humanitatis</em>. Ancient writing offered models of eloquence, judgment, and conduct.</p><p>Humanists pursued manuscripts and clearer texts, but they were not a single philosophical party. Many remained committed Christians. Humanism cannot be reduced to modern secularism or to the claim that medieval people had no interest in the individual.</p><p class="note-detail">Petrarch’s encounter with Cicero is one episode in a much longer history of classical learning.</p>', source: 'https://www.metmuseum.org/essays/the-rediscovery-of-classical-antiquity', sourceLabel: 'Read the Met’s historical essay ↗' },
  perspective: { kicker: '02 / THE INVENTION OF PICTORIAL SPACE', title: 'A world from one viewpoint', body: '<p>The tiled piazza and receding buildings in this imagined city create a coherent illusion of depth. The visible guide lines illustrate how parallel lines can seem to converge toward a vanishing point.</p><p>Brunelleschi’s experiments and Alberti’s writing made linear perspective central to Renaissance art. Their engagement with Roman forms helped produce new architecture, rather than exact copies of ancient buildings.</p><p class="note-detail">The painting is associated with Urbino, not Florence. Its author remains uncertain. The overlay is a simplified teaching diagram; its lines are not an original underdrawing or proof of the painter’s exact construction.</p>', source: 'https://www.metmuseum.org/essays/architecture-in-renaissance-italy', sourceLabel: 'Read the Met’s architecture essay ↗' },
  venus: { kicker: '03 / EVIDENCE & UNCERTAINTY', title: 'A goddess without a simple key', body: '<p>The Uffizi connects Venus’s modest gesture with ancient sculpture and suggests that Poliziano’s poetry may have informed the subject.</p><p>A Medici commission is considered probable, but the painting’s early patronage is not securely documented. It was recorded at the Medici villa of Castello in 1550.</p><p class="note-detail">Neoplatonic interpretations connect beauty, love, and spiritual ascent. They are interpretations of the painting, not a surviving statement of Botticelli’s intention. The mythological subject alone does not establish rejection of Christianity.</p>', source: 'https://www.uffizi.it/en/artworks/birth-of-venus', sourceLabel: 'Read the Uffizi catalogue ↗' },
  comparison: { kicker: '03 / READING VISUAL EVIDENCE', title: 'A family resemblance', body: '<p>The Roman marble torso in this comparison is a first- or second-century CE adaptation of a Greek Aphrodite type. Its missing arms once reached forward to partly cover the body.</p><p>It helps us see the long history of a gesture associated with Venus. It does not show that Botticelli knew this particular object, and it is not a proposed reconstruction of the painting’s source.</p><p class="note-detail">Both isolated figures are modern editorial treatments. Their scale and alignment were composed for comparison. The ancient sculpture’s missing parts have not been invented.</p>', source: 'https://www.metmuseum.org/art/collection/search/251115', sourceLabel: 'Read the Met’s object record ↗' },
  plato: { kicker: '04 / LOOK CLOSER', title: 'Plato points upward', body: '<p>At the center of Raphael’s gathering, Plato holds the <em>Timaeus</em> and raises a finger. The gesture is commonly read in relation to an intelligible reality beyond immediate appearances.</p><p>Raphael makes an ancient debate legible through bodies, books, and gestures. This gathering is an imagined Renaissance composition, not a record of ancient philosophers meeting.</p>', source: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/stanze-di-raffaello/stanza-della-segnatura/scuola-di-atene.html', sourceLabel: 'Read the Vatican Museums’ account ↗' },
  aristotle: { kicker: '04 / LOOK CLOSER', title: 'Aristotle extends his hand', body: '<p>Beside Plato, Aristotle holds the <em>Ethics</em> and extends his hand horizontally. The contrast between their gestures has often been understood as a difference between philosophical approaches.</p><p>Keep observation and interpretation separate: the book and gesture can be seen in the painting; a complete account of Aristotle’s thought cannot be reduced to the position of his hand.</p>', source: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/stanze-di-raffaello/stanza-della-segnatura/scuola-di-atene.html', sourceLabel: 'Read the Vatican Museums’ account ↗' },
  raphael: { kicker: '04 / ANTIQUITY IN A RENAISSANCE SETTING', title: 'A new home for ancient thought', body: '<p>The philosophers stand within monumental Renaissance architecture. The Vatican Museums link the setting to Bramante’s project for rebuilding St Peter’s.</p><p>Raphael brings ancient intellectual authority into the artistic and political world of Pope Julius II. Across the room, the <em>Disputation of the Holy Sacrament</em> represents Christian theology. Philosophy and revealed truth share a decorative program.</p><p class="note-detail">This does not mean Renaissance thinkers always agreed about the relationship between reason and faith.</p>', source: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/stanze-di-raffaello/stanza-della-segnatura.html', sourceLabel: 'Explore the Room of the Segnatura ↗' },
  tension: { kicker: '04 / A COMPLICATED INHERITANCE', title: 'Admiration was not agreement', body: '<p>Renaissance uses of antiquity could express accommodation, criticism, or supersession. Botticelli’s <em>Adoration of the Kings</em>, for example, places the Nativity among crumbling classical architecture.</p><p>The National Gallery explains that such ruins could both satisfy learned interest in antiquity and imply that Christianity had surpassed pagan religion. A classical form did not have one fixed meaning.</p><p class="note-detail">Ficino translated Plato and sought connections with Christian thought. That effort was one influential response, not a universal Renaissance consensus.</p>', source: 'https://www.nationalgallery.org.uk/paintings/sandro-botticelli-the-adoration-of-the-kings', sourceLabel: 'Read the National Gallery’s interpretation ↗' }
};

function openDialog(dialog, opener) {
  $$('dialog[open]').forEach(other => { if (other !== dialog) other.close(); });
  dialog.dataset.opener = opener?.id || '';
  document.body.classList.add('modal-open');
  dialog.showModal();
  dialog.scrollTop = 0;
  $('.dialog-close', dialog)?.focus({preventScroll:true});
}
$$('[data-note]').forEach(button => button.addEventListener('click', () => {
  const note = notes[button.dataset.note];
  $('#note-kicker').textContent = note.kicker;
  $('#note-title').textContent = note.title;
  $('#note-body').innerHTML = note.body;
  const detail = details[button.dataset.note];
  $('#note-artwork').hidden = !detail;
  $('#note-dialog').classList.toggle('has-artwork', Boolean(detail));
  if (detail) { $('#note-image').src = `assets/${detail.file}`; $('#note-image').alt = detail.alt; $('#note-image-caption').textContent = detail.caption; }
  $('#note-source').href = note.source;
  $('#note-source').textContent = note.sourceLabel;
  $('#note-dialog').setAttribute('aria-labelledby', 'note-title');
  openDialog($('#note-dialog'), button);
}));
$$('[data-open]').forEach(button => button.addEventListener('click', () => openDialog(document.getElementById(button.dataset.open), button)));
$$('dialog').forEach(dialog => {
  const heading = $('h2', dialog);
  if (heading && !heading.id) heading.id = `${dialog.id}-title`;
  if (heading) dialog.setAttribute('aria-labelledby', heading.id);
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.toggle('modal-open', Boolean($('dialog[open]'))));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
$$('.index-list a').forEach(link => link.addEventListener('click', () => {
  $('#index-dialog').close();
  finishIntro();
  const target = $(link.getAttribute('href'));
  target.setAttribute('tabindex', '-1');
  requestAnimationFrame(() => target.focus({preventScroll:true}));
}));
$('#view-painting').addEventListener('click', () => openDialog($('#painting-dialog'), $('#view-painting')));
$('#print-inquiry').addEventListener('click', () => window.print());

const routes = {
  latin: { text: 'Latin authors → medieval copyists → humanist readers', detail: 'Libraries, monasteries, and schools preserved Latin works long before Petrarch. Humanists sought manuscripts, compared readings, and cultivated eloquence.' },
  greek: { text: 'Greek authors → Byzantine scholars → Italian translators', detail: 'Greek-speaking scholars copied and studied ancient texts. Teachers, collectors, and translators expanded access in Italy before and after the fall of Constantinople in 1453.' },
  arabic: { text: 'Greek works → Arabic scholarship → Latin translations', detail: 'In the Islamic world, scholars translated, debated, and extended Greek mathematics and philosophy. Arabic-to-Latin translations influenced European learning centuries before the Renaissance.' }
};
function selectRoute(tab) {
  $$('[data-route]').forEach(button => { button.setAttribute('aria-selected', String(button === tab)); button.tabIndex = button === tab ? 0 : -1; });
  $('#route-content').setAttribute('aria-labelledby', tab.id);
  $('#route-text').textContent = routes[tab.dataset.route].text;
  $('#route-detail').textContent = routes[tab.dataset.route].detail;
}
$$('[data-route]').forEach(tab => {
  tab.addEventListener('click', () => selectRoute(tab));
  tab.addEventListener('keydown', event => {
    const tabs = $$('[data-route]'); const i = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = tabs[(i+1)%tabs.length];
    if (event.key === 'ArrowLeft') next = tabs[(i+tabs.length-1)%tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs.at(-1);
    if (next) { event.preventDefault(); selectRoute(next); next.focus(); }
  });
});
$('#perspective-toggle').addEventListener('click', () => {
  const visible = $('#city').classList.toggle('geometry-visible');
  $('#perspective-toggle').setAttribute('aria-pressed', String(visible));
  $('#perspective-toggle span:last-child').textContent = visible ? 'Hide the geometry' : 'Reveal the geometry';
});
function blendInheritance() {
  const value = Number($('#inheritance-range').value) / 100;
  $('.comparison-renaissance').style.opacity = value;
  $('.comparison-ancient').style.opacity = 1-value;
  $('.ancient-date').style.opacity = .3 + .7*(1-value);
  $('.renaissance-date').style.opacity = .3 + .7*value;
  const status = value < .2 ? 'A Roman Aphrodite, 1st–2nd century CE' : value > .8 ? 'A painted Venus, c. 1485' : 'An inherited gesture, transformed';
  if ($('#comparison-status').textContent !== status) $('#comparison-status').textContent = status;
  $('#inheritance-range').setAttribute('aria-valuetext', `${Math.round(value*100)} percent Renaissance image; ${status}`);
}
$('#inheritance-range').addEventListener('input', blendInheritance); blendInheritance();
let activeWall = 'philosophy';
$$('[data-wall]').forEach(button => button.addEventListener('click', async () => {
  const wall = button.dataset.wall;
  if (activeWall === wall) return;
  activeWall = wall;
  const image = $(`#${wall}-image`);
  image.loading = 'eager';
  try { await image.decode(); } catch {}
  // Ignore a stale decode if a visitor selected the other wall while the image loaded.
  if (activeWall !== wall) return;
  $('#philosophy-image').hidden = wall !== 'philosophy';
  $('#theology-image').hidden = wall !== 'theology';
  $('.fresco-pins').hidden = wall !== 'philosophy';
  $$('[data-wall]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.wall === wall)));
  $('#wall-description').textContent = wall === 'philosophy' ? 'Plato points upward; Aristotle extends a hand toward the world. Raphael makes their different approaches visible. Select a detail to look closer.' : 'Christian theology occupies the facing wall. The Trinity and the Eucharist belong to the same papal program as the ancient philosophers—an ambitious ordering of different kinds of truth.';
  $('#wall-credit').textContent = wall === 'philosophy' ? 'RAPHAEL · THE SCHOOL OF ATHENS · VATICAN MUSEUMS' : 'RAPHAEL · DISPUTATION OF THE HOLY SACRAMENT · VATICAN MUSEUMS';
}));

// Minimal spatial response, restricted to the visible chapter and disabled for touch/reduced motion.
const sections = $$('main>section');

function resetParallax() {
  document.documentElement.style.setProperty('--mx', '0'); document.documentElement.style.setProperty('--my', '0');
  $$('[data-depth]').forEach(layer => layer.style.transform = '');
  currentX = currentY = pointerX = pointerY = 0;
  if (frame) cancelAnimationFrame(frame); frame = null;
}
function renderParallax() {
  if (reducedMotion || !finePointer.matches || document.hidden) { resetParallax(); return; }
  currentX += (pointerX-currentX)*.045; currentY += (pointerY-currentY)*.045;
  if (activeSection.id === 'prologue') { document.documentElement.style.setProperty('--mx', currentX.toFixed(3)); document.documentElement.style.setProperty('--my', currentY.toFixed(3)); }
  $$('[data-depth]', activeSection).forEach(layer => {
    if (document.body.classList.contains('intro-running')) return;
    const depth = Number(layer.dataset.depth);
    layer.style.transform = `translate3d(${(currentX*depth).toFixed(2)}px,${(currentY*depth*.5).toFixed(2)}px,0)`;
  });
  if (Math.abs(pointerX-currentX)+Math.abs(pointerY-currentY) > .005) frame = requestAnimationFrame(renderParallax); else frame = null;
}
window.addEventListener('pointermove', event => {
  if (reducedMotion || !finePointer.matches || event.pointerType === 'touch') return;
  pointerX = (event.clientX/innerWidth-.5)*2; pointerY = (event.clientY/innerHeight-.5)*2;
  if (!frame) frame = requestAnimationFrame(renderParallax);
}, {passive:true});
window.addEventListener('pointerleave', resetParallax);
document.addEventListener('visibilitychange', () => { if (document.hidden) resetParallax(); });
let scrollFrame = false;
function updateChapter() {
  scrollFrame = false;
  const center = innerHeight * .43;
  document.body.classList.toggle('past-opening', window.scrollY > 100);
  let closest = sections[0];
  for (const section of sections) { const rect = section.getBoundingClientRect(); if (rect.top <= center && rect.bottom > center) closest = section; }
  if (closest !== activeSection) { resetParallax(); activeSection = closest; }
  $$('[data-chapter]').forEach(link => { if (link.dataset.chapter === activeSection.id) link.setAttribute('aria-current','true'); else link.removeAttribute('aria-current'); });
  if (introStarted && !introComplete && activeSection.id !== 'prologue') finishIntro();
}
window.addEventListener('scroll', () => { if (!scrollFrame) { scrollFrame=true; requestAnimationFrame(updateChapter); } }, {passive:true});
window.addEventListener('resize', updateChapter);updateChapter();

// Original restrained ambience. The user's first explicit sound click unlocks audio.
let audioContext, audioGain, audioNodes = [], soundOn = false;
function createAmbience() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  audioContext = new AudioContextClass();
  audioGain = audioContext.createGain(); audioGain.gain.value = 0; audioGain.connect(audioContext.destination);
  [110,146.832,164.814].forEach((frequency,index) => {
    const oscillator = audioContext.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    const gain = audioContext.createGain(); gain.gain.value = [.18,.08,.055][index];
    const lfo = audioContext.createOscillator(); lfo.frequency.value = .04 + index*.017;
    const movement = audioContext.createGain(); movement.gain.value = .028;
    lfo.connect(movement); movement.connect(gain.gain); oscillator.connect(gain); gain.connect(audioGain); oscillator.start(); lfo.start();
    audioNodes.push(oscillator,gain,lfo,movement);
  });
  const buffer = audioContext.createBuffer(1,audioContext.sampleRate*4,audioContext.sampleRate);
  const channel = buffer.getChannelData(0); for(let i=0;i<channel.length;i++) channel[i]=(Math.random()*2-1)*.18;
  const noise=audioContext.createBufferSource();noise.buffer=buffer;noise.loop=true;
  const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=230;
  const noiseGain=audioContext.createGain();noiseGain.gain.value=.25;noise.connect(filter);filter.connect(noiseGain);noiseGain.connect(audioGain);noise.start();audioNodes.push(noise,filter,noiseGain);
  return true;
}
$('.sound-toggle').addEventListener('click', async () => {
  try {
    if (!audioContext && !createAmbience()) { $('#sound-label').textContent='Sound unavailable'; return; }
    soundOn = !soundOn;
    if (soundOn) { await audioContext.resume(); audioGain.gain.cancelScheduledValues(audioContext.currentTime);audioGain.gain.setTargetAtTime(.16,audioContext.currentTime,.6); }
    else { audioGain.gain.cancelScheduledValues(audioContext.currentTime);audioGain.gain.setTargetAtTime(0,audioContext.currentTime,.25); }
    $('.sound-toggle').setAttribute('aria-pressed',String(soundOn)); $('#sound-label').textContent=soundOn?'Sound on':'Sound off';
  } catch { soundOn=false;$('.sound-toggle').setAttribute('aria-pressed','false');$('#sound-label').textContent='Sound unavailable'; }
});
// Never continue sound in a hidden tab. Return only when explicitly enabled.
document.addEventListener('visibilitychange', () => { if (!audioContext) return; if (document.hidden) audioContext.suspend(); else if (soundOn) audioContext.resume(); });

// A complete, unclipped art room. A turn changes the wall; detail views preserve the real source image.
let roomWall = 'philosophy', roomDetail = null, roomTurning = false;
function renderRoom() {
  $('#room-dialog').scrollTop=0;
  requestAnimationFrame(()=>$('#room-dialog').scrollTop=0);
  const detail = roomDetail && details[roomDetail];
  const room = $('#room-dialog');
  room.classList.toggle('detail-view', Boolean(detail));
  $('#room-reset').hidden = !detail;
  $('.room-pins').hidden = roomWall !== 'philosophy' || Boolean(detail);
  if (detail) {
    $('#room-image').src = `assets/${detail.file}`; $('#room-image').alt = detail.alt;
    $('#room-caption').textContent = detail.caption;
    const paragraph = document.createElement('div'); paragraph.innerHTML = notes[roomDetail].body;
    $('#room-detail').textContent = $('p',paragraph).textContent;
  } else {
    $('#room-image').src = `assets/${roomWall === 'philosophy' ? 'athens' : 'disputa'}.webp`;
    $('#room-image').alt = roomWall === 'philosophy' ? 'The School of Athens by Raphael, shown complete in an immersive art view.' : 'Disputation of the Holy Sacrament by Raphael, shown complete in an immersive art view.';
    $('#room-caption').textContent = roomWall === 'philosophy' ? 'The School of Athens · Philosophy' : 'Disputation of the Holy Sacrament · Theology';
    $('#room-detail').textContent = roomWall === 'philosophy' ? 'Select a detail to look closer. Use the facing-wall control to compare philosophy and theology.' : 'Christian theology faces ancient philosophy in the same papal room. The pairing is part of Raphael’s program for Pope Julius II.';
  }
}
$('#enter-room').addEventListener('click', () => { roomWall=activeWall; roomDetail=null;renderRoom();openDialog($('#room-dialog'),$('#enter-room')); });
$$('[data-room-detail]').forEach(button => button.addEventListener('click', () => { roomDetail=button.dataset.roomDetail;renderRoom();$('#room-reset').focus({preventScroll:true}); }));
$('#room-reset').addEventListener('click', () => {roomDetail=null;renderRoom();$('#room-turn').focus({preventScroll:true});});
async function turnRoom() {
  if (roomTurning) return;
  roomTurning=true;
  const nextWall=roomWall==='philosophy'?'theology':'philosophy';
  const img=new Image();img.src=`assets/${nextWall==='philosophy'?'athens':'disputa'}.webp`;
  try{await img.decode();}catch{}
  if(!$('#room-dialog').open){roomTurning=false;return;}
  const change=()=>{roomWall=nextWall;roomDetail=null;renderRoom();};
  if(reducedMotion){change();roomTurning=false;return;}
  $('#room-dialog').classList.add('turning');
  setTimeout(change,330);
  setTimeout(()=>{$('#room-dialog').classList.remove('turning');roomTurning=false;},860);
}
$('#room-turn').addEventListener('click',turnRoom);
$('#room-dialog').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();turnRoom();}});
