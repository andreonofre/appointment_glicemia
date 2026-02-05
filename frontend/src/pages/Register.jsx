/**
 * PÁGINA DE CADASTRO
 * 
 * Cadastro usando Supabase Auth (sem backend Node.js)
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as supabaseAuth from '../services/supabaseAuthService';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    idade: '',
    tipoDiabetes: 'tipo2',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validações
    if (!formData.nome || !formData.email || !formData.password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      await supabaseAuth.register({
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        idade: formData.idade ? parseInt(formData.idade) : null,
        tipoDiabetes: formData.tipoDiabetes,
      });
      
      setSuccess(true);
      setError('');
      
      // Mostra mensagem de sucesso e redireciona para login
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Cadastro realizado! Verifique seu email para confirmar sua conta.' 
          } 
        });
      }, 2000);
    } catch (err) {
      setError(err.error || 'Erro ao cadastrar. Tente novamente.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <span className="logo-icon">🩺</span>
            <h1>Glico</h1>
          </div>
          <p className="subtitle">Criar nova conta</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              Código enviado para seu email! Redirecionando...
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome">Nome completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Maria Silva"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idade">Idade</label>
              <input
                type="number"
                id="idade"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                placeholder="35"
                disabled={loading}
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoDiabetes">Tipo de Diabetes *</label>
              <select
                id="tipoDiabetes"
                name="tipoDiabetes"
                value={formData.tipoDiabetes}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="tipo1">Tipo 1</option>
                <option value="tipo2">Tipo 2</option>
                <option value="gestacional">Gestacional</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar senha *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading || success}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <div className="register-footer">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login">Entrar</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
