// El aparato retro en 3D: carcasa de metal, pantallita LCD y diez teclas.
// Se carga con import() desde app.js; si algo falla, app.js deja el respaldo HTML.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const fontsReady = () => Promise.race([
  Promise.all([document.fonts.load('800 120px "Bricolage Grotesque"'), document.fonts.load('120px "VT323"')]),
  new Promise((r) => setTimeout(r, 2500)),
]).catch(() => {});

function easeOutBack(x) { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }

// Si algo falla al montar, se liberan renderer, canvas y observadores ya creados y se vuelve a lanzar el error.
export async function init(container, opts) {
  await fontsReady();
  const limpiar = [];
  try { return montar(container, opts, limpiar); }
  catch (err) { for (const f of limpiar.reverse()) { try { f(); } catch { /* seguir liberando */ } } throw err; }
}

function montar(container, { keys, lcd, onPress, onHover, onFail }, limpiar) {
  const coarse = matchMedia('(pointer: coarse)').matches; // celular: menos fps y materiales más baratos

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  limpiar.push(() => { renderer.dispose(); renderer.domElement.remove(); });
  if (!renderer.capabilities.isWebGL2) throw new Error('sin WebGL2');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.75;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-4, 8, 5);
  scene.add(sun, new THREE.AmbientLight(0xffffff, 0.25));

  const device = new THREE.Group();
  const tilt = new THREE.Group();
  tilt.add(device);
  scene.add(tilt);

  // ---------- carcasa ----------
  const metal = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 0.88, roughness: 0.32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x23262c, metalness: 0.6, roughness: 0.5 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(6.6, 0.8, 4.7, 6, 0.32), metal);
  device.add(body);

  const bezel = new THREE.Mesh(new RoundedBoxGeometry(5.5, 0.24, 1.32, 4, 0.1), dark);
  bezel.position.set(0, 0.46, -1.48);
  device.add(bezel);

  const bed = new THREE.Mesh(new RoundedBoxGeometry(6.0, 0.12, 2.6, 4, 0.06), new THREE.MeshStandardMaterial({ color: 0x15171b, roughness: 0.8 }));
  bed.position.set(0, 0.4, 0.72);
  device.add(bed);

  // Rejilla naranja (como en el reel)
  const gCanvas = document.createElement('canvas'); gCanvas.width = 512; gCanvas.height = 32;
  const gx = gCanvas.getContext('2d');
  for (let x = 0; x < 512; x += 12) { gx.fillStyle = '#ef8a2a'; gx.fillRect(x, 0, 8, 32); gx.fillStyle = '#9a4f10'; gx.fillRect(x + 8, 0, 4, 32); }
  const grille = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.16),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(gCanvas), metalness: 0.4, roughness: 0.5 }));
  grille.material.map.colorSpace = THREE.SRGBColorSpace;
  grille.position.set(0, 0.42, -0.62);
  device.add(grille);

  // Tornillos y LEDs
  const screwGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.05, 20);
  for (const [x, z] of [[-2.95, -2.05], [2.95, -2.05], [-2.95, 2.05], [2.95, 2.05]]) {
    const s = new THREE.Mesh(screwGeo, dark); s.position.set(x, 0.41, z); device.add(s);
  }
  const leds = [0xff4b3e, 0x9cff7a].map((c, i) => {
    const m = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.2 });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), m);
    led.position.set(2.5 + i * 0.22, 0.43, -0.62);
    device.add(led);
    return m;
  });

  // Sombra falsa (barata) debajo del aparato
  const sh = document.createElement('canvas'); sh.width = sh.height = 128;
  const shx = sh.getContext('2d');
  const grad = shx.createRadialGradient(64, 64, 8, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.55)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  shx.fillStyle = grad; shx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.62;
  tilt.add(shadow);

  // ---------- pantallita LCD ----------
  const lcdCanvas = document.createElement('canvas'); lcdCanvas.width = 1024; lcdCanvas.height = 196;
  const lx = lcdCanvas.getContext('2d');
  const lcdTex = new THREE.CanvasTexture(lcdCanvas);
  lcdTex.colorSpace = THREE.SRGBColorSpace;
  lcdTex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const lcdMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.06, 0.97), new THREE.MeshBasicMaterial({ map: lcdTex, toneMapped: false }));
  lcdMesh.rotation.x = -Math.PI / 2;
  lcdMesh.position.set(0, 0.585, -1.48);
  device.add(lcdMesh);

  const lcdState = { text: lcd, shown: lcd.length, start: 0, typing: false, cursor: true, lastDraw: '' };
  function drawLcd() {
    const visible = lcdState.text.slice(0, lcdState.shown).replace(/_$/, '');
    const key = `${visible}|${lcdState.cursor}`;
    if (key === lcdState.lastDraw) return;
    lcdState.lastDraw = key;
    const W = lcdCanvas.width, H = lcdCanvas.height;
    const bg = lx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0f2412'); bg.addColorStop(1, '#081409');
    lx.fillStyle = bg; lx.fillRect(0, 0, W, H);
    lx.font = '112px "VT323", monospace'; lx.textBaseline = 'middle';
    lx.shadowColor = 'rgba(156,255,122,0.85)'; lx.shadowBlur = 18; lx.fillStyle = '#9cff7a';
    const maxW = W - 80; let txt = visible;
    while (lx.measureText(txt).width > maxW && txt.length > 1) txt = txt.slice(1); // si no cabe, se ve el final
    lx.fillText(txt, 40, H / 2 + 6);
    if (lcdState.cursor) { const w = lx.measureText(txt).width; lx.fillRect(48 + w, H / 2 - 38, 42, 80); }
    lx.shadowBlur = 0; lx.fillStyle = 'rgba(0,0,0,0.28)';
    for (let y = 0; y < H; y += 4) lx.fillRect(0, y, W, 2);
    lcdTex.needsUpdate = true;
  }
  drawLcd();

  // ---------- teclas ----------
  const keyMeshes = [];
  const geoKey = new RoundedBoxGeometry(0.86, 0.5, 0.86, 4, 0.14);
  const geoWide = new RoundedBoxGeometry(1.36, 0.5, 0.86, 4, 0.14);
  const rows = [
    keys.slice(0, 5).map((k, j) => ({ k, x: -1.92 + j * 0.96, z: 0.22 })),
    keys.slice(5, 9).map((k, j) => ({ k, x: -2.16 + j * 0.96, z: 1.24 })).concat([{ k: keys[9], x: 1.98, z: 1.24 }]),
  ].flat();
  const restY = 0.71;
  rows.forEach(({ k, x, z }, i) => {
    const color = new THREE.Color(k.color);
    const mat = coarse
      ? new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.0, emissive: color, emissiveIntensity: 0 })
      : new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, metalness: 0.0, clearcoat: 0.35, clearcoatRoughness: 0.35, emissive: color, emissiveIntensity: 0 });
    const mesh = new THREE.Mesh(k.wide ? geoWide : geoKey, mat);
    mesh.position.set(x, restY, z);
    mesh.userData = { i, y: 0, hover: 0, pressedUntil: 0, introAt: 0 };
    // letra en la cara de arriba
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const cx = c.getContext('2d');
    cx.fillStyle = k.wide ? '#eceae4' : '#1b1b1b';
    cx.font = `800 ${k.wide ? 150 : 172}px "Bricolage Grotesque", sans-serif`;
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(k.k, 128, 140);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    label.rotation.x = -Math.PI / 2; label.position.y = 0.252;
    label.raycast = () => {};
    mesh.add(label);
    device.add(mesh);
    keyMeshes.push(mesh);
  });
  keyMeshes.sort((a, b) => a.userData.i - b.userData.i);

  // ---------- encuadre ----------
  function fit() {
    const w = container.clientWidth || 1, h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const dist = 10 + Math.max(0, 1.5 - camera.aspect) * 8;
    camera.position.set(0, dist * 0.8, dist * 0.6);
    camera.lookAt(0, -0.15, 0.4);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(fit); ro.observe(container);
  limpiar.push(() => ro.disconnect());
  fit();

  // ---------- puntero ----------
  const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
  let hovered = -1, down = null;
  const tilted = { x: 0, y: 0 };
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(keyMeshes, false)[0];
    return hit ? hit.object.userData.i : -1;
  }
  const el = renderer.domElement;
  const onMove = (e) => {
    if (e.pointerType === 'mouse') { const h = pick(e); if (h !== hovered) { hovered = h; onHover?.(h); } el.style.cursor = hovered >= 0 ? 'pointer' : 'default'; }
  };
  const onDown = (e) => { down = { x: e.clientX, y: e.clientY, i: pick(e), id: e.pointerId }; };
  const onUp = (e) => {
    if (!down || down.id !== e.pointerId) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10; // fue arrastre / scroll, no tecla
    const i = pick(e);
    if (!moved && i >= 0 && i === down.i) onPress(i);
    down = null;
  };
  const onCancel = () => { down = null; };
  const onLeave = () => { if (hovered !== -1) { hovered = -1; onHover?.(-1); } el.style.cursor = 'default'; };
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onCancel);
  el.addEventListener('pointerleave', onLeave);
  const fine = matchMedia('(pointer: fine)').matches;
  const onWinMove = (e) => { tilted.x = (e.clientX / innerWidth) * 2 - 1; tilted.y = (e.clientY / innerHeight) * 2 - 1; };
  if (fine) { addEventListener('pointermove', onWinMove, { passive: true }); limpiar.push(() => removeEventListener('pointermove', onWinMove)); }

  // ---------- ciclo de render, pausado cuando no se ve ----------
  let prev = performance.now();
  let visible = true, raf = 0, dead = false;
  const t0 = performance.now() / 1000;
  keyMeshes.forEach((m, i) => { m.userData.introAt = t0 + 0.25 + i * 0.07; });
  let lastBlink = 0, lastFrame = 0;

  // Si el dibujo truena, se libera todo y app.js regresa al respaldo HTML.
  function frame() {
    try { tick(); } catch (err) { console.warn('3D: falló el dibujo, se queda el respaldo HTML:', err); dispose(); onFail?.(); }
  }
  function tick() {
    raf = 0;
    if (dead || !visible || document.hidden) return;
    const nowMs = performance.now();
    if (coarse && nowMs - lastFrame < 30) { raf = requestAnimationFrame(frame); return; } // ~30 fps en celular
    lastFrame = nowMs;
    const dt = Math.min((nowMs - prev) / 1000, 0.05); prev = nowMs;
    const now = nowMs / 1000;

    for (const m of keyMeshes) {
      const u = m.userData;
      const intro = Math.min(1, Math.max(0, (now - u.introAt) / 0.6));
      const introOff = (1 - easeOutBack(intro)) * 2.8;
      const target = now < u.pressedUntil ? -0.2 : (u.i === hovered ? 0.08 : 0);
      u.y += (target - u.y) * Math.min(1, dt * (target < 0 ? 40 : 14));
      m.position.y = restY + u.y + (intro < 1 ? introOff : 0);
      m.visible = intro > 0;
      u.hover += ((u.i === hovered ? 1 : 0) - u.hover) * Math.min(1, dt * 10);
      m.material.emissiveIntensity = u.hover * 0.22 + (now < u.pressedUntil ? 0.35 : 0);
    }

    // inclinación hacia el cursor + flotar suave
    tilt.rotation.x += ((tilted.y * 0.07) - tilt.rotation.x) * Math.min(1, dt * 4);
    tilt.rotation.z += ((-tilted.x * 0.06) - tilt.rotation.z) * Math.min(1, dt * 4);
    device.position.y = Math.sin(now * 1.3) * 0.05;
    device.rotation.y = Math.sin(now * 0.45) * 0.035;
    leds[0].emissiveIntensity = 0.6 + 0.6 * (0.5 + 0.5 * Math.sin(now * 3.2));
    leds[1].emissiveIntensity = 0.4 + 0.8 * (0.5 + 0.5 * Math.sin(now * 1.7 + 1));

    // pantallita: escribe letra por letra y parpadea el cursor
    if (lcdState.typing) {
      const n = Math.floor((now - lcdState.start) / 0.035);
      lcdState.shown = Math.min(lcdState.text.length, n);
      if (lcdState.shown >= lcdState.text.length) lcdState.typing = false;
    }
    if (now - lastBlink > 0.5) { lcdState.cursor = !lcdState.cursor; lastBlink = now; }
    drawLcd();

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  const wake = () => { if (!raf && !dead && visible && !document.hidden) { prev = performance.now(); raf = requestAnimationFrame(frame); } };
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; wake(); }, { threshold: 0.02 });
  io.observe(container);
  limpiar.push(() => io.disconnect());
  const onVis = () => wake();
  document.addEventListener('visibilitychange', onVis);
  limpiar.push(() => document.removeEventListener('visibilitychange', onVis));

  el.addEventListener('webglcontextlost', (e) => { e.preventDefault(); dispose(); onFail?.(); });

  function dispose() {
    if (dead) return;
    dead = true; cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    removeEventListener('pointermove', onWinMove);
    scene.traverse((o) => { o.geometry?.dispose(); const m = o.material; if (m) { m.map?.dispose(); m.dispose(); } });
    envTex.dispose(); renderer.dispose(); el.remove();
  }

  wake();

  return {
    press(i) {
      const m = keyMeshes[i]; if (!m) return;
      m.userData.pressedUntil = performance.now() / 1000 + 0.16;
      wake();
    },
    setLcd(text, animate) {
      lcdState.text = text; lcdState.lastDraw = '';
      if (animate) { lcdState.typing = true; lcdState.shown = 0; lcdState.start = performance.now() / 1000; }
      else { lcdState.typing = false; lcdState.shown = text.length; }
      wake();
    },
    setLang() { /* las letras de las teclas no cambian; la pantallita la maneja app.js */ },
    dispose,
  };
}
