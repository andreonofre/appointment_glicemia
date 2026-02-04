/**
 * PÁGINA DE LOGIN
 * 
 * Tela de autenticação do usuário.
 * 
 * Funcionalidades:
 * - Login com email e senha
 * - Link para cadastro
 * - Validação de campos
 * - Mensagens de erro
 * 
 * Como fazer manutenção:
 * - Para adicionar campos, adicione no formulário e no estado
 * - Para mudar validações, altere a função handleSubmit
 * - Para mudar visual, altere o arquivo Login.css
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');

  useEffect(() => {
    // Limpa mensagem após 5 segundos
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * Atualiza os campos do formulário
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Limpa erro ao digitar
  };

  /**
   * Submete o formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validações básicas
    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/painel'); // Redireciona para o painel
    } catch (err) {
      setError(err.error || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login com Google OAuth
   */
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/painel`
        }
      });

      if (authError) {
        setError('Erro ao fazer login com Google.');
        console.error(authError);
      }
    } catch (err) {
      setError('Erro ao fazer login com Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Cabeçalho */}
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🩺</span>
            <h1>Glico</h1>
          </div>
          <p className="subtitle">Autocuidado em Diabetes</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Entrar</h2>
          
          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Divisor */}
          <div className="divider">
            <span>ou</span>
          </div>

          {/* Botão Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-google btn-block"
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="login-footer">
            <p>
              Não tem uma conta?{' '}
              <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </div>
        </form>

        {/* Dados de teste */}
        <div className="test-credentials">
          <p className="test-label">🔍 Dados de teste:</p>
          <p className="test-info">Email: teste@glico.com</p>
          <p className="test-info">Senha: teste123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
