/**
 * CONFIGURAÇÃO DO RESEND
 * 
 * Este arquivo configura o serviço de envio de e-mails (Resend).
 * 
 * O que é o Resend?
 * - Serviço para enviar e-mails programaticamente
 * - Usado para lembretes, notificações, relatórios, etc.
 * 
 * Como fazer manutenção:
 * 1. A API key fica no arquivo .env
 * 2. Para trocar de conta, altere RESEND_API_KEY no .env
 * 3. Configure o domínio remetente no painel do Resend
 */

const { Resend } = require('resend');

// Cria instância do Resend com a API key
const resend = new Resend(process.env.RESEND_API_KEY);

// E-mail remetente padrão
const fromEmail = process.env.FROM_EMAIL || 'noreply@glico.com';

module.exports = {
  resend,
  fromEmail
};
