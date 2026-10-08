// Portafolio: todo funciona sin 3D. El 3D se carga aparte y, si falla, queda el respaldo HTML.
import { UI, KEYS, SECTIONS, PROJECTS, LINKS } from './i18n.js?v=20261007i';

const STORE = 'rl-portafolio';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function leer(clave, def) { try { return localStorage.getItem(`${STORE}:${clave}`) ?? def; } catch { return def; } }
function guardar(clave, v) { try { localStorage.setItem(`${STORE}:${clave}`, v); } catch { /* sin almacenamiento: no pasa nada */ } }
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- idioma ----------
const param = new URLSearchParams(location.search).get('lang');
let lang = param === 'en' || param === 'es' ? param : leer('lang', 'en');
if (lang !== 'es') lang = 'en'; // inglés por defecto: cuadra con las teclas PORTFOLIO

const state = { lang, sound: leer('sound', '1') === '1', keypad: null, typer: null, current: -1 };

// Lo que la pantallita muestra 'en reposo': el saludo o la última sección elegida.
const lcdBase = () => (state.current >= 0 ? `> ${KEYS[state.current][state.lang].toUpperCase()}_` : UI[state.lang].lcdIdle);

// Al pasar el cursor sobre una tecla, la pantallita adelanta su sección; al salir, regresa.
function hover(i) {
  if (i >= 0) click(true);
  if (i >= 0) setLcd(`> ${KEYS[i][state.lang].toUpperCase()}_`);
  else setLcd(lcdBase());
}

// ---------- cifras que suben al aparecer (solo con movimiento permitido) ----------
let ioCifras = null;
function contarCifras(fmt) {
  ioCifras?.disconnect();
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  ioCifras = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting || en.intersectionRatio < 0.6) continue;
      ioCifras.unobserve(en.target);
      const dd = en.target; const fin = Number(dd.dataset.n); const mas = dd.dataset.plus === '1' ? '+' : '';
      const t0 = performance.now(); const dur = 1200;
      const paso = (now) => {
        const k = Math.min(1, Math.max(0, (now - t0) / dur)); const v = Math.round(fin * (1 - Math.pow(1 - k, 3)));
        dd.textContent = fmt.format(v) + mas; if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }
  }, { threshold: 0.6 });
  $$('#fab-stats dd').forEach((dd) => ioCifras.observe(dd));
}

// ---------- render ----------
function renderLegend() {
  const nav = $('#legend');
  nav.innerHTML = KEYS.map((k, i) =>
    `<a href="#${k.id}" data-i="${i}"${i === state.current ? ' class="active" aria-current="location"' : ''}><b style="background:${k.color};${k.wide ? 'color:#eceae4' : ''}">${esc(k.k)}</b><span>${esc(k[state.lang])}</span></a>`).join('');
}

function renderHtmlKeys() {
  const box = $('#keys-html');
  box.innerHTML = KEYS.map((k, i) =>
    `<button type="button" class="key${k.wide ? ' wide' : ''}" style="--c:${k.color}" ${k.wide ? 'data-dark' : ''} data-i="${i}" aria-label="${esc(k[state.lang])}">${esc(k.k)}</button>`).join('');
}

function cardHTML(p) {
  const t = p[state.lang]; const ui = UI[state.lang];
  const extra = t.used ? `<dl><div><dt>${esc(ui.used)}</dt><dd>${esc(t.used)}</dd></div><div><dt>${esc(ui.built)}</dt><dd>${esc(t.built)}</dd></div></dl>` : '';
  const stack = p.stack ? `<div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>` : '';
  const impact = t.impact ? `<p class="impact">${esc(t.impact)}</p>` : '';
  const link = p.url
    ? `<a class="go" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.play ? ui.play : ui.open)} ↗</a>`
    : (p.group === 'proyectos' ? `<span class="private">${esc(ui.private)}</span>` : '');
  const v = p.video;
  const demo = v ? `<button type="button" class="demo-thumb" data-video="${esc(v.src)}" data-poster="${esc(v.poster)}" data-w="${v.w}" data-h="${v.h}" data-title="${esc((t.name || p.name) + ' · ' + v[state.lang])}">
      <img src="${esc(v.poster)}" alt="" loading="lazy" width="${v.w}" height="${v.h}">
      <span class="demo-play" aria-hidden="true"></span>
      <span class="demo-meta"><b>${esc(ui.demo)} · ${esc(t.name || p.name)} · ${esc(v.len)}</b><span>${esc(v[state.lang])}</span><i>${esc(ui.demoData)}</i></span>
    </button>` : '';
  return `<article class="card reveal${v ? ' has-demo' : ''}" style="--a:${p.accent}">${demo}
    <div class="card-top"><div class="card-icon${p.logo ? ' has-logo' : ''}" aria-hidden="true">${p.logo ? `<img src="${esc(p.logo)}" alt="" width="46" height="46" loading="lazy">` : esc(p.mono)}</div>
      <span class="badge ${p.status}">${esc(ui.status[p.status])}</span></div>
    <div class="card-name"><h3>${esc(t.name || p.name)}</h3><div class="tag">${esc(t.tag)}</div></div>
    <p>${esc(t.desc)}</p>${impact}${extra}${stack}${link}</article>`;
}

function renderSections() {
  for (const sec of $$('.sec')) {
    const id = sec.id; const data = SECTIONS[id]?.[state.lang] || {};
    const k = KEYS.find((x) => x.id === id);
    sec.querySelector('.sec-head').innerHTML =
      `<div class="sec-key" style="background:${k.color};${k.wide ? 'color:#eceae4' : ''}" aria-hidden="true">${esc(k.k)}</div>
       <h2 tabindex="-1">${esc(data.title || '')}</h2>${data.lead ? `<p class="lead">${esc(data.lead)}</p>` : ''}`;
  }
  for (const box of $$('[data-group]')) box.innerHTML = PROJECTS.filter((p) => p.group === box.dataset.group).map(cardHTML).join('');
  for (const box of $$('[data-body]')) box.innerHTML = (SECTIONS[box.dataset.body][state.lang].body || []).map((p) => `<p class="reveal">${esc(p)}</p>`).join('');
  $('#hobbies').innerHTML = SECTIONS.fuera[state.lang].items.map((h) =>
    `<article class="hobby reveal"><h3 class="hobby-stat">${esc(h.stat)}</h3><p class="hobby-label">${esc(h.label)}</p><p>${esc(h.text)}</p></article>`).join('');
  const fab = SECTIONS.fabrica[state.lang]; const fmt = new Intl.NumberFormat(state.lang === 'es' ? 'es-MX' : 'en-US');
  $('#fab-stats').innerHTML = fab.stats.map((s) =>
    `<div class="reveal"><dt>${esc(s.l)}</dt><dd data-n="${s.n}" data-plus="${s.plus ? 1 : 0}">${fmt.format(s.n)}${s.plus ? '+' : ''}</dd></div>`).join('');
  $('#fab-note').textContent = fab.statsNote;
  contarCifras(fmt);
  const tool = SECTIONS.herramientas[state.lang];
  $('#pipeline').innerHTML = tool.steps.map((s, i) =>
    `<li class="step reveal" style="--c:${KEYS[i % KEYS.length].color}"><span class="step-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.name)}</h3><span class="step-who">${esc(s.who)}</span><p>${esc(s.text)}</p></li>`).join('');
  $('#office-img').alt = tool.office.alt; $('#office-big').alt = tool.office.alt;
  $('#office-copy').innerHTML =
    `<p class="office-kicker">${esc(tool.office.kicker)}</p><h3>${esc(tool.office.title)}</h3><p>${esc(tool.office.text)}</p>
     <dl class="office-stats">${tool.office.stats.map(([n, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(n)}</dd></div>`).join('')}</dl>
     <p class="office-source">${esc(tool.office.source)}</p>`;
  $('#chips').innerHTML = SECTIONS.herramientas[state.lang].chips.map((c) => `<li class="reveal">${esc(c)}</li>`).join('');
  const linkItems = [
    ['GitHub', LINKS.github, true], ['LinkedIn', LINKS.linkedin, true],
  ];
  $('#code-links').innerHTML = linkItems.map(([n, u]) => `<a class="ghost" href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join('') +
    `<a class="ghost" href="https://github.com/rl7103405-gif/portfolio" target="_blank" rel="noopener">${esc(UI[state.lang].repo)} ↗</a>`;
  $('#cv-link').setAttribute('href', LINKS.cv);
  $('#contact-links').innerHTML =
    `<a href="mailto:${esc(LINKS.email)}">${esc(LINKS.email)}</a>` +
    linkItems.map(([n, u]) => `<a class="ghost" href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join('');
}

function applyText() {
  const ui = UI[state.lang];
  document.documentElement.lang = state.lang;
  for (const el of $$('[data-i18n]')) el.textContent = ui[el.dataset.i18n] ?? '';
  for (const el of $$('[data-i18n-html]')) el.innerHTML = ui[el.dataset.i18nHtml] ?? ''; // texto propio, no de usuarios
  for (const el of $$('[data-i18n-aria]')) el.setAttribute('aria-label', ui[el.dataset.i18nAria] ?? '');
  $('#btn-sound').setAttribute('aria-pressed', String(state.sound));
  $('#btn-sound').classList.toggle('on', state.sound);
  document.title = state.lang === 'en' ? 'Roberto Linares · Portfolio' : 'Roberto Linares · Portafolio';
}

function renderAll() {
  applyText(); renderLegend(); renderHtmlKeys(); renderSections(); observeReveals(); bindCards();
  setLcd(lcdBase(), false, true);
}

// ---------- pantallita (LCD) ----------
// 'announce' actualiza el texto aria-live: solo al presionar o al renderizar, no en el hover.
function setLcd(text, animate = true, announce = false) {
  if (announce) $('#lcd-text').textContent = text.replace(/^>\s*|_$/g, '');
  const el = $('#lcd-html');
  clearInterval(state.typer);
  if (!animate || reduced.matches || document.documentElement.classList.contains('has-3d')) { el.textContent = text; }
  else {
    let i = 0; el.textContent = '';
    state.typer = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(state.typer); }, 28);
  }
  state.keypad?.setLcd(text, animate && !reduced.matches);
}

// ---------- sonido: un solo AudioContext, creado solo cuando el usuario lo activa ----------
let actx = null;
let ruido = null;
function click(suave = false) {
  if (!state.sound) return;
  try {
    actx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') { if (suave) return; actx.resume(); } // el navegador pide un clic antes de sonar
    const t = actx.currentTime;
    if (!ruido) {
      ruido = actx.createBuffer(1, actx.sampleRate * 0.05, actx.sampleRate);
      const d = ruido.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    }
    // el "clac" de la tecla: ruido corto con filtro
    const n = actx.createBufferSource(); n.buffer = ruido;
    const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = suave ? 3800 : 2600; bp.Q.value = 1.2;
    const gn = actx.createGain(); gn.gain.value = suave ? 0.05 : 0.45;
    n.connect(bp).connect(gn).connect(actx.destination); n.start(t);
    if (suave) return;
    // el "thock" de abajo, cuando la tecla toca fondo
    const o = actx.createOscillator(); const g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(190, t + 0.012); o.frequency.exponentialRampToValueAtTime(70, t + 0.09);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.016); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.13);
  } catch { /* el audio nunca debe romper la navegación */ }
}

// ---------- navegación: una tecla abre su sección ----------
let ultimo = 0;
function press(i, { scroll = true } = {}) {
  const k = KEYS[i]; if (!k) return;
  const n = ++ultimo; // la última selección siempre gana
  click();
  state.current = i;
  setLcd(lcdBase(), true, true);
  state.keypad?.press(i);
  const btn = $(`#keys-html [data-i="${i}"]`);
  if (btn) { btn.classList.add('pressed'); setTimeout(() => btn.classList.remove('pressed'), 140); }
  $$('#legend a').forEach((a) => {
    const on = Number(a.dataset.i) === i;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  if (!scroll) return;
  setTimeout(() => {
    if (n !== ultimo) return;
    const sec = document.getElementById(k.id);
    sec.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    sec.querySelector('h2')?.focus({ preventScroll: true });
    history.replaceState(null, '', `${location.search}#${k.id}`);
  }, reduced.matches ? 0 : 420);
}

$('#keys-html').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) press(Number(b.dataset.i)); });
// El mismo adelanto al pasar el cursor por el respaldo HTML y por la leyenda.
for (const sel of ['#keys-html', '#legend']) {
  $(sel).addEventListener('pointerover', (e) => { const t = e.target.closest('[data-i]'); if (t && e.pointerType === 'mouse') hover(Number(t.dataset.i)); });
  // pointerout + relatedTarget: si el puntero sale de una tecla y no entra a otra, se restaura la pantallita.
  $(sel).addEventListener('pointerout', (e) => {
    if (e.pointerType !== 'mouse' || !e.target.closest('[data-i]')) return;
    if (!e.relatedTarget?.closest?.('[data-i]')) hover(-1);
  });
}
// 'Ver proyectos' (celular) pasa por la misma navegación que la tecla P, para que la pantallita no se quede atrás.
$('.hero-links a[href="#proyectos"]').addEventListener('click', (e) => { e.preventDefault(); press(KEYS.findIndex((k) => k.id === 'proyectos')); });
$('#legend').addEventListener('click', (e) => {
  const a = e.target.closest('a[data-i]'); if (!a) return;
  e.preventDefault(); press(Number(a.dataset.i));
});

// Teclado físico: solo cuando el aparato tiene el foco (no secuestra letras en toda la página).
const OES = KEYS.map((k, i) => (k.k === 'O' ? i : -1)).filter((i) => i >= 0);
let oIdx = 0;
$('#device').addEventListener('keydown', (e) => {
  if (e.target !== e.currentTarget) return; // Enter/Espacio sobre un botón hijo hace su click nativo
  if (e.repeat || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
  const key = e.key.toUpperCase();
  let i = -1;
  if (key === 'ENTER') i = KEYS.findIndex((k) => k.k === '↵');
  else if (key === 'O') { i = OES[oIdx % OES.length]; oIdx++; }
  else i = KEYS.findIndex((k) => k.k === key);
  if (i >= 0) { e.preventDefault(); press(i); }
});

// ---------- botones de arriba ----------
$('#btn-lang').addEventListener('click', () => {
  state.lang = state.lang === 'es' ? 'en' : 'es';
  guardar('lang', state.lang);
  const u = new URL(location.href); u.searchParams.set('lang', state.lang); history.replaceState(null, '', u);
  renderAll();
  state.keypad?.setLang(state.lang);
});
$('#btn-sound').addEventListener('click', () => {
  state.sound = !state.sound; guardar('sound', state.sound ? '1' : '0'); applyText(); click();
});

// ---------- animaciones de scroll ----------
let io = null;
function observeReveals() {
  if (reduced.matches || !('IntersectionObserver' in window)) { document.documentElement.classList.remove('anim'); return; }
  document.documentElement.classList.add('anim');
  io?.disconnect();
  io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.setProperty('--d', `${(i % 6) * 60}ms`); io.observe(el); });
}

// Tarjetas que se inclinan hacia el cursor (solo con mouse y sin movimiento reducido).
function bindCards() {
  if (reduced.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const c of $$('.card')) {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', `${(x - 0.5) * 8}deg`); c.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      c.style.setProperty('--mx', `${x * 100}%`); c.style.setProperty('--my', `${y * 100}%`);
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  }
}

// ---------- el 3D: se carga aparte; si algo falla, queda el respaldo ----------
function webgl2() { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } }

let carga3D = 0; // token: una carga vieja no debe montarse si cambió algo mientras esperaba
const sinEspera = () => document.documentElement.classList.remove('wait-3d');

async function load3D() {
  if (reduced.matches || !webgl2()) { sinEspera(); return; }
  const token = ++carga3D;
  try {
    const mod = await import('./keypad3d.js?v=20261007i');
    const keypad = await mod.init($('#device-3d'), {
      keys: KEYS, lang: state.lang, lcd: lcdBase(),
      onPress: (i) => press(i),
      onHover: (i) => hover(i),
      onFail: () => { document.documentElement.classList.remove('has-3d'); sinEspera(); state.keypad = null; },
    });
    if (reduced.matches || token !== carga3D) { keypad.dispose(); return; }
    state.keypad = keypad;
    state.keypad.setLcd(lcdBase(), false);
    document.documentElement.classList.add('has-3d');
    sinEspera();
  } catch (err) {
    console.warn('3D no disponible, se queda el respaldo HTML:', err);
    document.documentElement.classList.remove('has-3d');
    sinEspera();
    state.keypad = null;
  }
}

reduced.addEventListener?.('change', () => { if (reduced.matches) { carga3D++; state.keypad?.dispose(); state.keypad = null; document.documentElement.classList.remove('has-3d'); sinEspera(); } renderAll(); });

renderAll();

// Entrada con ancla (#fabrica): salta a la sección sin animación y marca su tecla.
const anclaIdx = KEYS.findIndex((k) => k.id === location.hash.slice(1));
if (anclaIdx >= 0) {
  state.current = anclaIdx;
  renderLegend(); setLcd(lcdBase(), false, true);
  document.getElementById(KEYS[anclaIdx].id).scrollIntoView({ behavior: 'instant', block: 'start' });
}

// El 3D espera a que el navegador esté libre y no se carga con ahorro de datos.
if (!navigator.connection?.saveData) {
  if ('requestIdleCallback' in window) requestIdleCallback(load3D, { timeout: 2000 });
  else setTimeout(load3D, 200);
}

// ---------- oficina en grande ----------
const dlg = $('#office-dlg');
$('#office-open').addEventListener('click', () => { if (dlg.showModal) dlg.showModal(); else window.open($('#office-big').src, '_blank', 'noopener'); });
if (dlg.showModal) {
  $('#office-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); // clic fuera de la imagen
}

// ---------- videos demo: el archivo se descarga solo al tocar play ----------
const demoDlg = $('#demo-dlg'); const demoVid = $('#demo-video');
function cerrarDemo() { $('#demo-error').hidden = true; demoVid.pause(); demoVid.removeAttribute('src'); demoVid.load(); }
// Solo cuenta el error si hay un video puesto (al cerrar, quitar el src también dispara 'error').
demoVid.addEventListener('error', () => { if (demoVid.getAttribute('src')) { $('#demo-error').textContent = UI[state.lang].demoError; $('#demo-error').hidden = false; } });
document.addEventListener('click', (e) => {
  const t = e.target.closest('.demo-thumb'); if (!t) return;
  if (!demoDlg.showModal) { window.open(t.dataset.video, '_blank', 'noopener'); return; }
  demoVid.poster = t.dataset.poster; demoVid.width = Number(t.dataset.w); demoVid.height = Number(t.dataset.h);
  demoVid.src = t.dataset.video; demoDlg.setAttribute('aria-label', t.dataset.title);
  demoDlg.showModal(); demoVid.play().catch(() => {});
});
if (demoDlg.showModal) {
  $('#demo-close').addEventListener('click', () => demoDlg.close());
  let toqueFuera = false;
  demoDlg.addEventListener('pointerdown', (e) => { toqueFuera = e.target === demoDlg; });
  demoDlg.addEventListener('click', (e) => { if (e.target === demoDlg && toqueFuera) demoDlg.close(); });
  demoDlg.addEventListener('close', cerrarDemo);
}

// ---------- botón "volver al teclado" ----------
const toTop = $('#to-top');
toTop.addEventListener('click', () => {
  $('#inicio').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
  $('#device').focus({ preventScroll: true });
  history.replaceState(null, '', location.pathname + location.search);
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => { toTop.classList.toggle('show', !en.isIntersecting); }, { threshold: 0.15 }).observe($('#device'));
} else { toTop.classList.add('show'); }
