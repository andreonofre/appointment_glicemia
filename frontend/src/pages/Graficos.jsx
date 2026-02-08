/**
 * PÁGINA DE GRÁFICOS
 */

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import GlicemiaChart from '../components/GlicemiaChart';
import IntervalosChart from '../components/IntervalosChart';
import * as glicemiaService from '../services/glicemiaService';
import * as profileService from '../services/profileService';
import './Graficos.css';

function Graficos() {
  const [glicemias, setGlicemias] = useState([]);
  const [metas, setMetas] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      try {
        const [dataGlicemias, dataMetas] = await Promise.all([
          glicemiaService.list(),
          profileService.getUserProfile()
        ]);
        setGlicemias(dataGlicemias);
        setMetas(dataMetas);
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
        <div className="graficos-hero">
          <div className="hero-content">
            <div className="hero-icon-wrapper">
              <BarChart3 className="hero-icon" size={36} />
            </div>
            <h1>Gráficos e Análises</h1>
            <p>Visualize suas tendências glicêmicas</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <Activity className="loading-icon" size={48} />
            <p>Carregando gráficos...</p>
          </div>
        ) : glicemias.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <BarChart3 className="empty-icon" size={64} />
            </div>
            <h2>Nenhum dado registrado ainda</h2>
            <p>Comece a registrar suas medições de glicemia para visualizar gráficos e análises detalhadas do seu controle glicêmico.</p>
            
            <div className="preview-cards">
              <div className="preview-card">
                <div className="preview-card-header">
                  <TrendingUp size={24} />
                  <h3>Evolução Temporal</h3>
                </div>
                <p>Acompanhe a variação da sua glicemia ao longo dos dias</p>
                <div className="preview-chart">
                  <div className="preview-bars">
                    <div className="preview-bar" style={{height: '60%'}}></div>
                    <div className="preview-bar" style={{height: '80%'}}></div>
                    <div className="preview-bar" style={{height: '45%'}}></div>
                    <div className="preview-bar" style={{height: '70%'}}></div>
                    <div className="preview-bar" style={{height: '55%'}}></div>
                  </div>
                </div>
              </div>

              <div className="preview-card">
                <div className="preview-card-header">
                  <Target size={24} />
                  <h3>Tempo em Intervalos</h3>
                </div>
                <p>Veja quanto tempo você permanece em cada faixa glicêmica</p>
                <div className="preview-chart">
                  <div className="preview-pie">
                    <div className="pie-segment normal"></div>
                    <div className="pie-segment high"></div>
                    <div className="pie-segment low"></div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/registrar')} className="btn-start">
              <Activity size={20} />
              Registrar Primeira Medição
            </button>
          </div>
        ) : (
          <div className="charts-grid">
            <div className="chart-card">
              <h2>Glicemia nos Últimos 7 Dias</h2>
              <GlicemiaChart data={glicemias.slice(0, 7)} metas={metas} />
            </div>
            <div className="chart-card">
              <h2>Tempo nos Intervalos</h2>
              <IntervalosChart data={glicemias} metas={metas} />
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}

export default Graficos;
