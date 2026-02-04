/**
 * CONTEXTO DE AUTENTICAÇÃO
 * 
 * Gerencia o estado global de autenticação do usuário.
 * 
 * Como usar:
 * - Envolva o App com <AuthProvider>
 * - Use useAuth() em qualquer componente para acessar:
 *   - user: dados do usuário logado
 *   - loading: se está carregando
 *   - login: função para fazer login
 *   - logout: função para fazer logout
 * 
 * Como fazer manutenção:
 * - Para adicionar novos métodos, adicione no value do Provider
 * - Para modificar comportamento, altere as funções
 */

import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

// Cria o contexto
const AuthContext = createContext();

/**
 * Provider que envolve a aplicação
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar, verifica se há usuário logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = authService.getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }
    
    setLoading(false);
  }, []);

  /**
   * Faz login
   */
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Faz cadastro
   */
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Faz logout
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  /**
   * Atualiza dados do usuário
   */
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // Valores disponíveis para os componentes
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
}

export default AuthContext;
