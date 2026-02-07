/**
 * PÁGINA DE RELATÓRIOS
 * 
 * Permite selecionar período e gerar relatório em PDF
 */

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Activity, Target, TrendingUp, TrendingDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import * as glicemiaService from '../services/glicemiaService';
import { gerarRelatorioPDF } from '../utils/pdfGenerator';
import './Relatorios.css';

function Relatorios() {
  const [glicemias, setGlicemias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  
  // Estado para seleção de período
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    carregar();
    
    // Define período padrão: últimos 14 dias
    const hoje = new Date();
    const quatorze = new Date();
    quatorze.setDate(hoje.getDate() - 14);
    
    setDataFim(hoje.toISOString().split('T')[0]);
    setDataInicio(quatorze.toISOString().split('T')[0]);
  }, []);

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

  /**
   * Filtra glicemias por período
   */
  const glicemiasFiltradas = glicemias.filter(g => {
    if (!dataInicio || !dataFim) return true;
    
    const dataGlicemia = new Date(g.data_hora);
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59);
    
    return dataGlicemia >= inicio && dataGlicemia <= fim;
  });

  /**
   * Calcula estatísticas
   */
  const calcularEstatisticas = () => {
    if (glicemiasFiltradas.length === 0) {
      return {
        total: 0,
        media: 0,
        noAlvo: 0,
        percentualNoAlvo: 0,
        alto: 0,
        percentualAlto: 0,
        muitoAlto: 0,
        percentualMuitoAlto: 0,
        baixo: 0,
        percentualBaixo: 0,
        gmi: 0,
      };
    }

    const total = glicemiasFiltradas.length;
    const soma = glicemiasFiltradas.reduce((acc, g) => acc + g.valor, 0);
    const media = Math.round(soma / total);
    
    const noAlvo = glicemiasFiltradas.filter(g => g.valor >= 70 && g.valor <= 180).length;
    const alto = glicemiasFiltradas.filter(g => g.valor > 180 && g.valor <= 250).length;
    const muitoAlto = glicemiasFiltradas.filter(g => g.valor > 250).length;
    const baixo = glicemiasFiltradas.filter(g => g.valor < 70).length;
    
    // GMI (Glucose Management Indicator) estimado
    const gmi = (3.31 + (0.02392 * media)).toFixed(1);

    return {
      total,
      media,
      noAlvo,
      percentualNoAlvo: Math.round((noAlvo / total) * 100),
      alto,
      percentualAlto: Math.round((alto / total) * 100),
      muitoAlto,
      percentualMuitoAlto: Math.round((muitoAlto / total) * 100),
      baixo,
      percentualBaixo: Math.round((baixo / total) * 100),
      gmi,
    };
  };

  const stats = calcularEstatisticas();

  /**
   * Gera PDF
   */
  const handleGerarPDF = async () => {
    if (glicemiasFiltradas.length === 0) {
      alert('Nenhum dado para gerar relatório');
      return;
    }

    setGerando(true);
    try {
      await gerarRelatorioPDF({
        glicemias: glicemiasFiltradas,
        stats,
        dataInicio,
        dataFim,
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF');
    } finally {
      setGerando(false);
    }
  };

  if (loading) return <div className="app-container"><Sidebar /><main className="main-content"><p>Carregando...</p></main></div>;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="relatorios-hero">
          <div className="hero-content">
            <div className="hero-icon-wrapper">
              <FileText className="hero-icon" size={36} />
            </div>
            <h1>Relatórios em PDF</h1>
            <p>Gere relatórios detalhados do seu controle glicêmico</p>
          </div>
        </div>

        {/* Seleção de período */}
        <div className="periodo-selector">
          <Calendar size={20} />
          <div className="periodo-inputs">
            <div className="input-group">
              <label>Data Início</label>
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Data Fim</label>
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>
          <button 
            className="btn-gerar-pdf" 
            onClick={handleGerarPDF}
            disabled={gerando}
          >
            <Download size={20} />
            {gerando ? 'Gerando...' : 'Gerar PDF'}
          </button>
        </div>

        <div className="relatorio-grid">
          {/* Card Resumo Geral */}
          <div className="relatorio-card">
            <h3>
              <Activity size={20} />
              Resumo do Período
            </h3>
            <div className="stat-row">
              <span>Total de Medições:</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-row">
              <span>Média Geral:</span>
              <strong>{stats.media} mg/dL</strong>
            </div>
            <div className="stat-row">
              <span>GMI Estimado:</span>
              <strong>{stats.gmi}%</strong>
            </div>
          </div>

          {/* Card Intervalos */}
          <div className="relatorio-card">
            <h3>
              <Target size={20} />
              Tempo nos Intervalos
            </h3>
            <div className="stat-row interval-success">
              <span>
                <TrendingUp size={16} />
                No Alvo (70-180):
              </span>
              <strong>{stats.noAlvo} ({stats.percentualNoAlvo}%)</strong>
            </div>
            <div className="stat-row interval-warning">
              <span>
                <TrendingUp size={16} />
                Alto (181-250):
              </span>
              <strong>{stats.alto} ({stats.percentualAlto}%)</strong>
            </div>
            <div className="stat-row interval-danger">
              <span>
                <TrendingUp size={16} />
                Muito Alto (&gt;250):
              </span>
              <strong>{stats.muitoAlto} ({stats.percentualMuitoAlto}%)</strong>
            </div>
            <div className="stat-row interval-danger">
              <span>
                <TrendingDown size={16} />
                Baixo (&lt;70):
              </span>
              <strong>{stats.baixo} ({stats.percentualBaixo}%)</strong>
            </div>
          </div>
        </div>

        {/* Tabela de Últimas Medições */}
        <div className="relatorio-section">
          <h2>
            <FileText size={24} />
            Últimas Medições
          </h2>
          <div className="table-wrapper">
            <table className="relatorio-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Valor</th>
                  <th>Categoria</th>
                  <th>Medicamento</th>
                  <th>Observações</th>
                </tr>
              </thead>
              <tbody>
                {glicemiasFiltradas.slice(0, 20).map(g => (
                  <tr key={g.id}>
                    <td>
                      {new Date(g.data_hora).toLocaleDateString('pt-BR')}
                      {' '}
                      {new Date(g.data_hora).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td>
                      <span className={`valor-badge ${
                        g.valor < 70 ? 'baixo' : 
                        g.valor <= 180 ? 'normal' : 
                        g.valor <= 250 ? 'alto' : 'muito-alto'
                      }`}>
                        {g.valor} mg/dL
                      </span>
                    </td>
                    <td>{g.categoria}</td>
                    <td>{g.medicamentos || '-'}</td>
                    <td className="obs-cell">{g.observacoes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Relatorios;
