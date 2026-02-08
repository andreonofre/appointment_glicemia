/**
 * PÁGINA DE RELATÓRIOS
 * 
 * Permite selecionar período e gerar relatório em PDF
 */

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Activity, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-toastify';
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
      toast.error('Erro ao carregar medições');
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
      toast.warning('Nenhum dado para gerar relatório');
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
      toast.success('PDF gerado com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      toast.error('Erro ao gerar PDF: ' + (err.message || 'Verifique o console para mais detalhes'));
    } finally {
      setGerando(false);
    }
  };

  if (loading) return <div className="app-container"><Sidebar /><main className="main-content"><p>Carregando...</p></main></div>;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header-styled">
          <div className="header-wrapper">
            <div className="header-icon-box">
              <FileText size={32} />
            </div>
            <div className="header-text">
              <h1>Relatórios</h1>
              <p>Gere relatórios em PDF com suas estatísticas de glicemia</p>
            </div>
          </div>
        </div>

        {/* Seleção de Período */}
        <div className="periodo-selector">
          <h3><Calendar size={20} /> Período do Relatório</h3>
          <div className="datas-input">
            <div className="input-group">
              <label>Data Inicial:</label>
              <input 
                type="date" 
                value={dataInicio} 
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Data Final:</label>
              <input 
                type="date" 
                value={dataFim} 
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-relatorio">
          <div className="stat-card">
            <Activity size={24} />
            <div className="stat-content">
              <h4>Resumo do Período</h4>
              <p className="stat-value">{stats.total} medições</p>
              <p className="stat-detail">Média: <strong>{stats.media} mg/dL</strong></p>
              <p className="stat-detail">GMI estimado: <strong>{stats.gmi}%</strong></p>
            </div>
          </div>
          
          <div className="stat-card stat-alvo">
            <Target size={24} />
            <div className="stat-content">
              <h4>Tempo nos Intervalos</h4>
              <div className="intervalos-list">
                <div className="intervalo-item normal">
                  <span className="intervalo-label">No alvo (70-180):</span>
                  <span className="intervalo-valor">{stats.percentualNoAlvo}%</span>
                </div>
                <div className="intervalo-item alto">
                  <span className="intervalo-label">Alto (181-250):</span>
                  <span className="intervalo-valor">{stats.percentualAlto}%</span>
                </div>
                <div className="intervalo-item muito-alto">
                  <span className="intervalo-label">Muito alto (&gt;250):</span>
                  <span className="intervalo-valor">{stats.percentualMuitoAlto}%</span>
                </div>
                <div className="intervalo-item baixo">
                  <span className="intervalo-label">Baixo (&lt;70):</span>
                  <span className="intervalo-valor">{stats.percentualBaixo}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Últimas 20 medições */}
        <div className="ultimas-medicoes">
          <h3>Últimas 20 Medições do Período</h3>
          <div className="tabela-medicoes-wrapper">
            <table className="tabela-medicoes">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Valor</th>
                  <th>Categoria</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {glicemiasFiltradas.slice(0, 20).map((g, idx) => {
                  let statusClass = 'normal';
                  let statusText = 'Normal';
                  if (g.valor < 70) {
                    statusClass = 'baixo';
                    statusText = 'Baixo';
                  } else if (g.valor > 180 && g.valor <= 250) {
                    statusClass = 'alto';
                    statusText = 'Alto';
                  } else if (g.valor > 250) {
                    statusClass = 'muito-alto';
                    statusText = 'Muito Alto';
                  }

                  return (
                    <tr key={idx}>
                      <td>{new Date(g.data_hora).toLocaleString('pt-BR')}</td>
                      <td className="valor-col"><strong>{g.valor} mg/dL</strong></td>
                      <td>{g.categoria}</td>
                      <td><span className={`status-badge ${statusClass}`}>{statusText}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botão Gerar PDF */}
        <div className="acoes-relatorio">
          <button 
            className="btn-gerar-pdf" 
            onClick={handleGerarPDF}
            disabled={gerando || glicemiasFiltradas.length === 0}
          >
            {gerando ? (
              <>
                <Download size={20} className="icon-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download size={20} />
                Gerar PDF
              </>
            )}
          </button>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default Relatorios;
