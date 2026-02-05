/**
 * SERVIÇO DE AUTENTICAÇÃO - SOMENTE SUPABASE
 * 
 * Autenticação usando apenas Supabase (sem backend Node.js)
 * 
 * Funcionalidades:
 * - ✅ Login com Google OAuth
 * - ✅ Cadastro com Email/Senha
 * - ✅ Login com Email/Senha
 * - ✅ Logout
 */

import { supabase } from '../config/supabase';

/**
 * Cadastro de novo usuário com Email/Senha
 */
export async function register(userData) {
  const { email, password, nome, idade, tipoDiabetes } = userData;

  console.log('📝 Registrando usuário no Supabase Auth...');

  // Cadastra no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome,
        idade,
        tipo_diabetes: tipoDiabetes
      }
    }
  });

  if (error) {
    console.error('❌ Erro ao cadastrar:', error);
    throw { error: error.message };
  }

  console.log('✅ Usuário cadastrado com sucesso!');
  console.log('📧 Email de confirmação enviado para:', email);

  return {
    message: 'Cadastro realizado! Verifique seu email para confirmar.',
    user: data.user
  };
}

/**
 * Login com Email/Senha
 */
export async function login(email, password) {
  console.log('🔐 Fazendo login...');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('❌ Erro ao fazer login:', error);
    throw { error: error.message };
  }

  console.log('✅ Login bem-sucedido!');

  const user = {
    id: data.user.id,
    email: data.user.email,
    nome: data.user.user_metadata.nome || data.user.email.split('@')[0],
    idade: data.user.user_metadata.idade,
    tipo_diabetes: data.user.user_metadata.tipo_diabetes
  };

  // Salva no localStorage
  localStorage.setItem('token', data.session.access_token);
  localStorage.setItem('user', JSON.stringify(user));

  return { user, token: data.session.access_token };
}

/**
 * Logout
 */
export async function logout() {
  console.log('👋 Fazendo logout...');
  
  await supabase.auth.signOut();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  console.log('✅ Logout realizado');
}

/**
 * Pega usuário armazenado
 */
export function getStoredUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Login com Google OAuth
 */
export async function loginWithGoogle() {
  console.log('🔐 Iniciando login com Google...');

  const isLocal = window.location.hostname === 'localhost';
  const baseUrl = isLocal 
    ? 'http://localhost:5173' 
    : 'https://appointment-glicemia.vercel.app';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`
    }
  });

  if (error) {
    console.error('❌ Erro ao iniciar OAuth:', error);
    throw error;
  }

  console.log('✅ Redirecionando para Google...');
  return data;
}
