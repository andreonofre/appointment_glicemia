/**
 * PÁGINA DE CADASTRO
 * 
 * Cadastro usando Supabase Auth (sem backend Node.js)
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as supabaseAuth from '../services/supabaseAuthService';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    dataNascimento: '',
    endereco: '',
    contato: '',
    tipoDiabetes: 'tipo2',
    medicamentosUso: '',
    aceitaTermos: false,
    aceitaPrivacidade: false,
    metaJejumMin: '70',
    metaJejumMax: '100',
    metaPosPrandialMax: '140',
    metaGlicemiaMin: '70',
    metaGlicemiaMax: '180',
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    
    // Aplica máscara de telefone
    if (name === 'contato') {
      const maskedValue = formatarTelefone(value);
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : maskedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  /**
   * Formata telefone: (00) 99999-9999
   */
  const formatarTelefone = (valor) => {
    // Remove tudo que não é dígito
    const numeros = valor.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    } else {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.nome || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido. Use um formato válido como: usuario@exemplo.com');
      return;
    }

    if (!formData.dataNascimento) {
      toast.error('Data de nascimento é obrigatória');
      return;
    }

    if (!formData.contato) {
      toast.error('Contato é obrigatório');
      return;
    }

    // Validar se o telefone tem 11 dígitos
    const telefoneNumeros = formData.contato.replace(/\D/g, '');
    if (telefoneNumeros.length !== 11) {
      toast.error('Telefone deve ter 11 dígitos: (99) 99999-9999');
      return;
    }

    if (!formData.aceitaTermos) {
      toast.error('Você deve aceitar os Termos de Uso');
      return;
    }

    if (!formData.aceitaPrivacidade) {
      toast.error('Você deve aceitar a Política de Privacidade');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Validar metas glicêmicas
    if (!formData.metaJejumMin || !formData.metaJejumMax || !formData.metaPosPrandialMax || !formData.metaGlicemiaMin || !formData.metaGlicemiaMax) {
      toast.error('Todas as metas glicêmicas são obrigatórias');
      return;
    }
    
    setLoading(true);
    
    try {
      // Calcular idade a partir da data de nascimento
      const hoje = new Date();
      const nascimento = new Date(formData.dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }

      await supabaseAuth.register({
        nome: formData.nome,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        idade: idade,
        dataNascimento: formData.dataNascimento,
        endereco: formData.endereco,
        contato: formData.contato,
        tipoDiabetes: formData.tipoDiabetes,
        medicamentosUso: formData.medicamentosUso,
        metaJejumMin: parseInt(formData.metaJejumMin),
        metaJejumMax: parseInt(formData.metaJejumMax),
        metaPosPrandialMax: parseInt(formData.metaPosPrandialMax),
        metaGlicemiaMin: parseInt(formData.metaGlicemiaMin),
        metaGlicemiaMax: parseInt(formData.metaGlicemiaMax),
      });
      
      toast.success('Cadastro realizado! Verifique seu email para confirmar sua conta.');
      
      // Redireciona para login após 2 segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Cadastro realizado! Verifique seu email para confirmar sua conta.' 
          } 
        });
      }, 2000);
    } catch (err) {
      // Tratamento específico de erros
      let errorMessage = err.error || err.message || 'Erro ao cadastrar. Tente novamente.';
      
      // Erro de limite de taxa de email
      if (errorMessage.toLowerCase().includes('email rate limit exceeded') || 
          errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Limite de emails excedido. Aguarde alguns minutos e tente novamente.';
        toast.error(errorMessage, { autoClose: 5000 });
      }
      // Email já cadastrado
      else if (errorMessage.toLowerCase().includes('already') || 
               errorMessage.toLowerCase().includes('exists')) {
        errorMessage = 'Este email já está cadastrado. Faça login ou use outro email.';
        toast.error(errorMessage);
      }
      // Email inválido
      else if (errorMessage.toLowerCase().includes('invalid email')) {
        errorMessage = 'Email inválido. Verifique o formato do email.';
        toast.error(errorMessage);
      }
      // Senha fraca
      else if (errorMessage.toLowerCase().includes('password')) {
        errorMessage = 'Senha não atende aos requisitos. Use pelo menos 6 caracteres.';
        toast.error(errorMessage);
      }
      // Erro genérico
      else {
        toast.error(errorMessage);
      }
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
          <div className="form-section">
            <h3 className="section-title">Dados Pessoais</h3>
            
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
                <label htmlFor="dataNascimento">Data de Nascimento *</label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contato">Contato *</label>
                <input
                  type="tel"
                  id="contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                  disabled={loading}
                />
                <small className="field-hint">Formato: (99) 99999-9999 com 11 dígitos</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="endereco">Endereço</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Rua Example, 123 - São Paulo, SP"
                disabled={loading}
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

          <div className="form-section">
            <h3 className="section-title">Segurança</h3>
            
            <div className="form-group">
              <label htmlFor="password">Senha *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
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
          </div>

          <div className="form-section">
            <h3 className="section-title">Medicamentos</h3>
            
            <div className="form-group">
              <label htmlFor="medicamentosUso">Medicamentos em uso</label>
              <textarea
                id="medicamentosUso"
                name="medicamentosUso"
                value={formData.medicamentosUso}
                onChange={handleChange}
                placeholder="Liste os medicamentos que você utiliza (opcional)"
                rows="3"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Metas Glicêmicas Personalizadas *</h3>
            <p className="section-description">Estas metas serão utilizadas nos seus gráficos e relatórios</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="metaJejumMin">Jejum - Mínimo (mg/dL) *</label>
                <input
                  type="number"
                  id="metaJejumMin"
                  name="metaJejumMin"
                  value={formData.metaJejumMin}
                  onChange={handleChange}
                  min="40"
                  max="200"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="metaJejumMax">Jejum - Máximo (mg/dL) *</label>
                <input
                  type="number"
                  id="metaJejumMax"
                  name="metaJejumMax"
                  value={formData.metaJejumMax}
                  onChange={handleChange}
                  min="40"
                  max="200"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="metaPosPrandialMax">Pós-prandial Máximo (mg/dL) *</label>
              <input
                type="number"
                id="metaPosPrandialMax"
                name="metaPosPrandialMax"
                value={formData.metaPosPrandialMax}
                onChange={handleChange}
                min="40"
                max="300"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="metaGlicemiaMin">Glicemia Mínima Aceitável (mg/dL) *</label>
                <input
                  type="number"
                  id="metaGlicemiaMin"
                  name="metaGlicemiaMin"
                  value={formData.metaGlicemiaMin}
                  onChange={handleChange}
                  min="40"
                  max="200"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="metaGlicemiaMax">Glicemia Máxima Aceitável (mg/dL) *</label>
                <input
                  type="number"
                  id="metaGlicemiaMax"
                  name="metaGlicemiaMax"
                  value={formData.metaGlicemiaMax}
                  onChange={handleChange}
                  min="40"
                  max="400"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Consentimento</h3>
            
            <div className="form-group-checkbox">
              <input
                type="checkbox"
                id="aceitaTermos"
                name="aceitaTermos"
                checked={formData.aceitaTermos}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="aceitaTermos">
                Li e aceito os <Link to="/termos-uso" target="_blank">Termos de Uso</Link> *
              </label>
            </div>

            <div className="form-group-checkbox">
              <input
                type="checkbox"
                id="aceitaPrivacidade"
                name="aceitaPrivacidade"
                checked={formData.aceitaPrivacidade}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="aceitaPrivacidade">
                Li e aceito a <Link to="/politica-privacidade" target="_blank">Política de Privacidade (LGPD)</Link> *
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
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
