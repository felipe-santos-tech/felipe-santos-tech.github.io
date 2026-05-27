/* ═══════════════════════════════
   FELIPE SANTOS — script.js
═══════════════════════════════ */

// ── THEME TOGGLE ──
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('fs-theme') || 'dark';
html.setAttribute('data-theme', saved);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fs-theme', next);
});

// ── CURSOR PERSONALIZADO ──
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (window.innerWidth > 640) {
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

  document.querySelectorAll('a, button, .about-card, .proj-card, .proj-featured, .sg-item, .cl-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(2.2)';
      cursor.style.opacity = '0.5';
      cursorRing.style.transform += ' scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.opacity = '1';
    });
  });
}

// ── NAV LATERAL ATIVA NO SCROLL ──
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

function setActiveNav() {
  let current = '';
  const offset = window.innerHeight * 0.4;
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - offset) {
      current = sec.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

// ── SCROLL SUAVE ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navW = window.innerWidth > 640 ? 0 : 0;
      window.scrollTo({ top: target.offsetTop - 40, behavior: 'smooth' });
    }
  });
});

// ── BACK TO TOP ──
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  topBtn?.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── REVEAL ON SCROLL (fade-up) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ── FORMULÁRIO → WHATSAPP ──
const form = document.getElementById('cform');
const submitBtn = document.getElementById('submitBtn');

form?.addEventListener('submit', e => {
  e.preventDefault();
  const fd   = new FormData(form);
  const name = fd.get('name')    || '';
  const mail = fd.get('email')   || '';
  const serv = fd.get('servico') || '';
  const msg  = fd.get('message') || '';

  const text = encodeURIComponent(
    `Oi Felipe! Sou ${name} (${mail}).\nServiço: ${serv}\n\n${msg}`
  );
  window.open(`https://wa.me/5541984084116?text=${text}`, '_blank');

  const orig = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem enviada!';
  submitBtn.style.background = '#22c55e';
  form.reset();

  setTimeout(() => {
    submitBtn.innerHTML = orig;
    submitBtn.style.background = '';
  }, 3500);
});

// ── NAV MOBILE: highlight no mobile ──
// (a nav lateral some em mobile, mas deixa o scroll listener ativo pra quando tiver visível)