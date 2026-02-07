/**
 * COMPONENTE REGISTRARMODAL
 * 
 * Modal para registrar nova glicemia.
 */

import { useState } from 'react';
import { X, Activity, Calendar, FileText, Pill, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import * as glicemiaService from '../services/glicemiaService';
import './RegistrarModal.css';

function RegistrarModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    valor: '',
    categoria: 'jejum',
    medicamentos: '',
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
      toast.error('Informe o valor da glicemia');
      return;
    }

    const valor = parseInt(formData.valor);
    if (valor < 20 || valor > 600) {
      toast.error('Valor deve estar entre 20 e 600 mg/dL');
      return;
    }
    
    setLoading(true);
    
    try {
      await glicemiaService.create({
        valor,
        categoria: formData.categoria,
        medicamentos: formData.medicamentos,
        observacoes: formData.observacoes,
        data_hora: formData.data_hora,
      });
      
      toast.success('Glicemia registrada com sucesso!');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Erro ao registrar glicemia');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Activity size={28} className="modal-icon" />
            <h2>Registrar Glicemia</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group form-highlight">
            <label htmlFor="valor">
              <Activity size={18} />
              Valor da Glicemia *
            </label>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">
                <FileText size={18} />
                Categoria *
              </label>
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
              <label htmlFor="data_hora">
                <Calendar size={18} />
                Data e Hora
              </label>
              <input
                type="datetime-local"
                id="data_hora"
                name="data_hora"
                value={formData.data_hora}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="medicamentos">
              <Pill size={18} />
              Medicamentos/Insulina
            </label>
            <input
              type="text"
              id="medicamentos"
              name="medicamentos"
              value={formData.medicamentos}
              onChange={handleChange}
              placeholder="Ex: Insulina NPH 10u, Metformina 850mg..."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">
              <FileText size={18} />
              Observações
            </label>
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
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarModal;
