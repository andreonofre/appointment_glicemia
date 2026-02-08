/**
 * PÁGINA DE HISTÓRICO - HEATMAP
 * 
 * Heatmap de controle glicêmico com visualização por dia e momento
 */

import { useState, useEffect } from 'react';
import { Clock, Trash2, Calendar, X, AlertCircle, Coffee, Utensils, UtensilsCrossed, Moon, Stars } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import * as glicemiaService from '../services/glicemiaService';
import './Historico.css';

function Historico() {
  const [glicemias, setGlicemias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, id: null, valor: null, data: null });
  const [periodo, setPeriodo] = useState(30); // dias

  useEffect(() => {
    carregarGlicemias();
  }, []);

  const carregarGlicemias = async () => {
    try {
      const data = await glicemiaService.list();
      setGlicemias(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
      toast.error('Erro ao carregar medições');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalExcluir = (id, valor, data) => {
    setModalExcluir({ aberto: true, id, valor, data });
  };

  const fecharModalExcluir = () => {
    setModalExcluir({ aberto: false, id: null, valor: null, data: null });
  };

  const confirmarExclusao = async () => {
    try {
      await glicemiaService.remove(modalExcluir.id);
      setGlicemias(glicemias.filter(g => g.id !== modalExcluir.id));
      toast.success('Medição excluída com sucesso!');
      fecharModalExcluir();
    } catch (err) {
      toast.error('Erro ao excluir medição');
    }
  };

  // Filtra glicemias por período
  const getGlicemiasPeriodo = () => {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() - periodo);
    
    return glicemias.filter(g => {
      const dataGlicemia = new Date(g.data_hora);
      return dataGlicemia >= dataLimite;
    });
  };

  // Agrupa glicemias por data (todas as medições do dia)
  const agruparPorDataMomento = () => {
    const glicemiasPeriodo = getGlicemiasPeriodo();
    const agrupado = {};

    glicemiasPeriodo.forEach(g => {
      const data = new Date(g.data_hora).toISOString().split('T')[0];
      if (!agrupado[data]) {
        agrupado[data] = [];
      }
      agrupado[data].push(g);
    });

    // Ordena por data (mais recente primeiro)
    const datasOrdenadas = Object.keys(agrupado).sort((a, b) => new Date(b) - new Date(a));
    return datasOrdenadas.map(data => ({
      data,
      medicoes: agrupado[data]
    }));
  };

  const dadosHeatmap = agruparPorDataMomento();

  // Retorna classe CSS baseada no valor
  const getClasseValor = (valor) => {
    if (valor < 70) return 'heatmap-baixo';
    if (valor <= 180) return 'heatmap-normal';
    if (valor <= 250) return 'heatmap-alto';
    return 'heatmap-muito-alto';
  };

  // Formata data com dia da semana
  const formatarDataComDia = (dataStr) => {
    const data = new Date(dataStr + 'T12:00:00');
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const diasSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const diaSemana = diasSemana[data.getDay()];
    
    return `${dia}/${mes} (${diaSemana})`;
  };

  // Definição das colunas do heatmap com faixas de horário
  const colunas = [
    { grupo: <><Coffee size={16} /> Café da manhã</>, itens: [
      { label: 'Jejum', horaInicio: 6, horaFim: 8 },
      { label: '2h após', horaInicio: 8, horaFim: 11 }
    ]},
    { grupo: <><Utensils size={16} /> Almoço</>, itens: [
      { label: 'Antes', horaInicio: 11, horaFim: 13 },
      { label: '2h após', horaInicio: 13, horaFim: 16 }
    ]},
    { grupo: <><UtensilsCrossed size={16} /> Jantar</>, itens: [
      { label: 'Antes', horaInicio: 18, horaFim: 20 },
      { label: '2h Após', horaInicio: 20, horaFim: 22 }
    ]},
    { grupo: <><Moon size={16} /> Ao deitar</>, itens: [
      { label: 'Antes', horaInicio: 22, horaFim: 24 }
    ]},
    { grupo: <><Stars size={16} /> Madrugada</>, itens: [
      { label: '3:00h', horaInicio: 2, horaFim: 5 }
    ]}
  ];

  // Busca medição por horário
  const getMedicaoPorHorario = (medicoes, horaInicio, horaFim) => {
    // medicoes é um array de medições daquele dia
    if (!Array.isArray(medicoes)) return null;
    
    for (let medicao of medicoes) {
      const hora = new Date(medicao.data_hora).getHours();
      const minutos = new Date(medicao.data_hora).getMinutes();
      const horaDecimal = hora + (minutos / 60);
      
      // Tratamento especial para horários que cruzam meia-noite
      if (horaFim === 24) {
        if (horaDecimal >= horaInicio || hora === 0) {
          return medicao;
        }
      } else if (horaDecimal >= horaInicio && horaDecimal < horaFim) {
        return medicao;
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-state">
            <Clock size={48} className="loading-icon" />
            <p>Carregando histórico...</p>
          </div>
        </main>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-state">
            <Clock size={48} className="loading-icon" />
            <p>Carregando histórico...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header-styled">
          <div className="header-wrapper">
            <div className="header-icon-box">
              <Clock size={32} />
            </div>
            <div className="header-text">
              <h1>Controle de HGT</h1>
              <p>Visualize todas as suas medições em formato heatmap</p>
            </div>
          </div>
          <div className="periodo-selector-compact">
            <Calendar size={18} />
            <select value={periodo} onChange={(e) => setPeriodo(Number(e.target.value))}>
              <option value={7}>Últimos 7 dias</option>
              <option value={14}>Últimos 14 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={60}>Últimos 60 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>
          </div>
        </div>

        <div className="heatmap-container">
          <div className="heatmap-scroll">
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th className="col-data" rowSpan="2">Data</th>
                  {colunas.map((col, idx) => (
                    <th key={idx} colSpan={col.itens.length} className="col-grupo">
                      {col.grupo}
                    </th>
                  ))}
                </tr>
                <tr>
                  {colunas.map((col, colIdx) => 
                    col.itens.map((item, itemIdx) => (
                      <th key={`${colIdx}-${itemIdx}`} className="col-momento">
                        {item.label}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {dadosHeatmap.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-heatmap">
                      Nenhuma medição encontrada no período selecionado
                    </td>
                  </tr>
                ) : (
                  dadosHeatmap.map(({ data, medicoes }) => (
                    <tr key={data}>
                      <td className="data-cell">{formatarDataComDia(data)}</td>
                      {colunas.map((col, colIdx) =>
                        col.itens.map((item, itemIdx) => {
                          const medicao = getMedicaoPorHorario(medicoes, item.horaInicio, item.horaFim);
                          return (
                            <td 
                              key={`${colIdx}-${itemIdx}`} 
                              className={medicao ? `valor-cell ${getClasseValor(medicao.valor)}` : 'valor-cell empty'}
                            >
                              {medicao && (
                                <div className="cell-content">
                                  <span className="valor-text">{medicao.valor}</span>
                                  <button
                                    className="btn-excluir-cell"
                                    onClick={() => abrirModalExcluir(medicao.id, medicao.valor, data)}
                                    title="Excluir medição"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legenda */}
        <div className="heatmap-legenda">
          <h3>Legenda:</h3>
          <div className="legenda-items">
            <div className="legenda-item">
              <span className="legenda-box heatmap-normal"></span>
              <span>Normal (70-180 mg/dL)</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-box heatmap-alto"></span>
              <span>Alto (181-250 mg/dL)</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-box heatmap-muito-alto"></span>
              <span>Muito Alto (&gt;250 mg/dL)</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-box heatmap-baixo"></span>
              <span>Baixo (&lt;70 mg/dL)</span>
            </div>
          </div>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {modalExcluir.aberto && (
          <div className="modal-overlay" onClick={fecharModalExcluir}>
            <div className="modal-confirmacao" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-confirmacao">
                <AlertCircle size={48} className="icon-alerta" />
                <button className="modal-close-btn" onClick={fecharModalExcluir}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body-confirmacao">
                <h3>Confirmar Exclusão</h3>
                <p>Tem certeza que deseja excluir a medição de <strong>{modalExcluir.valor} mg/dL</strong>?</p>
                <p className="data-exclusao">Data: {formatarDataComDia(modalExcluir.data)}</p>
                <p className="aviso-exclusao">Esta ação não pode ser desfeita.</p>
              </div>
              <div className="modal-footer-confirmacao">
                <button className="btn-cancelar" onClick={fecharModalExcluir}>
                  Cancelar
                </button>
                <button className="btn-confirmar-excluir" onClick={confirmarExclusao}>
                  <Trash2 size={18} />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}

export default Historico;
