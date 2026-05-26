/* ═══════════════════════════════
   Felipe Santos — scripts.js
═══════════════════════════════ */

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
});

// Smooth trail
function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.transform = `translate(${tx - 14}px, ${ty - 14}px)`;
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .pillar, .sc-item, .proj-card, .proj-featured').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform += ' scale(2)';
    cursor.style.opacity = '0.5';
    trail.style.transform += ' scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.opacity = '1';
  });
});

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 80
    ? 'rgba(8,12,16,0.97)'
    : 'rgba(8,12,16,0.85)';
});

// ── BACK TO TOP ──
const topBtn = document.getElementById('top-btn');
window.addEventListener('scroll', () => {
  topBtn.classList.toggle('show', window.scrollY > 400);
});
topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── REVEAL ON SCROLL ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SMOOTH NAV LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('nav').offsetHeight;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── FORM SUBMIT (mailto fallback) ──
const form = document.getElementById('form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const name    = data.get('name');
  const email   = data.get('email');
  const servico = data.get('servico');
  const msg     = data.get('message');

  const body = `Nome: ${name}%0AE-mail: ${email}%0AServiço: ${servico}%0A%0AMensagem:%0A${msg}`;
  const waMsg = encodeURIComponent(`Oi Felipe! Sou ${name} (${email}).%0AServiço: ${servico}%0A${msg}`);

  // Abre WhatsApp com mensagem pré-preenchida
  window.open(`https://wa.me/5541984084116?text=${waMsg}`, '_blank');
  form.reset();

  // Feedback visual
  const btn = form.querySelector('.fsubmit');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>Mensagem enviada! ✓</span>';
  btn.style.background = '#4caf50';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 3000);
});

// ── PILLAR HOVER expand desc ──
document.querySelectorAll('.pillar').forEach(p => {
  const desc = p.querySelector('.pillar-desc');
  p.addEventListener('mouseenter', () => {
    desc.style.maxHeight = '80px';
    desc.style.opacity   = '1';
  });
  p.addEventListener('mouseleave', () => {
    desc.style.maxHeight = '';
    desc.style.opacity   = '';
  });
});
