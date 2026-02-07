/**
 * PÁGINA DE HISTÓRICO
 */

import { useState, useEffect } from 'react';
import { Clock, Trash2, Activity, Calendar, Pill, FileText, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';import Footer from '../components/Footer';import * as glicemiaService from '../services/glicemiaService';
import './Historico.css';

function Historico() {
  const [glicemias, setGlicemias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarGlicemias();
  }, []);

  const carregarGlicemias = async () => {
    try {
      const data = await glicemiaService.list();
      setGlicemias(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id) => {
    if (!confirm('Deseja realmente excluir esta medição?')) return;
    try {
      await glicemiaService.remove(id);
      setGlicemias(glicemias.filter(g => g.id !== id));
      toast.success('Medição excluída com sucesso!');
    } catch (err) {
      toast.error('Erro ao excluir medição');
    }
  };

  const getValorClass = (valor) => {
    if (valor < 70) return 'baixo';
    if (valor <= 180) return 'normal';
    if (valor <= 250) return 'alto';
    return 'muito-alto';
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="historico-hero">
          <div className="hero-content">
            <div className="hero-icon-wrapper">
              <Clock className="hero-icon" size={36} />
            </div>
            <h1>Histórico de Medições</h1>
            <p>Acompanhe todas as suas medições de glicemia</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <Activity size={48} className="loading-icon" />
            <p>Carregando medições...</p>
          </div>
        ) : glicemias.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <Activity size={80} />
            </div>
            <h2>Nenhuma medição ainda</h2>
            <p>Suas medições de glicemia aparecerão aqui.</p>
            <div className="preview-cards">
              <div className="preview-card">
                <div className="preview-badge normal">
                  <Activity size={20} />
                  <span>120 mg/dL</span>
                </div>
                <div className="preview-info">
                  <Calendar size={16} />
                  <span>Jejum</span>
                </div>
              </div>
              <div className="preview-card">
                <div className="preview-badge alto">
                  <TrendingUp size={20} />
                  <span>190 mg/dL</span>
                </div>
                <div className="preview-info">
                  <Calendar size={16} />
                  <span>Pós-prandial</span>
                </div>
              </div>
            </div>
            <p className="empty-hint">Comece registrando sua primeira medição!</p>
          </div>
        ) : (
          <div className="historico-list">
            {glicemias.map(g => (
              <div key={g.id} className="historico-item">
                <div className="historico-main">
                  <div className={`historico-valor-badge ${getValorClass(g.valor)}`}>
                    <Activity size={24} />
                    <span className="valor">{g.valor}</span>
                    <span className="unidade">mg/dL</span>
                  </div>
                  
                  <div className="historico-details">
                    <div className="detail-row">
                      <Calendar size={16} />
                      <span className="detail-label">Data:</span>
                      <span className="detail-value">
                        {new Date(g.data_hora).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                        {' às '}
                        {new Date(g.data_hora).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <Clock size={16} />
                      <span className="detail-label">Categoria:</span>
                      <span className="detail-value categoria">{g.categoria}</span>
                    </div>
                    
                    {g.medicamentos && (
                      <div className="detail-row medicamento">
                        <Pill size={16} />
                        <span className="detail-label">Medicamento:</span>
                        <span className="detail-value">{g.medicamentos}</span>
                      </div>
                    )}
                    
                    {g.observacoes && (
                      <div className="detail-row observacao">
                        <FileText size={16} />
                        <span className="detail-value">{g.observacoes}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button onClick={() => deletar(g.id)} className="btn-delete" title="Excluir">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Historico;
