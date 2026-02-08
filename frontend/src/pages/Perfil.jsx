/**
 * PÁGINA DE PERFIL DO USUÁRIO
 * 
 * Permite visualizar e editar informações do perfil
 */

import { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, Pill, Target, Save, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../services/profileService';
import './Perfil.css';

function Perfil() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
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

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const data = await profileService.getUserProfile();
      setProfile(data);
      
      // Preenche o formulário
      setFormData({
        nome: data.nome || user?.nome || '',
        email: data.email || user?.email || '',
        dataNascimento: data.data_nascimento || '',
        endereco: data.endereco || '',
        contato: data.contato || '',
        tipoDiabetes: data.tipo_diabetes || 'tipo2',
        medicamentosUso: data.medicamentos_uso || '',
        metaJejumMin: String(data.meta_jejum_min || 70),
        metaJejumMax: String(data.meta_jejum_max || 100),
        metaPosPrandialMax: String(data.meta_pos_prandial_max || 140),
        metaGlicemiaMin: String(data.meta_glicemia_min || 70),
        metaGlicemiaMax: String(data.meta_glicemia_max || 180),
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplica máscara de telefone
    if (name === 'contato') {
      const maskedValue = formatarTelefone(value);
      setFormData(prev => ({
        ...prev,
        [name]: maskedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
    if (!formData.nome || !formData.email) {
      toast.error('Nome e email são obrigatórios');
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

    setSaving(true);
    
    try {
      // Calcular idade
      const hoje = new Date();
      const nascimento = new Date(formData.dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }

      await profileService.updateUserProfile({
        nome: formData.nome,
        email: formData.email,
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
      });

      // Atualiza contexto
      updateUser({
        ...user,
        nome: formData.nome,
        email: formData.email,
      });

      toast.success('Perfil atualizado com sucesso!');
      await carregarPerfil();
    } catch (error) {
      // console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-perfil">
            <Loader className="spinner" size={48} />
            <p>Carregando perfil...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header-styled">
          <div className="header-wrapper">
            <div className="header-icon-box">
              <User size={32} />
            </div>
            <div className="header-text">
              <h1>Meu Perfil</h1>
              <p>Gerencie suas informações pessoais e metas glicêmicas</p>
            </div>
          </div>
        </div>

        <div className="perfil-content">
          <form onSubmit={handleSubmit} className="perfil-form">
            {/* Informações Pessoais */}
            <div className="perfil-section">
              <div className="section-header">
                <User size={24} />
                <h2>Informações Pessoais</h2>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
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
                    required
                    disabled
                  />
                  <small className="field-hint">O email não pode ser alterado</small>
                </div>

                <div className="form-group">
                  <label htmlFor="dataNascimento">
                    <Calendar size={16} />
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contato">
                    <Phone size={16} />
                    Contato *
                  </label>
                  <input
                    type="tel"
                    id="contato"
                    name="contato"
                    value={formData.contato}
                    onChange={handleChange}
                    placeholder="(11) 98765-4321"
                    required
                  />
                  <small className="field-hint">Formato: (99) 99999-9999 com 11 dígitos</small>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="endereco">
                    <MapPin size={16} />
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua Example, 123 - São Paulo, SP"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipoDiabetes">Tipo de Diabetes *</label>
                  <select
                    id="tipoDiabetes"
                    name="tipoDiabetes"
                    value={formData.tipoDiabetes}
                    onChange={handleChange}
                    required
                  >
                    <option value="tipo1">Tipo 1</option>
                    <option value="tipo2">Tipo 2</option>
                    <option value="gestacional">Gestacional</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medicamentos */}
            <div className="perfil-section">
              <div className="section-header">
                <Pill size={24} />
                <h2>Medicamentos</h2>
              </div>
              
              <div className="form-group">
                <label htmlFor="medicamentosUso">Medicamentos em Uso</label>
                <textarea
                  id="medicamentosUso"
                  name="medicamentosUso"
                  value={formData.medicamentosUso}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Liste os medicamentos que você utiliza..."
                />
              </div>
            </div>

            {/* Metas Glicêmicas */}
            <div className="perfil-section">
              <div className="section-header">
                <Target size={24} />
                <h2>Metas Glicêmicas Personalizadas</h2>
              </div>
              <p className="section-description">
                Estas metas são utilizadas nos gráficos e relatórios
              </p>
              
              <div className="form-grid">
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
                    required
                  />
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
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="metaGlicemiaMin">Glicemia Mínima (mg/dL) *</label>
                  <input
                    type="number"
                    id="metaGlicemiaMin"
                    name="metaGlicemiaMin"
                    value={formData.metaGlicemiaMin}
                    onChange={handleChange}
                    min="40"
                    max="200"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="metaGlicemiaMax">Glicemia Máxima (mg/dL) *</label>
                  <input
                    type="number"
                    id="metaGlicemiaMax"
                    name="metaGlicemiaMax"
                    value={formData.metaGlicemiaMax}
                    onChange={handleChange}
                    min="40"
                    max="400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="perfil-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-save"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader className="spinner-small" size={18} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default Perfil;
