/**
 * PÁGINA DE GRÁFICOS
 */

import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlicemiaChart from '../components/GlicemiaChart';
import IntervalosChart from '../components/IntervalosChart';
import * as glicemiaService from '../services/glicemiaService';
import './Graficos.css';

function Graficos() {
  const [glicemias, setGlicemias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await glicemiaService.list();
        setGlicemias(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <BarChart3 size={32} />
          <h1>Gráficos e Análises</h1>
        </div>

        {loading ? (
          <p>Carregando gráficos...</p>
        ) : glicemias.length === 0 ? (
          <p>Registre medições para visualizar gráficos.</p>
        ) : (
          <div className="charts-grid">
            <div className="chart-card">
              <h2>Glicemia nos Últimos 7 Dias</h2>
              <GlicemiaChart data={glicemias.slice(0, 7)} />
            </div>
            <div className="chart-card">
              <h2>Tempo nos Intervalos</h2>
              <IntervalosChart data={glicemias} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Graficos;
