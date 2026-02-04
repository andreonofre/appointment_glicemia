/**
 * SERVIÇO DE API
 * 
 * Centraliza todas as chamadas HTTP para o backend.
 * 
 * Como usar:
 * - import api from './services/api';
 * - await api.get('/endpoint');
 * - await api.post('/endpoint', { dados });
 * 
 * Como fazer manutenção:
 * - Para mudar URL base, altere .env.local ou a variável abaixo
 * - Para adicionar headers globais, adicione em api.defaults.headers
 * - O token é adicionado automaticamente se existir no localStorage
 */

import axios from 'axios';

// Cria instância do axios com configurações base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição - Adiciona o token automaticamente
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se existir token, adiciona no header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta - Trata erros globalmente
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, retorna normalmente
    return response;
  },
  (error) => {
    // Se o token expirou (401), limpa e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Retorna o erro para ser tratado no componente
    return Promise.reject(error);
  }
);

export default api;
