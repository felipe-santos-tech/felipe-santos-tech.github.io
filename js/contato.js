/* ═══════════════════════════════════════════════
   FELIPE SANTOS — contato.js
   Formulário: Web3Forms + hCaptcha + WhatsApp
   ── Mexa aqui para alterar a integração ──
════════════════════════════════════════════════ */

// ── CONFIGURAÇÕES — edite aqui se precisar ──
const WHATSAPP_NUMBER      = '5541984084116';
const ALERT_PRIMARY_COLOR  = '#3b82f6';
const ALERT_SECONDARY_COLOR = '#4a5870';
const SWAL_DARK_BG         = '#0e1420';
const SWAL_DARK_COLOR      = '#e8f0ff';
// ─────────────────────────────────────────────

const form      = document.getElementById('cform');
const submitBtn = document.getElementById('submitBtn');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name     = formData.get('name')    || 'Não informado';
  const email    = formData.get('email')   || 'Não informado';
  const servico  = formData.get('servico') || 'Não selecionado';
  const message  = formData.get('message') || 'Não informado';
  const captcha  = formData.get('h-captcha-response');

  // Valida captcha
  if (!captcha) {
    Swal.fire({
      title: 'Captcha obrigatório',
      text: 'Confirme que você não é um robô antes de enviar.',
      icon: 'warning',
      background: SWAL_DARK_BG,
      color: SWAL_DARK_COLOR,
      confirmButtonColor: ALERT_PRIMARY_COLOR
    });
    return;
  }

  // Monta link do WhatsApp
  const waText =
    `Olá Felipe!%0A%0A` +
    `Solicitei contato pelo portfólio:%0A%0A` +
    `*Nome:* ${encodeURIComponent(name)}%0A` +
    `*E-mail:* ${encodeURIComponent(email)}%0A` +
    `*Tipo de Serviço:* ${encodeURIComponent(servico)}%0A%0A` +
    `*Mensagem:*%0A${encodeURIComponent(message)}%0A%0A` +
    `---%0AEnviado via site`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  formData.set('subject', `Novo Contato - ${name} (${servico})`);

  // Estado de loading
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitBtn.disabled = true;

  try {
    const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
    const json = await res.json();

    if (json.success) {
      const result = await Swal.fire({
        title: 'Mensagem enviada!',
        text: 'Deseja abrir o WhatsApp com os detalhes prontos?',
        icon: 'success',
        background: SWAL_DARK_BG,
        color: SWAL_DARK_COLOR,
        showCancelButton: true,
        confirmButtonColor: ALERT_PRIMARY_COLOR,
        cancelButtonColor: ALERT_SECONDARY_COLOR,
        confirmButtonText: 'Sim, abrir WhatsApp',
        cancelButtonText: 'Não, obrigado'
      });

      if (result.isConfirmed) window.open(waUrl, '_blank');

      submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
      submitBtn.style.background = '#22c55e';
      form.reset();
      if (typeof hcaptcha !== 'undefined') hcaptcha.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3500);

    } else {
      Swal.fire({
        title: 'Ops...', text: json.message || 'Erro ao enviar. Tente novamente.',
        icon: 'error', background: SWAL_DARK_BG, color: SWAL_DARK_COLOR,
        confirmButtonColor: ALERT_PRIMARY_COLOR
      });
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
      if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
    }

  } catch (err) {
    Swal.fire({
      title: 'Erro', text: 'Falha na conexão. Tente pelo WhatsApp.',
      icon: 'error', background: SWAL_DARK_BG, color: SWAL_DARK_COLOR,
      confirmButtonColor: ALERT_PRIMARY_COLOR
    });
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
    if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
  }
});
