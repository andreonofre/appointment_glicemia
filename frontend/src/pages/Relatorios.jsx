/**
 * PÁGINA DE RELATÓRIOS
 */

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import * as glicemiaService from '../services/glicemiaService';
import './Relatorios.css';

function Relatorios() {
  const [stats, setStats] = useState(null);
  const [glicemias, setGlicemias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [statsData, glicemiasData] = await Promise.all([
          glicemiaService.getStats(),
          glicemiaService.list()
        ]);
        setStats(statsData);
        setGlicemias(glicemiasData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  if (loading) return <div className="app-container"><Sidebar /><main className="main-content"><p>Carregando...</p></main></div>;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <FileText size={32} />
          <h1>Relatórios</h1>
        </div>

        <div className="relatorio-grid">
          <div className="relatorio-card">
            <h3>Resumo Geral</h3>
            <div className="stat-row">
              <span>Total de Medições:</span>
              <strong>{stats?.total || 0}</strong>
            </div>
            <div className="stat-row">
              <span>Média Geral:</span>
              <strong>{stats?.media || 0} mg/dL</strong>
            </div>
            <div className="stat-row">
              <span>No Alvo (70-180):</span>
              <strong>{stats?.noAlvo || 0} ({stats?.percentualNoAlvo || 0}%)</strong>
            </div>
          </div>

          <div className="relatorio-card">
            <h3>Últimas 10 Medições</h3>
            <table className="relatorio-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Momento</th>
                </tr>
              </thead>
              <tbody>
                {glicemias.slice(0, 10).map(g => (
                  <tr key={g.id}>
                    <td>{new Date(g.data_medicao).toLocaleDateString('pt-BR')}</td>
                    <td className={g.valor >= 70 && g.valor <= 180 ? 'valor-ok' : 'valor-alerta'}>
                      {g.valor} mg/dL
                    </td>
                    <td>{g.momento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Relatorios;
