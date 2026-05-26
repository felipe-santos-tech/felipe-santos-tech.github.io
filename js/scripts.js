/* ============================================================
   FELIPE SANTOS — scripts.js
   Theme · Scroll FX · Back-to-top · Contact Form
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. THEME TOGGLE
  -------------------------------------------------------- */
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'felipe-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(saved);

  themeBtn && themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });


  /* --------------------------------------------------------
     2. SCROLL ANIMATIONS (Intersection Observer)
  -------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach((el) => observer.observe(el));


  /* --------------------------------------------------------
     3. BACK TO TOP
  -------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 320);
  }, { passive: true });

  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* --------------------------------------------------------
     4. NAVBAR SHADOW ON SCROLL
  -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 2px 24px rgba(26,22,18,0.12)'
      : 'none';
  }, { passive: true });


  /* --------------------------------------------------------
     5. CONTACT FORM (web3forms + sweetalert2)
  -------------------------------------------------------- */
  const form = document.getElementById('contato-form');
  const ACCESS_KEY = '9fc1f0ed-f1ec-47ac-97fe-a08c6ad082c9';
  const WA_NUMBER = '5541984084116';

  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name    = formData.get('name')    || 'Não informado';
    const email   = formData.get('email')   || 'Não informado';
    const servico = formData.get('servico') || 'Não selecionado';
    const prazo   = formData.get('prazo')   || 'Não informado';
    const message = formData.get('message') || 'Não informado';

    const waText = [
      'Olá Felipe!',
      '',
      'Solicitei orçamento/contato pelo portfólio:',
      '',
      `*Nome:* ${name}`,
      `*E-mail:* ${email}`,
      `*Tipo de Serviço:* ${servico}`,
      `*Prazo:* ${prazo}`,
      '',
      '*Mensagem / Projeto:*',
      message,
      '',
      '---',
      'Enviado via site',
    ].join('%0A');

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(decodeURIComponent(waText))}`;

    formData.append('access_key', ACCESS_KEY);
    formData.append('subject', `Novo Orçamento/Contato — ${name} (${servico})`);

    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    }

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        const result = await Swal.fire({
          title: 'Enviado com sucesso! 🎉',
          text: 'Deseja abrir o WhatsApp com os detalhes prontos?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#c45c1a',
          cancelButtonColor: '#8a7f72',
          confirmButtonText: 'Sim, abrir WhatsApp',
          cancelButtonText: 'Não, obrigado',
        });

        if (result.isConfirmed) {
          window.open(waUrl, '_blank');
          Swal.fire({ title: 'Pronto!', text: 'WhatsApp aberto! Aguardo seu contato.', icon: 'success', confirmButtonColor: '#c45c1a' });
        } else {
          Swal.fire({ title: 'Tudo certo!', text: 'Mensagem recebida! Qualquer coisa, use o botão flutuante do WhatsApp.', icon: 'success', confirmButtonColor: '#c45c1a' });
        }
        form.reset();
      } else {
        Swal.fire({ title: 'Ops...', text: 'Erro ao enviar. Tente novamente ou use o botão do WhatsApp.', icon: 'error', confirmButtonColor: '#c45c1a' });
      }
    } catch (err) {
      console.error('Form error:', err);
      Swal.fire({ title: 'Erro de conexão', text: 'Falha na conexão. Use o botão flutuante do WhatsApp.', icon: 'error', confirmButtonColor: '#c45c1a' });
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Enviar Solicitação <i class="fas fa-paper-plane"></i>';
      }
    }
  });

})();