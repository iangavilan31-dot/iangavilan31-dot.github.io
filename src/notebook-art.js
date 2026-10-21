// Original vector artwork. Parts have independent pivots; no sprites or raster cutouts.
export const gardenerArt = `<svg class="gardener-art" viewBox="0 0 520 400" role="img" aria-labelledby="gardener-title gardener-desc">
<title id="gardener-title">A curious alien tending a little glass garden</title><desc id="gardener-desc">A small, round alien waters a sprout inside a glass terrarium. Its antenna and leaves sway gently.</desc>
<defs>
 <pattern id="pencil-shade" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)"><path d="M0 0v7" stroke="#9bc8ea" stroke-width=".8" opacity=".28"/></pattern>
 <pattern id="soil-dots" width="13" height="11" patternUnits="userSpaceOnUse"><circle cx="2" cy="4" r=".8" fill="#eee9db" opacity=".38"/><path d="m7 8 3-1" stroke="#b4d3e8" stroke-width=".7" opacity=".4"/></pattern>
 <filter id="chalk-edge"><feTurbulence type="fractalNoise" baseFrequency=".065" numOctaves="3" seed="11" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale=".65" xChannelSelector="R" yChannelSelector="G"/></filter>
</defs>
<g class="garden-ink" fill="none" stroke="#eee9db" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" filter="url(#chalk-edge)">
 <g class="ground-lines" opacity=".45"><path class="draw-path" pathLength="1" d="M65 336q100-8 180-2t202-2"/><path class="draw-path" pathLength="1" d="M103 344q80-4 118-1m113-1 62-1"/></g>
 <g class="terrarium">
  <path class="draw-path glass-outline" pathLength="1" d="M338 114c-1 27-40 47-49 80-13 46-6 99 12 121 21 26 105 28 126 0 19-25 25-75 10-122-11-34-46-51-47-79"/>
  <ellipse class="draw-path" pathLength="1" cx="364" cy="113" rx="28" ry="7"/><path class="draw-path" pathLength="1" d="M338 111v10q26 12 52 0v-10"/>
  <path fill="#8ab3d9" fill-opacity=".045" stroke="none" d="M338 124c-4 24-39 43-48 80-10 43-6 88 14 111 19 23 100 25 121 0 21-25 25-68 10-111-12-35-42-52-46-80z"/>
  <path class="draw-path" pathLength="1" d="M297 288q68-14 136 1m-134 13q64 22 132 1" stroke="#9dc8e8" opacity=".7"/>
  <path fill="url(#soil-dots)" stroke="none" d="M296 290q70-15 138 0l-9 24q-60 32-121-1z"/>
  <path class="draw-path" pathLength="1" d="M302 300q63 25 124 2M308 311q50 18 111 1" opacity=".28"/>
  <g class="plant plant-main">
   <path class="draw-path" pathLength="1" d="M364 293c-4-27-5-55 3-89" stroke="#a2cce9"/>
   <path class="draw-path leaf-fill" pathLength="1" d="M362 257c-31 0-43-19-45-37 22 1 42 8 45 37z" fill="#9ecae5" fill-opacity=".12"/>
   <path class="draw-path" pathLength="1" d="m326 231 35 25" opacity=".65"/>
   <path class="draw-path leaf-fill" pathLength="1" d="M363 239c25 1 43-18 44-39-26 2-40 16-44 39z" fill="#9ecae5" fill-opacity=".16"/>
   <path class="draw-path" pathLength="1" d="m397 212-33 26" opacity=".65"/>
   <path class="draw-path leaf-fill" pathLength="1" d="M367 210c-19-10-20-29-11-42 17 11 21 25 11 42z" fill="#9ecae5" fill-opacity=".12"/>
   <path class="draw-path" pathLength="1" d="m359 179 8 29" opacity=".65"/>
  </g>
  <g class="plant plant-small" stroke="#a2cce9" stroke-width="1.4"><path class="draw-path" pathLength="1" d="M321 294q-3-14 4-28m-3 13q-17-1-17-14 17 0 17 14m2-5q13 0 14-13-11-1-14 13"/></g>
  <g opacity=".3" stroke-width="1.1"><path class="draw-path" pathLength="1" d="M304 204q-11 25-8 49m8-63-3 7m113 40q4 20-1 35"/><path class="draw-path" pathLength="1" d="m401 153 14 17"/></g>
  <path class="draw-path" pathLength="1" d="M354 128q9 3 20 0" opacity=".4"/>
 </g>
 <g class="alien-body">
  <g class="antenna"><path class="draw-path" pathLength="1" d="M169 171q-20-31-5-51"/><path class="draw-path" pathLength="1" d="M164 123q-19-1-22-18 23-1 22 18z" fill="#9ecae5" fill-opacity=".2"/><path class="draw-path" pathLength="1" d="M164 122q-1-19 17-23 3 19-17 23z" fill="#9ecae5" fill-opacity=".13"/></g>
  <path class="draw-path" pathLength="1" fill="#253f60" d="M124 250c-14-42 6-84 43-88 39-5 72 24 72 66 0 27-9 46-27 60 3 13 21 26 10 34-9 7-29-9-35-17-3 17-6 29-17 29-12 0-8-21-8-29-8 14-17 23-28 19-12-6 7-22 9-29-24 13-42 15-46 6-6-12 24-19 33-26-2-7-4-17-6-25z"/>
  <path fill="url(#pencil-shade)" stroke="none" d="M124 250c-14-42 6-84 43-88 39-5 72 24 72 66 0 27-9 46-27 60 3 13 21 26 10 34-9 7-29-9-35-17-3 17-6 29-17 29-12 0-8-21-8-29-8 14-17 23-28 19-12-6 7-22 9-29-24 13-42 15-46 6-6-12 24-19 33-26-2-7-4-17-6-25z"/>
  <path class="draw-path" pathLength="1" d="M129 234q-6-29 9-47m3-5 5-4" stroke="#9ecae5" opacity=".65"/>
  <g class="alien-eyes"><ellipse cx="170" cy="216" rx="13" ry="18" fill="#f1eddf" stroke="none"/><ellipse cx="211" cy="211" rx="12" ry="17" fill="#f1eddf" stroke="none"/>
   <g class="pupils" fill="#162c48" stroke="none"><ellipse cx="174" cy="218" rx="6.5" ry="10"/><ellipse cx="215" cy="213" rx="6" ry="9.5"/><circle cx="176" cy="214" r="2" fill="#f1eddf"/><circle cx="217" cy="209" r="1.8" fill="#f1eddf"/></g>
  </g>
  <path class="draw-path smile" pathLength="1" d="M187 243q9 7 16-2"/>
  <g stroke="#9ecae5" opacity=".6" stroke-width="1.4"><path class="draw-path" pathLength="1" d="m151 239 5 1m-3 4 5 1m64-12 4-2m-3 7 4-2"/></g>
  <path class="draw-path" pathLength="1" d="M127 270q-28-19-33-4c-3 8 10 12 17 15"/>
 </g>
 <g class="watering-arm">
  <path class="draw-path" pathLength="1" d="M225 260q23 5 32-13c5-10-2-17-6-12-3 6-2 14-8 15l-14-1" fill="#253f60"/>
  <g class="watering-can" stroke="#a5cde9">
   <path class="draw-path" pathLength="1" d="m248 223 39-5 4 33q-19 9-36 3z" fill="#1b3452"/><path class="draw-path" pathLength="1" d="m287 228 20-13 5 4-22 28M252 229c-23-13-23 20 2 13M248 222q15-8 39-4m-27-1 3-10 9-2 6 12"/>
   <path class="draw-path" pathLength="1" d="m306 214 8 9m-55 5 19-3m-17 8 18-3m-17 9 17-3" opacity=".5" stroke-width="1"/>
  </g>
 </g>
 <g class="water-drops" stroke="#a5cde9" stroke-width="1.4"><path class="drop drop-one" d="m319 225 2 5"/><path class="drop drop-two" d="m326 236 2 4"/><path class="drop drop-three" d="m333 249 2 5"/></g>
 <g class="garden-spark" stroke="#b1d6ee" stroke-width="1.1"><path class="draw-path" pathLength="1" d="m413 139 1-8m-5 5 8-1m-112 34 1-5m-4 3 6-1"/></g>
</g></svg>`;

export function svgElement(markup) {
 const t = document.createElement('template'); t.innerHTML = markup.trim(); return t.content.firstElementChild;
}
export function chalkIcon(category = 'Creative') {
 const paths = {
  Games:'M13 22c-6-1-8 16-4 17 3 1 7-5 10-5h10c3 0 6 6 10 5 5-2 2-18-4-17-6-2-17-2-22 0z M15 26v7m-3-3h7 M32 27h.1m4 4h.1 M22 19q0-7 6-8',
  Web:'M8 13q15-2 32 0v24q-17-2-32 0z M8 19h32 M12 16h.1m4 0h.1m4 0h.1 M20 24l-5 4 5 4m8-8 5 4-5 4',
  Apps:'M15 8q9-2 18 0v32q-9 2-18 0z M15 13h18M15 35h18 M23 38h2 M21 22l-3 4 3 4m6-8 3 4-3 4',
  Research:'M12 9q8-2 13 3 5-5 13-3v27q-8-2-13 3-5-5-13-3z M25 13v26 M16 17l5 1m8 0 5-1 M16 23l5 1m8 0 5-1',
  Creative:'M12 35q-3-14 5-22l20 21q-11 8-25 1z M17 13l4-4 20 21-4 4 M12 29q5 0 6 6 M20 14l15 16 M30 9l1-5m4 10 5-1'
 };
 return svgElement(`<svg class="project-character chalk-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="draw-path" pathLength="1" d="${paths[category]||paths.Creative}"/></svg>`);
}
