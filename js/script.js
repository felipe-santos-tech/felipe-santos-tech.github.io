/* ============================================================
   FELIPE SANTOS — scripts.js
   Terminal Animation · Theme Toggle · Scroll FX · Form
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

  // Load saved or default
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(saved);

  themeBtn && themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });


  /* --------------------------------------------------------
     2. TERMINAL ANIMATION
  -------------------------------------------------------- */
  const termBody = document.getElementById('terminal-body');

  const LINES = [
    { type: 'cmd',     text: '$ cat about.json' },
    { type: 'blank',   text: '' },
    { type: 'comment', text: '{' },
    { type: 'pair',    key: '  "name"',       val: '"Felipe Santos"' },
    { type: 'pair',    key: '  "age"',        val: '23' },
    { type: 'pair',    key: '  "role"',       val: '"Analista de Sistemas"' },
    { type: 'pair',    key: '  "location"',   val: '"Curitiba, PR"' },
    { type: 'pair',    key: '  "focus"',      val: '"Android Dev · SQL · ERP"' },
    { type: 'pair',    key: '  "studying"',   val: '"Engenharia de Software"' },
    { type: 'pair',    key: '  "openTo"',     val: '"Projetos & Freelance"' },
    { type: 'comment', text: '}' },
    { type: 'blank',   text: '' },
    { type: 'cmd',     text: '$ git log --oneline -4' },
    { type: 'blank',   text: '' },
    { type: 'log',     hash: 'a3f1c2d', msg: 'feat: ERP modernization sprint 12' },
    { type: 'log',     hash: 'b8e4901', msg: 'fix: SQL dynamic filter optimization' },
    { type: 'log',     hash: 'c2d77fa', msg: 'feat: SESMT EPI signature module' },
    { type: 'log',     hash: 'f9a0341', msg: 'feat: checklist app v1.0 release' },
    { type: 'blank',   text: '' },
    { type: 'cmd',     text: '$ npm run build' },
    { type: 'blank',   text: '' },
    { type: 'success', text: '✓ Build successful — ready to ship 🚀' },
  ];

  function buildLine(line) {
    const span = document.createElement('span');
    span.className = 't-line';

    switch (line.type) {
      case 'cmd':
        span.innerHTML = `<span class="t-prompt">$ </span><span class="t-cmd">${line.text.slice(2)}</span>`;
        break;
      case 'pair':
        span.innerHTML = `<span class="t-key">${line.key}</span><span class="t-comment">: </span><span class="t-val">${line.val}</span><span class="t-comment">,</span>`;
        break;
      case 'comment':
        span.innerHTML = `<span class="t-comment">${line.text}</span>`;
        break;
      case 'log':
        span.innerHTML = `<span class="t-err">${line.hash}</span> <span class="t-val">${line.msg}</span>`;
        break;
      case 'success':
        span.innerHTML = `<span style="color:var(--green)">${line.text}</span>`;
        break;
      case 'blank':
        span.innerHTML = '&nbsp;';
        break;
      default:
        span.textContent = line.text;
    }
    return span;
  }

  function runTerminal() {
    if (!termBody) return;
    termBody.innerHTML = '';

    // Cursor element
    const cursor = document.createElement('span');
    cursor.className = 't-cursor';

    let i = 0;
    const delay = 55; // ms per line

    function nextLine() {
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);

      if (i >= LINES.length) {
        // Restart after pause
        setTimeout(runTerminal, 4000);
        return;
      }

      const el = buildLine(LINES[i]);
      termBody.appendChild(el);
      el.appendChild(cursor);
      i++;
      setTimeout(nextLine, delay);
    }

    nextLine();
  }

  runTerminal();


  /* --------------------------------------------------------
     3. SCROLL ANIMATIONS (Intersection Observer)
  -------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach((el) => observer.observe(el));


  /* --------------------------------------------------------
     4. BACK TO TOP
  -------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');

  function handleScroll() {
    if (!backToTop) return;
    if (window.scrollY > 320) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* --------------------------------------------------------
     5. NAVBAR SCROLL SHADOW
  -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 2px 24px rgba(0,0,0,0.5)'
      : 'none';
  }, { passive: true });


  /* --------------------------------------------------------
     6. CONTACT FORM (web3forms + sweetalert2)
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

    // Build WhatsApp URL
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

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      decodeURIComponent(waText)
    )}`;

    // Append web3forms keys
    formData.append('access_key', ACCESS_KEY);
    formData.append('subject', `Novo Orçamento/Contato — ${name} (${servico})`);

    // Disable button during submission
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
          confirmButtonColor: '#25D366',
          cancelButtonColor: '#334155',
          confirmButtonText: 'Sim, abrir WhatsApp',
          cancelButtonText: 'Não, obrigado',
          background: 'var(--card)',
          color: 'var(--text)',
        });

        if (result.isConfirmed) {
          window.open(waUrl, '_blank');
          Swal.fire({
            title: 'Pronto!',
            text: 'WhatsApp aberto! Aguardo seu contato.',
            icon: 'success',
            confirmButtonColor: '#00c8e8',
            background: 'var(--card)',
            color: 'var(--text)',
          });
        } else {
          Swal.fire({
            title: 'Tudo certo!',
            text: 'Mensagem recebida! Qualquer coisa, use o botão flutuante do WhatsApp.',
            icon: 'success',
            confirmButtonColor: '#00c8e8',
            background: 'var(--card)',
            color: 'var(--text)',
          });
        }
        form.reset();
      } else {
        Swal.fire({
          title: 'Ops...',
          text: 'Erro ao enviar. Tente novamente ou use o botão do WhatsApp.',
          icon: 'error',
          confirmButtonColor: '#00c8e8',
          background: 'var(--card)',
          color: 'var(--text)',
        });
      }
    } catch (err) {
      console.error('Form error:', err);
      Swal.fire({
        title: 'Erro de conexão',
        text: 'Falha na conexão. Use o botão flutuante do WhatsApp.',
        icon: 'error',
        confirmButtonColor: '#00c8e8',
        background: 'var(--card)',
        color: 'var(--text)',
      });
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
      }
    }
  });

})();