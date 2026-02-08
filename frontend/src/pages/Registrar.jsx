/**
 * PÁGINA DE REGISTRAR GLICEMIA
 */

import { useState } from 'react';
import { Activity, Calendar, Pill, FileText, Save, TrendingUp } from 'lucide-react';
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
        <div className="page-header-styled">
          <div className="header-wrapper">
            <div className="header-icon-box">
              <Activity className="header-icon-animated" size={32} />
            </div>
            <div className="header-text">
              <h1>Registrar Medição de Glicemia</h1>
              <p>Monitore sua glicemia de forma simples e eficaz</p>
            </div>
          </div>
        </div>

        <div className="registrar-container">
          <div className="register-card">
            <form onSubmit={handleSubmit} className="registrar-form">
              <div className="form-group form-highlight">
                <label htmlFor="valor">
                  <TrendingUp size={18} />
                  Valor da Glicemia *
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    placeholder="150"
                    disabled={loading}
                    min="20"
                    max="600"
                    required
                  />
                  <span className="input-unit">mg/dL</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categoria">
                    <FileText size={18} />
                    Momento *
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    disabled={loading}
                    className="momento-select"
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

                <div className="form-group">
                  <label htmlFor="data_hora">
                    <Calendar size={18} />
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    id="data_hora"
                    name="data_hora"
                    value={formData.data_hora}
                    onChange={(e) => setFormData({...formData, data_hora: e.target.value})}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="medicamentos">
                  <Pill size={18} />
                  Medicamentos/Insulina (opcional)
                </label>
                <input
                  type="text"
                  id="medicamentos"
                  name="medicamentos"
                  value={formData.medicamentos}
                  onChange={(e) => setFormData({...formData, medicamentos: e.target.value})}
                  placeholder="Ex: Metformina 500mg, Insulina NPH 10u..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="observacoes">
                  <FileText size={18} />
                  Observações (opcional)
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  rows="4"
                  placeholder="Ex: Após exercício físico, sintomas de hipoglicemia..."
                  disabled={loading}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                <Save size={20} />
                {loading ? 'Salvando...' : 'Registrar Glicemia'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Registrar;
