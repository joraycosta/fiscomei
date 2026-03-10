export default async function handler(req, res) {
  // Permite apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, email, perfil, cnpj } = req.body;

  // Validação básica
  if (!nome || !email || !perfil) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const isContador = perfil === 'Contador';

  const subject = isContador
    ? 'Parceria FiscoMEI: seu escritório + seus clientes MEI prontos para 2027'
    : 'Você garantiu sua vaga! Aqui está o que vem por aí 🎉';

  const htmlUsuario = isContador ? `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111318">
      <div style="background:#1E3A5F;padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:#fff;font-size:1.6rem;margin:0;letter-spacing:-0.03em">FiscoMEI</h1>
        <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.85rem">Parceria para Contadores</p>
      </div>
      <div style="background:#fff;padding:36px;border:1px solid #e8e4dc;border-top:none;border-radius:0 0 12px 12px">
        <p style="font-size:1rem;margin:0 0 16px">Olá, <strong>${nome}</strong>!</p>
        <p style="color:#3a4150;line-height:1.7;margin:0 0 20px">Obrigado por topar essa parceria. Sei que você está recebendo uma avalanche de perguntas dos seus clientes MEI sobre a Reforma Tributária — e o FiscoMEI nasceu para ser o braço digital que te ajuda a atender todos eles com mais agilidade.</p>
        <p style="font-weight:600;margin:0 0 12px">Veja o que você acabou de desbloquear:</p>
        <div style="background:#f7f5f0;border-radius:10px;padding:20px;margin:0 0 20px">
          <p style="margin:0 0 10px">📋 <strong>Painel multi-cliente</strong> — veja o status de todos seus clientes MEI em uma tela, com alertas centralizados.</p>
          <p style="margin:0 0 10px">🏷️ <strong>Co-branding</strong> — o painel aparece com o nome do seu escritório para seus clientes.</p>
          <p style="margin:0">💰 <strong>Comissão recorrente</strong> — 20% de cada cliente MEI que converter. Sem limite de indicações.</p>
        </div> <p style="color:#3a4150;line-height:1.7;margin:0 0 24px">Nos próximos dias você receberá o link do painel e o kit de comunicação pronto para repassar aos seus clientes.</p>
        <p style="color:#7a8394;font-size:0.82rem;margin:0">Qualquer dúvida, responda este e-mail. Estarei pessoalmente disponível.<br><br>Um abraço,<br><strong>Equipe FiscoMEI</strong></p>
      </div>
    </div>` : `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111318">
      <div style="background:#1E3A5F;padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:#fff;font-size:1.6rem;margin:0;letter-spacing:-0.03em">FiscoMEI</h1>
        <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.85rem">Sua vaga está garantida 🎉</p>
      </div>
      <div style="background:#fff;padding:36px;border:1px solid #e8e4dc;border-top:none;border-radius:0 0 12px 12px">
        <p style="font-size:1rem;margin:0 0 16px">Olá, <strong>${nome}</strong>!</p>
        <p style="color:#3a4150;line-height:1.7;margin:0 0 20px">Que bom ter você aqui. Sua vaga no acesso antecipado do FiscoMEI está garantida — e você foi um dos primeiros a embarcar nessa.</p>
        <div style="background:#fef3e2;border-left:4px solid #b8860b;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 20px">
          <p style="margin:0;font-weight:600;color:#9a5c00">📅 Prazo mais crítico: Setembro de 2026</p>
          <p style="margin:8px 0 0;font-size:0.85rem;color:#b85c00">Todo MEI precisará decidir entre DAS e o novo regime tributário. Sem decisão = o sistema escolhe por você.</p>
        </div><p style="font-weight:600;margin:0 0 12px">Nos próximos dias você vai receber:</p>
        <p style="color:#3a4150;margin:0 0 8px">→ Um guia explicando o que muda para o seu MEI</p>
        <p style="color:#3a4150;margin:0 0 8px">→ Acesso ao simulador antes de todo mundo</p>
        <p style="color:#3a4150;margin:0 0 20px">→ Checklist personalizado com seus prazos</p>
        ${cnpj ? `<p style="color:#7a8394;font-size:0.82rem;margin:0 0 16px">CNPJ informado: <strong>${cnpj}</strong> — já vamos pré-preencher seu diagnóstico!</p>` : ''}
        <p style="color:#7a8394;font-size:0.82rem;margin:0">Qualquer dúvida, responda este e-mail. Leio tudo pessoalmente.<br><br>Bem-vindo ao FiscoMEI!<br><strong>Equipe FiscoMEI</strong></p>
        <hr style="border:none;border-top:1px solid #e8e4dc;margin:24px 0"/>
        <p style="color:#7a8394;font-size:0.75rem;margin:0">Se você conhece outro MEI que ainda não sabe o que fazer na Reforma, encaminhe esse e-mail. 🙏</p>
      </div>
    </div>`;

  try {
    // 1. E-mail de boas-vindas para o usuário
    const resUsuario = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FiscoMEI <onboarding@resend.dev>',
        to: [email],
        subject,
        html: htmlUsuario
      })
    });

    // 2. Notificação interna para o FiscoMEI
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FiscoMEI Sistema <onboarding@resend.dev>',
        to: ['fiscomei.contato@gmail.com'],
        subject: `📋 Novo cadastro: ${nome} (${perfil})`,
        html: `
          <div style="font-family:Arial,sans-serif;padding:24px;background:#f0ede6;border-radius:8px">
            <h2 style="margin:0 0 16px;color:#1E3A5F">Novo cadastro no FiscoMEI</h2>
            <p style="margin:0 0 8px"><strong>Nome:</strong> ${nome}</p>
            <p style="margin:0 0 8px"><strong>E-mail:</strong> ${email}</p>
            <p style="margin:0 0 8px"><strong>Perfil:</strong> ${perfil}</p>
            <p style="margin:0 0 8px"><strong>CNPJ:</strong> ${cnpj || 'Não informado'}</p>
          </div>`
      })
    });

    if (!resUsuario.ok) {
      const err = await resUsuario.json();
      throw new Error(err.message || 'Erro ao enviar e-mail');
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Erro Resend:', err);
    return res.status(500).json({ error: err.message });
  }
}
