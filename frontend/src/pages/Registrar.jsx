/**
 * PÁGINA DE REGISTRAR GLICEMIA
 */

import { useState } from 'react';
import { Activity, Calendar, Pill, FileText, Save, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import * as glicemiaService from '../services/glicemiaService';
import './Registrar.css';

function Registrar() {
  const [formData, setFormData] = useState({
    valor: '',
    categoria: 'jejum',
    medicamentos: '',
    data_hora: new Date().toISOString().slice(0, 16),
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.valor || formData.valor < 20 || formData.valor > 600) {
      toast.error('Valor deve estar entre 20 e 600 mg/dL');
      return;
    }
    
    setLoading(true);

    try {
      await glicemiaService.create({
        valor: parseInt(formData.valor),
        categoria: formData.categoria,
        medicamentos: formData.medicamentos,
        observacoes: formData.observacoes,
        data_hora: formData.data_hora,
      });
      
      toast.success('Glicemia registrada com sucesso!');
      setFormData({
        valor: '',
        categoria: 'jejum',
        medicamentos: '',
        data_hora: new Date().toISOString().slice(0, 16),
        observacoes: ''
      });
    } catch (err) {
      toast.error('Erro ao registrar glicemia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="registrar-hero">
          <div className="registrar-hero-content">
            <div className="hero-icon-wrapper">
              <Activity className="hero-icon" size={36} />
            </div>
            <h1>Registrar Medição de Glicemia</h1>
            <p>Monitore sua glicemia de forma simples e eficaz</p>
          </div>
        </div>

        <div className="register-card">
          <form onSubmit={handleSubmit} className="registrar-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <TrendingUp size={18} />
                  Valor (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  required
                  placeholder="Ex: 120"
                  min="20"
                  max="600"
                />
              </div>

              <div className="form-group">
                <label>
                  <CheckCircle size={18} />
                  Momento
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                >
                  <option value="jejum">Jejum</option>
                  <option value="pre-cafe">Pré-café</option>
                  <option value="pos-cafe">Pós-café</option>
                  <option value="pre-almoco">Pré-almoço</option>
                  <option value="pos-almoco">Pós-almoço</option>
                  <option value="pre-jantar">Pré-jantar</option>
                  <option value="pos-jantar">Pós-jantar</option>
                  <option value="antes-dormir">Antes de dormir</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={18} />
                  Data e Hora
                </label>
                <input
                  type="datetime-local"
                  value={formData.data_hora}
                  onChange={(e) => setFormData({...formData, data_hora: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Pill size={18} />
                  Medicamentos (opcional)
                </label>
                <input
                  type="text"
                  value={formData.medicamentos}
                  onChange={(e) => setFormData({...formData, medicamentos: e.target.value})}
                  placeholder="Ex: Metformina 500mg"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>
                <FileText size={18} />
                Observações (opcional)
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                rows="4"
                placeholder="Ex: Após exercício físico, sintomas de hipoglicemia..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              <Save size={20} />
              {loading ? 'Salvando...' : 'Registrar Glicemia'}
            </button>
          </form>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Registrar;
