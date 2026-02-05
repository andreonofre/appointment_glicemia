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
import { supabase } from '../config/supabase';

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
    // Verifica localStorage
    const token = localStorage.getItem('token');
    const storedUser = authService.getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }

    // Verifica sessão do Supabase (para Google OAuth)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Usuário logado via Google OAuth
        const googleUser = {
          id: session.user.id,
          email: session.user.email,
          nome: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email.split('@')[0],
          avatar_url: session.user.user_metadata.avatar_url
        };
        
        // Salva no localStorage também
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(googleUser));
        
        setUser(googleUser);
      }
      
      setLoading(false);
    });

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const googleUser = {
          id: session.user.id,
          email: session.user.email,
          nome: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email.split('@')[0],
          avatar_url: session.user.user_metadata.avatar_url
        };
        
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(googleUser));
        
        setUser(googleUser);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
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
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
