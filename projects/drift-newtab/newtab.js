// Drift — animated new tab. WebGL domain-warped flow field + clock + search.

/* ---------- moods (Inigo Quilez cosine palettes, kept dark & cinematic) ---------- */
const MOODS = [
  { name: "Ember", a: [0.15, 0.12, 0.12], b: [0.50, 0.30, 0.20], c: [1, 1, 1], d: [0.00, 0.10, 0.20] },
  { name: "Tide",  a: [0.12, 0.16, 0.18], b: [0.20, 0.40, 0.45], c: [1, 1, 1], d: [0.50, 0.30, 0.20] },
  { name: "Moss",  a: [0.13, 0.15, 0.12], b: [0.30, 0.42, 0.25], c: [1, 1, 1], d: [0.20, 0.25, 0.10] },
  { name: "Slate", a: [0.14, 0.14, 0.16], b: [0.24, 0.25, 0.32], c: [1, 1, 1], d: [0.10, 0.15, 0.22] },
];

/* ---------- shaders ---------- */
const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_a, u_b, u_c, u_d;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, amp = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++){
    v += amp * noise(p);
    p = rot * p * 2.0;
    amp *= 0.5;
  }
  return v;
}
vec3 palette(float t){
  return u_a + u_b * cos(6.28318 * (u_c * t + u_d));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;
  float t = u_time * 0.05;

  vec2 q = vec2(fbm(uv * 1.5 + vec2(0.0, t)),
                fbm(uv * 1.5 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(uv * 1.5 + 3.0 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(uv * 1.5 + 3.0 * q + vec2(8.3, 2.8) - t * 0.5));
  float f = fbm(uv * 1.5 + 3.5 * r);

  float mixv = f + 0.3 * length(r);
  vec3 col = palette(mixv);
  col *= 0.6 + 0.6 * f;
  col = mix(col, palette(mixv + 0.15), length(q) * 0.5);

  vec2 vu = gl_FragCoord.xy / u_res.xy;
  float vig = smoothstep(1.2, 0.3, length(vu - 0.5) * 1.4);
  col *= vig;

  float g = hash(gl_FragCoord.xy + fract(u_time)) * 0.05 - 0.025;
  col += g;

  col = pow(max(col, 0.0), vec3(0.9));
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ---------- gl boot ---------- */
const canvas = document.getElementById("gl");
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const start = performance.now();
function createRenderer() {
  try {
    const gl = canvas.getContext('webgl', { antialias:false, powerPreference:'low-power' });
    if (!gl) return null;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader); throw new Error('Shader unavailable');
      }
      return shader;
    };
    const program = gl.createProgram();
    const vertex = compile(gl.VERTEX_SHADER, VERT), fragment = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null; }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program,'p');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const uniforms = Object.fromEntries(['res','time','a','b','c','d'].map(name => [name,gl.getUniformLocation(program,'u_'+name)]));
    canvas.hidden = false;
    return {
      resize() { gl.viewport(0,0,canvas.width,canvas.height); },
      mood(value) { for (const name of ['a','b','c','d']) gl.uniform3fv(uniforms[name],value[name]); },
      draw(time) {
        gl.uniform2f(uniforms.res,canvas.width,canvas.height);
        gl.uniform1f(uniforms.time,time); gl.drawArrays(gl.TRIANGLES,0,3);
      }
    };
  } catch { return null; }
}
let renderer = createRenderer();
if (!renderer) canvas.hidden = true;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25, Math.sqrt(1600000 / Math.max(1,innerWidth * innerHeight)));
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  renderer?.resize();
  renderer?.draw(motion.matches ? 0 : (performance.now() - start) / 1000);
}
addEventListener("resize", resize);
resize();

/* ---------- mood state ---------- */
let savedMood = 0;
try { savedMood = Number(localStorage.getItem('drift.mood') || 0); } catch {}
let mood = savedMood;
if (!Number.isInteger(mood) || mood < 0 || mood >= MOODS.length) mood = 0;

function applyMood(i) {
  mood = (i + MOODS.length) % MOODS.length;
  const m = MOODS[mood];
  renderer?.mood(m);
  document.body.style.backgroundColor = `rgb(${m.a.map(value => Math.round(value*140)).join(',')})`;
  try { localStorage.setItem("drift.mood", String(mood)); } catch {}
  renderer?.draw(motion.matches ? 0 : (performance.now() - start) / 1000);
  [...moodsEl.children].forEach((el, idx) => {
    el.classList.toggle("active", idx === mood);
    el.setAttribute('aria-pressed', String(idx === mood));
  });
  moodnameEl.textContent = m.name;
  moodnameEl.classList.add("show");
  clearTimeout(applyMood._t);
  applyMood._t = setTimeout(() => moodnameEl.classList.remove("show"), 1400);
}

const moodsEl = document.getElementById("moods");
const moodnameEl = document.getElementById("moodname");
MOODS.forEach((m, i) => {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.title = m.name;
  dot.setAttribute('aria-label', m.name + ' mood');
  dot.addEventListener("click", () => applyMood(i));
  moodsEl.appendChild(dot);
});
addEventListener("keydown", (e) => {
  if (document.activeElement === qEl) return;
  if (e.key >= "1" && e.key <= String(MOODS.length)) applyMood(+e.key - 1);
});
applyMood(mood);

/* ---------- render loop (pauses when tab hidden) ---------- */
let running = false;
let animationId = 0, lastDraw = -Infinity;
function frame(now) {
  if (!running) return;
  if (now - lastDraw >= 1000/30 - 1) {
    renderer?.draw((now - start) / 1000); lastDraw = now;
  }
  animationId = requestAnimationFrame(frame);
}
function updateMotion() {
  cancelAnimationFrame(animationId);
  running = !!renderer && !document.hidden && !motion.matches;
  if (running) animationId = requestAnimationFrame(frame);
  else renderer?.draw(0);
}
updateMotion();
document.addEventListener('visibilitychange', updateMotion);
motion.addEventListener('change', updateMotion);
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault(); renderer = null; canvas.hidden = true; updateMotion();
});
canvas.addEventListener('webglcontextrestored', () => {
  renderer = createRenderer(); resize(); applyMood(mood); updateMotion();
});

/* ---------- clock + greeting ---------- */
const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("date");
const greetEl = document.getElementById("greeting");

function tick() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  clockEl.textContent = `${h12}:${m} ${ampm}`;
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });
  const part = h < 5 ? "Late night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Late night";
  greetEl.textContent = `${part}, Ian`;
}
tick();
setInterval(tick, 1000);

/* ---------- search ---------- */
const formEl = document.getElementById("search");
const qEl = document.getElementById("q");
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = qEl.value.trim();
  if (!v) return;
  const looksLikeUrl = /^https?:\/\//i.test(v) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v);
  location.href = looksLikeUrl
    ? (/^https?:\/\//i.test(v) ? v : "https://" + v)
    : "https://www.google.com/search?q=" + encodeURIComponent(v);
});
qEl.focus();
