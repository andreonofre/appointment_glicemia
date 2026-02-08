/**
 * PÁGINA DE COMPLETAR PERFIL
 * 
 * Exibida para usuários que fazem login com Google OAuth
 * e precisam completar as informações do perfil
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../services/profileService';
import './CompletarPerfil.css';

function CompletarPerfil() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    dataNascimento: '',
    endereco: '',
    contato: '',
    tipoDiabetes: 'tipo2',
    medicamentosUso: '',
    metaJejumMin: '70',
    metaJejumMax: '100',
    metaPosPrandialMax: '140',
    metaGlicemiaMin: '70',
    metaGlicemiaMax: '180',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validações
    if (!formData.dataNascimento) {
      setError('Data de nascimento é obrigatória');
      return;
    }

    if (!formData.contato) {
      setError('Contato é obrigatório');
      return;
    }

    // Validar metas glicêmicas
    if (!formData.metaJejumMin || !formData.metaJejumMax || !formData.metaPosPrandialMax || !formData.metaGlicemiaMin || !formData.metaGlicemiaMax) {
      setError('Todas as metas glicêmicas são obrigatórias');
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

      // Atualiza o perfil no Supabase
      await profileService.updateUserProfile({
        nome: formData.nome,
        email: user.email,
        idade: idade,
        data_nascimento: formData.dataNascimento,
        endereco: formData.endereco,
        contato: formData.contato,
        tipo_diabetes: formData.tipoDiabetes,
        medicamentos_uso: formData.medicamentosUso,
        meta_jejum_min: parseInt(formData.metaJejumMin),
        meta_jejum_max: parseInt(formData.metaJejumMax),
        meta_pos_prandial_max: parseInt(formData.metaPosPrandialMax),
        meta_glicemia_min: parseInt(formData.metaGlicemiaMin),
        meta_glicemia_max: parseInt(formData.metaGlicemiaMax),
        aceite_termos: true, // Já aceitou ao logar com Google
        aceite_privacidade: true,
      });

      // Atualiza o contexto do usuário
      updateUser({
        ...user,
        perfil_completo: true
      });
      
      // Redireciona para o painel
      navigate('/painel');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="completar-perfil-container">
      <div className="completar-perfil-card">
        <div className="completar-perfil-header">
          <div className="logo">
            <span className="logo-icon">🩺</span>
            <h1>Glico</h1>
          </div>
          <h2>Complete seu perfil</h2>
          <p className="subtitle">Precisamos de algumas informações para personalizar sua experiência</p>
        </div>

        <form onSubmit={handleSubmit} className="completar-perfil-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

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
                required
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
                  required
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
                  required
                />
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
                required
              >
                <option value="tipo1">Tipo 1</option>
                <option value="tipo2">Tipo 2</option>
                <option value="gestacional">Gestacional</option>
              </select>
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
                  required
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
                  required
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
                required
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
                  required
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
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Completar Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompletarPerfil;
