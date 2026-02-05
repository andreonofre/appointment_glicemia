/**
 * CONFIGURAÇÃO DO SUPABASE
 * 
 * Cliente do Supabase para autenticação OAuth (Google)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Verificando configuração do Supabase...');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Definida' : '❌ Não definida');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Definida' : '❌ Não definida');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente do Supabase não configuradas!');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas');
  console.error('Valores atuais:');
  console.error('  VITE_SUPABASE_URL:', supabaseUrl || 'undefined');
  console.error('  VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '(oculta)' : 'undefined');
  
  // Em desenvolvimento, mostra alerta
  if (import.meta.env.DEV) {
    alert('ERRO: Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('✅ Supabase client inicializado');
console.log('📍 URL:', supabaseUrl);
