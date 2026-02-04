/**
 * SERVIÇO DE E-MAIL
 * 
 * Gerencia o envio de e-mails usando o Resend.
 * 
 * Tipos de e-mails:
 * - Código de verificação de cadastro
 * - Lembretes para medir glicemia
 * - Notificações de consulta
 * - Promoções e dicas
 * - Relatórios
 * 
 * Como fazer manutenção:
 * - Para alterar templates, modifique o HTML em cada função
 * - Para adicionar novos tipos de e-mail, crie novas funções
 */

const { resend, fromEmail } = require('../config/resend');

/**
 * Envia email com código de verificação
 */
async function sendVerificationCode(email, nome, code) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Código de Verificação - Glico',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2D9A9A 0%, #2ECC71 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .code-box { background: linear-gradient(135deg, #2D9A9A 0%, #2ECC71 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
            .code { font-size: 48px; font-weight: 700; letter-spacing: 8px; color: white; margin: 0; }
            .info { background: #f8f9fa; border-left: 4px solid #2D9A9A; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🩺 Glico</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Gestão Inteligente de Diabetes</p>
            </div>
            <div class="content">
              <h2 style="color: #2D9A9A; margin-top: 0;">Olá, ${nome}!</h2>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Recebemos sua solicitação de cadastro no Glico. Para confirmar seu email, utilize o código abaixo:
              </p>
              
              <div class="code-box">
                <p class="code">${code}</p>
              </div>

              <div class="info">
                <p style="margin: 0; color: #555;">
                  <strong>⏱️ Este código expira em 15 minutos.</strong><br>
                  Se você não solicitou este cadastro, ignore este email.
                </p>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Após inserir o código, você poderá fazer login e começar a gerenciar sua glicemia de forma inteligente.
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2024 Glico - Gestão Inteligente de Diabetes</p>
              <p style="margin: 5px 0 0 0;">Este é um email automático, não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log(`✅ Email de verificação enviado para ${email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de verificação:', error);
    throw error;
  }
}

/**
 * Envia lembrete para medir glicemia
 */
async function sendReminderEmail(to, nome, horario) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: '⏰ Lembrete Glico - Hora de medir sua glicemia',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2D9A9A 0%, #1F7A7A 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🩺 Glico</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Autocuidado em Diabetes</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2D9A9A; margin-top: 0;">Olá, ${nome}! 👋</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              É hora de medir sua glicemia (${horario}).
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Não se esqueça de registrar o valor no aplicativo para acompanhar sua evolução!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" style="background: #2D9A9A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Abrir Glico
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              💡 Dica: Mantenha a regularidade nas medições para um melhor controle!
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Para desativar lembretes, acesse as configurações do app.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Erro ao enviar e-mail de lembrete:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error };
  }
}

/**
 * Envia lembrete de consulta médica
 */
async function sendConsultationReminder(to, nome, dataConsulta, medico) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: '📅 Lembrete de Consulta - Glico',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2D9A9A 0%, #1F7A7A 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🩺 Glico</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Autocuidado em Diabetes</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2D9A9A; margin-top: 0;">Olá, ${nome}! 👋</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Você tem uma consulta marcada!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2D9A9A;">
              <p style="margin: 5px 0;"><strong>📅 Data:</strong> ${dataConsulta}</p>
              <p style="margin: 5px 0;"><strong>👨‍⚕️ Médico:</strong> ${medico}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Não se esqueça de gerar e levar seu relatório de glicemias!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/relatorios" style="background: #2D9A9A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Gerar Relatório
              </a>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Erro ao enviar lembrete de consulta:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error };
  }
}

/**
 * Envia e-mail promocional ou de dicas
 */
async function sendPromotionalEmail(to, nome, assunto, conteudo) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: assunto,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2D9A9A 0%, #1F7A7A 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🩺 Glico</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Autocuidado em Diabetes</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2D9A9A; margin-top: 0;">Olá, ${nome}! 👋</h2>
            ${conteudo}
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Você está recebendo este e-mail porque é usuário do Glico.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Erro ao enviar e-mail promocional:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error };
  }
}

module.exports = {
  sendVerificationCode,
  sendReminderEmail,
  sendConsultationReminder,
  sendPromotionalEmail
};
