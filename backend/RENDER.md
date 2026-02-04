# Render Deploy Configuration

Este backend está configurado para deploy no Render.

## Configurações Necessárias

### Build Command
```
npm install
```

### Start Command
```
npm start
```

### Environment Variables
Adicione estas variáveis no Render Dashboard:

```
SUPABASE_URL=https://dqyzhkftlwecimnnjiim.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxeXpoa2Z0bHdlY2ltbm5qaWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1Nzg2NjIsImV4cCI6MjA1NTE1NDY2Mn0.Wkm4KCh1LqiCdVrj1IMDPpSJjyGjKV3xk5tOobxGV7I
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
RESEND_API_KEY=re_PYRG51bD_QKb16hTV117RKPn7jkHPe1z4
PORT=3000
NODE_ENV=production
```

### Regions
Escolha uma região próxima ao Brasil para melhor performance.
