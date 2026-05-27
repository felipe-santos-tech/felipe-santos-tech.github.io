document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('nav');
  const topbtn = document.getElementById('topbtn');
  const form = document.getElementById('cform');
  const fsub = document.getElementById('fsub');

  window.addEventListener('scroll', () => {
    if (nav) nav.style.background = window.scrollY > 60 ? 'rgba(7,9,13,.98)' : 'rgba(7,9,13,.9)';
    if (topbtn) topbtn.classList.toggle('show', window.scrollY > 400);
  });

  if (topbtn) {
    topbtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({ top: targetElement.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), idx * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const service = formData.get('servico') || '';
      const message = formData.get('message') || '';
      const whatsappMsg = encodeURIComponent(`Oi Felipe! Sou ${name} (${email}).\nServiço: ${service}\n\n${message}`);
      window.open(`https://wa.me/5541984084116?text=${whatsappMsg}`, '_blank');
      if (fsub) {
        fsub.textContent = 'Enviado! ✓';
        fsub.style.background = '#4ade80';
      }
      form.reset();
      setTimeout(() => {
        if (fsub) {
          fsub.textContent = 'Enviar Mensagem ✈';
          fsub.style.background = '';
        }
      }, 3000);
    });
  }
});
