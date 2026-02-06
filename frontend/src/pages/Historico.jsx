/**
 * PÁGINA DE HISTÓRICO
 */

import { useState, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import * as glicemiaService from '../services/glicemiaService';
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
    if (!confirm('Deseja realmente excluir?')) return;
    try {
      await glicemiaService.remove(id);
      setGlicemias(glicemias.filter(g => g.id !== id));
    } catch (err) {
      alert('Erro ao excluir');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <Clock size={32} />
          <h1>Histórico de Medições</h1>
        </div>

        <div className="historico-list">
          {loading ? (
            <p>Carregando...</p>
          ) : glicemias.length === 0 ? (
            <p>Nenhuma medição registrada ainda.</p>
          ) : (
            glicemias.map(g => (
              <div key={g.id} className="historico-item">
                <div className="historico-info">
                  <span className="historico-valor">{g.valor} mg/dL</span>
                  <span className="historico-momento">{g.momento}</span>
                  <span className="historico-data">
                    {new Date(g.data_medicao).toLocaleDateString('pt-BR')}
                  </span>
                  {g.observacoes && <p className="historico-obs">{g.observacoes}</p>}
                </div>
                <button onClick={() => deletar(g.id)} className="btn-delete">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Historico;
