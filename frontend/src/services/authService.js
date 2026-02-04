/**
 * SERVIÇO DE AUTENTICAÇÃO
 * 
 * Funções para login, cadastro e logout.
 * 
 * Como usar:
 * - import { login, register, logout } from './services/authService';
 * - const user = await login(email, password);
 * 
 * Como fazer manutenção:
 * - Para adicionar campos no cadastro, modifique a função register
 * - Para adicionar validações, faça antes das chamadas de API
 */

import api from './api';

/**
 * Faz login do usuário
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Salva o token e dados do usuário
    if (response.data.session?.access_token) {
      localStorage.setItem('token', response.data.session.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao fazer login' };
  }
};

/**
 * Cadastra novo usuário
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao cadastrar usuário' };
  }
};

/**
 * Faz logout do usuário
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  } finally {
    // Remove dados do localStorage independente do resultado
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

/**
 * Busca dados do usuário logado
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao buscar usuário' };
  }
};

/**
 * Verifica se o usuário está logado
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Pega o usuário do localStorage
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
