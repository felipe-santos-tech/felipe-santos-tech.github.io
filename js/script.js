document.addEventListener('DOMContentLoaded', function() {
  const topbtn = document.getElementById('topbtn');
  const form = document.getElementById('cform');
  const submitBtn = document.querySelector('.btn-submit');

  // Botão topo
  window.addEventListener('scroll', () => {
    if (topbtn) topbtn.classList.toggle('show', window.scrollY > 400);
  });
  if (topbtn) {
    topbtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Navegação suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // Animação de revelar
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.about-grid, .stack-grid, .project-card, .contact-wrapper').forEach(el => {
    el.classList.add('rv');
    observer.observe(el);
  });
  // CSS para o efeito
  const style = document.createElement('style');
  style.textContent = '.rv { opacity: 0; transform: translateY(20px); transition: all 0.5s ease; } .rv.in { opacity: 1; transform: translateY(0); }';
  document.head.appendChild(style);

  // Formulário WhatsApp
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const service = data.get('servico') || '';
      const message = data.get('message') || '';
      const text = `Oi Felipe! Sou ${name} (${email}).\nServiço: ${service}\n\n${message}`;
      window.open(`https://wa.me/5541984084116?text=${encodeURIComponent(text)}`, '_blank');
      if (submitBtn) {
        submitBtn.textContent = 'Enviado! ✓';
        submitBtn.style.background = '#10b981';
      }
      form.reset();
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Enviar mensagem ✈';
          submitBtn.style.background = '';
        }
      }, 3000);
    });
  }
});
