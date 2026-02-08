# Erro: Email Rate Limit Exceeded

## Descrição do Problema

O erro **"email rate limit exceeded"** ocorre quando o Supabase bloqueia temporariamente o envio de emails devido ao excesso de tentativas em um curto período de tempo.

## Por que acontece?

1. **Limite de desenvolvimento**: O plano gratuito do Supabase tem limites rigorosos de envio de email
2. **Proteção anti-spam**: Sistema de segurança para evitar abuso
3. **Múltiplas tentativas**: Vários cadastros ou redefinições de senha em sequência

## Soluções

### Solução 1: Aguardar (Recomendado para produção)
- Aguarde **alguns minutos** (geralmente 5-10 minutos)
- Tente cadastrar novamente
- O limite é reiniciado automaticamente

### Solução 2: Desabilitar confirmação de email (Apenas para desenvolvimento)

No painel do Supabase:

1. Acesse: **Authentication** → **Settings** → **Email Auth**
2. Desmarque: **"Enable email confirmations"**
3. **IMPORTANTE**: Reative isso antes de ir para produção!

**Passos detalhados:**
```
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral → Authentication → Email Templates
4. Em "Settings" → Desabilite "Confirm email"
```

### Solução 3: Configurar SMTP próprio (Produção)

Para produção, configure seu próprio servidor SMTP:

1. No Supabase: **Project Settings** → **Auth** → **SMTP Settings**
2. Configure com:
   - SendGrid
   - Amazon SES
   - Mailgun
   - Resend
   - Ou qualquer outro provedor SMTP

### Solução 4: Usar login direto (Alternativa)

Para testes, você pode fazer login com Google OAuth:
- Não depende de confirmação de email
- Funciona imediatamente
- Configurado para funcionar no sistema

## Tratamento no Sistema

O sistema agora detecta esse erro e exibe uma mensagem amigável:

```javascript
"Limite de emails excedido. Aguarde alguns minutos e tente novamente."
```

## Verificar Configurações Atuais

### No Supabase Dashboard:

1. **Authentication** → **Settings** → **Auth Providers**
   - Verifique se "Enable Email provider" está ativo

2. **Authentication** → **Email Templates**
   - Verifique as configurações de confirmação

3. **Project Settings** → **API**
   - Copie a URL e Key (já configuradas no .env)

## Ambiente de Desenvolvimento

Para facilitar testes em desenvolvimento, recomendo:

1. **Desabilitar confirmação de email temporariamente**
2. **Usar Google OAuth** para login
3. **Limitar tentativas** de cadastro durante testes

## Ambiente de Produção

Para produção:

1. ✅ **Manter confirmação de email ativa**
2. ✅ **Configurar SMTP próprio** (SendGrid, SES, etc.)
3. ✅ **Monitorar limites** de envio
4. ✅ **Implementar throttling** no frontend

## Status Atual do Sistema

- ✅ Tratamento de erro implementado
- ✅ Mensagem amigável para o usuário
- ✅ Login com Google OAuth como alternativa
- ✅ Validação de email melhorada

## Próximos Passos Recomendados

1. Para desenvolvimento: Desabilitar confirmação de email no Supabase
2. Para produção: Configurar SMTP próprio
3. Aguardar 10 minutos se o erro ocorrer
4. Usar Google OAuth como alternativa para testes
