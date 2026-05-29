/* ═══════════════════════════════
   FELIPE SANTOS — script.js
════════════════════════════════ */

// ── THEME TOGGLE ──
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

const saved = localStorage.getItem('fs-theme') || 'dark';
html.setAttribute('data-theme', saved);

themeBtn?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', next);
  localStorage.setItem('fs-theme', next);
});

// ── CURSOR PERSONALIZADO ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

if (window.innerWidth > 640 && cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;

    cursorRing.style.transform = `translate(${rx - 15}px, ${ry - 15}px)`;
    requestAnimationFrame(animRing);
  }

  animRing();

  document
    .querySelectorAll('a, button, .about-card, .proj-card, .proj-featured, .sg-item, .cl-item')
    .forEach(el => {
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

      window.scrollTo({
        top: target.offsetTop - 40,
        behavior: 'smooth'
      });
    }
  });
});

// ── BACK TO TOP ──
const topBtn = document.getElementById('topBtn');

window.addEventListener('scroll', () => {
  topBtn?.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

topBtn?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ── REVEAL ON SCROLL (fade-up) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.fade-up').forEach(el => {
  revealObserver.observe(el);
});

// ── FORMULÁRIO → WEB3FORMS + WHATSAPP + HCAPTCHA ──
const form = document.getElementById('cform');
const submitBtn = document.getElementById('submitBtn');

const whatsappNumber = '5541984084116';

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const name = formData.get('name') || 'Não informado';
  const email = formData.get('email') || 'Não informado';
  const servico = formData.get('servico') || 'Não selecionado';
  const message = formData.get('message') || 'Não informado';

  const captchaResponse = formData.get('h-captcha-response');

  if (!captchaResponse) {
    Swal.fire({
      title: 'Captcha obrigatório',
      text: 'Confirme que você não é um robô antes de enviar.',
      icon: 'warning',
      background: '#0e1420',
      color: '#e8f0ff',
      confirmButtonColor: '#f97316'
    });

    return;
  }

  const waText =
    `Olá Felipe!%0A%0A` +
    `Solicitei contato pelo portfólio:%0A%0A` +
    `*Nome:* ${encodeURIComponent(name)}%0A` +
    `*E-mail:* ${encodeURIComponent(email)}%0A` +
    `*Tipo de Serviço:* ${encodeURIComponent(servico)}%0A%0A` +
    `*Mensagem:*%0A${encodeURIComponent(message)}%0A%0A` +
    `---%0AEnviado via site`;

  const waUrl = `https://wa.me/${whatsappNumber}?text=${waText}`;

  formData.set('subject', `Novo Contato - ${name} (${servico})`);

  const originalHTML = submitBtn.innerHTML;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitBtn.disabled = true;

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const json = await res.json();

    if (json.success) {
      const result = await Swal.fire({
        title: 'Mensagem enviada!',
        text: 'Deseja abrir o WhatsApp com os detalhes prontos?',
        icon: 'success',
        background: '#0e1420',
        color: '#e8f0ff',
        showCancelButton: true,
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#4a5870',
        confirmButtonText: 'Sim, abrir WhatsApp',
        cancelButtonText: 'Não, obrigado'
      });

      if (result.isConfirmed) {
        window.open(waUrl, '_blank');
      }

      submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
      submitBtn.style.background = '#22c55e';

      form.reset();

      if (typeof hcaptcha !== 'undefined') {
        hcaptcha.reset();
      }

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3500);

    } else {
      Swal.fire({
        title: 'Ops...',
        text: json.message || 'Erro ao enviar. Tente novamente.',
        icon: 'error',
        background: '#0e1420',
        color: '#e8f0ff',
        confirmButtonColor: '#f97316'
      });

      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      if (typeof hcaptcha !== 'undefined') {
        hcaptcha.reset();
      }
    }

  } catch (err) {
    Swal.fire({
      title: 'Erro',
      text: 'Falha na conexão. Use o WhatsApp flutuante.',
      icon: 'error',
      background: '#0e1420',
      color: '#e8f0ff',
      confirmButtonColor: '#f97316'
    });

    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;

    if (typeof hcaptcha !== 'undefined') {
      hcaptcha.reset();
    }
  }
});

// ── NAV MOBILE: highlight no mobile ──
// A nav lateral some em mobile, mas o scroll listener fica ativo para quando estiver visível.