(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function d(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=d(e);fetch(e.href,r)}})();const A="modulepreload",O=function(t,o){return new URL(t,o).href},v={},N=function(o,d,s){let e=Promise.resolve();if(d&&d.length>0){let n=function(a){return Promise.all(a.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};const i=document.getElementsByTagName("link"),y=document.querySelector("meta[property=csp-nonce]"),g=y?.nonce||y?.getAttribute("nonce");e=n(d.map(a=>{if(a=O(a,s),a in v)return;v[a]=!0;const c=a.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(!!s)for(let u=i.length-1;u>=0;u--){const m=i[u];if(m.href===a&&(!c||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${a}"]${p}`))return;const l=document.createElement("link");if(l.rel=c?"stylesheet":A,c||(l.as="script"),l.crossOrigin="",l.href=a,g&&l.setAttribute("nonce",g),document.head.appendChild(l),c)return new Promise((u,m)=>{l.addEventListener("load",u),l.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${a}`)))})}))}function r(n){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=n,window.dispatchEvent(i),!i.defaultPrevented)throw n}return e.then(n=>{for(const i of n||[])i.status==="rejected"&&r(i.reason);return o().catch(r)})};function b(t){document.title="PANE — your monitor is a window",t.innerHTML=`
  <main class="poster" id="main">
    <header class="poster-top">
      <span class="kicker">PANE — A WINDOW, NOT A SCREEN</span>
      <nav aria-label="Site">
        <a href="#/about">HOW IT WORKS</a>
      </nav>
    </header>

    <h1 class="wordmark"><span class="visually-hidden">PANE</span><span aria-hidden="true">P<span class="outline">A</span>NE</span></h1>
    <div class="poster-main">
      <div>
        <p class="lede">Your monitor is a window. Rooms exist behind the glass —
        and they move because you do.</p>
        <figure class="proof">
          <div class="proof-row">
            <img src="./poster/vault-l.jpg" alt="The Vault rendered from a head position leaned left" loading="lazy" />
            <img src="./poster/vault-c.jpg" alt="The Vault rendered from a centered head position" loading="lazy" />
            <img src="./poster/vault-r.jpg" alt="The Vault rendered from a head position leaned right" loading="lazy" />
          </div>
          <figcaption class="teaser-label">ONE ROOM — THREE HEAD POSITIONS. NOTHING ELSE CHANGED.</figcaption>
        </figure>
      </div>
      <div class="poster-side">
        <div class="teaser-frame">
          <video muted loop playsinline autoplay preload="metadata"
                 aria-label="Teaser: the window travels through four deep rooms while the viewer's head position shifts the parallax">
            <source src="./teaser/pane-teaser.mp4" type="video/mp4" />
            <track kind="captions" src="./teaser/pane-teaser.vtt" srclang="en" label="English" />
          </video>
        </div>
        <p class="teaser-caption" aria-hidden="true"></p>
        <span class="teaser-label">RECORDED FROM THE LIVE ENGINE — 30 S, NO CUTS</span>
        <ul class="fact-list">
          <li><span>PROJECTION</span><span>TRUE OFF-AXIS (KOOIMA)</span></li>
          <li><span>TRACKING</span><span>FACE — 100% ON-DEVICE</span></li>
          <li><span>NO CAMERA?</span><span>POINTER · GYRO · STILL</span></li>
          <li><span>ROOMS</span><span>FOUR, BEHIND THE GLASS</span></li>
        </ul>
      </div>
    </div>

    <div class="cta-row">
      <a class="cta cta--primary" href="#/window">LOOK CLOSER</a>
      <a class="mono-link" href="#/about">THE PHYSICS, EXPLAINED →</a>
    </div>

    <footer class="poster-foot">
      <span>FACE TRACKING RUNS ON THIS MACHINE. NOTHING LEAVES.</span>
      <span>WEBGL · 60 FPS · CAMERA OPTIONAL</span>
    </footer>
  </main>`;const o=t.querySelector("video"),d=t.querySelector(".teaser-caption"),s=o.textTracks[0];s&&(s.mode="hidden",s.addEventListener("cuechange",()=>{const e=s.activeCues?.[0];d.textContent=e?e.text:""})),o.addEventListener("error",()=>{t.querySelector(".teaser-frame").style.display="none",t.querySelector(".teaser-label").textContent="THE TEASER IS THE SITE ITSELF — PRESS LOOK CLOSER"},!0)}function S(t){document.title="PANE — how it works",t.innerHTML=`
  <main class="about" id="main">
    <header class="poster-top">
      <a class="mono-link" href="#/">← PANE</a>
      <nav aria-label="Site"><a class="mono-link" href="#/window">OPEN THE WINDOW</a></nav>
    </header>

    <h1>HOW THE<br/>TRICK WORKS</h1>

    <h2>The window is a projection plane</h2>
    <div class="spread">
    <div>
    <p>Every 3D application you have ever used puts the camera <strong>inside</strong> the
    scene and points it around. PANE does the opposite: the camera is <strong>your
    actual eye</strong>, and the screen is a fixed window between you and the room.</p>
    <p>Each frame, PANE builds a <strong>generalized off-axis projection</strong>
    (Kooima's formulation): an asymmetric viewing frustum stretched from your tracked
    eye position through the four corners of the monitor. When you move, the frustum
    shears — the window itself never rotates, never scales, never lies. That is why
    the parallax behaves like a real window instead of a screensaver: near edges
    occlude, far lines slide slowly, and objects in front of the glass come toward you.</p>
    </div>

    <svg class="diagram" viewBox="0 0 900 430" role="img"
         aria-label="Diagram: two eye positions in front of a fixed screen plane. Each eye casts a different asymmetric frustum through the same glass into the room behind.">
      <defs>
        <clipPath id="roomClip"><rect x="430" y="30" width="450" height="370"/></clipPath>
      </defs>
      <!-- room -->
      <g clip-path="url(#roomClip)">
        <polygon points="150,140 880,-16 880,661" fill="rgba(255,255,255,0.75)"/>
        <polygon points="240,260 880,-432 880,567" fill="rgba(14,58,80,0.1)"/>
      </g>
      <line x1="430" y1="340" x2="880" y2="340" stroke="#0E3A50" stroke-width="3"/>
      <line x1="880" y1="60" x2="880" y2="340" stroke="#0E3A50" stroke-width="3"/>
      <g stroke="#0E3A50" stroke-width="3" opacity="0.8">
        <line x1="540" y1="340" x2="540" y2="140"/>
        <line x1="650" y1="340" x2="650" y2="140"/>
        <line x1="760" y1="340" x2="760" y2="140"/>
      </g>
      <rect x="575" y="170" width="46" height="70" fill="#A5D8E8" stroke="#0E3A50" stroke-width="2.5"/>
      <!-- frustum edges -->
      <g stroke="#0E3A50" stroke-width="2.5">
        <line x1="150" y1="140" x2="430" y2="80"/>
        <line x1="150" y1="140" x2="430" y2="340"/>
      </g>
      <g stroke="#0E3A50" stroke-width="2.5" stroke-dasharray="7 6" opacity="0.6">
        <line x1="240" y1="260" x2="430" y2="80"/>
        <line x1="240" y1="260" x2="430" y2="340"/>
      </g>
      <!-- the glass -->
      <line x1="430" y1="60" x2="430" y2="380" stroke="#ffffff" stroke-width="9"/>
      <line x1="430" y1="60" x2="430" y2="380" stroke="#0E3A50" stroke-width="2.5"/>
      <!-- eyes -->
      <circle cx="150" cy="140" r="9" fill="#0E3A50"/>
      <circle cx="240" cy="260" r="9" fill="none" stroke="#0E3A50" stroke-width="3"/>
      <!-- labels -->
      <g font-family="IBM Plex Mono, monospace" font-size="14" font-weight="500" letter-spacing="1.5" fill="#0E3A50">
        <text x="108" y="114">EYE — LEANED LEFT</text>
        <text x="200" y="296">EYE — CENTERED</text>
        <text x="418" y="44" text-anchor="middle">THE GLASS</text>
        <text x="418" y="404" text-anchor="middle">z = 0</text>
        <text x="866" y="44" text-anchor="end">THE ROOM, BEHIND</text>
        <text x="298" y="72">ASYMMETRIC FRUSTUM</text>
      </g>
      <text x="450" y="426" font-family="IBM Plex Mono, monospace" font-size="14" font-weight="500"
            letter-spacing="1.5" fill="#0E3A50" text-anchor="middle">
        WHAT MOVES IS THE EYE. THE WINDOW NEVER ROTATES.</text>
    </svg>
    </div>

    <h2>The tracking never leaves this machine</h2>
    <p>PANE uses MediaPipe FaceLandmarker, served from this site and executed in
    your browser. Your eye position is estimated from the two iris centers; your
    distance from their spread. The pose is smoothed with a one-euro filter and
    predicted one frame ahead so the room never trails your head.</p>
    <p><strong>No frame, landmark, or coordinate is transmitted anywhere.</strong>
    There is no analytics script on this site. Open the network tab, lean around,
    watch nothing move but you.</p>

    <h2>The depth cues are the craft</h2>
    <p>Off-axis projection is only the skeleton. What sells the illusion:
    the window frame and its reveal occlude the rooms' edges; rain beads sit ON
    the glass at zero parallax; dust hangs at a dozen depths; architecture recedes
    to true vanishing points; one artifact in the Vault leans out through the
    plane, into your side of the glass.</p>

    <h2>Nobody hits a dead end</h2>
    <table>
      <thead><tr><th>You have</th><th>The window runs on</th></tr></thead>
      <tbody>
        <tr><td>A webcam, granted</td><td>Face tracking — the full illusion</td></tr>
        <tr><td>No camera, or you decline</td><td>Pointer drives the same projection, with an idle drift that keeps it breathing</td></tr>
        <tr><td>A phone</td><td>Device orientation — moving the phone IS the window</td></tr>
        <tr><td>Reduced motion set</td><td>Composed still views of every room, full copy, no tracking</td></tr>
      </tbody>
    </table>

    <h2>Measured, not claimed</h2>
    <table id="numbers">
      <tbody>
        <tr><td>Frame rate, all four rooms</td><td data-num="fps">60 fps locked — measured headless on a Radeon RX 6600, fixture-driven</td></tr>
        <tr><td>Left-vs-right view difference</td><td data-num="parallax">35–56% of pixels change per room (pixelmatch, ±15 cm head positions)</td></tr>
        <tr><td>Tracking-to-frame latency</td><td data-num="latency">one camera frame, minus 45 ms of velocity prediction — the room does not trail the head</td></tr>
        <tr><td>Lighthouse (mobile, landing)</td><td data-num="lh">100 performance · 95+ accessibility · 100 best practices — production build</td></tr>
        <tr><td>Console errors, all pages</td><td data-num="errors">zero</td></tr>
      </tbody>
    </table>

    <h2>Colophon</h2>
    <p>three.js, MediaPipe tasks-vision, GSAP, Web Audio, Vite + TypeScript.
    Type: Outfit and IBM Plex Mono, self-hosted. Every room is procedural —
    no photographs, no models, no stock. The score is synthesized live.</p>

    <footer class="foot">
      <span>PANE — A DEPTH EXPERIMENT</span>
      <span>CAMERA OPTIONAL · NOTHING LEAVES</span>
    </footer>
  </main>`}const x=document.getElementById("app"),h=document.createElement("div");x.appendChild(h);const E=document.createElement("a");E.className="skip-link";E.href="#main";E.textContent="SKIP TO CONTENT";document.body.prepend(E);let f=null,w=!1;function T(){const t=location.hash||"#/";if(t.startsWith("#/window")){if(h.hidden=!0,h.innerHTML="",f){f.show();return}if(w)return;w=!0,N(async()=>{const{WindowPage:o}=await import("./windowPage-DA7X-bqV.js");return{WindowPage:o}},[],import.meta.url).then(({WindowPage:o})=>{f=new o(x),f.show()})}else f?.hide(),h.hidden=!1,t.startsWith("#/about")?S(h):b(h),window.scrollTo(0,0)}window.addEventListener("hashchange",T);T();export{N as _};
