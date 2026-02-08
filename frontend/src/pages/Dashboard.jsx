/**
 * PÁGINA DO DASHBOARD (PAINEL PRINCIPAL)
 * 
 * Tela principal do aplicativo após o login.
 * Mostra estatísticas, gráficos e últimas medições.
 * 
 * Funcionalidades:
 * - Exibe cartões com estatísticas (última medição, % no alvo, média, GMI)
 * - Gráfico de glicemias dos últimos 7 dias
 * - Gráfico de tempo nos intervalos
 * - Lista das medições de hoje
 * - Botão para registrar nova glicemia
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, TrendingUp, Zap, Plus, Clock, WandSparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as glicemiaService from '../services/glicemiaService';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import GlicemiaChart from '../components/GlicemiaChart';
import IntervalosChart from '../components/IntervalosChart';
import RegistrarModal from '../components/RegistrarModal';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [glicemias, setGlicemias] = useState([]);
  const [glicemiasHoje, setGlicemiasHoje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  /**
   * Carrega dados ao montar o componente
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Carrega estatísticas e glicemias
   */
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Busca estatísticas dos últimos 7 dias
      const statsData = await glicemiaService.getStats(7);
      setStats(statsData);
      
      // Busca glicemias dos últimos 7 dias
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - 7);
      const glicemiasData = await glicemiaService.list({
        data_inicio: dataInicio.toISOString(),
        limite: 100,
      });
      setGlicemias(glicemiasData);
      
      // Filtra glicemias de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const hojeData = glicemiasData.filter(g => 
        g.data_hora.startsWith(hoje)
      );
      setGlicemiasHoje(hojeData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formata data para exibição
   */
  const formatarData = () => {
    const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
                  'quinta-feira', 'sexta-feira', 'sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const hoje = new Date();
    const diaSemana = dias[hoje.getDay()];
    const dia = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    
    return `${diaSemana}, ${dia} de ${mes}`;
  };

  /**
   * Formata horário
   */
  const formatarHora = (dataHora) => {
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        {/* Cabeçalho */}
        <header className="page-header-styled">
          <div className="header-wrapper">
            <div className="header-icon-box header-icon-animated">
              <WandSparkles size={32} />
            </div>
            <div className="header-text">
              <h1>Olá, {user?.nome || user?.email?.split('@')[0]}!</h1>
              <p className="dashboard-date">{formatarData()}</p>
            </div>
          </div>
          <button 
            className="btn btn-primary btn-registrar"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Registrar Glicemia
          </button>
        </header>

        {/* Cards de Estatísticas */}
        <div className="stats-grid">
          <StatsCard
            icon={<Activity size={24} />}
            label="Última Medição"
            value={stats?.ultima_medicao?.valor || '--'}
            unit="mg/dL"
            color="primary"
          />
          
          <StatsCard
            icon={<Target size={24} />}
            label={`No Alvo (${stats?.periodo_dias || 7}d)`}
            value={stats?.percentual_no_alvo || 0}
            unit="%"
            color="success"
          />
          
          <StatsCard
            icon={<TrendingUp size={24} />}
            label={`Média (${stats?.periodo_dias || 7}d)`}
            value={stats?.media_geral || '--'}
            unit="mg/dL"
            color="info"
          />
          
          <StatsCard
            icon={<Zap size={24} />}
            label="GMI Estimado"
            value={stats?.gmi_estimado || '--'}
            unit="%"
            color="warning"
          />
        </div>

        {/* Gráficos */}
        <div className="charts-grid">
          <div className="chart-container">
            <h2>Glicemias dos Últimos 7 Dias</h2>
            <GlicemiaChart data={glicemias} />
          </div>

          <div className="chart-container">
            <h2>Tempo nos Intervalos</h2>
            <IntervalosChart data={glicemias} metas={stats?.metas} />
          </div>
        </div>

        {/* Medições de Hoje */}
        <div className="medicoes-hoje">
          <div className="medicoes-header">
            <div className="medicoes-title">
              <Clock size={24} />
              <h2>Medições de Hoje</h2>
            </div>
            {glicemiasHoje.length > 0 && (
              <span 
                className="ver-todas" 
                onClick={() => navigate('/historico')}
                style={{ cursor: 'pointer' }}
              >
                Ver todas →
              </span>
            )}
          </div>

          {glicemiasHoje.length === 0 ? (
            <div className="empty-state">
              <Activity size={48} className="empty-icon" />
              <p>Nenhuma medição registrada hoje</p>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={18} />
                Registrar primeira medição
              </button>
            </div>
          ) : (
            <div className="medicoes-list">
              {glicemiasHoje.map((medicao) => (
                <div key={medicao.id} className="medicao-item">
                  <div 
                    className={`medicao-indicator ${
                      medicao.valor < 70 ? 'baixo' : 
                      medicao.valor > 180 ? 'alto' : 
                      'normal'
                    }`}
                  >
                    <Activity size={20} />
                  </div>
                  <div className="medicao-info">
                    <span className="medicao-categoria">
                      {medicao.categoria.replace('-', ' ')}
                    </span>
                    <span className="medicao-hora">{formatarHora(medicao.data_hora)}</span>
                  </div>
                  <div className="medicao-valor">
                    <strong>{medicao.valor}</strong> mg/dL
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </main>

      {/* Modal de Registro */}
      {showModal && (
        <RegistrarModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
