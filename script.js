/* ═══════════════════════════════════════
   CURSOR
═══════════════════════════════════════ */
const cursor = document.getElementById('cursor');
let mx = -100, my = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 14}px,${my - 14}px)`;
  document.getElementById('coord-display').textContent =
    `x: ${String(Math.round(mx)).padStart(4,' ')} · y: ${String(Math.round(my)).padStart(4,' ')}`;
});

function setCursorAccent() {
  document.getElementById('cursor-dot').setAttribute('fill', '#8aad8a');
  document.getElementById('cursor-ring').setAttribute('stroke', '#8aad8a');
}
function setCursorDefault() {
  document.getElementById('cursor-dot').setAttribute('fill', '#7bc8bc');
  document.getElementById('cursor-ring').setAttribute('stroke', '#7bc8bc');
}

/* ═══════════════════════════════════════
   INTERACTIVE STICKERS TOGGLE
═══════════════════════════════════════ */
function handleStickerClick(event, id) {
  event.stopPropagation();
  const circle = document.getElementById(`sticker-c-${id}`);
  const text = document.getElementById(`sticker-t-${id}`);
  if (circle && text) {
    circle.classList.toggle('active');
    text.classList.toggle('active');
    const r = document.createElement('div');
    r.className = 'ripple sage';
    r.style.left = event.clientX + 'px';
    r.style.top  = event.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 750);
  }
}

/* ═══════════════════════════════════════
   CANVAS TRAIL
═══════════════════════════════════════ */
const canvas = document.getElementById('trail');
const ctx    = canvas.getContext('2d');
let pts = [];
let lastT = 0;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastT < 18) return;
  lastT = now;
  pts.push({ x: e.clientX, y: e.clientY, age: 0, c: Math.random() > 0.48 ? 0 : 1 });
});

function animateTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pts = pts.filter(p => p.age < 22);
  pts.forEach(p => {
    p.age++;
    const t = 1 - p.age / 22;
    const r = 2.2 * t;
    ctx.beginPath();
    ctx.fillStyle = p.c === 0
      ? `rgba(123,200,188,${t * 0.5})`
      : `rgba(138,173,138,${t * 0.45})`;
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ═══════════════════════════════════════
   CLICK RIPPLE
═══════════════════════════════════════ */
document.addEventListener('click', e => {
  try { if (e.target.closest('#flame-click')) return; } catch(_){}
  const d = document.createElement('div');
  d.className = 'ripple' + (Math.random() > 0.5 ? '' : ' sage');
  d.style.left = e.clientX + 'px';
  d.style.top  = e.clientY + 'px';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 750);
});

/* ═══════════════════════════════════════
   FLAME TOGGLE — starts UNLIT
═══════════════════════════════════════ */
let flameOn = false;

function handleFlameClick(e) {
  e.stopPropagation();
  toggleFlame();
  const r = document.createElement('div');
  r.className = 'ripple sage';
  r.style.left = e.clientX + 'px';
  r.style.top  = e.clientY + 'px';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 750);
}

function toggleFlame() {
  flameOn = !flameOn;
  const fg  = document.getElementById('flame-g');
  const sg  = document.getElementById('smoke-g');
  const wd  = document.getElementById('wick-dot');
  const pg  = document.getElementById('pulse-g');

  if (flameOn) {
    fg.style.opacity  = '1';
    sg.style.opacity  = '0';
    pg.style.opacity  = '0';
    wd.setAttribute('fill', '#7bc8bc');
    wd.setAttribute('r', '1.8');
  } else {
    fg.style.opacity  = '0';
    sg.style.opacity  = '1';
    pg.style.opacity  = '1';
    wd.setAttribute('fill', '#555');
    wd.setAttribute('r', '1.2');
    setTimeout(() => {
      const s = document.getElementById('smoke-g');
      if (s) s.style.opacity = '0';
    }, 1800);
  }
}

/* ═══════════════════════════════════════
   DOT-MATRIX CAKE FILL
═══════════════════════════════════════ */
(function generateDots() {
  const g = document.getElementById('cake-dots');
  const ns = 'http://www.w3.org/2000/svg';
  const spacing = 12;
  const yTop = 142, yBot = 268;
  const xTL = 80, xTR = 200, xBL = 66, xBR = 214;

  for (let y = yTop + 6; y <= yBot - 5; y += spacing) {
    const t  = (y - yTop) / (yBot - yTop);
    const xL = xTL + (xBL - xTL) * t;
    const xR = xTR + (xBR - xTR) * t;

    for (let x = xL + 5; x <= xR - 5; x += spacing) {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', x.toFixed(1));
      c.setAttribute('cy', y.toFixed(1));
      c.setAttribute('r',  '1.25');
      c.setAttribute('fill', '#111');
      const op = y < 165 ? 0.14 : y < 193 ? 0.17 : y < 228 ? 0.20 : 0.22;
      c.setAttribute('opacity', op);
      g.appendChild(c);
    }
  }
})();
