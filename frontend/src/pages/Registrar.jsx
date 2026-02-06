/**
 * PÁGINA DE REGISTRAR GLICEMIA
 */

import { useState } from 'react';
import { Activity } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import * as glicemiaService from '../services/glicemiaService';
import './Registrar.css';

function Registrar() {
  const [formData, setFormData] = useState({
    valor: '',
    momento: 'jejum',
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await glicemiaService.create(formData);
      setMessage('✅ Glicemia registrada com sucesso!');
      setFormData({
        valor: '',
        momento: 'jejum',
        data: new Date().toISOString().split('T')[0],
        observacoes: ''
      });
    } catch (err) {
      setError('Erro ao registrar glicemia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <Activity size={32} />
          <h1>Registrar Glicemia</h1>
        </div>

        <div className="register-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Valor (mg/dL)</label>
              <input
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                required
                placeholder="Ex: 120"
              />
            </div>

            <div className="form-group">
              <label>Momento</label>
              <select
                value={formData.momento}
                onChange={(e) => setFormData({...formData, momento: e.target.value})}
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
              <label>Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Observações (opcional)</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                rows="3"
                placeholder="Ex: Após exercício físico"
              />
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : 'Registrar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Registrar;
