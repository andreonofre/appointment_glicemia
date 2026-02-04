/**
 * COMPONENTE REGISTRARMODAL
 * 
 * Modal para registrar nova glicemia.
 */

import { useState } from 'react';
import * as glicemiaService from '../services/glicemiaService';
import './RegistrarModal.css';

function RegistrarModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    valor: '',
    categoria: 'jejum',
    observacoes: '',
    data_hora: new Date().toISOString().slice(0, 16),
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.valor) {
      setError('Informe o valor da glicemia');
      return;
    }

    const valor = parseInt(formData.valor);
    if (valor < 20 || valor > 600) {
      setError('Valor deve estar entre 20 e 600 mg/dL');
      return;
    }
    
    setLoading(true);
    
    try {
      await glicemiaService.create({
        valor,
        categoria: formData.categoria,
        observacoes: formData.observacoes,
        data_hora: formData.data_hora,
      });
      
      onSuccess();
    } catch (err) {
      setError(err.error || 'Erro ao registrar glicemia');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🩺 Registrar Glicemia</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="valor">Valor da Glicemia *</label>
            <div className="input-with-unit">
              <input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                placeholder="150"
                disabled={loading}
                min="20"
                max="600"
                autoFocus
              />
              <span className="input-unit">mg/dL</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="jejum">Jejum</option>
              <option value="pre-refeicao">Antes das refeições</option>
              <option value="pos-prandial">Pós-prandial (2h)</option>
              <option value="antes-dormir">Antes de dormir</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="data_hora">Data e Hora</label>
            <input
              type="datetime-local"
              id="data_hora"
              name="data_hora"
              value={formData.data_hora}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Ex: Após café da manhã, sentindo tontura..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarModal;
