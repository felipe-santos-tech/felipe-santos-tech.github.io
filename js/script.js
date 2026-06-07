/* ═══════════════════════════════
   FELIPE SANTOS — script.js v3
════════════════════════════════ */

// ── THEME ──
const html     = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const saved    = localStorage.getItem('fs-theme') || 'dark';
html.setAttribute('data-theme', saved);
themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fs-theme', next);
});

// ── NAV ATIVA ──
const currentPage = document.body.dataset.page;
document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.toggle('active', l.dataset.page === currentPage));
document.querySelectorAll('.mobile-nav-link[data-page]').forEach(l => l.classList.toggle('active', l.dataset.page === currentPage));

// ── TOPNAV SCROLL ──
const topnav = document.querySelector('.topnav');
window.addEventListener('scroll', () => {
  topnav?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── CURSOR ──
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (window.innerWidth > 640 && cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });
  function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursorRing.style.transform = `translate(${rx - 15}px, ${ry - 15}px)`;
    requestAnimationFrame(animRing);
  }
  animRing();
}

// ── BACK TO TOP ──
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => topBtn?.classList.toggle('show', window.scrollY > 400), { passive: true });
topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── MENU MOBILE ──
const hamburger        = document.getElementById('hamburger');
const mobileNav        = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const closeMobileNav   = document.getElementById('closeMobileNav');

// Garante que o estado começa limpo em cada carregamento de página
html.classList.remove('menu-open');

function openMenu() {
  hamburger?.classList.add('active');
  mobileNav?.classList.add('active');
  mobileNavOverlay?.classList.add('active');
  html.classList.add('menu-open');
}
function closeMenu() {
  hamburger?.classList.remove('active');
  mobileNav?.classList.remove('active');
  mobileNavOverlay?.classList.remove('active');
  html.classList.remove('menu-open');
}

hamburger?.addEventListener('click', openMenu);
closeMobileNav?.addEventListener('click', closeMenu);
mobileNavOverlay?.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));

// Fecha com Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
